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
import API from "../api/api";
import { Skeleton } from "../components/Skeleton";

const staticStyles = [
  { id: 1, name: "Casual", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop" },
  { id: 2, name: "Formal", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop" },
  { id: 3, name: "Party",  image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop" },
  { id: 4, name: "Gym",    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop" },
];

const staticReviews = [
  { id: 1, rating: 5, userName: "Sarah M.",  comment: "I'm blown away by the quality and style of the clothes I received from Shopco. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations." },
  { id: 2, rating: 5, userName: "Alex K.",   comment: "Finding clothes that align with my personal style used to be a challenge until I discovered Shopco. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions." },
  { id: 3, rating: 5, userName: "James L.",  comment: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shopco. The selection of clothes is not only diverse but also on-point with the latest trends." },
  { id: 4, rating: 5, userName: "Moana R.",  comment: "The customer service at Shopco is absolutely outstanding. They went above and beyond to help me find the perfect outfit for a special event. I'll definitely be a returning customer!" },
];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [reviewPage, setReviewPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    API.get("/products/")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const newArrivals = products.filter(p => p.category === "New Arrivals" || p.category === "new-arrivals");
  const topSelling  = products.filter(p => p.category === "Top Selling" || p.category === "top-selling");

  const visibleReviews = staticReviews.slice(reviewPage * 3, reviewPage * 3 + 3);
  const canPrev = reviewPage > 0;
  const canNext = (reviewPage + 1) * 3 < staticReviews.length;

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>FIND CLOTHES <br />THAT MATCHES <br />YOUR STYLE</h1>
            <p>Browse through our diverse range of meticulously crafted garments.</p>
            <button onClick={() => navigate("/category/new-arrivals")}>Shop Now</button>
            <div className="stats">
              <div><h3>200+</h3><p>International Brands</p></div>
              <div><h3>2,000+</h3><p>High-Quality Products</p></div>
              <div><h3>30,000+</h3><p>Happy Customers</p></div>
            </div>
          </div>
          <img src={hero} alt="Hero" className="hero-img" />
        </div>
      </section>

      {/* BRANDS */}
      <section className="brands">
        <img src={versace} alt="Versace" />
        <img src={zara}    alt="Zara" />
        <img src={gucci}   alt="Gucci" />
        <img src={prada}   alt="Prada" />
        <img src={calvin}  alt="Calvin Klein" />
      </section>

      {/* NEW ARRIVALS */}
      <Section title="NEW ARRIVALS" products={newArrivals} navigate={navigate} link="/category/new-arrivals" loading={loading} />

      {/* TOP SELLING */}
      <Section title="TOP SELLING" products={topSelling} navigate={navigate} link="/category/top-selling" loading={loading} />

      {/* BROWSE BY DRESS STYLE */}
      <section className="style">
        <h2>BROWSE BY DRESS STYLE</h2>
        <div className="style-grid">
          {staticStyles.map(s => (
            <div key={s.id} className="style-card" onClick={() => navigate(`/category/${s.name.toLowerCase()}`)}>
              <img src={s.image} alt={s.name} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonial">
        <div className="testimonial-header">
          <h2>OUR HAPPY CUSTOMERS</h2>
          <div className="testimonial-arrows">
            <button className="arrow-btn" onClick={() => setReviewPage(p => p - 1)} disabled={!canPrev}>&#8592;</button>
            <button className="arrow-btn" onClick={() => setReviewPage(p => p + 1)} disabled={!canNext}>&#8594;</button>
          </div>
        </div>
        <div className="testimonial-grid">
          {visibleReviews.map(r => (
            <div key={r.id} className="testimonial-card">
              <div className="t-stars">{"★".repeat(r.rating)}</div>
              <div className="t-user">
                <strong>{r.userName}</strong>
                <span className="t-verified">✅</span>
              </div>
              <p className="t-comment">"{r.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Newsletter + Footer is handled by Footer.jsx — nothing here */}
    </>
  );
}

function Section({ title, products, navigate, link, loading }) {
  return (
    <section className="products">
      <h2>{title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginTop: "24px" }}>
        {loading ? (
          <Skeleton type="product-card" count={4} />
        ) : (
          products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
      <button className="view" onClick={() => navigate(link)}>View All</button>
    </section>
  );
}
