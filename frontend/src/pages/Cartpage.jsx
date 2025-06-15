"use client"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Cart from "../components/Cart"

export default function Productpage() {
  return (
    <div className="product">
      <Navbar />
      <Cart />
      <Footer />
    </div>
  )
}