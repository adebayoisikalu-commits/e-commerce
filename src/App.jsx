// App.jsx
import React from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import ProductDetails from "./pages/ProductDetails";

// Get user from localStorage
const getStoredUser = () => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("authUser");

  if (!token || !user) return null;

  try {
    return JSON.parse(user);
  } catch (error) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    return null;
  }
};

// Protected route for logged-in users
const ProtectedRoute = ({ children }) => {
  const user = getStoredUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin-only route by email
const AdminRoute = ({ children }) => {
  const user = getStoredUser();
  const adminEmail = "adebayoisikalu@gmail.com"; // <-- Replace with your email

  if (!user || user.email !== adminEmail) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public-only route for login/signup
const PublicOnlyRoute = ({ children }) => {
  const user = getStoredUser();
  if (user) return <Navigate to="/" replace />;
  return children;
};

// Layout with Navbar
const AppLayout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <Signup />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          {/* Wildcard route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}