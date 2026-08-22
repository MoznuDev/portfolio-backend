import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ৩ নম্বর আর্গুমেন্টে ডাটাবেজের কালেকশনের আসল নাম "client" দেওয়া হলো
const Client = mongoose.model("Client", clientSchema, "client");

export default Client;