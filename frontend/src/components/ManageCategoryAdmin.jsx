import React, { useEffect, useState } from "react";
import { getCategories, addCategory, updateCategory, deleteCategory } from "../api/api";

export default function ManageCategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", _id: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    setError("");
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      setError("Failed to fetch categories.");
    }
    setLoading(false);
  }

  function handleEdit(category) {
    setForm({ name: category.name, _id: category._id });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (form._id) {
        await updateCategory(form._id, { name: form.name });
        setSuccess("Category updated!");
      } else {
        await addCategory({ name: form.name });
        setSuccess("Category added!");
      }
      setForm({ name: "", _id: null });
      fetchCategories();
    } catch (err) {
      setError("Failed to save category.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setError("");
    setSuccess("");
    try {
      await deleteCategory(id);
      setSuccess("Category deleted!");
      fetchCategories();
    } catch (err) {
      setError("Failed to delete category.");
    }
  }

  return (
    <div className="manage-category-admin">
      <h2>Manage Categories</h2>
      {loading ? (
        <div>Loading categories...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <>
          {success && <div style={{ color: "green" }}>{success}</div>}
          <form onSubmit={handleSubmit} className="category-form">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Category Name"
              required
            />
            <button type="submit">{form._id ? "Update" : "Add"}</button>
            {form._id && (
              <button type="button" onClick={() => setForm({ name: "", _id: null })} style={{ marginLeft: 8 }}>
                Cancel
              </button>
            )}
          </form>
          <table className="category-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td>{cat.name}</td>
                  <td>
                    <button onClick={() => handleEdit(cat)}>Edit</button>
                    <button onClick={() => handleDelete(cat._id)} style={{ color: "red", marginLeft: 8 }}>
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