import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
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
    testimonial: {
      type: String,
      required: [true, "Testimonial content is required"],
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    projectTitle: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;