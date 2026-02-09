import "../styles/footer.css";

import github from "../assets/icons/github.png";
import facebook from "../assets/icons/facebook.png";
import instagram from "../assets/icons/instagram.png";
import twitter from "../assets/icons/twitter.png";
import Newsletter from "../components/Newsletter";
import visa from "../assets/payments/visa.png";
import mastercard from "../assets/payments/mastercard.png";
import paypal from "../assets/payments/paypal.png";
import applepay from "../assets/payments/applepay.png";
import gpay from "../assets/payments/gpay.png"
  export default function Footer() {
  return (
    <footer className="footer">
      <Newsletter/>
      <div className="footer-top">
        <div className="footer-brand">
          <h3>SHOP.CO</h3>
          <p>
            We have clothes that suit your style and which you’re proud to wear.
          </p>

          <div className="footer-socials">
            <img src={github} alt="Website" />
            <img src={facebook} alt="Facebook" />
            <img src={instagram} alt="Instagram" />
            <img src={twitter} alt="Twitter" />
          </div>
        </div>

        <div className="footer-links">
          <div>
            <h4>COMPANY</h4>
            <a>About</a>
            <a>Features</a>
            <a>Works</a>
            <a>Career</a>
          </div>

          <div>
            <h4>HELP</h4>
            <a>Customer Support</a>
            <a>Delivery Details</a>
            <a>Terms & Conditions</a>
            <a>Privacy Policy</a>
          </div>

          <div>
            <h4>FAQ</h4>
            <a>Account</a>
            <a>Manage Deliveries</a>
            <a>Orders</a>
            <a>Payments</a>
          </div>

          <div>
            <h4>RESOURCES</h4>
            <a>Free eBooks</a>
            <a>Development Tutorial</a>
            <a>How to - Blog</a>
            <a>YouTube Playlist</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 SHOP.CO. All rights reserved.</span>

        <div className="footer-payments">
          <img src={visa} alt="Visa" />
          <img src={mastercard} alt="Mastercard" />
          <img src={paypal} alt="PayPal" />
          <img src={applepay} alt="Apple Pay" />
          <img src={gpay} alt="GPay" />
        </div>
      </div>
    </footer>
  );
}
