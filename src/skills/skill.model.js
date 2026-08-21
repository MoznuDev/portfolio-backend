import mongoose from "mongoose";
import slugify from "slugify";

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Skill title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true, // সার্চিং স্পিড বাড়ানোর জন্য
    },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Tools", "Soft skill", "Other"],
      default: "Frontend",
      index: true,
    },
    icon: {
      type: String,
      default: "",
    },
    proficiencyLevel: {
      type: Number,
      min: [0, "Proficiency cannot be less than 0"],
      max: [100, "Proficiency cannot be more than 100"],
      default: 80,
    },
  },
  { timestamps: true }
);

// ✅ Document Save হওয়ার পূর্বে Auto Slug তৈরি
skillSchema.pre("save", async function () {
  if (this.isModified("title") || !this.slug) {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }
  }
});

// ✅ Update (findOneAndUpdate) এর সময়ও Title পরিবর্তন হলে Slug আপডেট
skillSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update?.title) {
    update.slug = slugify(update.title, { lower: true, strict: true });
  }
});

const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema);

export default Skill;