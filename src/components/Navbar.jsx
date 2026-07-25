
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('authUser');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { cart } = useContext(CartContext);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login', { replace: true });
  };

  const toggleMenu = () => setMenuOpen((current) => !current);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          Vogue
        </Link>

        <button
          type="button"
          className={`navbar__menu-toggle ${menuOpen ? 'is-open' : ''}`}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>

        <nav className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}>
          <Link to="/cart" onClick={closeMenu}>Cart ({cart.length})</Link>
          <Link to="/orders" onClick={closeMenu}>Orders</Link>
          {user && user.email === "adebayoisikalu@gmail.com" && (
            <Link to="/admin" className="navbar__admin" onClick={closeMenu}>
              Admin
            </Link>
          )}
          {user && (
            <div className="navbar__user navbar__user-mobile">
              <span className="navbar__welcome">Hi, {user.name || 'Shopper'}</span>
              <button type="button" className="navbar__logout" onClick={() => { handleLogout(); closeMenu(); }}>
                Logout
              </button>
            </div>
          )}
        </nav>

        <div className="navbar__actions">
          {user && (
            <div className="navbar__user">
              <span className="navbar__welcome">Hi, {user.name || 'Shopper'}</span>
              <button type="button" className="navbar__logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;