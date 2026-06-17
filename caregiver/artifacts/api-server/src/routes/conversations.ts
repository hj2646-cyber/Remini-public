import { Router, type IRouter, type Request } from "express";
import { runQuery } from "../neo4j";
import { randomUUID } from "crypto";

const router: IRouter = Router({ mergeParams: true });
type PatientParams = { patientId: string };
type ConversationParams = { patientId: string; conversationId: string };

// GET /api/patients/:patientId/conversations
router.get("/", async (req: Request<PatientParams>, res) => {
  const patientId = req.params.patientId;
  try {
    const rows = await runQuery<{ c: any }>(
      `MATCH (p:Patient {id: $patientId})-[:HAS_CONVERSATION]->(c:Conversation)
       RETURN c ORDER BY c.sessionDate DESC`,
      { patientId }
    );
    res.json(rows.map(r => r.c));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/patients/:patientId/conversations
router.post("/", async (req: Request<PatientParams>, res) => {
  const patientId = req.params.patientId;
  const { sessionDate, summary } = req.body;
  const id = randomUUID();
  const now = new Date().toISOString();

  try {
    const rows = await runQuery<{ c: any }>(
      `MATCH (p:Patient {id: $patientId})
       CREATE (c:Conversation {
         id: $id,
         sessionDate: $sessionDate,
         summary: $summary,
         feedbackSubmitted: false,
         messageCount: 0,
         createdAt: $now
       })
       CREATE (p)-[:HAS_CONVERSATION]->(c)
       RETURN c`,
      {
        patientId,
        id,
        sessionDate: sessionDate ? new Date(sessionDate).toISOString() : now,
        summary: summary ?? null,
        now
      }
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    res.status(201).json(rows[0].c);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/patients/:patientId/conversations/:conversationId
router.get("/:conversationId", async (req: Request<ConversationParams>, res) => {
  const patientId = req.params.patientId;
  const conversationId = req.params.conversationId;

  try {
    // 1. Get conversation
    const convRows = await runQuery<{ c: any }>(
      `MATCH (p:Patient {id: $patientId})-[:HAS_CONVERSATION]->(c:Conversation {id: $conversationId})
       RETURN c`,
      { patientId, conversationId }
    );
    if (convRows.length === 0) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    const conversation = convRows[0].c;

    // 2. Get messages
    const msgRows = await runQuery<{ m: any }>(
      `MATCH (c:Conversation {id: $conversationId})-[:HAS_MESSAGE]->(m:Message)
       RETURN m ORDER BY m.timestamp ASC`,
      { conversationId }
    );
    const messages = msgRows.map(r => r.m);

    // 3. Get feedback
    const feedbackRows = await runQuery<{ f: any }>(
      `MATCH (c:Conversation {id: $conversationId})-[:HAS_FEEDBACK]->(f:Feedback)
       RETURN f`,
      { conversationId }
    );
    const feedback = feedbackRows.length > 0 ? feedbackRows[0].f : null;

    res.json({ ...conversation, messages, feedback });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/patients/:patientId/conversations/:conversationId/messages
router.post("/:conversationId/messages", async (req: Request<ConversationParams>, res) => {
  const conversationId = req.params.conversationId;
  const { role, content, timestamp } = req.body;
  const id = randomUUID();
  const t = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();

  try {
    const rows = await runQuery<{ m: any }>(
      `MATCH (c:Conversation {id: $conversationId})
       CREATE (m:Message {
         id: $id,
         role: $role,
         content: $content,
         timestamp: $t
       })
       CREATE (c)-[:HAS_MESSAGE]->(m)
       WITH c, m
       MATCH (c)-[:HAS_MESSAGE]->(all)
       WITH c, m, count(all) as cnt
       SET c.messageCount = cnt
       RETURN m`,
      { conversationId, id, role, content, t }
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    res.status(201).json(rows[0].m);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
