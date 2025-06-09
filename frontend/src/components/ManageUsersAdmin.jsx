import React, { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser } from "../api/api";

export default function ManageUsersAdmin() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError("Failed to fetch users.");
    }
    setLoading(false);
  }

  function handleEdit(user) {
    setEditingUser(user);
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "",
    });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await updateUser(editingUser._id, form);
      setSuccess("User updated successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError("Failed to update user.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setError("");
    setSuccess("");
    try {
      await deleteUser(id);
      setSuccess("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
    }
  }

  return (
    <div className="manage-users-admin">
      <h2>Manage Users</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <>
          {success && <div style={{ color: "green" }}>{success}</div>}
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)} style={{ marginLeft: 8, color: "red" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editingUser && (
            <div className="edit-user-form">
              <h3>Edit User</h3>
              <form onSubmit={handleUpdate}>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                  required
                />
                <select name="role" value={form.role} onChange={handleChange} required>
                  <option value="user">User</option>
                  <option value="farmer">Farmer</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditingUser(null)} style={{ marginLeft: 8 }}>
                  Cancel
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}