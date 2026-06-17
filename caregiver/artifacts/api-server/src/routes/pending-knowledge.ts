import { Router, type IRouter, type Request } from "express";
import { runQuery } from "../neo4j";
import { requireAuth } from "../middlewares/auth";
import { randomUUID } from "crypto";

const router: IRouter = Router({ mergeParams: true });

const AI_SERVER_URL = process.env.AI_SERVER_URL || "http://localhost:8000";

type PatientParams = { patientId: string };
type ItemParams = { patientId: string; itemId: string };

// ---------------------------------------------------------------------------
// Helper: resolve patientId (aiUserId or UUID) → { patientNodeId, personaId }
// ---------------------------------------------------------------------------
async function resolvePatientAndPersona(
  patientId: string
): Promise<{ patientNodeId: string; personaId: string } | null> {
  // Try by aiUserId first
  let rows = await runQuery<{ id: string; aiUserId: string }>(
    `MATCH (p:Patient {aiUserId: $patientId}) RETURN p.id AS id, p.aiUserId AS aiUserId`,
    { patientId }
  );
  if (rows.length > 0) {
    return { patientNodeId: rows[0].id, personaId: rows[0].aiUserId };
  }

  // Try by UUID
  rows = await runQuery<{ id: string; aiUserId: string }>(
    `MATCH (p:Patient {id: $patientId}) RETURN p.id AS id, p.aiUserId AS aiUserId`,
    { patientId }
  );
  if (rows.length > 0) {
    return { patientNodeId: rows[0].id, personaId: rows[0].aiUserId };
  }

  return null;
}

