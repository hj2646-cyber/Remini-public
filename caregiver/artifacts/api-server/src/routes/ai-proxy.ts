import { Router, type IRouter, type Request, type Response } from "express";
import { runQuery } from "../neo4j";

const router: IRouter = Router({ mergeParams: true });

const AI_SERVER_URL =
  process.env.AI_SERVER_URL || "http://localhost:8000";

const TIMEOUT_MS = 30_000;

// ---------------------------------------------------------------------------
// Helper: resolve Neo4j patientId (UUID) → AI server user_id (e.g. "P001")
// ---------------------------------------------------------------------------
async function resolveAiUserId(patientId: string): Promise<string> {
  const rows = await runQuery<{ aiUserId: string | null }>(
    `MATCH (p:Patient {id: $id}) RETURN p.aiUserId AS aiUserId`,
    { id: patientId }
  );
  const aiUserId = rows[0]?.aiUserId;
  // If no aiUserId is set, fall back to the patientId itself
  return aiUserId || patientId;
}

// ---------------------------------------------------------------------------
// Helper: fetch from the AI server with timeout and error handling
// ---------------------------------------------------------------------------

async function aiGet(path: string): Promise<globalThis.Response> {
  const url = `${AI_SERVER_URL}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function aiDelete(path: string): Promise<globalThis.Response> {
  const url = `${AI_SERVER_URL}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { method: "DELETE", signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function aiPostRaw(
  path: string,
  body: Buffer | ArrayBuffer,
  contentType: string,
): Promise<globalThis.Response> {
  const url = `${AI_SERVER_URL}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body,
      signal: controller.signal,
      duplex: "half",
    } as RequestInit);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Forward the AI server response to the Express response.
 * Returns true if the response was sent, false otherwise (caller should handle).
 */
async function forwardResponse(
  aiRes: globalThis.Response,
  res: Response,
): Promise<void> {
  const contentType = aiRes.headers.get("content-type") || "application/json";
  res.status(aiRes.status).set("Content-Type", contentType);
  const body = await aiRes.text();
  res.send(body);
}

function handleAiError(err: unknown, res: Response): void {
  if (err instanceof DOMException && err.name === "AbortError") {
    res.status(504).json({
      error: "AI server request timed out",
      detail: `No response within ${TIMEOUT_MS / 1000}s`,
    });
    return;
  }
  const message =
    err instanceof Error ? err.message : "Unknown error";
  // Connection refused, DNS failure, etc.
  res.status(502).json({
    error: "AI server unavailable",
    detail: message,
  });
}

// ---------------------------------------------------------------------------
// Routes scoped to a patient: /api/patients/:patientId/ai/*
// ---------------------------------------------------------------------------

type PatientParams = { patientId: string };
type ProfileParams = { patientId: string; profileId: string };

// -- Conversations ----------------------------------------------------------

// GET /api/patients/:patientId/ai/conversations
router.get(
  "/patients/:patientId/ai/conversations",
  async (req: Request<PatientParams>, res: Response) => {
    try {
      const userId = await resolveAiUserId(req.params.patientId);
      const aiRes = await aiGet(
        `/conversations?user_id=${encodeURIComponent(userId)}`,
      );
      await forwardResponse(aiRes, res);
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// GET /api/patients/:patientId/ai/conversations/sessions
// Returns session-level aggregation (one entry per AI conversation session)
router.get(
  "/patients/:patientId/ai/conversations/sessions",
  async (req: Request<PatientParams>, res: Response) => {
    try {
      const userId = await resolveAiUserId(req.params.patientId);
      const limit = encodeURIComponent(String(req.query.limit ?? 50));
      const aiRes = await aiGet(
        `/conversations/sessions?user_id=${encodeURIComponent(userId)}&limit=${limit}`,
      );
      await forwardResponse(aiRes, res);
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// GET /api/patients/:patientId/ai/conversations/sessions/:sessionId
// Returns all messages in a session for the given patient
router.get(
  "/patients/:patientId/ai/conversations/sessions/:sessionId",
  async (
    req: Request<{ patientId: string; sessionId: string }>,
    res: Response,
  ) => {
    try {
      const userId = await resolveAiUserId(req.params.patientId);
      const { sessionId } = req.params;
      const aiRes = await aiGet(
        `/conversations?user_id=${encodeURIComponent(userId)}&session_id=${encodeURIComponent(sessionId)}&limit=500`,
      );
      await forwardResponse(aiRes, res);
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// GET /api/patients/:patientId/ai/conversations/summary
router.get(
  "/patients/:patientId/ai/conversations/summary",
  async (req: Request<PatientParams>, res: Response) => {
    try {
      const userId = await resolveAiUserId(req.params.patientId);
      const aiRes = await aiGet(
        `/conversations/summary?user_id=${encodeURIComponent(userId)}`,
      );
      await forwardResponse(aiRes, res);
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// DELETE /api/patients/:patientId/ai/conversations/sessions/:sessionId
// 세션 1개 (한 번 대화 전체) 삭제. AI 서버 DB 에서 영구 삭제.
router.delete(
  "/patients/:patientId/ai/conversations/sessions/:sessionId",
  async (
    req: Request<{ patientId: string; sessionId: string }>,
    res: Response,
  ) => {
    try {
      const { sessionId } = req.params;
      const aiRes = await aiDelete(
        `/conversations/sessions/${encodeURIComponent(sessionId)}`,
      );
      await forwardResponse(aiRes, res);
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// DELETE /api/patients/:patientId/ai/conversations
// 환자의 모든 대화 내역 삭제 (전체 초기화).
router.delete(
  "/patients/:patientId/ai/conversations",
  async (req: Request<PatientParams>, res: Response) => {
    try {
      const userId = await resolveAiUserId(req.params.patientId);
      const aiRes = await aiDelete(
        `/conversations/users/${encodeURIComponent(userId)}`,
      );
      await forwardResponse(aiRes, res);
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// -- Voice Profiles ---------------------------------------------------------

// GET /api/patients/:patientId/ai/voice-profiles
router.get(
  "/patients/:patientId/ai/voice-profiles",
  async (req: Request<PatientParams>, res: Response) => {
    try {
      const userId = await resolveAiUserId(req.params.patientId);
      const aiRes = await aiGet(
        `/voice-profiles?user_id=${encodeURIComponent(userId)}`,
      );
      await forwardResponse(aiRes, res);
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// POST /api/patients/:patientId/ai/voice-profiles
// Forward multipart form data as-is, injecting user_id from patientId.
router.post(
  "/patients/:patientId/ai/voice-profiles",
  async (req: Request<PatientParams>, res: Response) => {
    try {
      const { patientId } = req.params;

      // Read the raw body and forward it with its original content-type.
      // Express has already parsed the body as json/urlencoded, so we need
      // the raw bytes for multipart. We re-collect them from the request stream.
      const contentType = req.headers["content-type"] || "";

      // For multipart, we need to collect raw chunks from the incoming request
      // and forward them to the AI server, adding user_id if not present.
      const userId = await resolveAiUserId(patientId);

      if (contentType.includes("multipart/form-data")) {
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", async () => {
          try {
            const rawBody = Buffer.concat(chunks);
            const aiRes = await aiPostRaw(
              `/voice-profiles?user_id=${encodeURIComponent(userId)}`,
              rawBody,
              contentType,
            );
            await forwardResponse(aiRes, res);
          } catch (err) {
            handleAiError(err, res);
          }
        });
        req.on("error", (err) => handleAiError(err, res));
      } else {
        const body = { ...req.body, user_id: userId };
        const url = `${AI_SERVER_URL}/voice-profiles`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
        try {
          const aiRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal,
          });
          await forwardResponse(aiRes, res);
        } finally {
          clearTimeout(timer);
        }
      }
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// DELETE /api/patients/:patientId/ai/voice-profiles/:profileId
router.delete(
  "/patients/:patientId/ai/voice-profiles/:profileId",
  async (req: Request<ProfileParams>, res: Response) => {
    try {
      const userId = await resolveAiUserId(req.params.patientId);
      const { profileId } = req.params;
      const aiRes = await aiDelete(
        `/voice-profiles/${encodeURIComponent(profileId)}?user_id=${encodeURIComponent(userId)}`,
      );
      await forwardResponse(aiRes, res);
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// -- Memory Photos ----------------------------------------------------------

// GET /api/patients/:patientId/ai/memory-photos
router.get(
  "/patients/:patientId/ai/memory-photos",
  async (req: Request<PatientParams>, res: Response) => {
    try {
      const userId = await resolveAiUserId(req.params.patientId);
      const aiRes = await aiGet(
        `/memory-photos?user_id=${encodeURIComponent(userId)}`,
      );
      await forwardResponse(aiRes, res);
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// POST /api/patients/:patientId/ai/memory-photos
// Forward multipart form data as-is, injecting user_id from patientId.
router.post(
  "/patients/:patientId/ai/memory-photos",
  async (req: Request<PatientParams>, res: Response) => {
    try {
      const { patientId } = req.params;
      const contentType = req.headers["content-type"] || "";

      const userId = await resolveAiUserId(patientId);

      if (contentType.includes("multipart/form-data")) {
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", async () => {
          try {
            const rawBody = Buffer.concat(chunks);
            const aiRes = await aiPostRaw(
              `/memory-photos?user_id=${encodeURIComponent(userId)}`,
              rawBody,
              contentType,
            );
            await forwardResponse(aiRes, res);
          } catch (err) {
            handleAiError(err, res);
          }
        });
        req.on("error", (err) => handleAiError(err, res));
      } else {
        const body = { ...req.body, user_id: userId };
        const url = `${AI_SERVER_URL}/memory-photos`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
        try {
          const aiRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal,
          });
          await forwardResponse(aiRes, res);
        } finally {
          clearTimeout(timer);
        }
      }
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// POST /api/patients/:patientId/ai/memory-photos/:photoId/activate
router.post(
  "/patients/:patientId/ai/memory-photos/:photoId/activate",
  async (req: Request<{ patientId: string; photoId: string }>, res: Response) => {
    try {
      const userId = await resolveAiUserId(req.params.patientId);
      const { photoId } = req.params;
      const url =
        `${AI_SERVER_URL}/memory-photos/${encodeURIComponent(photoId)}/activate` +
        `?user_id=${encodeURIComponent(userId)}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const aiRes = await fetch(url, {
          method: "POST",
          signal: controller.signal,
        });
        await forwardResponse(aiRes, res);
      } finally {
        clearTimeout(timer);
      }
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// DELETE /api/patients/:patientId/ai/memory-photos/:photoId
router.delete(
  "/patients/:patientId/ai/memory-photos/:photoId",
  async (req: Request<{ patientId: string; photoId: string }>, res: Response) => {
    try {
      const userId = await resolveAiUserId(req.params.patientId);
      const { photoId } = req.params;
      const aiRes = await aiDelete(
        `/memory-photos/${encodeURIComponent(photoId)}?user_id=${encodeURIComponent(userId)}`,
      );
      await forwardResponse(aiRes, res);
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// GET /api/patients/:patientId/ai/memory-photos/:photoId/file
// Streams the image back through the API server so the caregiver app
// doesn't need direct access to the AI server origin.
router.get(
  "/patients/:patientId/ai/memory-photos/:photoId/file",
  async (req: Request<{ patientId: string; photoId: string }>, res: Response) => {
    try {
      const userId = await resolveAiUserId(req.params.patientId);
      const { photoId } = req.params;
      const aiRes = await aiGet(
        `/memory-photos/${encodeURIComponent(photoId)}/file?user_id=${encodeURIComponent(userId)}`,
      );
      const contentType = aiRes.headers.get("content-type") || "application/octet-stream";
      res.status(aiRes.status).set("Content-Type", contentType);
      const buffer = Buffer.from(await aiRes.arrayBuffer());
      res.send(buffer);
    } catch (err) {
      handleAiError(err, res);
    }
  },
);

// ---------------------------------------------------------------------------
// Routes NOT scoped to a patient: /api/ai/*
// ---------------------------------------------------------------------------

// GET /api/ai/metrics
router.get("/ai/metrics", async (_req: Request, res: Response) => {
  try {
    const aiRes = await aiGet("/metrics");
    await forwardResponse(aiRes, res);
  } catch (err) {
    handleAiError(err, res);
  }
});

// GET /api/ai/health
router.get("/ai/health", async (_req: Request, res: Response) => {
  try {
    const aiRes = await aiGet("/health");
    await forwardResponse(aiRes, res);
  } catch (err) {
    handleAiError(err, res);
  }
});

export default router;
