import multer from "multer";
import os from "os";
import path from "path";
import crypto from "crypto";

// Groq jin formats ko support karta hai (docs se verify kiye)
const ALLOWED_EXT = [
  ".flac", ".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".ogg", ".wav", ".webm",
];

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const storage = multer.diskStorage({
  destination: os.tmpdir(),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `ttt-${crypto.randomUUID()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isMedia =
    file.mimetype.startsWith("audio/") || file.mimetype.startsWith("video/");

  if (isMedia && ALLOWED_EXT.includes(ext)) {
    return cb(null, true);
  }
  const error = new Error("Unsupported file type. Upload an audio or video file.");
  error.status = 400;
  cb(error);
};

export const uploadMedia = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter,
}).single("file");