import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CloseIcon } from "./Icons";
import "../styles/navbar.css";

export default function TopBanner() {
    const [show, setShow] = useState(true);
    const user = useSelector((state) => state.auth.user);

    if (!show || user) return null;

    return (
        <div className="top-banner">
            <div className="banner-content">
                <span>
                    Sign up and get 20% off to your first order.{" "}
                    <Link to="/auth" className="banner-link">Sign Up Now</Link>
                </span>
            </div>
            <button className="banner-close" onClick={() => setShow(false)}>
                <CloseIcon />
            </button>
        </div>
    );
}
