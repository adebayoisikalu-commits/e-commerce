import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    total,
  } = useContext(CartContext);

  if (!cart.length) return <h2>Your cart is empty</h2>;

  return (
    <div className="container">
      <h1>Your Cart</h1>

      {cart.map((item) => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>${item.price}</p>

          <button onClick={() => decreaseQty(item._id)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => increaseQty(item._id)}>+</button>

          <button onClick={() => removeFromCart(item._id)}>
            Remove
          </button>
        </div>
      ))}

      <h2>Total: ${total}</h2>
    </div>
  );
}