"use client"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Product from "../components/Product"
import "../Styles/Product.css"

export default function Productpage() {
  return (
    <div className="product">
      <Navbar />
      <Product />
      <Footer />
    </div>
  )
}