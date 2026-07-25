const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "adebayoisikalu@gmail.com";

const buildOrderId = async () => {
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  if (!lastOrder || !lastOrder.orderId) {
    return "ORD-1001";
  }

  const parts = lastOrder.orderId.split("-");
  const numeric = parseInt(parts[1], 10);
  const nextNumber = Number.isNaN(numeric) ? 1001 : numeric + 1;
  return `ORD-${nextNumber}`;
};

// Create order
router.post("/", auth, async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      phone,
      state,
      city,
      address,
      deliveryOption,
      shippingFee,
      items,
      subTotal,
      total,
    } = req.body;

    if (!customerName || !phone || !state || !city || !deliveryOption || !items?.length) {
      return res.status(400).json({ message: "Please provide all required order details." });
    }

    if (deliveryOption === "Home Delivery" && !address) {
      return res.status(400).json({ message: "A delivery address is required for Home Delivery." });
    }

    const orderId = await buildOrderId();

    const order = await Order.create({
      orderId,
      userId: req.user.id,
      customerName,
      customerEmail,
      phone,
      state,
      city,
      address: deliveryOption === "Home Delivery" ? address : "",
      deliveryOption,
      shippingFee: shippingFee || 0,
      items,
      subTotal,
      total,
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create order." });
  }
});

// Get orders (admin gets all, regular users get own orders)
router.get("/", auth, async (req, res) => {
  try {
    const query = req.user.email === ADMIN_EMAIL ? {} : { userId: req.user.id };
    const orders = await Order.find(query).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch orders." });
  }
});

// Mark payment notice from customer
router.patch("/:id/payment-notice", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to update this order." });
    }

    order.paymentNotice = true;
    await order.save();

    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update payment notice." });
  }
});

// Update order status (admin only)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    if (req.user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    const { paymentStatus, deliveryStatus } = req.body;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;

    await order.save();
    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update order status." });
  }
});

module.exports = router;
