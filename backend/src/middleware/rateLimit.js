import rateLimit from "express-rate-limit";

// Login/register ke liye: 15 minute mein sirf 20 koshishein
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, please try again later",
  },
});