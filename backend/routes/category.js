import express from 'express';
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories
} from '../controllers/categoryController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);

router.post('/', authenticate, authorizeRoles('admin'), addCategory);
router.put('/:id', authenticate, authorizeRoles('admin'), updateCategory);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteCategory);

export default router;