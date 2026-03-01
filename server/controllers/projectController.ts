import { Request, Response, NextFunction } from 'express';
import Project from '../models/Project.js';

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin/Editor)
 */
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('--- Project Creation Request ---');
        console.log('Request Body:', JSON.stringify(req.body, null, 2));

        const project = await Project.create(req.body);

        console.log('Project created successfully:', project._id);
        res.status(201).json(project);
    } catch (error: any) {
        console.error('--- Project Creation Error ---');
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            console.error('Validation Errors:', messages);
            return res.status(400).json({
                error: 'Validation failed',
                details: messages
            });
        }
        console.error('Database Error:', error);
        next(error);
    }
};

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { featured, category } = req.query;
        const query: any = {};

        if (featured === 'true') {
            query.featured = true;
        }

        if (category) {
            query.category = category;
        }

        const projects = await Project.find(query).sort('-createdAt');
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get featured projects
 * @route   GET /api/projects/featured
 * @access  Public
 */
export const getFeaturedProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await Project.find({ featured: true }).sort('-createdAt');
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin/Editor)
 */
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(`--- Project Update Request [ID: ${req.params.id}] ---`);
        console.log('Update Body:', JSON.stringify(req.body, null, 2));

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        console.log('Project updated successfully');
        res.json(project);
    } catch (error: any) {
        console.error('--- Project Update Error ---');
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            console.error('Validation Errors:', messages);
            return res.status(400).json({
                error: 'Validation failed',
                details: messages
            });
        }
        next(error);
    }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin)
 */
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        next(error);
    }
};
