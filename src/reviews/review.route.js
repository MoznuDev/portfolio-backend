import express from "express";
import {
  createReview,
  getReviews,
  getFeaturedReviews,
  updateReview,
  deleteReview,
} from "./review.controller.js";

const router = express.Router();

// Base Route: /api/reviews

// 1. Fetch Routes
router.get("/", getReviews);
router.get("/featured", getFeaturedReviews);

// 2. Create Routes (RESTful POST / and legacy POST /create-review)
router.post("/", createReview);
router.post("/create-review", createReview); 

// 3. Update & Delete Routes
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;