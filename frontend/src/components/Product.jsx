
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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; 

export default function Product() {
  const { addItemToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [addedToCartItems, setAddedToCartItems] = useState(new Set())
  const [imageErrors, setImageErrors] = useState(new Set()) 

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await getProducts()
        const fetchedProducts = res.data.products || res.data || []
        setProducts(fetchedProducts)
        
        console.log("Fetched products:", fetchedProducts.slice(0, 2));
      } catch (err) {
        console.error("Error fetching products:", err);
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
      currency: "NPR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredProducts = products.filter((product) => {
    const name = product.title || product.name || ""
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    "All",
    ...Array.from(new Set(products.map((product) =>
      product.category?.charAt(0).toUpperCase() + product.category?.slice(1).toLowerCase()
    ))).filter(Boolean)
  ]

  const handleAddToCart = (e, productId) => {
    e.preventDefault() 
    e.stopPropagation()
    addItemToCart(productId, 1) 
    
    setAddedToCartItems(prev => new Set(prev).add(productId))
    setTimeout(() => {
      setAddedToCartItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }, 2000)
  }

  function getProductImageUrl(product) {
    if (product && product._id && imageErrors.has(product._id)) {
      return "/placeholder.svg";
    }
    
    if (!product) return "/placeholder.svg";
    
    if (product.mainImage) {
      if (product.mainImage.startsWith("http")) return product.mainImage;
      
      if (product.mainImage.startsWith("uploads/")) {
        return `${API_BASE_URL}/${product.mainImage}`;
      }
      
      if (product.mainImage.startsWith("/uploads/")) {
        return `${API_BASE_URL}${product.mainImage}`;
      }
      
      return `${API_BASE_URL}/uploads/${product.mainImage}`;
    }
    
    if (Array.isArray(product.image) && product.image.length > 0) {
      const img = product.image[0];
      if (!img) return "/placeholder.svg";
      
      if (img.startsWith("http")) return img;
      if (img.startsWith("uploads/")) return `${API_BASE_URL}/${img}`;
      if (img.startsWith("/uploads/")) return `${API_BASE_URL}${img}`;
      return `${API_BASE_URL}/uploads/${img}`;
    }
    
    return "/placeholder.svg";
  }

  const handleImageError = (productId, e) => {
    console.error(`Failed to load image for product ${productId}`);
    
    setImageErrors(prev => new Set(prev).add(productId));
    
    e.target.onerror = null;
    
    e.target.src = "/placeholder.svg";
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
        <div className="product-header">
          <h2 className="product-title">All Agricultural Products</h2>
          <p className="product-description">
            Explore our complete range of high-quality agricultural products and solutions
          </p>
        </div>

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

        <div className="results-info">
          <span className="results-count">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>

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
                      src={getProductImageUrl(product)}
                      alt={name}
                      className="product-img"
                      onError={(e) => handleImageError(product._id, e)}
                    />
                    <button
                      className={`favorite-btn ${favorites.has(product._id) ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFavorite(product._id);
                      }}
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
