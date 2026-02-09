import { Link } from "react-router-dom";
import { CloseIcon } from "./Icons";
import "../styles/auth.css";

export default function AuthModal({ onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <CloseIcon />
                </button>

                <h3>Join SHOP.CO</h3>
                <p>Please log in or sign up to add items to your cart and proceed to checkout.</p>

                <div className="modal-btns">
                    <Link to="/auth" className="modal-login" onClick={onClose}>
                        Log In
                    </Link>
                    <Link to="/auth" className="modal-signup" onClick={onClose}>
                        Sign Up
                    </Link>
                    <button className="google-auth" style={{ marginTop: 0 }}>
                        <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" width="20" />
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
