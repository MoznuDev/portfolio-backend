import express from "express";
import {
  createSkill,
  getAllskill,
  updateSkill,
  deleteSkill,
} from "./skill.controller.js";

const router = express.Router();

// Base URL: /api/skill
router.post("/", createSkill); // POST /api/skill
router.get("/", getAllskill); // GET /api/skill
router.put("/:id", updateSkill); // PUT /api/skill/:id
router.delete("/:id", deleteSkill); // DELETE /api/skill/:id

export default router;
