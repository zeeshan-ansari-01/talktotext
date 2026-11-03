import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    // stripeCustomerId: { type: String, default: null },
    providerCustomerId: { type: String, default: null },
    priceId: { type: String, default: null },
    status: {
      type: String,
      enum: ["none", "active", "cancelled"],
      default: "none",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);