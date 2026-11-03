import { z } from "zod";

export const updatePostSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").max(100000),
});

export const generatePostSchema = z.object({
  transcript: z
    .string()
    .trim()
    .min(20, "Transcript is too short")
    .max(200000, "Transcript is too long"),
});