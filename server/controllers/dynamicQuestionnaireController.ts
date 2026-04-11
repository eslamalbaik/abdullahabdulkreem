import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage.js';

// Admin Controllers
export const getQuestionnaires = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const questionnaires = await storage.getDynamicQuestionnaires();
        res.json(questionnaires);
    } catch (error) {
        next(error);
    }
};

export const getQuestionnaireById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const questionnaire = await storage.getDynamicQuestionnaireById(req.params.id as string);
        if (!questionnaire) return res.status(404).json({ message: 'Questionnaire not found' });
        
        const questions = await storage.getDynamicQuestions(req.params.id as string);
        res.json({ ...questionnaire, questions });
    } catch (error) {

        next(error);
    }
};

export const createQuestionnaire = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const questionnaire = await storage.createDynamicQuestionnaire(req.body);
        res.status(201).json(questionnaire);
    } catch (error) {
        next(error);
    }
};

export const updateQuestionnaire = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const questionnaire = await storage.updateDynamicQuestionnaire(req.params.id as string, req.body);
        res.json(questionnaire);
    } catch (error) {

        next(error);
    }
};

export const deleteQuestionnaire = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await storage.deleteDynamicQuestionnaire(req.params.id as string);
        res.json({ message: 'Questionnaire deleted successfully' });
    } catch (error) {

        next(error);
    }
};

// Question Controllers
export const addQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const question = await storage.createDynamicQuestion({
            ...req.body,
            questionnaireId: req.params.id as string
        });
        res.status(201).json(question);
    } catch (error) {

        next(error);
    }
};

export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const question = await storage.updateDynamicQuestion(req.params.questionId as string, req.body);
        res.json(question);
    } catch (error) {

        next(error);
    }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await storage.deleteDynamicQuestion(req.params.questionId as string);
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {

        next(error);
    }
};

// Response Controllers
export const getResponses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const responses = await storage.getDynamicResponses(req.params.id as string);
        res.json(responses);
    } catch (error) {

        next(error);
    }
};

// Public Controllers
export const getPublicQuestionnaire = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const questionnaire = await storage.getDynamicQuestionnaireBySlug(req.params.slug);
        if (!questionnaire || !questionnaire.isPublished) {
            return res.status(404).json({ message: 'Questionnaire not found or not published' });
        }
        
        const questions = await storage.getDynamicQuestions(questionnaire.id);
        res.json({ ...questionnaire, questions });
    } catch (error) {
        next(error);
    }
};

export const submitResponse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const questionnaire = await storage.getDynamicQuestionnaireBySlug(req.params.slug);
        if (!questionnaire) return res.status(404).json({ message: 'Questionnaire not found' });
        
        const response = await storage.createDynamicResponse({
            questionnaireId: questionnaire.id,
            answers: req.body
        });
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};
