import Category from '../models/Category.js';
import Product from '../models/Product.js'; // <-- Import Product model

// Add category
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ message: 'Category added', category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category updated', category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get top selling products by category
export const getTopSellingByCategory = async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.find();
    const result = {};

    // For each category, get top N selling products (e.g., top 1)
    for (const category of categories) {
      const topProducts = await Product.find({ category: category._id })
        .sort({ sales: -1 }) 
        .limit(1); 
      result[category.name] = topProducts;
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};