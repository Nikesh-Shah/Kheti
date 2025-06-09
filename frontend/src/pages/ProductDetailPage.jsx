"use client"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductDetail from "../components/ProductDetail"
import "../Styles/Product.css"

export default function Productpage() {
  return (
    <div className="product">
      <Navbar />
      <ProductDetail />
      <Footer />
    </div>
  )
}