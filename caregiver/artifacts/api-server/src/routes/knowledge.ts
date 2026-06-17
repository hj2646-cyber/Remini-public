import { Router, type IRouter, type Request } from "express";
import { runQuery } from "../neo4j";
import { randomUUID } from "crypto";

const router: IRouter = Router({ mergeParams: true });
type PatientParams = { patientId: string };
type KnowledgeParams = { patientId: string; itemId: string };

type KnowledgeType = "life_memory" | "daily_care";

interface KnowledgeItem {
  id: string;
  patientId: string;
  type: KnowledgeType;
  category: string;
  title: string;
  content: string;
  period: string | null;
  importance: number;
  source: "ai" | "caregiver";
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Helper: resolve Patient UUID → Persona's persona_id (e.g. "P001")
// ---------------------------------------------------------------------------
async function resolvePersonaId(patientId: string): Promise<string | null> {
  const rows = await runQuery<{ aiUserId: string | null }>(
    `MATCH (p:Patient {id: $id}) RETURN p.aiUserId AS aiUserId`,
    { id: patientId }
  );
  return rows[0]?.aiUserId || null;
}

// ---------------------------------------------------------------------------
// Helper: map GraphEntity node → KnowledgeItem response
// ---------------------------------------------------------------------------
function graphEntityToItem(e: any, patientId: string): KnowledgeItem {
  // Build content from available fields
  const description = e.description || "";
  const value = e.value || "";
  const searchText = e.search_text || "";
  const role = e.role ? `(${e.role})` : "";

  // Compose a readable content string
  let content = description || value || searchText;
  if (role && !content.includes(role)) {
    content = `${role} ${content}`.trim();
  }
  if (!content) content = e.name || "";

  return {
    id: e.kg_id || e.node_id || randomUUID(),
    patientId,
    type: e.graph_type || "life_memory",
    category: e.category || "기타",
    title: e.name || "제목 없음",
    content,
    period: e.period || null,
    importance: typeof e.importance === "number" ? e.importance : 2,
    source: e.source || "ai",
    createdAt: e.created_at || e.createdAt || new Date().toISOString(),
    updatedAt: e.updated_at || e.updatedAt || new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// GET /api/patients/:patientId/knowledge
// Reads from GraphEntity nodes connected to the Persona in the knowledge graph.
// Falls back to KnowledgeItem nodes for backward compatibility.
// ---------------------------------------------------------------------------
router.get("/", async (req: Request<PatientParams>, res) => {
  const patientId = req.params.patientId;
  const type = req.query.type as KnowledgeType | undefined;

  try {
    const personaId = await resolvePersonaId(patientId);

    const items: KnowledgeItem[] = [];

    // 1) Read from AI server's GraphEntity nodes (via Persona)
    if (personaId) {
      const typeFilter = type ? `AND e.graph_type = $type` : "";
      const cypher = `
        MATCH (p:Persona {persona_id: $personaId})-[r]->(e:GraphEntity)
        WHERE e.persona_id = $personaId ${typeFilter}
        RETURN e
        ORDER BY e.graph_type ASC, e.category ASC, e.name ASC
      `;
      const rows = await runQuery<{ e: any }>(cypher, { personaId, ...(type ? { type } : {}) });
      for (const row of rows) {
        items.push(graphEntityToItem(row.e, patientId));
      }
    }

    // 2) Also read legacy KnowledgeItem nodes (if any exist)
    const legacyCypher = type
      ? `MATCH (p:Patient {id: $patientId})-[:HAS_KNOWLEDGE]->(k:KnowledgeItem {type: $type})
         RETURN k ORDER BY k.createdAt ASC`
      : `MATCH (p:Patient {id: $patientId})-[:HAS_KNOWLEDGE]->(k:KnowledgeItem)
         RETURN k ORDER BY k.createdAt ASC`;
    const legacyRows = await runQuery<{ k: any }>(legacyCypher, { patientId, ...(type ? { type } : {}) });
    for (const row of legacyRows) {
      const k = row.k;
      items.push({
        id: k.id,
        patientId,
        type: k.type,
        category: k.category,
        title: k.title,
        content: k.content,
        period: k.period ?? null,
        importance: typeof k.importance === "object" ? k.importance.toNumber() : Number(k.importance),
        source: "caregiver",
        createdAt: k.createdAt,
        updatedAt: k.updatedAt,
      });
    }

    res.json(items);
  } catch (err: any) {
    console.error("GET /knowledge error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/patients/:patientId/knowledge
// Creates a GraphEntity node connected to the Persona so the AI server can use it.
// Also creates a KnowledgeItem linked to Patient for backward compatibility.
// ---------------------------------------------------------------------------
router.post("/", async (req: Request<PatientParams>, res) => {
  const patientId = req.params.patientId;
  const { type, category, title, content, period, importance } = req.body;
  const now = new Date().toISOString();
  const kgId = randomUUID();

  try {
    const personaId = await resolvePersonaId(patientId);

    if (personaId) {
      // Determine a label for the entity based on category
      const labelMap: Record<string, string> = {
        "가족관계": "Person", "친구/지인": "Person",
        "직업/경력": "Occupation", "학창시절": "Event",
        "취미/관심사": "Activity", "중요한 추억": "Event",
        "거주지": "Place",
        "투약 정보": "Medication", "식사 선호": "Food",
        "수면 패턴": "Routine", "운동 습관": "Activity",
        "의료 이력": "HealthCondition", "알레르기": "HealthCondition",
        "일상 루틴": "Routine",
      };
      const entityLabel = labelMap[category] || "Info";
      const nodeId = `${personaId}|${type}|${entityLabel}|${title}`;
      const searchText = `${title} ${content} ${category}`;

      // Determine relationship type based on category
      const relMap: Record<string, string> = {
        "가족관계": "HAS_FAMILY", "친구/지인": "HAD_FRIEND",
        "직업/경력": "WORKED_AS", "학창시절": "REFLECTS_ON",
        "취미/관심사": "ENJOYS_ACTIVITY", "중요한 추억": "REFLECTS_ON",
        "거주지": "FROM",
        "투약 정보": "TAKES_MEDICATION", "식사 선호": "PREFERS_FOOD",
        "수면 패턴": "HAS_ROUTINE", "운동 습관": "ENJOYS_ACTIVITY",
        "의료 이력": "HAS_HEALTH_CONDITION", "알레르기": "HAS_HEALTH_CONDITION",
        "일상 루틴": "HAS_ROUTINE",
      };
      const relType = relMap[category] || "HAS_INFO";

      // Create GraphEntity node connected to Persona AND linked to Graph hub via IN_GRAPH
      const cypher = `
        MATCH (persona:Persona {persona_id: $personaId})
        MATCH (hub:Graph {persona_id: $personaId, graph_type: $type})
        CREATE (e:GraphEntity:${entityLabel} {
          kg_id: $kgId,
          node_id: $nodeId,
          persona_id: $personaId,
          graph_type: $type,
          name: $title,
          description: $content,
          search_text: $searchText,
          category: $category,
          source: "caregiver",
          importance: $importance,
          period: $period,
          created_at: $now,
          updated_at: $now
        })
        CREATE (persona)-[:${relType}]->(e)
        CREATE (e)-[:IN_GRAPH]->(hub)
        RETURN e
      `;
      const rows = await runQuery<{ e: any }>(cypher, {
        personaId, kgId, nodeId, type, title, content: content || "",
        searchText, category, importance: importance ?? 2,
        period: period ?? null, now,
      });

      if (rows.length > 0) {
        res.status(201).json(graphEntityToItem(rows[0].e, patientId));
        return;
      }
    }

    // Fallback: create KnowledgeItem linked to Patient
    const fallbackCypher = `
      MATCH (p:Patient {id: $patientId})
      CREATE (k:KnowledgeItem {
        id: $kgId, type: $type, category: $category, title: $title,
        content: $content, period: $period, importance: $importance,
        createdAt: $now, updatedAt: $now
      })
      CREATE (p)-[:HAS_KNOWLEDGE]->(k)
      RETURN k
    `;
    const fallbackRows = await runQuery<{ k: any }>(fallbackCypher, {
      patientId, kgId, type, category, title, content: content || "",
      period: period ?? null, importance: importance ?? 2, now,
    });

    if (fallbackRows.length === 0) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    const k = fallbackRows[0].k;
    res.status(201).json({
      id: k.id, patientId, type: k.type, category: k.category,
      title: k.title, content: k.content, period: k.period ?? null,
      importance: Number(k.importance), source: "caregiver" as const,
      createdAt: k.createdAt, updatedAt: k.updatedAt,
    });
  } catch (err: any) {
    console.error("POST /knowledge error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// PATCH /api/patients/:patientId/knowledge/:itemId
// Updates either a GraphEntity (by kg_id or node_id) or a KnowledgeItem.
// ---------------------------------------------------------------------------
router.patch("/:itemId", async (req: Request<KnowledgeParams>, res) => {
  const patientId = req.params.patientId;
  const itemId = req.params.itemId;
  const { title, content, period, importance, category } = req.body;
  const now = new Date().toISOString();

  try {
    // Try GraphEntity first (by kg_id)
    const geCypher = `
      MATCH (e:GraphEntity {kg_id: $itemId})
      SET e.name = COALESCE($title, e.name),
          e.description = COALESCE($content, e.description),
          e.search_text = COALESCE($searchText, e.search_text),
          e.category = COALESCE($category, e.category),
          e.period = COALESCE($period, e.period),
          e.importance = COALESCE($importance, e.importance),
          e.updated_at = $now
      RETURN e
    `;
    const searchText = title && content ? `${title} ${content} ${category || ""}` : null;
    const geRows = await runQuery<{ e: any }>(geCypher, {
      itemId, title: title || null, content: content || null,
      searchText, category: category || null,
      period: period !== undefined ? period : null,
      importance: importance !== undefined ? importance : null, now,
    });
    if (geRows.length > 0) {
      res.json(graphEntityToItem(geRows[0].e, patientId));
      return;
    }

    // Try GraphEntity by node_id
    const geNodeCypher = `
      MATCH (e:GraphEntity {node_id: $itemId})
      SET e.name = COALESCE($title, e.name),
          e.description = COALESCE($content, e.description),
          e.search_text = COALESCE($searchText, e.search_text),
          e.category = COALESCE($category, e.category),
          e.period = COALESCE($period, e.period),
          e.importance = COALESCE($importance, e.importance),
          e.updated_at = $now
      RETURN e
    `;
    const geNodeRows = await runQuery<{ e: any }>(geNodeCypher, {
      itemId, title: title || null, content: content || null,
      searchText, category: category || null,
      period: period !== undefined ? period : null,
      importance: importance !== undefined ? importance : null, now,
    });
    if (geNodeRows.length > 0) {
      res.json(graphEntityToItem(geNodeRows[0].e, patientId));
      return;
    }

    // Fallback: try KnowledgeItem
    const setClauses: string[] = ["k.updatedAt = $now"];
    const params: Record<string, any> = { patientId, itemId, now };
    if (category !== undefined) { setClauses.push("k.category = $category"); params.category = category; }
    if (title !== undefined) { setClauses.push("k.title = $title"); params.title = title; }
    if (content !== undefined) { setClauses.push("k.content = $content"); params.content = content; }
    if (period !== undefined) { setClauses.push("k.period = $period"); params.period = period ?? null; }
    if (importance !== undefined) { setClauses.push("k.importance = $importance"); params.importance = importance; }

    const kiCypher = `
      MATCH (p:Patient {id: $patientId})-[:HAS_KNOWLEDGE]->(k:KnowledgeItem {id: $itemId})
      SET ${setClauses.join(", ")}
      RETURN k
    `;
    const kiRows = await runQuery<{ k: any }>(kiCypher, params);
    if (kiRows.length === 0) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    const k = kiRows[0].k;
    res.json({
      id: k.id, patientId, type: k.type, category: k.category,
      title: k.title, content: k.content, period: k.period ?? null,
      importance: Number(k.importance), source: "caregiver" as const,
      createdAt: k.createdAt, updatedAt: k.updatedAt,
    });
  } catch (err: any) {
    console.error("PATCH /knowledge error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/patients/:patientId/knowledge/:itemId
// Deletes either a GraphEntity or a KnowledgeItem.
// Only allows deletion of caregiver-added items (source: "caregiver").
// ---------------------------------------------------------------------------
router.delete("/:itemId", async (req: Request<KnowledgeParams>, res) => {
  const patientId = req.params.patientId;
  const itemId = req.params.itemId;

  try {
    // Try GraphEntity by kg_id (only caregiver-added)
    const geDel = await runQuery(
      `MATCH (e:GraphEntity {kg_id: $itemId, source: "caregiver"}) DETACH DELETE e RETURN count(e) AS cnt`,
      { itemId }
    );
    if (geDel.length > 0 && Number(geDel[0].cnt) > 0) {
      res.status(204).send();
      return;
    }

    // Try GraphEntity by node_id (only caregiver-added)
    const geNodeDel = await runQuery(
      `MATCH (e:GraphEntity {node_id: $itemId, source: "caregiver"}) DETACH DELETE e RETURN count(e) AS cnt`,
      { itemId }
    );
    if (geNodeDel.length > 0 && Number(geNodeDel[0].cnt) > 0) {
      res.status(204).send();
      return;
    }

    // Fallback: KnowledgeItem
    await runQuery(
      `MATCH (p:Patient {id: $patientId})-[r:HAS_KNOWLEDGE]->(k:KnowledgeItem {id: $itemId})
       DELETE r, k`,
      { patientId, itemId }
    );
    res.status(204).send();
  } catch (err: any) {
    console.error("DELETE /knowledge error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
