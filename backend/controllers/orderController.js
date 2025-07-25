import Order from '../models/Order.js';

export const placeOrder = async (req, res) => {
    try {
        const { products, totalAmount, paymentMethod } = req.body;
        const buyer = req.user.userId;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'No products in order.' });
        }
        if (!totalAmount || totalAmount < 0) {
            return res.status(400).json({ error: 'Invalid total amount.' });
        }

        const orderData = {
            buyer,
            products,
            totalAmount
        };

        if (paymentMethod) orderData.paymentMethod = paymentMethod;

        const order = new Order(orderData);
        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

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

export const getFarmerOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'products.product',
                select: 'farmer title'
            })
            .populate('buyer', 'firstName lastName email')
            .sort({ orderedAt: -1 });

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