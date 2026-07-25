import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";

const shippingRates = {
  Lagos: 2000,
  Abuja: 3000,
  default: 2500,
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useContext(CartContext);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    customerEmail: "",
    state: "",
    city: "",
    address: "",
  });
  const [deliveryOption, setDeliveryOption] = useState("Home Delivery");
  const [shippingFee, setShippingFee] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cart.length) {
      navigate("/", { replace: true });
    }
  }, [cart.length, navigate]);

  useEffect(() => {
    const selectedState = form.state.trim();
    if (deliveryOption === "Home Delivery") {
      setShippingFee(shippingRates[selectedState] ?? shippingRates.default);
    } else {
      setShippingFee(0);
    }
  }, [deliveryOption, form.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.customerName.trim() || !form.phone.trim() || !form.state.trim() || !form.city.trim()) {
      return setError("Please fill in all required fields.");
    }

    if (deliveryOption === "Home Delivery" && !form.address.trim()) {
      return setError("Please provide a delivery address for Home Delivery.");
    }

    const items = cart.map((item) => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const payload = {
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      phone: form.phone,
      state: form.state,
      city: form.city,
      address: form.address,
      deliveryOption,
      shippingFee,
      items,
      subTotal: total,
      total: total + shippingFee,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearCart();
      navigate("/order-confirmation", {
        state: { order: response.data },
      });
    } catch (submissionError) {
      setError(
        submissionError.response?.data?.message ||
          "Unable to place your order right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const orderTotal = total + shippingFee;

  return (
    <motion.main
      className="checkout-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="checkout-card">
        <h1>Checkout</h1>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </label>

          <label>
            Phone Number
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="08012345678"
              required
            />
          </label>

          <label>
            Email (optional)
            <input
              name="customerEmail"
              value={form.customerEmail}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>

          <label>
            State
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Lagos"
              required
            />
          </label>

          <label>
            City
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Ikeja"
              required
            />
          </label>

          <div className="delivery-options">
            <p>Delivery Options</p>
            <label>
              <input
                type="radio"
                name="deliveryOption"
                value="Home Delivery"
                checked={deliveryOption === "Home Delivery"}
                onChange={() => setDeliveryOption("Home Delivery")}
              />
              Home Delivery
            </label>
            <label>
              <input
                type="radio"
                name="deliveryOption"
                value="Pick Up"
                checked={deliveryOption === "Pick Up"}
                onChange={() => setDeliveryOption("Pick Up")}
              />
              Pick Up
            </label>
          </div>

          {deliveryOption === "Home Delivery" && (
            <label>
              Full Delivery Address
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Awolowo Road, Ikeja, Lagos"
                required
              />
            </label>
          )}

          <div className="checkout-summary">
            <div>
              <strong>Cart total</strong>
              <span>₦{total.toFixed(2)}</span>
            </div>
            <div>
              <strong>Shipping fee</strong>
              <span>₦{shippingFee.toFixed(2)}</span>
            </div>
            <div className="checkout-total">
              <strong>Total</strong>
              <span>₦{orderTotal.toFixed(2)}</span>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button className="checkout-button" type="submit" disabled={loading}>
            {loading ? "Placing order..." : "Place order"}
          </button>
        </form>

        <div className="payment-info">
          <h2>Payment Method</h2>
          <p>Bank Transfer only</p>
          <p>Use your Order ID as payment reference.</p>
        </div>
      </div>
    </motion.main>
  );
}
