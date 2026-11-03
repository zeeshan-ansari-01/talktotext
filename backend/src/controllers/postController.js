import Post from "../models/Post.js";
import { updatePostSchema, generatePostSchema } from "../validators/postValidator.js";
import { generateBlog } from "../services/blogService.js";

// Meri saari posts (naye pehle)
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("title content createdAt");
    res.json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};

// Ek post
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.user._id });
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// Post edit
export const updatePost = async (req, res, next) => {
  try {
    const { title, content } = updatePostSchema.parse(req.body);

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content },
      { new: true, runValidators: true }
    );
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// Transcript se blog banao aur save karo
export const generatePost = async (req, res, next) => {
  try {
    const { transcript } = generatePostSchema.parse(req.body);

    // Style ke liye is user ki pichli 3 posts
    const previousPosts = await Post.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("content");

    const { title, content, truncated } = await generateBlog(
      transcript,
      previousPosts
    );

    const post = await Post.create({ user: req.user._id, title, content });

    res.status(201).json({ success: true, post, truncated });
  } catch (error) {
    next(error);
  }
};