import { useContext } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";

export default function Favourites() {
  const { favourites, addToCart, toggleFavourite, isFavourite } = useContext(CartContext);

  return (
    <motion.main
      className="favourites-page"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <section className="featured-section">
        <div className="section-heading">
          <div>
            <span className="section-heading__eyebrow">My Favourites</span>
            <h2 className="section-heading__title">Saved pieces ready for later</h2>
          </div>
        </div>

        {favourites.length ? (
          <div className="products-grid">
            {favourites.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
                toggleFavourite={toggleFavourite}
                isFavourite={isFavourite(product._id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-products">
            <h3>No favourites yet</h3>
            <p>Tap the heart icon on any product to save it here for later.</p>
          </div>
        )}
      </section>
    </motion.main>
  );
}
