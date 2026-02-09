import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { Skeleton } from "../components/Skeleton";
import { CheckIcon, PlusIcon, MinusIcon, StarFull, StarHalf } from "../components/Icons";
import AuthModal from "../components/AuthModal";
import "../styles/product-detail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");
  const [selectedSize, setSelectedSize] = useState("Large");
  const [selectedColor, setSelectedColor] = useState("White");
  const [quantity, setQuantity] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const relatedProducts = [
    {
      id: 101,
      title: "Slim Fit Denim Jeans",
      description: "Classic slim fit denim jeans for everyday wear.",
      price: 240,
      rating: 3.5,
      category: "New Arrivals",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d"
    },
    {
      id: 102,
      title: "Gradient Graphic T-shirt",
      price: 145,
      rating: 3.5,
      image: "https://images.unsplash.com/photo-1618354691551-44de113f0164"
    },
    {
      id: 103,
      title: "Polo with Tipping Details",
      price: 180,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10"
    },
    {
      id: 104,
      title: "Black Striped T-shirt",
      price: 120,
      oldPrice: 150,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1520975916090-3105956dac38"
    }
  ];

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`http://localhost:5000/products/${id}`).then(res => res.json()),
      fetch(`http://localhost:5000/reviews/product/${id}`).then(res => res.json())
    ])
      .then(([productData, reviewsData]) => {
        setProduct(productData);
        setReviews(reviewsData);
        setActiveImg(productData.images?.[0] || productData.image);
        if (productData.colors?.length > 0) setSelectedColor(productData.colors[0]);
        if (productData.sizes?.length > 0) setSelectedSize(productData.sizes[0]);
      })
      .catch(err => console.error("Error fetching product data:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarFull key={`full-${i}`} />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" />);
    }
    return <div className="stars-svg">{stars}</div>;
  };

  const handleAddToCart = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: activeImg,
        selectedSize,
        selectedColor,
        quantity,
      })
    );
  };

  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-top">
          <div className="pd-images">
            <div className="pd-thumbs">
              <div className="skeleton pulse" style={{ width: '100px', height: '100px', borderRadius: '10px' }}></div>
              <div className="skeleton pulse" style={{ width: '100px', height: '100px', borderRadius: '10px' }}></div>
              <div className="skeleton pulse" style={{ width: '100px', height: '100px', borderRadius: '10px' }}></div>
            </div>
            <div className="pd-main skeleton pulse" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '20px' }}></div>
          </div>
          <div className="pd-info">
            <div className="skeleton pulse" style={{ width: '80%', height: '40px', marginBottom: '20px' }}></div>
            <div className="skeleton pulse" style={{ width: '40%', height: '20px', marginBottom: '20px' }}></div>
            <div className="skeleton pulse" style={{ width: '30%', height: '30px', marginBottom: '20px' }}></div>
            <div className="skeleton pulse" style={{ width: '100%', height: '100px', marginBottom: '20px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="pd-page">Product not found</div>;

  return (
    <div className="pd-page">
      <p className="breadcrumb">Home &gt; Shop &gt; Men &gt; T-shirts</p>

      <div className="pd-top">
        <div className="pd-images">
          <div className="pd-thumbs">
            {(product.images || [product.image]).map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setActiveImg(img)}
                className={activeImg === img ? "active" : ""}
              />
            ))}
          </div>

          <div className="pd-main">
            <img src={activeImg} alt={product.title} />
          </div>
        </div>

        <div className="pd-info">
          <h1>{product.title}</h1>
          <div className="pd-rating">
            {renderStars(averageRating)} <span>{averageRating}/5</span>
          </div>
          <div className="pd-price">
            <strong>${product.price}</strong>
            <span className="old">$300</span>
            <span className="off">-40%</span>
          </div>
          <p className="pd-desc">{product.description}</p>

          <div className="pd-colors">
            <p>Select Colors</p>
            <div className="color-dots">
              {(product.colors || ["Black", "Blue", "White"]).map((color) => (
                <span
                  key={color}
                  className={`color-dot ${selectedColor === color ? "active" : ""}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => setSelectedColor(color)}
                >
                  {selectedColor === color && <CheckIcon />}
                </span>
              ))}
            </div>
          </div>

          <div className="pd-sizes">
            <p>Choose Size</p>
            <div className="size-btns">
              {(product.sizes || ["Small", "Medium", "Large", "X-Large"]).map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? "active" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="pd-cart">
            <div className="qty">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <MinusIcon />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>
                <PlusIcon />
              </button>
            </div>
            <button className="add-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <section className="pd-reviews">
        <h2>Rating & Reviews ({reviews.length})</h2>
        <div className="reviews-grid">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  {renderStars(review.rating)}
                  <div className="check">✔</div>
                </div>
                <h3>{review.userName}</h3>
                <p>"{review.comment}"</p>
                <small>Posted on {new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          ) : (
            <p>No reviews yet for this product.</p>
          )}
        </div>
        {reviews.length > 6 && <button className="load-more">Load More Reviews</button>}
      </section>

      <section className="pd-related">
        <h2>YOU MIGHT ALSO LIKE</h2>
        <div className="related-grid">
          {relatedProducts.map(p => (
            <div key={p.id} className="rel-card">
              <img src={p.image} alt={p.title} />
              <h4>{p.title}</h4>
              <div className="rel-rating">⭐⭐⭐⭐<span>3.5/5</span></div>
              <div className="rel-price"><strong>${p.price}</strong></div>
            </div>
          ))}
        </div>
      </section>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
