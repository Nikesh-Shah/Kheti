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
  

router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/farmer', authenticate, getProductsByFarmer); 
router.get('/:id', getProductById); 


router.post(
  '/',
  authenticate,
  authorizeRoles('farmer', 'seller'),
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  addProduct
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('farmer', 'seller'),
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  updateProduct
);

router.delete('/:id', authenticate, authorizeRoles('farmer', 'seller'), deleteProduct);

export default router;