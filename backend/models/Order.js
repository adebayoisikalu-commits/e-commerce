const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String },
    deliveryOption: {
      type: String,
      enum: ["Home Delivery", "Pick Up"],
      required: true,
    },
    shippingFee: { type: Number, default: 0 },
    items: [orderItemSchema],
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "Bank Transfer" },
    paymentStatus: { type: String, default: "Pending Payment" },
    paymentNotice: { type: Boolean, default: false },
    deliveryStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
