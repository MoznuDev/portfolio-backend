import mongoose from "mongoose";
import slugify from "slugify";

const skillchema = new mongoose.Schema(
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
    },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Tools", "Soft skill", "Other"],
      default: "Frontend",
    },
    icon: {
      type: String,
      default: "",
    },
    proficiencyLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
  },
  { timestamps: true },
);

// ✅ Safe Modern Pre-save Hook (Async pattern without explicit next callback)
skillchema.pre("save", async function () {
  if (this.isModified("title") || !this.slug) {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }
  }
});

const Skill = mongoose.models.Skill || mongoose.model("Skill", skillchema);

export default Skill;
