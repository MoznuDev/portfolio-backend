import Resume from './resume.model.js';

// POST: Create Resume
export const createResume = async (req, res) => {
  try {
    const newResume = await Resume.create(req.body);
    res.status(201).json({ success: true, data: newResume });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// GET: All Resumes
export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.status(200).json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET: Single Resume by ID
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT: Update Resume
export const updateResume = async (req, res) => {
  try {
    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedResume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.status(200).json({ success: true, data: updatedResume });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE: Delete Resume
export const deleteResume = async (req, res) => {
  try {
    const deletedResume = await Resume.findByIdAndDelete(req.params.id);
    if (!deletedResume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};