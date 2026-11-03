import fs from "fs/promises";
import { transcribeFile } from "../services/transcriptionService.js";

// Ek user ek time par ek hi transcription chala sake (duplicate processing se bachav)
const inProgress = new Set();

export const transcribe = async (req, res, next) => {
  const filePath = req.file?.path;
  const userId = String(req.user._id);
  let locked = false;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an audio or video file" });
    }

    if (inProgress.has(userId)) {
      return res.status(429).json({
        success: false,
        message: "A transcription is already in progress. Please wait.",
      });
    }
    inProgress.add(userId);
    locked = true;

    const transcript = await transcribeFile(filePath);
    res.json({ success: true, transcript });
  } catch (error) {
    next(error);
  } finally {
    if (locked) inProgress.delete(userId);
    if (filePath) await fs.unlink(filePath).catch(() => {});
  }
};