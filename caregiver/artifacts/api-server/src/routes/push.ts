import { Router, type IRouter, type Request } from "express";
import { runQuery } from "../neo4j";
import { sendPushToPatient } from "../web-push";

const router: IRouter = Router();

// GET /api/push/vapid-public-key
router.get("/vapid-public-key", (_req, res) => {
  const key = process.env.VAPID_PUBLIC_KEY;
  if (!key) {
    res.status(500).json({ error: "VAPID_PUBLIC_KEY not configured" });
    return;
  }
  res.json({ publicKey: key });
});

// POST /api/push/subscribe
// body: { patientId, subscription: { endpoint, keys: { p256dh, auth } }, label? }
router.post("/subscribe", async (req: Request, res) => {
  const { patientId, subscription, label } = req.body ?? {};
  if (
    !patientId ||
    !subscription?.endpoint ||
    !subscription?.keys?.p256dh ||
    !subscription?.keys?.auth
  ) {
    res
      .status(400)
      .json({ error: "patientId and complete subscription (endpoint + keys) required" });
    return;
  }
  const now = new Date().toISOString();
  try {
    const rows = await runQuery<{ s: any }>(
      `MATCH (p:Patient)
       WHERE p.id = $patientId OR p.aiUserId = $patientId
       WITH p LIMIT 1
       MERGE (s:PushSubscription { endpoint: $endpoint })
       SET s.p256dh = $p256dh,
           s.auth = $auth,
           s.label = $label,
           s.updatedAt = $now,
           s.createdAt = coalesce(s.createdAt, $now)
       MERGE (p)-[:HAS_PUSH_SUBSCRIPTION]->(s)
       RETURN s`,
      {
        patientId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        label: label ?? null,
        now,
      },
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    res.status(201).json({ ok: true, subscription: rows[0].s });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/push/unsubscribe
// body: { endpoint }
router.post("/unsubscribe", async (req: Request, res) => {
  const { endpoint } = req.body ?? {};
  if (!endpoint) {
    res.status(400).json({ error: "endpoint required" });
    return;
  }
  try {
    await runQuery(
      `MATCH (s:PushSubscription { endpoint: $endpoint }) DETACH DELETE s`,
      { endpoint },
    );
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/push/test
// body: { patientId, title?, body? }
router.post("/test", async (req: Request, res) => {
  const { patientId, title, body } = req.body ?? {};
  if (!patientId) {
    res.status(400).json({ error: "patientId required" });
    return;
  }
  try {
    const result = await sendPushToPatient(patientId, {
      title: title ?? "Remini 테스트 알림",
      body: body ?? "푸시 정상 도착",
      data: { type: "test", patientId },
    });
    if (result.total === 0) {
      res.status(404).json({ error: "No subscriptions for patient", ...result });
      return;
    }
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
