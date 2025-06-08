"use client"
import React from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import FAQ from "../components/FAQ"
import Reviews from "../components/Reviews"
import Footer from "../components/Footer"
import FeatureProduct from "../components/FeatureProduct"
import "../Styles/Home.css"

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />
        <FeatureProduct />
      <FAQ />
      <Reviews />
      <Footer />
    </div>
  )
}