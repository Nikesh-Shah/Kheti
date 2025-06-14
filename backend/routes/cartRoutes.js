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

// Protect all cart routes (only logged-in users can access)
router.use(authenticate);

// GET /api/cart - Get current user's cart
router.get('/', getCart);

// POST /api/cart - Add product to cart
router.post('/', addToCart);

// PUT /api/cart - Update quantity of a cart item
router.put('/', updateCartItem);

// DELETE /api/cart/item - Remove one product from cart
router.delete('/item', removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete('/', clearCart);

export default router;
