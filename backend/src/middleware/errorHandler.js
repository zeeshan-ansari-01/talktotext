import { ZodError } from "zod";

// Koi route nahi mila
export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

// Saare errors yahan aate hain
export const errorHandler = (err, req, res, next) => {
  // Galat input (zod validation)
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: err.issues[0]?.message || "Invalid input",
    });
  }

    // Upload ke errors (file bahut badi, ek se zyada file, etc.)
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(413)
        .json({ success: false, message: "File is too large. Max size is 20MB." });
    }
    return res
      .status(400)
      .json({ success: false, message: "Invalid file upload" });
  }

  // Duplicate email (unique index)
  if (err.code === 11000) {
    return res
      .status(409)
      .json({ success: false, message: "Email already registered" });
  }

  // Galat ID format
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  // Baaki sab: andar ki detail bahar nahi, sirf terminal mein
  console.error(err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.status ? err.message : "Server error" });
};