import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    clientDesignation: {
      type: String,
      default: "Client",
      trim: true,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    clientImage: {
      type: String,
      default: "",
    },
    review: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      default: 5,
    },
    projectTitle: {
      type: String,
      default: "",
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true, // 👈 Featured রিভিউ দ্রুত সার্চ করার জন্য Index যোগ করা হয়েছে
    },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;