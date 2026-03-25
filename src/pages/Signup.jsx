import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Full name is required";

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password required";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Min 6 characters";
    }

    return nextErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setLoading(true);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      

      navigate("/login", {
        replace: true,
        state: { message: "Account created. Please login." },
      });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" onChange={handleChange} />
        <button>{loading ? "Loading..." : "Signup"}</button>
        {errorMessage && <p>{errorMessage}</p>}
        <Link to="/login">Login</Link>
      </form>
    </div>
  );
}
