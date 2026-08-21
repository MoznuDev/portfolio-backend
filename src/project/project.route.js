import express from "express";
import multer from "multer";
import {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  addProjectReview,
} from "./project.controller.js";

const router = express.Router();

// Multer Storage Config for Project Uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

// Base Route: /api/projects

// 1. Fetch & Create Projects
router.get("/", getProjects);
router.post("/", upload.single("image"), createProject);

// 2. Reviews (Placed before generic /:id route)
router.post("/:id/reviews", addProjectReview);

// 3. Single Project CRUD
router.get("/:id", getSingleProject);
router.put("/:id", upload.single("image"), updateProject);
router.delete("/:id", deleteProject);

export default router;