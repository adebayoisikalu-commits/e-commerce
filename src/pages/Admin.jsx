// Admin.jsx
import { useCallback, useEffect, useState } from "react";
import "./admin.css";
import { motion } from "framer-motion";
import axios from "axios";
import { formatCurrency } from "../utils/currency";

const STATUS_OPTIONS = [
  "All",
  "Pending Payment",
  "Payment Confirmed",
  "Preparing Order",
  "Ready for Pick Up",
  "Picked Up",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const productAPI = `${import.meta.env.VITE_API_URL}/api/products`;
  const ordersAPI = `${import.meta.env.VITE_API_URL}/api/orders`;
  const token = localStorage.getItem("authToken");

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(productAPI, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      alert("Failed to load products");
    }
  }, [productAPI, token]);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (statusFilter && statusFilter !== "All") query.append("status", statusFilter);

      const res = await axios.get(`${ordersAPI}?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      alert("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  }, [ordersAPI, token, search, statusFilter]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, image: val }));
    setImagePreview(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
      };

      let res;
      if (editingId) {
        res = await axios.put(`${productAPI}/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
        // update local products list
        setProducts((prev) => prev.map((p) => (p._id === res.data._id ? res.data : p)));
      } else {
        res = await axios.post(productAPI, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // prepend created product
        setProducts((prev) => [res.data, ...prev]);
      }

      setForm({ name: "", price: "", description: "", image: "" });
      setImagePreview("");
      alert("Product saved successfully");
    } catch (err) {
      console.error("Failed to save product", err);
      const msg = err?.response?.data?.message || err.message || "Failed to save product";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${productAPI}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product");
    }
  };

  const handleEditProduct = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
    });
    setEditingId(product._id);
    setActiveTab("products");
  };

  const updateOrderStatus = async (orderId, updates) => {
    try {
      await axios.patch(`${ordersAPI}/${orderId}/status`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order", err);
      alert("Failed to update order status");
    }
  };

  const confirmPayment = (orderId) => {
    updateOrderStatus(orderId, { paymentStatus: "Payment Confirmed" });
  };

  const changeDeliveryStatus = (orderId, status) => {
    updateOrderStatus(orderId, { deliveryStatus: status });
  };

  const summary = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    pendingPayments: orders.filter((order) => order.paymentStatus !== "Payment Confirmed").length,
  };

  return (
    <motion.div
      className="admin"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__brand">
            <h1>Admin Dashboard</h1>
            <p>Manage products, review orders, and confirm payments.</p>
          </div>
          <nav className="admin-tabs">
            <button
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </button>
            <button
              className={activeTab === "products" ? "active" : ""}
              onClick={() => setActiveTab("products")}
            >
              Products
            </button>
          </nav>
          <button
            className="button button--primary admin-add-product"
            onClick={() => {
              setActiveTab("products");
              setForm({ name: "", price: "", description: "", image: "" });
              setEditingId(null);
            }}
          >
            Add Product
          </button>
        </aside>

        <div className="admin-content">
          <div className="admin-content__top">
            <p className="admin-content__intro">Welcome back, admin. View and manage store activity from one streamlined dashboard.</p>
          </div>

          <div className="admin-summary-cards">
            <div className="admin-summary-card">
              <p className="summary-card__label">Total Orders</p>
              <h2>{summary.totalOrders}</h2>
            </div>
            <div className="admin-summary-card">
              <p className="summary-card__label">Total Revenue</p>
              <h2>{formatCurrency(summary.totalRevenue)}</h2>
            </div>
            <div className="admin-summary-card">
              <p className="summary-card__label">Pending Payments</p>
              <h2>{summary.pendingPayments}</h2>
            </div>
          </div>

          {activeTab === "products" ? (
        <section className="admin-products">
          <form onSubmit={handleSubmit} className="admin-form">
            <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleFormChange}
              required
            />
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              name="image"
              placeholder="Image URL (https://...)"
              value={form.image}
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="preview" style={{ maxWidth: 160, maxHeight: 120 }} />
              </div>
            )}
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleFormChange}
              required
            />
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </button>
          </form>

          <div className="admin-grid">
            {products.map((product) => (
              <div key={product._id} className="admin-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="admin-card__price">{formatCurrency(product.price)}</p>
                <div className="admin-actions">
                  <button className="button button--secondary" onClick={() => handleEditProduct(product)}>
                    Edit
                  </button>
                  <button className="button button--danger" onClick={() => handleDeleteProduct(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="admin-orders">
          <div className="admin-order-controls">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders by ID, name, or phone"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button type="button" className="button button--secondary" onClick={fetchOrders}>
              Refresh
            </button>
          </div>

          {loadingOrders ? (
            <div className="admin-loading">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="orders-empty">
              <h2>No orders yet</h2>
              <p>Once customers place orders, they will appear here.</p>
            </div>
          ) : (
            <div className="admin-order-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-card__top">
                    <div>
                      <strong>{order.orderId}</strong>
                      <p>{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="badge">{order.deliveryOption}</span>
                      <span className="badge badge--status">{order.deliveryStatus}</span>
                    </div>
                  </div>

                  <div className="order-card__info">
                    <div>
                      <p className="label">Customer</p>
                      <p>{order.customerName}</p>
                      <p>{order.phone}</p>
                      {order.customerEmail && <p>{order.customerEmail}</p>}
                    </div>
                    <div>
                      <p className="label">Total</p>
                      <p>{formatCurrency(order.total)}</p>
                      <p>Payment: {order.paymentStatus}</p>
                    </div>
                  </div>

                  <div className="order-card__address">
                    <p className="label">Address</p>
                    <p>{order.deliveryOption === "Home Delivery" ? order.address : "Pick up at store"}</p>
                  </div>

                  <div className="order-card__products">
                    <p className="label">Products</p>
                    {order.items.map((item) => (
                      <div key={item.productId} className="order-item-row">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card__actions">
                    <button
                      className="button button--primary"
                      onClick={() => confirmPayment(order._id)}
                    >
                      Confirm Payment
                    </button>
                    <select
                      value={order.deliveryStatus}
                      onChange={(e) => changeDeliveryStatus(order._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.filter((status) => status !== "All").map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
        </div>
      </div>
    </motion.div>
  );
}
