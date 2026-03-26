
import { motion } from "framer-motion";

export default function ProductCard({ product, addToCart }) {
  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <div className="product-card__media">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />
        <span className="product-card__tag">New Arrival</span>
      </div>

      <div className="product-card__content">
        <p className="product-card__eyebrow">Signature Edit</p>
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">
          {product.description ||
            "Elevated essentials designed to bring a refined finish to your everyday wardrobe."}
        </p>

        <div className="product-card__footer">
          <div>
            <span className="product-card__price-label">Price</span>
            <h4 className="product-card__price">${product.price}</h4>
          </div>

          <button
            className="product-card__button"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}