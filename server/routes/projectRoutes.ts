import express from 'express';
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getFeaturedProjects,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', getProjectById);

// Admin/Editor protected routes
router.post('/', protect, authorize('Admin', 'Editor'), createProject);
router.put('/:id', protect, authorize('Admin', 'Editor'), updateProject);

// Admin only routes
router.delete('/:id', protect, authorize('Admin'), deleteProject);

export default router;
