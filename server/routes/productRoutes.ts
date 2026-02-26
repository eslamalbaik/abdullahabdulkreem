import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, authorize('Admin', 'Editor'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, authorize('Admin', 'Editor'), updateProduct)
    .delete(protect, authorize('Admin'), deleteProduct);

export default router;
