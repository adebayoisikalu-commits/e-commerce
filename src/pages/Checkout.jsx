import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";

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
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
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
      paymentMethod,
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="checkout-card"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
      >
        <div className="checkout-hero">
          <div>
            <p className="checkout-eyebrow">Secure checkout</p>
            <h1>Complete your order</h1>
          </div>
          <div className="checkout-pill">Fast delivery • Bank transfer</div>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-grid">
            <div className="checkout-field-group">
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
            </div>

            <div className="checkout-field-group">
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

              <div className="payment-options">
                <p>Payment Method</p>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bank Transfer"
                    checked={paymentMethod === "Bank Transfer"}
                    onChange={() => setPaymentMethod("Bank Transfer")}
                  />
                  Bank Transfer
                </label>
              </div>
            </div>
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

          <motion.div
            className="checkout-summary"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <div>
              <strong>Cart total</strong>
              <span>{formatCurrency(total)}</span>
            </div>
            <div>
              <strong>Shipping fee</strong>
              <span>{formatCurrency(shippingFee)}</span>
            </div>
            <div className="checkout-total">
              <strong>Total</strong>
              <span>{formatCurrency(orderTotal)}</span>
            </div>
          </motion.div>

          {error && <div className="form-error">{error}</div>}

          <motion.button
            className="checkout-button"
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Placing order..." : "Place order"}
          </motion.button>
        </form>

        <div className="payment-info">
          <div className="payment-info-header">
            <h2>Payment Method</h2>
            <span className="payment-badge">Bank Transfer</span>
          </div>
          <p className="payment-description">Use the details below for checkout. This is a fake example account.</p>
          <ul className="payment-details">
            <li>
              <strong>Opay:</strong>
              <span>Sunmisola Isikalu</span>
            </li>
            <li>
              <strong>Account number:</strong>
              <span>7049187380</span>
            </li>
            <li>
              <strong>Phone:</strong>
              <span>07049187380</span>
            </li>
          </ul>
          <p className="payment-hint">Use your Order ID as payment reference.</p>
        </div>
      </motion.div>
    </motion.main>
  );
}
