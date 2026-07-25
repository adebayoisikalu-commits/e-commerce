import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./admin.css";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrder = (order) => {
    setSelectedOrder((current) => (current?._id === order._id ? null : order));
  };

  return (
    <motion.main
      className="orders-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="orders-card">
        <div className="orders-header">
          <h1>Your Orders</h1>
          <p>Track your purchases, payment status, and delivery progress in one place.</p>
        </div>

        {loading ? (
          <div className="orders-skeleton">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="orders-skeleton__item" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <h2>No orders yet</h2>
            <p>Once you place an order, it will appear here with the latest status updates.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card__summary" onClick={() => toggleOrder(order)}>
                  <div>
                    <strong>{order.orderId}</strong>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="order-status">{order.deliveryStatus}</span>
                    <p>₦{order.total.toFixed(2)}</p>
                  </div>
                </div>

                {selectedOrder?._id === order._id && (
                  <div className="order-card__details">
                    <div className="order-details-row">
                      <div>
                        <p className="label">Delivery</p>
                        <p>{order.deliveryOption}</p>
                      </div>
                      <div>
                        <p className="label">Payment</p>
                        <p>{order.paymentStatus}</p>
                      </div>
                    </div>

                    <div className="order-details-row">
                      <div>
                        <p className="label">Customer</p>
                        <p>{order.customerName}</p>
                        <p>{order.phone}</p>
                      </div>
                      <div>
                        <p className="label">Address</p>
                        <p>{order.deliveryOption === "Home Delivery" ? order.address : "Pick up at store"}</p>
                      </div>
                    </div>

                    <div className="order-items">
                      <h3>Products</h3>
                      {order.items.map((item) => (
                        <div key={item.productId} className="order-item">
                          <span>{item.name} x{item.quantity}</span>
                          <span>₦{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.main>
  );
}
