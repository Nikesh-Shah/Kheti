import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../api/api";

export default function ManageOrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError("");
    try {
      const res = await getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      setError("Failed to fetch orders.");
    }
    setLoading(false);
  }

  async function handleStatusChange(orderId, status) {
    setError("");
    setSuccess("");
    try {
      await updateOrderStatus(orderId, { status });
      setSuccess("Order status updated!");
      fetchOrders();
    } catch (err) {
      setError("Failed to update order status.");
    }
  }

  async function handleDelete(orderId) {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setError("");
    setSuccess("");
    try {
      await deleteOrder(orderId);
      setSuccess("Order deleted successfully!");
      fetchOrders();
    } catch (err) {
      setError("Failed to delete order.");
    }
  }

  return (
    <div className="manage-orders-admin">
      <h2>Manage Orders</h2>
      {loading ? (
        <div>Loading orders...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <>
          {success && <div style={{ color: "green" }}>{success}</div>}
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {order.user?.firstName
                      ? `${order.user.firstName} ${order.user.lastName || ""}`
                      : order.user?.email || "N/A"}
                  </td>
                  <td>₹{order.total}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(order._id)}
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