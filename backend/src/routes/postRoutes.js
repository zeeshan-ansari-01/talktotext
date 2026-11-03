import { Router } from "express";
import {
  getPosts,
  getPostById,
  updatePost,
  generatePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";
import { requirePlan } from "../middleware/planGuard.js";

const router = Router();

// Is file ke saare routes ke liye login zaroori
router.use(protect);

router.post("/generate", requirePlan, generatePost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", updatePost);

export default router;