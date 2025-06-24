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

router.post('/', authenticate, authorizeRoles('user', 'buyer'), placeOrder);

router.get('/my', authenticate, authorizeRoles('user', 'buyer'), getMyOrders);

router.get('/admin', authenticate, authorizeRoles('admin'), getAllOrders);

router.get('/farmer', authenticate, authorizeRoles('farmer', 'seller'), getFarmerOrders);

router.put('/:id/status', authenticate, authorizeRoles('admin', 'farmer', 'seller'), updateOrderStatus);

router.delete('/:id', authenticate, authorizeRoles('admin'), deleteOrder);

export default router;