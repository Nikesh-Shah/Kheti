import React, { useEffect, useState } from "react";
import { getFarmerOrders, updateOrderStatus } from "../../api/api";
import Sidebar from "../Sidebar";

export default function ManageOrderFarmer() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await getFarmerOrders();
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders();
    } catch {
      alert("Failed to update order status");
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar role="farmer" />
      <main className="dashboard-main">
        <h2>Manage My Orders</h2>
        {loading ? (
          <div>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Placed On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    <ul>
                      {(order.items || []).map((item, idx) => (
                        <li key={idx}>
                          {item.name || item.title} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.total}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.customerName || order.customer?.name || "N/A"}
                  </td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : ""}
                  </td>
                  <td>
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(order._id, "shipped")
                          }
                        >
                          Mark as Shipped
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(order._id, "cancelled")
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === "shipped" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "delivered")
                        }
                      >
                        Mark as Delivered
                      </button>
                    )}
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