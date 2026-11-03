import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import transcriptionRoutes from "./routes/transcriptionRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Chhota test route: server chal raha hai ya nahi
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "TalkToText API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/transcriptions", transcriptionRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;