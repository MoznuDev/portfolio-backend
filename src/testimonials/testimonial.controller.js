import Testimonial from "./testimonial.model.js";

// Create Single or Multiple Testimonials
export const createTestimonial = async (req, res) => {
  try {
    let savedData;
    if (Array.isArray(req.body)) {
      savedData = await Testimonial.insertMany(req.body);
    } else {
      const newTestimonial = new Testimonial({ ...req.body });
      savedData = await newTestimonial.save();
    }

    return res.status(201).json({
      success: true,
      message: "Testimonial(s) added successfully",
      data: savedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add testimonial",
      error: error.message,
    });
  }
};

// Get All Testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update Testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    return res.status(200).json({ success: true, data: updatedTestimonial });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};