import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage.js';

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin/Editor)
 */
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('--- Project Creation Request ---');
        console.log('Request Body:', JSON.stringify(req.body, null, 2));

        const project = await storage.createProject(req.body);

        console.log('Project created successfully:', project.id);
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
        console.log('--- Fetching Projects [DEBUG] ---');
        const projects = await storage.getProjects();
        console.log(`Fetched ${projects.length} projects`);
        if (projects.length > 0) {
            console.log('Sample project ID:', projects[0].id);
        }
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
        const projects = await storage.getFeaturedProjects();
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
        const project = await storage.getProjectById(req.params.id as string);
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

        const project = await storage.updateProject(req.params.id as string, req.body);

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
        await storage.deleteProject(req.params.id as string);
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        next(error);
    }
};
