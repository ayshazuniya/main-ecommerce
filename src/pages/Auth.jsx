import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, register, clearError } from "../features/auth/authSlice";
import "../styles/auth.css";

export default function Auth({ initialMode = "login" }) {
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { loading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let result;
        if (mode === "login") {
            result = await dispatch(login({ email: formData.email, password: formData.password }));
        } else {
            result = await dispatch(register(formData));
        }

        if (!result.error) {
            navigate("/");
        }
    };

    const toggleMode = () => {
        setMode(mode === "login" ? "signup" : "login");
        dispatch(clearError());
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>

                {error && <p className="error-msg">{error}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {mode === "signup" && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button className="auth-btn" disabled={loading}>
                        {loading ? "Processing..." : mode === "login" ? "Login" : "Create Account"}
                    </button>
                </form>

                <div className="google-auth">
                    <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" width="20" />
                    Continue with Google
                </div>

                <p className="auth-switch">
                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                    <span onClick={toggleMode}>
                        {mode === "login" ? "Sign Up" : "Login"}
                    </span>
                </p>
            </div>
        </div>
    );
}
