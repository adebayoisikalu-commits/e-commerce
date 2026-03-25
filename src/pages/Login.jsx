 import { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message || "";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState(successMessage);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required";
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setErrorMessage("");
    setInfoMessage(successMessage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData);
      

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("authUser", JSON.stringify(response.data.user));
      navigate("/", { replace: true });
    } catch (requestError) {
      setErrorMessage(
        requestError.response?.data?.message ||
          "Unable to login right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell auth-shell--login">
      <div className="auth-card">
        <section className="auth-panel auth-panel--form">
          <div className="auth-panel__content auth-panel__content--center">
            <span className="auth-eyebrow">Sign in</span>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">
              Login to continue shopping, manage your orders, and access your
              saved products in one beautiful place.
            </p>

            {infoMessage && (
              <div className="auth-alert auth-alert--success">{infoMessage}</div>
            )}

            {errorMessage && (
              <div className="auth-alert auth-alert--error">{errorMessage}</div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "is-invalid" : ""}
                />
                {errors.email && (
                  <span className="auth-field__error">{errors.email}</span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "is-invalid" : ""}
                />
                {errors.password && (
                  <span className="auth-field__error">{errors.password}</span>
                )}
              </div>

              <button className="auth-button" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="auth-switch-text">
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
          </div>
        </section>

        <section className="auth-panel auth-panel--accent">
          <div className="auth-panel__content auth-panel__content--center">
            <span className="auth-badge">ShopEase</span>
            <h2 className="auth-welcome-title">Hello, Friend!</h2>
            <p className="auth-welcome-copy">
              Enter your personal details and start your journey with a stylish,
              seamless shopping experience.
            </p>

            <Link to="/signup" className="auth-button auth-button--ghost">
              Sign Up
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
