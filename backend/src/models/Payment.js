import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // stripeSessionId: { type: String, required: true, unique: true },
    provider: { type: String, required: true },
    providerPaymentId: { type: String, required: true, unique: true },
    priceId: { type: String, required: true },
    amount: { type: Number, required: true }, // sabse chhote unit mein (cents)
    currency: { type: String, default: "usd" },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);