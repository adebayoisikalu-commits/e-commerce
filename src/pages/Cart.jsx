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

  if (!cart.length)
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontSize: "28px",
          color: "#555",
          animation: "fadeIn 0.8s ease-in-out",
        }}
      >
        Your cart is empty 🛒
      </h2>
    );

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        background: "linear-gradient(135deg, #f9fafb, #eef2f7)",
        fontFamily: "Arial, sans-serif",
        animation: "fadeIn 0.6s ease-in-out",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "32px",
        }}
      >
        🛍️ Your Cart
      </h1>

      {cart.map((item) => (
        <div
          key={item._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "15px",
            background: "#fff",
            boxShadow: "0 5px 15px rgba(207, 51, 124, 0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.08)";
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>{item.name}</h3>
            <p style={{ margin: "5px 0", color: "#666" }}>
              ${item.price}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => decreaseQty(item._id)}
              style={btnStyle}
            >
              −
            </button>

            <span style={{ fontSize: "18px", minWidth: "20px", textAlign: "center" }}>
              {item.quantity}
            </span>

            <button
              onClick={() => increaseQty(item._id)}
              style={btnStyle}
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item._id)}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "none",
              background: " #de4778",
              color: "#fff",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.background = " #db7998")}
            onMouseLeave={(e) => (e.target.style.background = " #e96a92")}
          >
            Remove
          </button>
        </div>
      ))}

      <h2
        style={{
          textAlign: "right",
          marginTop: "30px",
          fontSize: "24px",
        }}
      >
        Total: ${total}
      </h2>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

const btnStyle = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "none",
  background: " #de4778",
  color: "#fff",
  cursor: "pointer",
  fontSize: "16px",
  transition: "0.2s",
};
