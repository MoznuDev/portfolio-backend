import mongoose from "mongoose";

const socialSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: true }
);

const heroBannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    primaryBtnText: { type: String, default: "View Portfolio" },
    primaryBtnLink: { type: String, default: "/project" },
    secondaryBtnText: { type: String, default: "Contact Me" },
    secondaryBtnLink: { type: String, default: "/contact" },
    imageUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    socials: [socialSchema],
  },
  { timestamps: true }
);

const HeroBanner = mongoose.models.HeroBanner || mongoose.model("HeroBanner", heroBannerSchema);

export default HeroBanner;