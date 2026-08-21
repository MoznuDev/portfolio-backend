import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      unique: true, // ডুপ্লিকেট সার্ভিস তৈরি রোদ করতে
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },
    icon: {
      type: String, // Lucide icon name, FontAwesome class or Cloudinary Image URL
      default: "",
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  { 
    timestamps: true,
    versionKey: false, // __v ফিল্ড রিমুভ করবে
  }
);

// Serverless / Vercel Safety Check
const Service =
  mongoose.models && mongoose.models.Service
    ? mongoose.models.Service
    : mongoose.model("Service", serviceSchema);

export default Service;