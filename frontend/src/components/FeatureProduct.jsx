"use client"

import { useEffect, useState } from "react"
import {
  LuSprout,
  LuTractor,
  LuWheat,
  LuLeaf,
  LuShoppingCart,
  LuHeart,
  LuStar,
  LuLoader,
  LuPackage,
  LuDroplets,
  LuBug,
} from "react-icons/lu"
import { getTopSellingByCategory } from "../api/api"
import { useCart } from "../context/CartContext" // <-- Add this import

export default function FeatureProduct() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState(new Set())
  const { addItemToCart } = useCart() // <-- Use the context

  useEffect(() => {
    async function fetchTopSelling() {
      try {
        const res = await getTopSellingByCategory()
        setData(res.data)
      } catch {
        setData({})
      } finally {
        setLoading(false)
      }
    }
    fetchTopSelling()
  }, [])

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
  }

  const getCategoryIcon = (category) => {
    const categoryLower = category.toLowerCase()
    if (categoryLower.includes("seed")) return <LuSprout className="category-icon" />
    if (categoryLower.includes("equipment") || categoryLower.includes("tool"))
      return <LuTractor className="category-icon" />
    if (categoryLower.includes("fertilizer") || categoryLower.includes("organic"))
      return <LuLeaf className="category-icon" />
    if (categoryLower.includes("crop") || categoryLower.includes("grain")) return <LuWheat className="category-icon" />
    if (categoryLower.includes("irrigation") || categoryLower.includes("water"))
      return <LuDroplets className="category-icon" />
    if (categoryLower.includes("pest") || categoryLower.includes("protection"))
      return <LuBug className="category-icon" />
    return <LuPackage className="category-icon" />
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <section className="feature-product-section">
        <div className="feature-product-container">
          <div className="loading-state">
            <LuLoader className="spin" />
            <h3>Loading Featured Products...</h3>
            <p>Discovering the best agricultural solutions for you</p>
          </div>
        </div>
      </section>
    )
  }

  if (!Object.keys(data).length) {
    return (
      <section className="feature-product-section">
        <div className="feature-product-container">
          <div className="empty-state">
            <LuPackage className="empty-icon" />
            <h3>No Featured Products Found</h3>
            <p>Check back soon for amazing agricultural products and deals!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="feature-product-section">
      <div className="feature-product-container">
        <div className="section-header">
          <h2 className="section-title">Featured Agricultural Products</h2>
          <p className="section-description">
            Discover our top-selling products trusted by thousands of farmers worldwide
          </p>
        </div>

        {Object.entries(data).map(([category, products]) => (
          <div key={category} className="category-section">
            <div className="category-header">
              {getCategoryIcon(category)}
              <h3 className="category-title">{category}</h3>
              <span className="product-count">{products.length} Products</span>
            </div>

            <div className="feature-product-grid">
              {products.map((product) => (
                <div key={product._id} className="feature-product-card">
                  <div className="product-image-container">
                    <img
                      src={product.image || "/placeholder.svg?height=200&width=200"}
                      alt={product.name}
                      className="feature-product-img"
                    />
                    <button
                      className={`favorite-btn ${favorites.has(product._id) ? "active" : ""}`}
                      onClick={() => toggleFavorite(product._id)}
                      aria-label="Add to favorites"
                    >
                      <LuHeart className="heart-icon" />
                    </button>
                    <div className="product-badge">
                      <LuStar className="badge-icon" />
                      <span>Top Seller</span>
                    </div>
                  </div>

                  <div className="product-content">
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-description">
                      {product.description?.length > 80
                        ? `${product.description.substring(0, 80)}...`
                        : product.description || "High-quality agricultural product for better farming results."}
                    </p>

                    <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <LuStar key={i} className={`rating-star ${i < 4 ? "filled" : ""}`} />
                      ))}
                      <span className="rating-text">(4.0)</span>
                    </div>

                    <div className="product-footer">
                      <div className="price-container">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        <span className="original-price">{formatPrice(product.price * 1.2)}</span>
                      </div>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addItemToCart(product._id, 1)}
                        type="button"
                      >
                        <LuShoppingCart className="cart-icon" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
