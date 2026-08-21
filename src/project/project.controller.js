import Project from './project.model.js';

// ========================================
// 1. CREATE PROJECT
// ========================================
export const createProject = async (req, res) => {
  try {
    const newProject = new Project({
      ...req.body,
    });
    const savedProject = await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: savedProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A project with this slug or title already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// ========================================
// 2. GET ALL PROJECTS
// ========================================
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

// ========================================
// 3. GET SINGLE PROJECT BY ID OR SLUG
// ========================================
export const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;

    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { slug: id };

    const project = await Project.findOne(query);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

// ========================================
// 4. UPDATE PROJECT BY ID
// ========================================
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A project with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// ========================================
// 5. DELETE PROJECT BY ID
// ========================================
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

// ========================================
// 6. ADD REVIEW TO PROJECT
// ========================================
export const addProjectReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, rating, comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Review comment is required",
      });
    }

    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { slug: id };

    const project = await Project.findOne(query);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const newReview = {
      userName: userName || "Anonymous",
      rating: Number(rating) || 5,
      comment,
      createdAt: new Date(),
    };

    if (!project.reviews) {
      project.reviews = [];
    }

    project.reviews.push(newReview);
    await project.save();

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      reviews: project.reviews,
      project,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
};