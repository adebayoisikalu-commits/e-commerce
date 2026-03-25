import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from "./pages/Cart";
import Login from './pages/Login';
import Signup from './pages/Signup';

const getStoredUser = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('authUser');

  if (!token || !user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    return null;
  }
};

const ProtectedRoute = ({ children }) => {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const user = getStoredUser();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppLayout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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