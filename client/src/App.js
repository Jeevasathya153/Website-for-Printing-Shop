import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import Notification from "./components/common/Notification";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CustomDesignPage from "./pages/CustomDesignPage_NEW";
import CartPage from "./pages/CartPage_COMPLETE";
import CheckoutPage from "./pages/CheckoutPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import ContactPage from "./pages/ContactPage";
import OrderSuccess from "./pages/OrderSuccess";
import ProductVariantsPage from "./pages/ProductVariantsPage";

function AppContent() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/product-variants/:productId" element={<ProductVariantsPage />} />
        <Route path="/custom-design" element={<CustomDesignPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/service/:serviceId" element={<ServiceDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <AppContent />
            <Notification />
          </div>
        </CartProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;