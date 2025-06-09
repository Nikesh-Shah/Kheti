import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api/api";

export default function ManageProductAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError("");
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      setError("Failed to fetch products.");
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setError("");
    setSuccess("");
    try {
      await deleteProduct(id);
      setSuccess("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product.");
    }
  }

  return (
    <div className="manage-products-admin">
      <h2>Manage Products</h2>
      {loading ? (
        <div>Loading products...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <>
          {success && <div style={{ color: "green" }}>{success}</div>}
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Farmer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    {Array.isArray(product.image) && product.image.length > 0 ? (
                      <img
                        src={
                          product.image[0].startsWith("http")
                            ? product.image[0]
                            : `/${product.image[0].replace(/\\/g, "/")}`
                        }
                        alt={product.title}
                        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>₹{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.unit}</td>
                  <td>{product.farmer?.firstName || product.farmer || "N/A"}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(product._id)}
                      style={{ color: "red" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}