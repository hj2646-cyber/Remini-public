import { Router, type IRouter, type Request } from "express";
import { runQuery } from "../neo4j";
import { randomUUID } from "crypto";

const router: IRouter = Router({ mergeParams: true });
type FeedbackParams = { patientId: string; conversationId: string };

const AI_SERVER_URL = process.env.AI_SERVER_URL || "http://127.0.0.1:8000";

/**
 * Phase 6 — 보호자가 "dissatisfied" 피드백 + 주제를 남기면
 * AI 서버의 avoidance 스토어에 기록하여 다음 대화에서 해당 주제를 회피한다.
 * comments 필드는 쉼표(, ，、)로 구분된 주제 목록으로 해석.
 * 실패해도 feedback 생성은 막지 않음 (fire-and-forget).
 */
async function pushAvoidanceTopics(userId: string, comments: string | null) {
  if (!userId || !comments) return;
  const topics = comments
    .split(/[,，、]/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && t.length < 30);
  if (topics.length === 0) return;

  await Promise.all(
    topics.map((topic) =>
      fetch(`${AI_SERVER_URL}/avoidance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, topic }),
      }).catch((err) => {
        console.error(`[avoidance] push failed topic="${topic}":`, err?.message || err);
      })
    )
  );
}

// POST /api/patients/:patientId/conversations/:conversationId/feedback
router.post("/", async (req: Request<FeedbackParams>, res) => {
  const conversationId = req.params.conversationId;
  const patientId = req.params.patientId;
  const { satisfaction, topicRelevance, toneAppropriate, memoryAccuracy, comments } = req.body;
  const id = randomUUID();
  const now = new Date().toISOString();

  try {
    const rows = await runQuery<{ f: any }>(
      `MATCH (c:Conversation {id: $conversationId})
       CREATE (f:Feedback {
         id: $id,
         satisfaction: $satisfaction,
         topicRelevance: $topicRelevance,
         toneAppropriate: $toneAppropriate,
         memoryAccuracy: $memoryAccuracy,
         comments: $comments,
         createdAt: $now
       })
       CREATE (c)-[:HAS_FEEDBACK]->(f)
       SET c.feedbackSubmitted = true
       RETURN f`,
      {
        conversationId,
        id,
        satisfaction,
        topicRelevance,
        toneAppropriate,
        memoryAccuracy,
        comments: comments ?? null,
        now
      }
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    // Phase 6: dissatisfied + comments → AI 서버 avoidance로 push (fire-and-forget)
    if (satisfaction === "dissatisfied" && comments && patientId) {
      pushAvoidanceTopics(patientId, comments).catch((err) =>
        console.error("[avoidance] background error:", err?.message || err)
      );
    }

    res.status(201).json(rows[0].f);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
