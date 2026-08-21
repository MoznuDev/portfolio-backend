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
    },
    company: {
      type: String,
      default: "",
    },
    clientImage: {
      type: String,
      default: "",
    },
    review: {
      type: String,
      required: [true, "Review text is required"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    projectTitle: {
      type: String,
      default: "",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;