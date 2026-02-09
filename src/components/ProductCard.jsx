import { Link } from "react-router-dom";
import "../styles/product.css";
import { StarFull, StarHalf, StarEmpty } from "../components/Icons"; // StarEmpty needed? Let's add it or just use grey stars? Using only Full/Half for now based on common patterns, will add empty if needed or just SVG loop.

// Helper to render stars
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarFull key={`full-${i}`} className="star-icon" />);
  }
  if (hasHalfStar) {
    stars.push(<StarHalf key="half" className="star-icon" />);
  }
  // Optional: Fill remaining with empty stars if you want a 5-star fixed width
  return stars;
};

export default function ProductCard({ product }) {
  // Calculate dynamic rating from reviews
  const reviews = product.Reviews || [];
  const rating = reviews.length > 0
    ? parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
    : 4.5; // Fallback to 4.5 for items without reviews (demo)

  const maxRating = 5;

  // Calculate discount percentage if not provided
  const discount = product.discount || (product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null);

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="image-container">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="product-image"
        />
      </div>

      <h4 className="product-title">{product.title || product.name}</h4>

      <div className="product-rating">
        <div className="stars">
          {renderStars(rating)}
        </div>
        <span className="rating-score">{rating}/{maxRating}</span>
      </div>

      <div className="product-price">
        <span className="current-price">${product.price}</span>
        {product.oldPrice && (
          <>
            <span className="old-price">${product.oldPrice}</span>
            <span className="discount-badge">-{discount}%</span>
          </>
        )}
      </div>
    </Link>
  );
}
