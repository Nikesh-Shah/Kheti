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
  LuFilter,
  LuSearch,
} from "react-icons/lu"
import { getProducts } from "../api/api"
import "../Styles/Product.css"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

const categoryIcons = {
  Fertilizer: <LuDroplets className="category-icon" />,
  Seeds: <LuSprout className="category-icon" />,
  Tools: <LuTractor className="category-icon" />,
  Grains: <LuWheat className="category-icon" />,
  Vegetables: <LuLeaf className="category-icon" />,
  Package: <LuBug className="category-icon" />,
  Pest: <LuBug className="category-icon" />,
}

export default function Product() {
  const { addItemToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [addedToCartItems, setAddedToCartItems] = useState(new Set())

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Use res.data for array response, fallback to res.data.products for object response
        const res = await getProducts()
        setProducts(res.data.products || res.data || [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleFavorite = (id) => {
    setFavorites((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredProducts = products.filter((product) => {
    // Use product.title for your DB, fallback to product.name for compatibility
    const name = product.title || product.name || ""
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories (capitalize first letter for display)
  const categories = [
    "All",
    ...Array.from(new Set(products.map((product) =>
      product.category?.charAt(0).toUpperCase() + product.category?.slice(1).toLowerCase()
    ))).filter(Boolean)
  ]

  const handleAddToCart = (e, productId) => {
    e.preventDefault() // Prevent navigation to product detail
    e.stopPropagation() // Stop event bubbling
    addItemToCart(productId, 1) // Add 1 quantity of the product
    
    // Show "Added!" message temporarily
    setAddedToCartItems(prev => new Set(prev).add(productId))
    setTimeout(() => {
      setAddedToCartItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }, 2000)
  }

  if (loading) {
    return (
      <section className="product-section">
        <div className="product-container">
          <div className="loading-state">
            <LuLoader className="spin" />
            <h3>Loading Products...</h3>
            <p>Discovering amazing agricultural products for you</p>
          </div>
        </div>
      </section>
    )
  }

  if (!products.length) {
    return (
      <section className="product-section">
        <div className="product-container">
          <div className="empty-state">
            <LuPackage className="empty-icon" />
            <h3>No Products Found</h3>
            <p>Check back soon for amazing agricultural products and deals!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="product-section">
      <div className="product-container">
        {/* Header */}
        <div className="product-header">
          <h2 className="product-title">All Agricultural Products</h2>
          <p className="product-description">
            Explore our complete range of high-quality agricultural products and solutions
          </p>
        </div>

        {/* Filters */}
        <div className="product-filters">
          <div className="search-container">
            <LuSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filter">
            <LuFilter className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <span className="results-count">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const name = product.title || product.name || ""
            const categoryDisplay =
              product.category?.charAt(0).toUpperCase() + product.category?.slice(1).toLowerCase()
            return (
              <Link to={`/product/${product._id}`} className="product-card-link" key={product._id}>
                <div className="product-card">
                  <div className="product-image-container">
                    <img
                      src={
                        Array.isArray(product.image) && product.image.length > 0
                          ? (product.image[0].startsWith("http") ? product.image[0] : `/${product.image[0].replace(/\\/g, "/")}`)
                          : "/placeholder.svg?height=200&width=200"
                      }
                      alt={name}
                      className="product-img"
                    />
                    <button
                      className={`favorite-btn ${favorites.has(product._id) ? "active" : ""}`}
                      onClick={() => handleFavorite(product._id)}
                      aria-label="Add to favorites"
                    >
                      <LuHeart className="heart-icon" />
                    </button>
                    <div className="product-category-badge">
                      {categoryIcons[categoryDisplay] || <LuPackage className="category-icon" />}
                      <span>{categoryDisplay}</span>
                    </div>
                  </div>

                  <div className="product-content">
                    <h4 className="product-name">{name}</h4>
                    <p className="product-description">
                      {product.description?.length > 80
                        ? `${product.description.substring(0, 80)}...`
                        : product.description || "High-quality agricultural product for better farming results."}
                    </p>

                    <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <LuStar key={i} className={`rating-star ${i < 4 ? "filled" : ""}`} />
                      ))}
                      <span className="rating-text">(4.5)</span>
                    </div>

                    <div className="product-footer">
                      <div className="price-container">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        <span className="original-price">{formatPrice(product.price * 1.15)}</span>
                      </div>
                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => handleAddToCart(e, product._id)}
                      >
                        <LuShoppingCart className="cart-icon" />
                        {addedToCartItems.has(product._id) ? "Added!" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="no-results">
            <LuSearch className="no-results-icon" />
            <h3>No products match your search</h3>
            <p>Try adjusting your search terms or category filter</p>
          </div>
        )}
      </div>
    </section>
  )
}
