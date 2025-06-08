import React, { useEffect, useState } from "react";
import { getProducts, getAllOrders, getCategories, getMyOrders } from "../api/api";
import { LuPackage, LuClipboardList, LuUsers, LuTrendingUp, LuSmile, LuLayers } from "react-icons/lu";
import Sidebar from "../components/Sidebar";
import "../Styles/AdminDashboard.css";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]); // If you have a getUsers API
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [prodRes, orderRes, catRes] = await Promise.all([
          getProducts(),
          getAllOrders(),
          getCategories(),
        ]);
        setProducts(prodRes.data.products || prodRes.data || []);
        setOrders(orderRes.data.orders || orderRes.data || []);
        setCategories(catRes.data.categories || catRes.data || []);
        // If you have a getUsers API, fetch and set users here
        const user = JSON.parse(localStorage.getItem("user"));
        setAdminName(user?.firstName || "Admin");
      } catch {
        setProducts([]);
        setOrders([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Quick stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCategories = categories.length;
  const totalUsers = users.length; // If you fetch users
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const earnings = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const monthlyEarnings = orders
    .filter(o => new Date(o.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Top-selling products (by order count)
  const productSales = {};
  orders.forEach(order => {
    (order.items || []).forEach(item => {
      productSales[item.product] = (productSales[item.product] || 0) + item.quantity;
    });
  });
  const topProducts = products
    .map(p => ({
      ...p,
      sales: productSales[p._id] || 0,
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3);

  // --- Graph Data ---
  // Sales per month (last 6 months)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString("default", { month: "short" });
  });

  const salesPerMonth = months.map((_, idx) => {
    const monthIdx = new Date().getMonth() - 5 + idx;
    return orders
      .filter(o => {
        const d = new Date(o.createdAt);
        return d.getMonth() === ((monthIdx + 12) % 12) && d.getFullYear() === new Date().getFullYear();
      })
      .reduce((sum, o) => sum + (o.total || 0), 0);
  });

  const salesData = {
    labels: months,
    datasets: [
      {
        label: "Sales (₹)",
        data: salesPerMonth,
        backgroundColor: "#1976d2",
        borderColor: "#1976d2",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2>
            <LuSmile /> Welcome, {adminName}!
          </h2>
          <p>Here’s your admin overview at a glance.</p>
        </div>

        {loading ? (
          <div className="dashboard-loading">Loading dashboard...</div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="dashboard-stats">
              <div className="stat-card">
                <LuPackage className="stat-icon" />
                <div>
                  <div className="stat-value">{totalProducts}</div>
                  <div className="stat-label">Total Products</div>
                </div>
              </div>
              <div className="stat-card">
                <LuClipboardList className="stat-icon" />
                <div>
                  <div className="stat-value">{totalOrders}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
              </div>
              <div className="stat-card">
                <LuTrendingUp className="stat-icon" />
                <div>
                  <div className="stat-value">₹{monthlyEarnings}</div>
                  <div className="stat-label">Earnings (This Month)</div>
                </div>
              </div>
              <div className="stat-card">
                <LuLayers className="stat-icon" />
                <div>
                  <div className="stat-value">{totalCategories}</div>
                  <div className="stat-label">Categories</div>
                </div>
              </div>
            </div>

            {/* Sales Graph */}
            <div className="dashboard-section">
              <h3>Sales Analytics (Last 6 Months)</h3>
              <div style={{ maxWidth: 600, background: "#fff", padding: 16, borderRadius: 8 }}>
                <Bar data={salesData} options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                  }
                }} />
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="dashboard-section">
              <h3>Top Selling Products</h3>
              <div className="top-products-list">
                {topProducts.length === 0 ? (
                  <div>No sales yet.</div>
                ) : (
                  topProducts.map(p => (
                    <div key={p._id} className="top-product-card">
                      <img src={p.image || "/placeholder.svg"} alt={p.title || p.name} />
                      <div>
                        <div className="top-product-name">{p.title || p.name}</div>
                        <div className="top-product-sales">{p.sales} sold</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}