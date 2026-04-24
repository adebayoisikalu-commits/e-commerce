import { useContext } from "react";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    total,
  } = useContext(CartContext);

  if (!cart.length)
    return (
      <motion.main
        className="cart-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="cart-empty">
          <div className="cart-empty__icon">🛒</div>
          <h2 className="cart-empty__title">Your cart is empty</h2>
          <p className="cart-empty__text">Add some products to get started!</p>
        </div>
      </main>
    );

  return (
    <motion.main
      className="cart-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Your Shopping Cart</h1>
          <div className="cart-count">{cart.length} item{cart.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="cart-items">
          {cart.map((item, index) => (
            <div
              key={item._id}
              className="cart-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="cart-item__image">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="cart-item__content">
                <h3 className="cart-item__title">{item.name}</h3>
                <p className="cart-item__price">${item.price}</p>
              </div>

              <div className="cart-item__quantity">
                <button
                  className="quantity-btn quantity-btn--decrease"
                  onClick={() => decreaseQty(item._id)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button
                  className="quantity-btn quantity-btn--increase"
                  onClick={() => increaseQty(item._id)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="cart-item__subtotal">
                <span className="subtotal-label">Subtotal</span>
                <span className="subtotal-value">${(item.price * item.quantity).toFixed(2)}</span>
              </div>

              <button
                className="cart-item__remove"
                onClick={() => removeFromCart(item._id)}
                aria-label="Remove item"
              >
                <span className="remove-icon">×</span>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-total">
            <div className="total-row">
              <span className="total-label">Total</span>
              <span className="total-value">${total.toFixed(2)}</span>
            </div>
          </div>

          <button className="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </main>
  );
}
