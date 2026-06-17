import webpush from "web-push";
import { runQuery } from "./neo4j";

let initialized = false;

function init() {
  if (initialized) return;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) {
    throw new Error(
      "VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT must be set in .env",
    );
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  initialized = true;
}

export type PushPayload = {
  title: string;
  body: string;
  data?: Record<string, any>;
};

export async function sendPushToPatient(
  patientId: string,
  payload: PushPayload,
): Promise<{ sent: number; total: number; failed: number }> {
  init();

  const rows = await runQuery<{ endpoint: string; p256dh: string; auth: string }>(
    `MATCH (p:Patient)
     WHERE p.id = $patientId OR p.aiUserId = $patientId
     MATCH (p)-[:HAS_PUSH_SUBSCRIPTION]->(s:PushSubscription)
     RETURN s.endpoint AS endpoint, s.p256dh AS p256dh, s.auth AS auth`,
    { patientId },
  );
  if (rows.length === 0) return { sent: 0, total: 0, failed: 0 };

  const body = JSON.stringify(payload);
  const goneEndpoints: string[] = [];
  let sent = 0;
  let failed = 0;

  await Promise.all(
    rows.map(async (r) => {
      try {
        await webpush.sendNotification(
          { endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } },
          body,
          { TTL: 60 },
        );
        sent++;
      } catch (err: any) {
        failed++;
        const status = err?.statusCode;
        if (status === 404 || status === 410) {
          goneEndpoints.push(r.endpoint);
        } else {
          console.error(`[web-push] send failed (status=${status}):`, err?.message ?? err);
        }
      }
    }),
  );

  if (goneEndpoints.length > 0) {
    await runQuery(
      `MATCH (s:PushSubscription) WHERE s.endpoint IN $endpoints DETACH DELETE s`,
      { endpoints: goneEndpoints },
    );
  }

  return { sent, total: rows.length, failed };
}
