import { Router, type IRouter, type Request } from "express";
import { runQuery } from "../neo4j";
import { sendPushToPatient } from "../web-push";
import { randomUUID } from "crypto";

const router: IRouter = Router({ mergeParams: true });
type PatientParams = { patientId: string };
type AlertParams = { patientId: string; alertId: string };

// GET /api/patients/:patientId/alerts
router.get("/", async (req: Request<PatientParams>, res) => {
  const patientId = req.params.patientId;
  const unreadOnly = req.query.unreadOnly === "true";

  const cypher = unreadOnly
    ? `MATCH (p:Patient {id: $patientId})-[:HAS_ALERT]->(a:Alert {isRead: false})
       RETURN a ORDER BY a.createdAt DESC`
    : `MATCH (p:Patient {id: $patientId})-[:HAS_ALERT]->(a:Alert)
       RETURN a ORDER BY a.createdAt DESC`;

  try {
    const rows = await runQuery<{ a: any }>(cypher, { patientId });
    res.json(rows.map(r => r.a));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/patients/:patientId/alerts (also supports aiUserId as patientId)
// The webhook from dementia-llm sends aiUserId (e.g. "P001") as the patientId.
// We try to find the patient by aiUserId first, then by id.
router.post("/", async (req: Request<PatientParams>, res) => {
  const rawId = req.params.patientId;
  const { level, message } = req.body;
  const id = randomUUID();
  const now = new Date().toISOString();

  try {
    // Try by aiUserId first
    let rows = await runQuery<{ a: any }>(
      `MATCH (p:Patient {aiUserId: $rawId})
       CREATE (a:Alert {
         id: $id,
         level: $level,
         message: $message,
         isRead: false,
         createdAt: $now
       })
       CREATE (p)-[:HAS_ALERT]->(a)
       RETURN a`,
      { rawId, id, level, message, now }
    );
    // If not found by aiUserId, try by id
    if (rows.length === 0) {
      rows = await runQuery<{ a: any }>(
        `MATCH (p:Patient {id: $rawId})
         CREATE (a:Alert {
           id: $id2,
           level: $level,
           message: $message,
           isRead: false,
           createdAt: $now
         })
         CREATE (p)-[:HAS_ALERT]->(a)
         RETURN a`,
        { rawId, id2: randomUUID(), level, message, now }
      );
    }
    if (rows.length === 0) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    const alertNode = rows[0].a;
    res.status(201).json(alertNode);

    // fire-and-forget: push to all registered devices for this patient
    const isRiskAlert = level === "warning" || level === "emergency";
    sendPushToPatient(rawId, {
      title: isRiskAlert ? "환자 위험 발화 감지" : "환자 알림",
      body: typeof message === "string" ? message : "",
      data: {
        type: "alert",
        level,
        alertId: alertNode?.id,
        patientId: rawId,
        createdAt: now,
      },
    }).catch((err) => {
      console.error(`[alert push] failed for ${rawId}:`, err?.message ?? err);
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/patients/:patientId/alerts/read-all
router.patch("/read-all", async (req: Request<PatientParams>, res) => {
  const patientId = req.params.patientId;
  try {
    await runQuery(
      `MATCH (p:Patient {id: $patientId})-[:HAS_ALERT]->(a:Alert {isRead: false})
       SET a.isRead = true`,
      { patientId }
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/patients/:patientId/alerts/:alertId/read
router.patch("/:alertId/read", async (req: Request<AlertParams>, res) => {
  const alertId = req.params.alertId;
  try {
    const rows = await runQuery<{ a: any }>(
      `MATCH (a:Alert {id: $alertId})
       SET a.isRead = true
       RETURN a`,
      { alertId }
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }
    res.json(rows[0].a);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
