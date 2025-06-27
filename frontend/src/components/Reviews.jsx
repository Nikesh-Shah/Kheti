
import { LuStar, LuQuote, LuCheck } from "react-icons/lu"

export default function Reviews() {
  const reviews = [
    {
      name: "Nikesh",
      role: "Organic Farm Owner",
      rating: 5,
      comment:
        "Kheti has transformed my farming operations. Their organic fertilizers increased my crop yield by 40%, and their consultation services helped me implement sustainable practices.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Rohan",
      role: "Wheat Farmer",
      rating: 5,
      comment:
        "The weather monitoring service is incredibly accurate. It helped me save my entire wheat crop from unexpected frost. The investment in their services paid for itself in one season.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Madan Rai",
      role: "Vegetable Grower",
      rating: 5,
      comment:
        "Excellent customer service and high-quality products. The seeds I purchased had a 95% germination rate, and the delivery was prompt. Highly recommend Kheti!",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "David aalam",
      role: "Dairy Farmer",
      rating: 4,
      comment:
        "Great platform for all farming needs. The equipment I bought was exactly as described, and the technical support team helped me with installation. Very satisfied with the service.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Lisa Gupta",
      role: "Fruit Orchard Owner",
      rating: 5,
      comment:
        "The pest control solutions from Kheti are eco-friendly and highly effective. My fruit trees are healthier than ever, and I've seen a significant increase in fruit quality.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Robert Chaudhary",
      role: "Corn Farmer",
      rating: 5,
      comment:
        "Kheti's marketplace feature helped me connect with buyers directly, eliminating middlemen. I now get better prices for my corn and have established long-term partnerships.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <section className="reviews">
      <div className="reviews-container">
        <div className="reviews-header">
          <h2 className="reviews-title">What Our Farmers Say</h2>
          <p className="reviews-description">
            Join thousands of satisfied farmers who have transformed their agricultural operations with Kheti.
          </p>
        </div>
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <div className="review-avatar">
                  <img src={review.avatar || "/placeholder.svg"} alt={review.name} className="avatar-img" />
                </div>
                <div className="review-info">
                  <h4 className="review-name">{review.name}</h4>
                  <p className="review-role">{review.role}</p>
                </div>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <LuStar key={i} className={`star ${i < review.rating ? "filled" : ""}`} />
                  ))}
                </div>
              </div>
              <div className="review-content">
                <LuQuote className="quote-icon" />
                <p className="review-text">{review.comment}</p>
              </div>
              <div className="review-verified">
                <LuCheck className="review-icon" />
                <span>Verified Purchase</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
