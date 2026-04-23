import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="loading">Loading product details...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="error">Product not found</div>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <div className="product-details">
        <div className="product-details__media">
          <img
            src={product.image}
            alt={product.name}
            className="product-details__image"
          />
        </div>

        <div className="product-details__content">
          <p className="product-details__eyebrow">Luxury Picks</p>
          <h1 className="product-details__title">{product.name}</h1>
          <p className="product-details__description">{product.description}</p>

          <div className="product-details__footer">
            <div>
              <span className="product-details__price-label">Price</span>
              <h2 className="product-details__price">${product.price}</h2>
            </div>

            <button
              className="product-details__button"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}