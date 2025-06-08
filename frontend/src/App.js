import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Home from './pages/Home';
import Productpage from './pages/Productpage';
import AdminDashboardPage from './pages/AdminDashboardpage';
import FarmerDashboardPage from './pages/FarmerDashboardpage';
import ManageCategory from "./components/ManageCategoryAdmin";
import ManageProducts from "./components/ManageProductAdmin";
import ManageUsers from "./components/ManageUsersAdmin";
import FarmerDashboard from './components/Farmer/FarmerDashboard';
import FarmerProducts from './components/Farmer/ManageProductFarmer';
import FarmerOrders from './components/Farmer/ManageOrderFarmer';
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Productpage />} />
        <Route path="/auth" element={<Auth />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/manage-products" element={<ManageProducts />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-categories" element={<ManageCategory />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Farmer routes */}
        <Route path="/farmer/dashboard" element={<FarmerDashboardPage />} />
        <Route path="/farmer/manage-products" element={<FarmerProducts />} />
        <Route path="/farmer/manage-orders" element={<FarmerOrders />} />
        <Route path="/farmer" element={<FarmerDashboard />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;
