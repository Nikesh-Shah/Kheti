import express from 'express';
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/productController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);

// Protected routes (only for 'farmer' or 'seller')
router.post('/', authenticate, authorizeRoles('farmer', 'seller'), addProduct);
router.put('/:id', authenticate, authorizeRoles('farmer', 'seller'), updateProduct);
router.delete('/:id', authenticate, authorizeRoles('farmer', 'seller'), deleteProduct);

export default router;