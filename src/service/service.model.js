import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },
    icon: {
      type: String, // Icon name (e.g. 'react', 'wordpress') or Image URL
      default: "",
      trim: true,
    },
    // ফ্রন্টএন্ডে ব্যবহৃত টেকনোলজির তালিকা (Array of Strings)
    technologies: {
      type: [String],
      default: [],
    },
    // ফ্রন্টএন্ডে ব্যবহৃত ফিচারের তালিকা (Array of Strings)
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
    timestamps: true 
  }
);

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;