import Review from "./review.model.js";

// ========================================
// 1. CREATE SINGLE OR BULK REVIEWS
// ========================================
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
      reviews: savedReviews,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// ========================================
// 2. GET ALL REVIEWS
// ========================================
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// ========================================
// 3. GET FEATURED REVIEWS ONLY
// ========================================
export const getFeaturedReviews = async (req, res) => {
  try {
    const featuredReviews = await Review.find({ isFeatured: true }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      message: "Featured reviews fetched successfully",
      data: featuredReviews,
      reviews: featuredReviews,
    });
  } catch (error) {
    console.error("Error fetching featured reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch featured reviews",
      error: error.message,
    });
  }
};

// ========================================
// 4. UPDATE REVIEW / TOGGLE FEATURED
// ========================================
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// ========================================
// 5. DELETE REVIEW BY ID
// ========================================
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};