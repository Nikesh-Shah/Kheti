import Order from '../models/Order.js';

// Place a new order (Buyer)
export const placeOrder = async (req, res) => {
    try {
        const { products, totalAmount } = req.body;
        const buyer = req.user.userId;

        const order = new Order({
            buyer,
            products,
            totalAmount
        });

        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all orders for the logged-in buyer
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.userId })
            .populate('products.product')
            .sort({ orderedAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('buyer', 'firstName lastName email')
            .populate('products.product')
            .sort({ orderedAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Farmer: Get orders for their products
export const getFarmerOrders = async (req, res) => {
    try {
        // Populate products.product to access farmer field
        const orders = await Order.find()
            .populate({
                path: 'products.product',
                select: 'farmer title'
            })
            .populate('buyer', 'firstName lastName email')
            .sort({ orderedAt: -1 });

        // Filter orders where at least one product belongs to this farmer
        const farmerOrders = orders.filter(order =>
            order.products.some(p =>
                p.product && p.product.farmer && p.product.farmer.toString() === req.user.userId
            )
        );

        res.json(farmerOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update order status (Admin or Farmer)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        order.status = status;
        await order.save();
        res.json({ message: 'Order status updated', order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete an order (Admin only)
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        await order.deleteOne();
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};