// ---------------------------------------------------------------------------
// POST /api/patients/:patientId/pending-knowledge
// Called by AI server webhook (no auth). Creates PendingKnowledge + Alert.
// ---------------------------------------------------------------------------
router.post("/", async (req: Request<PatientParams>, res) => {
  const rawId = req.params.patientId;
  const { rawUtterance, summary, categoryHint, confidence, sessionId } = req.body;
  const id = randomUUID();
  const now = new Date().toISOString();

  try {
    const resolved = await resolvePatientAndPersona(rawId);
    if (!resolved) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    const { patientNodeId } = resolved;

    // Create PendingKnowledge node + relationship
    const rows = await runQuery<{ pk: any }>(
      `MATCH (p:Patient {id: $patientNodeId})
       CREATE (pk:PendingKnowledge {
         id: $id,
         rawUtterance: $rawUtterance,
         summary: $summary,
         categoryHint: $categoryHint,
         confidence: $confidence,
         status: "pending",
         sessionId: $sessionId,
         createdAt: $now,
         updatedAt: $now
       })
       CREATE (p)-[:HAS_PENDING_KNOWLEDGE]->(pk)
       RETURN pk`,
      {
        patientNodeId,
        id,
        rawUtterance: rawUtterance || "",
        summary: summary || "",
        categoryHint: categoryHint || "",
        confidence: typeof confidence === "number" ? confidence : 0.5,
        sessionId: sessionId || "",
        now,
      }
    );

    // Create an Alert for the patient
    const alertId = randomUUID();
    await runQuery(
      `MATCH (p:Patient {id: $patientNodeId})
       CREATE (a:Alert {
         id: $alertId,
         level: "info",
         message: $message,
         type: "new_knowledge",
         isRead: false,
         createdAt: $now
       })
       CREATE (p)-[:HAS_ALERT]->(a)`,
      {
        patientNodeId,
        alertId,
        message: "새로운 기억 정보가 감지되었습니다: " + (summary || ""),
        now,
      }
    );

    res.status(201).json(rows[0]?.pk ?? { id });
  } catch (err: any) {
    console.error("POST /pending-knowledge error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/patients/:patientId/pending-knowledge
// Returns pending items. ?status= to filter (default: "pending").
// ---------------------------------------------------------------------------
router.get("/", async (req: Request<PatientParams>, res) => {
  const rawId = req.params.patientId;
  const status = (req.query.status as string) || "pending";

  try {
    const resolved = await resolvePatientAndPersona(rawId);
    if (!resolved) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    const { patientNodeId } = resolved;

    const rows = await runQuery<{ pk: any }>(
      `MATCH (p:Patient {id: $patientNodeId})-[:HAS_PENDING_KNOWLEDGE]->(pk:PendingKnowledge {status: $status})
       RETURN pk ORDER BY pk.createdAt DESC`,
      { patientNodeId, status }
    );

    res.json(rows.map((r) => r.pk));
  } catch (err: any) {
    console.error("GET /pending-knowledge error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/patients/:patientId/pending-knowledge/:itemId/approve
// Requires auth. Calls AI server to extract knowledge, creates GraphEntity.
// ---------------------------------------------------------------------------
router.post("/:itemId/approve", requireAuth, async (req: Request<ItemParams>, res) => {
  const rawId = req.params.patientId;
  const itemId = req.params.itemId;

  try {
    const resolved = await resolvePatientAndPersona(rawId);
    if (!resolved) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    const { patientNodeId, personaId } = resolved;

    // Fetch the PendingKnowledge item
    const pkRows = await runQuery<{ pk: any }>(
      `MATCH (p:Patient {id: $patientNodeId})-[:HAS_PENDING_KNOWLEDGE]->(pk:PendingKnowledge {id: $itemId})
       RETURN pk`,
      { patientNodeId, itemId }
    );
    if (pkRows.length === 0) {
      res.status(404).json({ error: "PendingKnowledge item not found" });
      return;
    }
    const pk = pkRows[0].pk;

    // Call AI server to extract structured knowledge
    let aiResult: any;
    try {
      const aiRes = await fetch(`${AI_SERVER_URL}/extract-knowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_utterance: pk.rawUtterance,
          summary: pk.summary,
          category_hint: pk.categoryHint,
          persona_id: personaId,
        }),
      });
      if (!aiRes.ok) {
        const errText = await aiRes.text();
        res.status(502).json({
          error: `AI server returned ${aiRes.status}: ${errText}`,
          hint: "AI 서버가 응답하지 않거나 오류가 발생했습니다. 서버 상태를 확인해주세요.",
        });
        return;
      }
      aiResult = await aiRes.json();
    } catch (fetchErr: any) {
      res.status(502).json({
        error: `AI server unreachable: ${fetchErr.message}`,
        hint: "AI 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.",
      });
      return;
    }

    // Create GraphEntity from AI server response (same pattern as knowledge.ts POST)
    const kgId = randomUUID();
    const now = new Date().toISOString();

    const category = aiResult.category || pk.categoryHint || "기타";
    const title = aiResult.name || aiResult.title || pk.summary;
    const content = aiResult.description || aiResult.content || pk.rawUtterance;
    const type = aiResult.graph_type || aiResult.type || "life_memory";
    const importance = aiResult.importance ?? 2;
    const period = aiResult.period ?? null;

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

    const entityCypher = `
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
        source: "ai_approved",
        importance: $importance,
        period: $period,
        created_at: $now,
        updated_at: $now
      })
      CREATE (persona)-[:${relType}]->(e)
      CREATE (e)-[:IN_GRAPH]->(hub)
      RETURN e
    `;
    const entityRows = await runQuery<{ e: any }>(entityCypher, {
      personaId,
      kgId,
      nodeId,
      type,
      title,
      content,
      searchText,
      category,
      importance,
      period,
      now,
    });
    if (entityRows.length === 0) {
      res.status(409).json({
        error: "Knowledge graph hub not found",
        hint: `Persona ${personaId}의 ${type} 그래프 허브가 없어 GraphEntity를 생성하지 못했습니다.`,
      });
      return;
    }

    // Update PendingKnowledge status to "approved"
    await runQuery(
      `MATCH (pk:PendingKnowledge {id: $itemId})
       SET pk.status = "approved", pk.updatedAt = $now
       RETURN pk`,
      { itemId, now }
    );

    res.json({
      message: "승인 완료",
      pendingKnowledgeId: itemId,
      graphEntityId: kgId,
      aiResult,
    });
  } catch (err: any) {
    console.error("POST /pending-knowledge/:itemId/approve error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/patients/:patientId/pending-knowledge/:itemId/reject
// Requires auth. Soft-delete: sets status to "rejected".
// ---------------------------------------------------------------------------
router.post("/:itemId/reject", requireAuth, async (req: Request<ItemParams>, res) => {
  const rawId = req.params.patientId;
  const itemId = req.params.itemId;
  const now = new Date().toISOString();

  try {
    const resolved = await resolvePatientAndPersona(rawId);
    if (!resolved) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    const { patientNodeId } = resolved;

    const rows = await runQuery<{ pk: any }>(
      `MATCH (p:Patient {id: $patientNodeId})-[:HAS_PENDING_KNOWLEDGE]->(pk:PendingKnowledge {id: $itemId})
       SET pk.status = "rejected", pk.updatedAt = $now
       RETURN pk`,
      { patientNodeId, itemId, now }
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "PendingKnowledge item not found" });
      return;
    }

    res.json(rows[0].pk);
  } catch (err: any) {
    console.error("POST /pending-knowledge/:itemId/reject error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/patients/:patientId/pending-knowledge/:itemId
// Requires auth. Hard-deletes the node.
// ---------------------------------------------------------------------------
router.delete("/:itemId", requireAuth, async (req: Request<ItemParams>, res) => {
  const rawId = req.params.patientId;
  const itemId = req.params.itemId;

  try {
    const resolved = await resolvePatientAndPersona(rawId);
    if (!resolved) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    const { patientNodeId } = resolved;

    await runQuery(
      `MATCH (p:Patient {id: $patientNodeId})-[:HAS_PENDING_KNOWLEDGE]->(pk:PendingKnowledge {id: $itemId})
       DETACH DELETE pk`,
      { patientNodeId, itemId }
    );

    res.status(204).send();
  } catch (err: any) {
    console.error("DELETE /pending-knowledge/:itemId error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
