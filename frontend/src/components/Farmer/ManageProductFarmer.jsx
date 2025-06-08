import React, { useEffect, useState } from "react";
import {
  getFarmerProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../api/api";
import Sidebar from "../Sidebar";

export default function ManageProductFarmer() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    title: "",
    price: "",
    quantity: "",
    category: "",
    image: "",
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await getFarmerProducts();
      setProducts(res.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // Handle form input
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Add or update product
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, form);
      } else {
        await addProduct(form);
      }
      setForm({ title: "", price: "", quantity: "", category: "", image: "" });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert("Error saving product");
    }
  }

  // Edit product
  function handleEdit(product) {
    setEditingProduct(product);
    setForm({
      title: product.title || "",
      price: product.price || "",
      quantity: product.quantity || "",
      category: product.category || "",
      image: product.image || "",
    });
  }

  // Delete product
  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch {
        alert("Error deleting product");
      }
    }
  }

  // Cancel editing
  function handleCancel() {
    setEditingProduct(null);
    setForm({ title: "", price: "", quantity: "", category: "", image: "" });
  }

  return (
    <div className="dashboard-layout">
      <Sidebar role="farmer" />
      <main className="dashboard-main">
        <h2>Manage My Products</h2>

        {/* Product Form */}
        <form className="product-form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Product Name"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
          />
          <button type="submit">
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
          {editingProduct && (
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>

        {/* Product List */}
        {loading ? (
          <div>Loading products...</div>
        ) : products.length === 0 ? (
          <div>No products found.</div>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.image || "/placeholder.svg"}
                      alt={p.title || p.name}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  </td>
                  <td>{p.title || p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.quantity}</td>
                  <td>{p.category}</td>
                  <td>
                    <button onClick={() => handleEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}