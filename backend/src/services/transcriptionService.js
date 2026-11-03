import fs from "fs";
import path from "path";

const GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const MODEL = "whisper-large-v3-turbo";

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const transcribeFile = async (filePath) => {
  const blob = await fs.openAsBlob(filePath);

  const form = new FormData();
  form.append("file", blob, path.basename(filePath));
  form.append("model", MODEL);
  form.append("response_format", "json");

  let response;
  try {
    response = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: form,
      signal: AbortSignal.timeout(120000), // 2 minute
    });
  } catch (error) {
    throw httpError(502, "Transcription service is not reachable. Try again.");
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw httpError(429, "Transcription limit reached. Please try again later.");
    }
    throw httpError(502, "Transcription failed. Please try again.");
  }

  const data = await response.json();
  const text = (data.text || "").trim();

  if (!text) {
    throw httpError(422, "No speech could be found in this file.");
  }
  return text;
};