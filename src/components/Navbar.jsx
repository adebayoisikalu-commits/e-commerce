import React from 'react';
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('authUser');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { cart } = useContext(CartContext);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          ShopEase
        </Link>
<Link to="/cart">Cart ({cart.length})</Link>

    {/* Admin link only visible to admin */}
    {user && user.role === "admin" && (
      <Link to="/admin" className="navbar__admin">
        Admin
      </Link>
    )}
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