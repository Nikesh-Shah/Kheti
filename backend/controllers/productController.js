import Product from '../models/Product.js';

// Add a new product
export const addProduct = async (req, res) => {
    try {
        // Attach the farmer (user) ID from the authenticated user
        const product = new Product({ ...req.body, farmer: req.user.userId });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a product (only the owner can update)
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Check if the logged-in user is the owner
        if (product.farmer.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        Object.assign(product, req.body);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a product (only the owner can delete)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Check if the logged-in user is the owner
        if (product.farmer.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await product.deleteOne();
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category: category.toLowerCase() });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProductsByFarmer = async (req, res) => {
    try {
        // req.user.userId is set by your auth middleware
        const products = await Product.find({ farmer: req.user.userId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};