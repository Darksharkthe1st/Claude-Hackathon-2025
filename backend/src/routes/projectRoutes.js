import { Router } from 'express';

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  volunteerForProject
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { optionalAuthenticate } from '../middleware/optionalAuth.js';

const router = Router();

router.get('/', optionalAuthenticate, getProjects);
router.get('/:id', optionalAuthenticate, getProjectById);

router.post('/', authenticate, createProject);
router.put('/:id', authenticate, updateProject);
router.delete('/:id', authenticate, deleteProject);
router.post('/:id/volunteer', authenticate, volunteerForProject);

export default router;

