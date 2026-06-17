import { Router, type IRouter, type Request } from "express";
import { runQuery } from "../neo4j";
import { randomUUID } from "crypto";
import { requireAuth, optionalAuth } from "../middlewares/auth";

const router: IRouter = Router();
type PatientParams = { patientId: string };

// Apply optional auth to all patient routes so that caregiverId is available
// when a token is provided, but existing unauthenticated usage still works.
router.use(optionalAuth);

// GET /api/patients
// If authenticated, only return patients linked to the caregiver.
// If unauthenticated (no token), return all patients for backward compatibility.
router.get("/", async (req, res) => {
  try {
    if (req.caregiverId) {
      const rows = await runQuery<{ p: any }>(
        `MATCH (cg:Caregiver {id: $caregiverId})-[:CARES_FOR]->(p:Patient)
         RETURN p ORDER BY p.createdAt ASC`,
        { caregiverId: req.caregiverId }
      );
      const patients = rows.map(r => r.p);
      res.json(patients);
    } else {
      const rows = await runQuery<{ p: any }>(
        `MATCH (p:Patient) RETURN p ORDER BY p.createdAt ASC`
      );
      const patients = rows.map(r => r.p);
      res.json(patients);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/patients
// If authenticated, creates a CARES_FOR relationship between the caregiver and the patient.
// aiUserId is the ID used in the AI server (e.g. "P001").
router.post("/", async (req, res) => {
  const { name, birthYear, diagnosis, caregiverName, aiUserId } = req.body;
  const id = randomUUID();
  const now = new Date().toISOString();

  // aiUserId links this patient to dementia-llm's user_id (e.g. "P001")
  const resolvedAiUserId = aiUserId || null;

  try {
    if (req.caregiverId) {
      const rows = await runQuery<{ p: any }>(
        `MATCH (cg:Caregiver {id: $caregiverId})
         CREATE (p:Patient {
           id: $id,
           name: $name,
           birthYear: $birthYear,
           diagnosis: $diagnosis,
           caregiverName: $caregiverName,
           aiUserId: $aiUserId,
           status: "stable",
           createdAt: $now,
           updatedAt: $now
         })
         CREATE (cg)-[:CARES_FOR]->(p)
         RETURN p`,
        { id, name, birthYear, diagnosis, caregiverName, aiUserId: resolvedAiUserId, now, caregiverId: req.caregiverId }
      );
      res.status(201).json(rows[0].p);
    } else {
      const rows = await runQuery<{ p: any }>(
        `CREATE (p:Patient {
          id: $id,
          name: $name,
          birthYear: $birthYear,
          diagnosis: $diagnosis,
          caregiverName: $caregiverName,
          aiUserId: $aiUserId,
          status: "stable",
          createdAt: $now,
          updatedAt: $now
        }) RETURN p`,
        { id, name, birthYear, diagnosis, caregiverName, aiUserId: resolvedAiUserId, now }
      );
      res.status(201).json(rows[0].p);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/patients/search-persona?persona_id=P001
// Search for existing Persona nodes in the knowledge graph
router.get("/search-persona", async (req, res) => {
  const personaId = req.query.persona_id as string;
  if (!personaId) {
    res.status(400).json({ error: "persona_id query parameter is required" });
    return;
  }
  try {
    const rows = await runQuery<{ p: any }>(
      `MATCH (p:Persona {persona_id: $personaId})
       RETURN p.persona_id AS personaId, p.name AS name, p.birth_date AS birthDate`,
      { personaId }
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Persona not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/patients/link-persona
// Link an existing Persona (from knowledge graph) to the caregiver app.
// Creates a Patient node with aiUserId pointing to the Persona, and links caregiver.
router.post("/link-persona", requireAuth, async (req, res) => {
  const { personaId } = req.body;
  if (!personaId) {
    res.status(400).json({ error: "personaId is required" });
    return;
  }

  try {
    // Check if already linked
    const existing = await runQuery<{ p: any }>(
      `MATCH (p:Patient {aiUserId: $personaId}) RETURN p`,
      { personaId }
    );
    if (existing.length > 0) {
      // Already exists - link caregiver and update name from Persona
      const personaInfo = await runQuery<{ name: string; birthDate: string }>(
        `MATCH (persona:Persona {persona_id: $personaId})
         RETURN persona.name AS name, persona.birth_date AS birthDate`,
        { personaId }
      );
      const updates: any = {};
      if (personaInfo.length > 0) {
        updates.name = personaInfo[0].name;
        if (personaInfo[0].birthDate) {
          updates.birthYear = parseInt(personaInfo[0].birthDate.substring(0, 4));
        }
      }
      const rows = await runQuery<{ p: any }>(
        `MATCH (cg:Caregiver {id: $caregiverId}), (p:Patient {aiUserId: $personaId})
         SET p.name = COALESCE($name, p.name),
             p.birthYear = COALESCE($birthYear, p.birthYear),
             p.updatedAt = $now
         MERGE (cg)-[:CARES_FOR]->(p)
         RETURN p`,
        { caregiverId: req.caregiverId, personaId, name: updates.name || null, birthYear: updates.birthYear || null, now: new Date().toISOString() }
      );
      res.json(rows[0].p);
      return;
    }

    // Get Persona info from knowledge graph
    const personaRows = await runQuery<{ name: string; birthDate: string }>(
      `MATCH (persona:Persona {persona_id: $personaId})
       RETURN persona.name AS name, persona.birth_date AS birthDate`,
      { personaId }
    );
    if (personaRows.length === 0) {
      res.status(404).json({ error: "Persona not found in knowledge graph" });
      return;
    }

    const persona = personaRows[0];
    const id = randomUUID();
    const now = new Date().toISOString();
    const birthYear = persona.birthDate ? parseInt(persona.birthDate.substring(0, 4)) : 0;

    // Create Patient node linked to the Persona's persona_id
    const rows = await runQuery<{ p: any }>(
      `MATCH (cg:Caregiver {id: $caregiverId})
       CREATE (p:Patient {
         id: $id,
         name: $name,
         birthYear: $birthYear,
         diagnosis: "",
         caregiverName: "",
         aiUserId: $personaId,
         status: "stable",
         createdAt: $now,
         updatedAt: $now
       })
       CREATE (cg)-[:CARES_FOR]->(p)
       RETURN p`,
      { id, name: persona.name, birthYear, personaId, now, caregiverId: req.caregiverId }
    );

    if (rows.length === 0) {
      res.status(500).json({ error: "보호자 계정을 찾을 수 없습니다. 다시 로그인해주세요." });
      return;
    }

    res.status(201).json(rows[0].p);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/patients/:patientId
router.get("/:patientId", async (req: Request<PatientParams>, res) => {
  const id = req.params.patientId;
  try {
    const rows = await runQuery<{ p: any }>(
      `MATCH (p:Patient {id: $id}) RETURN p`,
      { id }
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    res.json(rows[0].p);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/patients/:patientId
router.patch("/:patientId", async (req: Request<PatientParams>, res) => {
  const id = req.params.patientId;
  const updates = req.body;
  const now = new Date().toISOString();

  const setClauses: string[] = ["p.updatedAt = $now"];
  const params: any = { id, now, ...updates };

  Object.keys(updates).forEach(key => {
    setClauses.push(`p.${key} = $${key}`);
  });

  try {
    const rows = await runQuery<{ p: any }>(
      `MATCH (p:Patient {id: $id})
       SET ${setClauses.join(", ")}
       RETURN p`,
      params
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    res.json(rows[0].p);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
