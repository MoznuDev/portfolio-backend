import express from 'express';
import {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from './resume.controller.js';

const router = express.Router();

router.route('/')
  .post(createResume)
  .get(getAllResumes);

router.route('/:id')
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

export default router;