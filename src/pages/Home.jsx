import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const featuredProducts = products.slice(0, 8);

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-section__content">
          <span className="hero-section__badge">Premium Fashion Store</span>
          <h1 className="hero-section__title">
            Level Up Your Style With Our Summer Collections
          </h1>
          <p className="hero-section__text">
            Discover elevated essentials, standout statement pieces, and
            timeless everyday fashion curated to make your wardrobe feel fresh,
            modern, and effortlessly stylish.
          </p>

          <div className="hero-section__actions">
            <a href="#featured-products" className="hero-section__button">
              Shop Collection
            </a>
            <button
              type="button"
              className="hero-section__button hero-section__button--secondary"
            >
              Explore Trends
            </button>
          </div>

          <div className="hero-section__stats">
            <div className="hero-stat">
              <strong>12k+</strong>
              <span>Happy shoppers</span>
            </div>
            <div className="hero-stat">
              <strong>250+</strong>
              <span>Curated styles</span>
            </div>
            <div className="hero-stat">
              <strong>4.9/5</strong>
              <span>Top rated store</span>
            </div>
          </div>
        </div>

        <div className="hero-section__visual">
          <div className="hero-card hero-card--main">
            <img
              src="https://www.instyle.com/thmb/nswLuCLoYaOgGKS1mf3SxULvl7E=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-2214264711-8c1da132de854bea92ad54a52935689d.jpg"
              alt="Fashion collection"
            />
          </div>

          <div className="hero-card hero-card--floating">
            <p>Trending Now</p>
            <strong>Summer Luxe Edit</strong>
            <span>Fresh arrivals for a bold new season.</span>
          </div>
        </div>
      </section>

      <section className="promo-grid">
        <article className="promo-card promo-card--soft">
          <span>Summer 2026</span>
          <h2>Breathable essentials for effortless everyday outfits.</h2>
          <p>
            Lightweight fits, clean silhouettes, and premium finishing details.
          </p>
        </article>

        <article className="promo-card promo-card--warm">
          <span>Weekend Picks</span>
          <h2>Standout styles designed to turn simple looks into statements.</h2>
          <p>
            Refresh your wardrobe with a polished mix of comfort and confidence.
          </p>
        </article>

        <article className="promo-card promo-card--light">
          <span>Exclusive Offer</span>
          <h2>Get inspired by the latest fashion edits handpicked for you.</h2>
          <p>Shop limited drops and discover your next favorite piece.</p>
        </article>
      </section>

      <section className="featured-section" id="featured-products">
        <div className="section-heading">
          <div>
            <span className="section-heading__eyebrow">Featured Products</span>
            <h2 className="section-heading__title">
              Signature pieces for your next standout look
            </h2>
          </div>
          <p className="section-heading__text">
            Curated fashion picks from our newest arrivals, crafted to blend
            comfort, luxury, and trend-forward design.
          </p>
        </div>

        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>

        {!featuredProducts.length && (
          <div className="empty-products">
            <h3>No products yet</h3>
            <p>
              Add products from the backend and they will appear beautifully
              here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
