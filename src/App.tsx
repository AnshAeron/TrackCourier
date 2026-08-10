import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton"; // 1. Added import

import Home from "./pages/Home";
import Tracking from "./pages/Tracking";

import Providers from "./admin/pages/Providers";
import Bookings from "./admin/pages/Bookings";
import Users from "./admin/pages/Users";
import Login from "./admin/pages/Login";

import AdminLayout from "./admin/layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";


function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

export default function App() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />

      {!isAdmin && <Header />}

      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/track" element={<Tracking />} />

          {/* Admin */}
          <Route
            path="/admin89104"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="bookings" replace />} />

            <Route
              path="bookings"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF"]}>
                  <Bookings />
                </RoleRoute>
              }
            />

            <Route
              path="providers"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <Providers />
                </RoleRoute>
              }
            />

            <Route
              path="users"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <Users />
                </RoleRoute>
              }
            />
          </Route>

          <Route path="/admin89104/login" element={<Login />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}

      {/* 2. WhatsApp Button added here (only renders on non-admin routes) */}
      {!isAdmin && (
        <WhatsAppButton
          phoneNumber="919216401935"
          message="Hello, I have an enquiry"
          buttonText="Chat Now"
          tooltipText="Chat with us"
        />
      )}
    </div>
  );
}