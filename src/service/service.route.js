import express from "express";
import multer from "multer";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "./service.controller.js";

const router = express.Router();

// Multer Config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

// Base Path: /api/services
router.get("/", getServices);
router.post("/", upload.single("iconFile"), createService);
router.put("/:id", upload.single("iconFile"), updateService);
router.delete("/:id", deleteService);

export default router;