import express from "express";
import {
  createReview,
  getReviews,
  getFeaturedReviews,
  deleteReview,
} from "./review.controller.js";

const router = express.Router();

router.post("/create-review", createReview);
router.get("/", getReviews);
router.get("/featured", getFeaturedReviews);
router.delete("/:id", deleteReview);

export default router;