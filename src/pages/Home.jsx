import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/hero-banner.jpg";
import "../styles/home.css";
import ProductCard from "../components/ProductCard";

import versace from "../assets/brands/versace.png";
import zara from "../assets/brands/zara.png";
import gucci from "../assets/brands/gucci.png";
import prada from "../assets/brands/prada.png";
import calvin from "../assets/brands/calvin-klein.png";

import { Skeleton } from "../components/Skeleton";

export default function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [styles, setStyles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("https://shopco-ecommerce-6lk1.onrender.com/products").then(res => res.json()),
      fetch("https://shopco-ecommerce-6lk1.onrender.com/styles").then(res => res.json()),
      fetch("https://shopco-ecommerce-6lk1.onrender.com/reviews/home").then(res => res.json())
    ])
      .then(([productsData, stylesData, reviewsData]) => {
        setProducts(productsData);
        setStyles(stylesData);
        setReviews(reviewsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const newArrivals = products.filter(p => p.category === "new-arrivals");
  const topSelling = products.filter(p => p.category === "top-selling");

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>
              FIND CLOTHES <br />
              THAT MATCHES <br />
              YOUR STYLE
            </h1>

            <p>
              Browse through our diverse range of meticulously crafted garments.
            </p>

            <button onClick={() => navigate("/category/new-arrivals")}>
              Shop Now
            </button>

            <div className="stats">
              <div>
                <h3>200+</h3>
                <p>International Brands</p>
              </div>
              <div>
                <h3>2,000+</h3>
                <p>High-Quality Products</p>
              </div>
              <div>
                <h3>30,000+</h3>
                <p>Happy Customers</p>
              </div>
            </div>
          </div>

          <img src={hero} alt="Hero" className="hero-img" />
        </div>
      </section>

      {/* BRANDS */}
      <section className="brands">
        <img src={versace} alt="Versace" />
        <img src={zara} alt="Zara" />
        <img src={gucci} alt="Gucci" />
        <img src={prada} alt="Prada" />
        <img src={calvin} alt="Calvin Klein" />
      </section>

      {/* SECTIONS */}
      <Section
        title="NEW ARRIVALS"
        products={newArrivals}
        navigate={navigate}
        link="/category/new-arrivals"
        loading={loading}
      />

      <Section
        title="TOP SELLING"
        products={topSelling}
        navigate={navigate}
        link="/category/top-selling"
        loading={loading}
      />

      {/* BROWSE BY STYLE */}
      <section className="style">
        <h2>BROWSE BY DRESS STYLE</h2>

        <div className="style-grid">
          {loading ? (
            <Skeleton type="product-card" count={4} />
          ) : (
            styles.map(style => (
              <div
                key={style.id}
                className="style-card"
                onClick={() =>
                  navigate(`/category/${style.name.toLowerCase()}`)
                }
              >
                <img src={style.image} alt={style.name} />
                <span>{style.name}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="testimonial">
        <h2>OUR HAPPY CUSTOMERS</h2>
        <div className="testimonial-grid">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="testimonial-card">
                <div className="stars">{"⭐️".repeat(review.rating)}</div>
                <div className="user-name">
                  <strong>{review.userName}</strong>
                  <span className="verified">✅</span>
                </div>
                <p>"{review.comment}"</p>
                {review.Product && (
                  <small className="product-ref">on {review.Product.title}</small>
                )}
              </div>
            ))
          ) : (
            <>
              <div>⭐️⭐️⭐️⭐️⭐️ Amazing quality</div>
              <div>⭐️⭐️⭐️⭐️⭐️ Perfect fit</div>
              <div>⭐️⭐️⭐️⭐️⭐️ Loved it</div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

/* ===================== */
/* SECTION COMPONENT */
/* ===================== */

function Section({ title, products, navigate, link, loading }) {
  return (
    <section className="products">
      <h2>{title}</h2>

      <div className="product-grid">
        {loading ? (
          <Skeleton type="product-card" count={6} />
        ) : (
          products.slice(0, 6).map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      <button className="view" onClick={() => navigate(link)}>
        View All
      </button>
    </section>
  );
}
