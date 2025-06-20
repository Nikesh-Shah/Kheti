import Product from '../models/Product.js';

// Add a new product (supports multiple images)
export const addProduct = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        
        // mainImage: req.files['mainImage'] is an array with 1 file
        const mainImage = req.files && req.files['mainImage'] && req.files['mainImage'][0]
            ? `uploads/${req.files['mainImage'][0].filename}` // Use filename, not full path
            : "";
        console.log('Main image path:', mainImage);

        // images: req.files['images'] is an array
        const images = req.files && req.files['images']
            ? req.files['images'].map(file => `uploads/${file.filename}`) // Use filename, not full path
            : [];
        console.log('Additional images paths:', images);

        const { title, description, price, quantity, unit, category } = req.body;
        
        const product = new Product({
            title,
            description,
            price,
            quantity,
            unit,
            category,
            mainImage,
            image: images,
            farmer: req.user.userId
        });
        
        console.log('Product to save:', {
            title,
            description,
            price,
            quantity,
            unit,
            category,
            mainImage,
            image: images,
            farmer: req.user.userId
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error('Error in addProduct:', err);
        res.status(400).json({ error: err.message });
    }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    console.log("Products being returned:", products.slice(0, 2));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Check if the logged-in user is the owner
        if (product.farmer.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Update mainImage if uploaded
        if (req.files && req.files['mainImage'] && req.files['mainImage'][0]) {
            product.mainImage = `uploads/${req.files['mainImage'][0].filename}`; // Use filename, not full path
        }

        // Update additional images if uploaded
        if (req.files && req.files['images']) {
            product.image = req.files['images'].map(file => `uploads/${file.filename}`); // Use filename, not full path
        }

        // Update other fields
        const { title, description, price, quantity, unit, category } = req.body;
        if (title !== undefined) product.title = title;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (quantity !== undefined) product.quantity = quantity;
        if (unit !== undefined) product.unit = unit;
        if (category !== undefined) product.category = category;

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

        // Allow if user is owner or admin
        if (
            product.farmer.toString() !== req.user.userId &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await product.deleteOne();
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category: category.toLowerCase() });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get products by farmer (owner)
export const getProductsByFarmer = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "Unauthorized: user not found" });
        }
        const products = await Product.find({ farmer: req.user.userId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};