import { useEffect, useState } from "react";
import { getMyOrders } from "../api/api";
import Navbar from "./Navbar"; // <-- Import Navbar
import "../Styles/Order.css";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError("");
      try {
        const res = await getMyOrders();
        setOrders(res.data);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="order-loading">
          <div className="order-spinner"></div>
          Loading orders...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="order-error">{error}</div>
      </>
    );
  }

  if (!orders.length) {
    return (
      <>
        <Navbar />
        <div className="order-empty">
          <img src="/empty-cart.svg" alt="No Orders" className="order-empty-img" />
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="order-container">
        <h1 className="order-title">My Orders</h1>
        {orders.map(order => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <span>Order ID: {order._id}</span>
              <span>Status: <b>{order.status}</b></span>
              <span>Date: {new Date(order.orderedAt).toLocaleString()}</span>
            </div>
            <div className="order-products">
              {order.products.map(item => (
                <div className="order-product" key={item.product?._id || item.product}>
                  <img
                    src={item.product?.image?.[0] || "/empty-cart.svg"}
                    alt={item.product?.title || "Product"}
                    className="order-product-img"
                  />
                  <div>
                    <div className="order-product-title">{item.product?.title || "Product"}</div>
                    <div>Qty: {item.quantity}</div>
                    <div>Price: ₹{item.product?.price}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              Total: <b>₹{order.totalAmount}</b>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}