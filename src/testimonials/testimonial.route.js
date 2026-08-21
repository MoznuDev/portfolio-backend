import express from "express";
import {
  createTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "./testimonial.controller.js";

const router = express.Router();

router.post("/create-testimonial", createTestimonial);
router.get("/", getTestimonials);
router.patch("/:id", updateTestimonial);
router.delete("/:id", deleteTestimonial);

export default router;