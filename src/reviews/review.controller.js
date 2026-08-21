import Review from "./review.model.js";

// Create Single or Bulk Reviews
export const createReview = async (req, res) => {
  try {
    let savedReviews;
    if (Array.isArray(req.body)) {
      savedReviews = await Review.insertMany(req.body);
    } else {
      const newReview = new Review({ ...req.body });
      savedReviews = await newReview.save();
    }

    return res.status(201).json({
      success: true,
      message: "Review(s) created successfully",
      data: savedReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// Get All Reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get Featured Reviews Only
export const getFeaturedReviews = async (req, res) => {
  try {
    const featuredReviews = await Review.find({ isFeatured: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, reviews: featuredReviews });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};