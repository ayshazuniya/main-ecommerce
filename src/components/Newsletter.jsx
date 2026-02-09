import "../styles/newsletter.css";

export default function Newsletter() {
  return (
    <section className="newsletter-wrap">
      <div className="newsletter-bar">
        <h3>
          STAY UPTO DATE ABOUT <br />
          OUR LATEST OFFERS
        </h3>

        <div className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email address"
          />
          <button>Subscribe to Newsletter</button>
        </div>
      </div>
    </section>
  );
}
