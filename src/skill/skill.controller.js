import Skill from "./skill.model.js"; // আপনার Skill মডেলের প্যাথ দিন

// ১. Create Skill
export const createSkill = async (req, res, next) => {
  try {
    const newSkill = await Skill.create(req.body);
    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: newSkill,
    });
  } catch (error) {
    next(error);
  }
};

// ২. Get All skill
export const getAllskill = async (req, res, next) => {
  try {
    const skill = await Skill.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "skill retrieved successfully",
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// ৩. Update Skill
export const updateSkill = async (req, res, next) => {
  try {
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: updatedSkill,
    });
  } catch (error) {
    next(error);
  }
};

// ৪. Delete Skill
export const deleteSkill = async (req, res, next) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);

    if (!deletedSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
