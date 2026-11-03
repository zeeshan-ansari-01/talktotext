import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { requirePlan } from "../middleware/planGuard.js";
import { uploadMedia } from "../middleware/upload.js";
import { transcribe } from "../controllers/transcriptionController.js";

const router = Router();

// Order zaroori hai: pehle login, phir plan, tab file lo, tab transcribe
router.post("/", protect, requirePlan, uploadMedia, transcribe);

export default router;