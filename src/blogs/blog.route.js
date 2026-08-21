import express from "express";
import multer from "multer";
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "./blog.controller.js";

const router = express.Router();

// Multer Config (Memory Storage for Vercel/Cloudinary stream)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Base URL: /api/blogs
router.post("/", upload.single("image"), createBlog);
router.get("/", getBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.get("/:id", getBlogById);
router.put("/:id", upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);

export default router;