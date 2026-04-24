import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData
      );

      navigate("/login", {
        state: { message: "Account created successfully!" },
      });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="auth-shell auth-shell--signup"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="auth-card auth-card--reverse">
        
        {/* LEFT SIDE */}
        <section className="auth-panel auth-panel--accent">
          <div className="auth-panel__content auth-panel__content--center">
            <span className="auth-badge">Join Vogue</span>
            <h2 className="auth-welcome-title">Welcome Back!</h2>
            <p className="auth-welcome-copy">
              Already have an account? Login and continue shopping.
            </p>

            <Link to="/login" className="auth-button auth-button--ghost">
              Sign In
            </Link>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="auth-panel auth-panel--form">
          <div className="auth-panel__content auth-panel__content--center">
            <span className="auth-eyebrow">Create account</span>
            <h1 className="auth-title">Join the store</h1>

            {errorMessage && (
              <div className="auth-alert auth-alert--error">
                {errorMessage}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label>Name</label>
                <input
                  name="name"
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div className="auth-field">
                <label>Email</label>
                <input
                  name="email"
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Create password"
                />
              </div>

              <button className="auth-button">
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}