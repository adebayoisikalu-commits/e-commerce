import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const bankDetails = {
  bankName: "First Bank of Nigeria",
  accountName: "Vogue Fashion Store",
  accountNumber: "1234567890",
};

const pickupInstructions = {
  address: "123 Fashion Avenue, Victoria Island, Lagos",
  details:
    "Visit our store during business hours and present your Order ID at pickup.",
};

export default function OrderConfirmation() {
  const location = useLocation();
  const [paymentUpdate, setPaymentUpdate] = useState("");
  const [loading, setLoading] = useState(false);
  const order = location.state?.order;

  if (!order) {
    return (
      <motion.main className="checkout-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
        <div className="checkout-card">
          <h1>Order not found</h1>
          <p>Return to the homepage and place your order again.</p>
          <Link to="/" className="checkout-button">
            Go home
          </Link>
        </div>
      </motion.main>
    );
  }

  const handlePaymentNotice = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/orders/${order._id}/payment-notice`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPaymentUpdate("Payment notice sent. Your order remains pending until we confirm the transfer.");
    } catch (err) {
      setPaymentUpdate("Unable to send payment notice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      className="order-confirmation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="checkout-card">
        <h1>Order Confirmation</h1>
        <p className="order-status">Payment status: {order.paymentStatus}</p>

        <div className="order-meta">
          <div>
            <strong>Order ID</strong>
            <p>{order.orderId}</p>
          </div>
          <div>
            <strong>Delivery method</strong>
            <p>{order.deliveryOption}</p>
          </div>
          <div>
            <strong>Total amount</strong>
            <p>₦{order.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          {order.items.map((item) => (
            <div key={item.productId} className="order-item">
              <span>{item.name} x {item.quantity}</span>
              <span>₦{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="order-item order-item--summary">
            <span>Shipping fee</span>
            <span>₦{order.shippingFee.toFixed(2)}</span>
          </div>
          <div className="order-item order-item--summary">
            <span>Total</span>
            <span>₦{order.total.toFixed(2)}</span>
          </div>
        </div>

        {order.deliveryOption === "Home Delivery" ? (
          <div className="delivery-details">
            <h2>Delivery Address</h2>
            <p>{order.address}</p>
          </div>
        ) : (
          <div className="pickup-details">
            <h2>Pickup Instructions</h2>
            <p>{pickupInstructions.address}</p>
            <p>{pickupInstructions.details}</p>
          </div>
        )}

        <div className="bank-details">
          <h2>Bank Transfer Instructions</h2>
          <p>Use your Order ID as the payment reference.</p>
          <div>
            <strong>Bank Name</strong>
            <p>{bankDetails.bankName}</p>
          </div>
          <div>
            <strong>Account Name</strong>
            <p>{bankDetails.accountName}</p>
          </div>
          <div>
            <strong>Account Number</strong>
            <p>{bankDetails.accountNumber}</p>
          </div>
        </div>

        <button className="checkout-button" onClick={handlePaymentNotice} disabled={loading}>
          {loading ? "Sending notice..." : "I Have Made Payment"}
        </button>

        {paymentUpdate && <p className="payment-update">{paymentUpdate}</p>}

        <Link to="/" className="checkout-button checkout-button--ghost">
          Continue shopping
        </Link>
      </div>
    </motion.main>
  );
}
