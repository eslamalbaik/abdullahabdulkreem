import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage.js';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await storage.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await storage.getProducts();
        // The storage method doesn't support pagination yet, but returning all for now matches the simple use case
        // or we could add pagination to storage. 
        res.json({
            products,
            totalPages: 1,
            currentPage: 1,
            totalProducts: products.length,
        });
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await storage.getProductById(req.params.id as string);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await storage.updateProduct(req.params.id as string, req.body);
        res.json(product);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await storage.deleteProduct(req.params.id as string);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};
