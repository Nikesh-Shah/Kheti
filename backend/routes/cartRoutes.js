import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getCart);

router.post('/', addToCart);

router.put('/', updateCartItem);

router.delete('/item', removeFromCart);

router.delete('/', clearCart);

export default router;
