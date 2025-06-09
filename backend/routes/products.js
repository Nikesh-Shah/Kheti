import express from 'express';
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByFarmer
} from '../controllers/productController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);
router.get('/farmer', authenticate, getProductsByFarmer);

// Protected routes (only for 'farmer' or 'seller')
// For adding a product (multiple images)
router.post(
  '/',
  authenticate,
  authorizeRoles('farmer', 'seller'),
  upload.array('images', 6), // <-- add this middleware
  addProduct
);

// For updating a product (optional, if you want to allow updating images)
router.put(
  '/:id',
  authenticate,
  authorizeRoles('farmer', 'seller'),
  upload.array('images', 6), // <-- add this middleware if needed
  updateProduct
);

router.delete('/:id', authenticate, authorizeRoles('farmer', 'seller'), deleteProduct);

export default router;