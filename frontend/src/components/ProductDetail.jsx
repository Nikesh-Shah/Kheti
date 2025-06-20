import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../api/api";
import { useCart } from "../context/CartContext";
import Navbar from "./Navbar";
import "../Styles/ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItemToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  // Gather all images: mainImage first, then ...image[]
  const images = [
    ...(product.mainImage ? [product.mainImage] : []),
    ...(Array.isArray(product.image) ? product.image : [])
  ].filter(Boolean);

  return (
    <>
      <Navbar />
      <div className="product-detail-page">
        <div className="product-detail-gallery">
          <div className="main-image">
            <img
              src={
                images.length > 0
                  ? (images[selectedImage].startsWith("http")
                      ? images[selectedImage]
                      : images[selectedImage].startsWith("/uploads/")
                        ? images[selectedImage]
                        : `/${images[selectedImage].replace(/\\/g, "/")}`)
                  : "/placeholder.svg"
              }
              alt={product.title}
              className="main-product-img"
            />
          </div>
          <div className="thumbnail-row">
            {images.length > 0
              ? images.map((img, idx) => (
                  <img
                    key={idx}
                    src={
                      img.startsWith("http")
                        ? img
                        : img.startsWith("/uploads/")
                          ? img
                          : `/${img.replace(/\\/g, "/")}`
                    }
                    alt={`Thumbnail ${idx + 1}`}
                    className={selectedImage === idx ? "active" : ""}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))
              : (
                <img
                  src="/placeholder.svg"
                  alt="No preview"
                  style={{ width: 60, height: 60, borderRadius: 6, border: "1.5px solid #43a047" }}
                />
              )}
          </div>
        </div>
        <div className="product-detail-info">
          <h2 className="product-detail-title">{product.title}</h2>
          <p className="product-detail-desc">{product.description}</p>
          <div className="product-detail-meta">
            <div><strong>Price:</strong> <span className="price-green">₹{product.price}</span></div>
            <div><strong>Quantity:</strong> {product.quantity} {product.unit}</div>
            <div><strong>Category:</strong> {product.category?.name || product.category}</div>
          </div>
          <div className="add-to-cart">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button className="add-cart-btn" onClick={() => addItemToCart(product._id, quantity)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}