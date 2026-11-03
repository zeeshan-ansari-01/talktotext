import Post from "../models/Post.js";

const BASIC_POST_LIMIT = 3;

export const requirePlan = async (req, res, next) => {
  try {
    const { status, priceId } = req.user;

    if (status !== "active" || !priceId) {
      return res.status(403).json({
        success: false,
        message: "An active plan is required. Please upgrade.",
      });
    }

    if (priceId === process.env.PLAN_PRO_ID) {
      return next();
    }

    if (priceId === process.env.PLAN_BASIC_ID) {
      const count = await Post.countDocuments({ user: req.user._id });
      if (count >= BASIC_POST_LIMIT) {
        return res.status(403).json({
          success: false,
          message: "Basic plan limit reached (3 posts). Upgrade to Pro.",
        });
      }
      return next();
    }

    res.status(403).json({ success: false, message: "Unknown plan" });
  } catch (error) {
    next(error);
  }
};