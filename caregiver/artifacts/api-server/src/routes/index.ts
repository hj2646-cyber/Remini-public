import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import patientsRouter from "./patients";
import conversationsRouter from "./conversations";
import feedbackRouter from "./feedback";
import knowledgeRouter from "./knowledge";
import alertsRouter from "./alerts";
import pendingKnowledgeRouter from "./pending-knowledge";
import aiProxyRouter from "./ai-proxy";
import pushRouter from "./push";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/patients", patientsRouter);
router.use("/patients/:patientId/conversations", conversationsRouter);
router.use("/patients/:patientId/conversations/:conversationId/feedback", feedbackRouter);
router.use("/patients/:patientId/knowledge", knowledgeRouter);
router.use("/patients/:patientId/alerts", alertsRouter);
router.use("/patients/:patientId/pending-knowledge", pendingKnowledgeRouter);
router.use("/push", pushRouter);
router.use(aiProxyRouter);

export default router;
