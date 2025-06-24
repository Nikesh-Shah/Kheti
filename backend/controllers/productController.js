import Product from '../models/Product.js';

export const addProduct = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        
        const mainImage = req.files && req.files['mainImage'] && req.files['mainImage'][0]
            ? `uploads/${req.files['mainImage'][0].filename}` 
            : "";
        console.log('Main image path:', mainImage);

        const images = req.files && req.files['images']
            ? req.files['images'].map(file => `uploads/${file.filename}`) 
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

        if (
            product.farmer.toString() !== req.user.userId &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (req.files && req.files['mainImage'] && req.files['mainImage'][0]) {
            product.mainImage = `uploads/${req.files['mainImage'][0].filename}`; // Use filename, not full path
        }

        if (req.files && req.files['images']) {
            product.image = req.files['images'].map(file => `uploads/${file.filename}`); // Use filename, not full path
        }

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

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

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
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "Unauthorized: user not found" });
        }
        const products = await Product.find({ farmer: req.user.userId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};