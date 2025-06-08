import Sidebar from "../components/Sidebar";
import FarmerDashboard from "../components/Farmer/FarmerDashboard";
import React from "react";
import "../Styles/FarmerDashboard.css"; // Assuming you have a CSS file for styling
export default function FarmerDashboardPage() {
  return (
    <div>
      <Sidebar />
      <FarmerDashboard />
    </div>
  );
}