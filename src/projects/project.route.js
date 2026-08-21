import express from "express";
import {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  addProjectReview,
} from "./project.controller.js";

const router = express.Router();

// Project Routes
router.post("/", createProject);
router.get("/", getProjects);

// Specific action route before generic /:id
router.post("/:id/reviews", addProjectReview);

router.get("/:id", getSingleProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;