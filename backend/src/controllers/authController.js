import bcrypt from "bcrypt";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";
import { setAuthCookie, clearAuthCookie } from "../utils/token.js";

// Plan server se nikalta hai: sirf active subscription wala hi Basic/Pro hota hai
const getPlan = (user) => {
  if (user.status !== "active") return "starter";
  if (user.priceId === process.env.PLAN_PRO_ID) return "pro";
  if (user.priceId === process.env.PLAN_BASIC_ID) return "basic";
  return "starter";
};

// Frontend ko sirf safe fields bhejte hain (passwordHash kabhi nahi)
const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  status: user.status,
  priceId: user.priceId,
  plan: getPlan(user),
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const displayName = name || email.split("@")[0].slice(0, 60);

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: displayName, email, passwordHash });

    setAuthCookie(res, user._id);
    res.status(201).json({ success: true, user: toPublicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // passwordHash default mein hidden hai, yahan sirf login ke liye mangwate hain
    const user = await User.findOne({ email }).select("+passwordHash");
    const isMatch = user && (await bcrypt.compare(password, user.passwordHash));

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    setAuthCookie(res, user._id);
    res.json({ success: true, user: toPublicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: "Logged out" });
};

export const getMe = async (req, res, next) => {
  try {
    const postsCount = await Post.countDocuments({ user: req.user._id });
    res.json({
      success: true,
      user: { ...toPublicUser(req.user), postsCount },
    });
  } catch (error) {
    next(error);
  }
};