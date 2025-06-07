import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getFarmerOrders,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Buyer places an order
router.post('/', authenticate, authorizeRoles('user', 'buyer'), placeOrder);

// Buyer views their orders
router.get('/my', authenticate, authorizeRoles('user', 'buyer'), getMyOrders);

// Admin views all orders
router.get('/admin', authenticate, authorizeRoles('admin'), getAllOrders);

// Farmer views orders for their products
router.get('/farmer', authenticate, authorizeRoles('farmer', 'seller'), getFarmerOrders);

// Update order status (admin or farmer)
router.put('/:id/status', authenticate, authorizeRoles('admin', 'farmer', 'seller'), updateOrderStatus);

// Delete an order (admin only)
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteOrder);

export default router;