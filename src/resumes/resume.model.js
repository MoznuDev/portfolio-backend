import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    personalInfo: {
      fullName: { type: String, required: true },
      title: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      linkedin: { type: String },
      github: { type: String },
    },
    summary: { type: String, required: true },
    featuredProject: {
      title: { type: String },
      technologies: [{ type: String }],
      description: { type: String },
      challenges: [{ type: String }],
      projectUrl: { type: String },
    },
    workExperience: [
      {
        company: { type: String },
        role: { type: String },
        duration: { type: String },
        location: { type: String },
        description: { type: String },
      },
    ],
    skillAndTools: {
      languages: [{ type: String }],
      frontend: [{ type: String }],
      backend: [{ type: String }],
      uiRelated: [{ type: String }],
      toolsCode: [{ type: String }],
      toolsManagement: [{ type: String }],
      toolsDesign: [{ type: String }],
    },
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        year: { type: String },
        location: { type: String },
      },
    ],
  },
  { timestamps: true },
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
