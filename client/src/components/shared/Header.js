import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useContext(CartContext);
  const [activeSection, setActiveSection] = useState('');

  // Update active section based on hash
  useEffect(() => {
    const handleHashChange = () => {
      setActiveSection(window.location.hash.substring(1));
    };
    
    // Set initial active section
    if (window.location.hash) {
      setActiveSection(window.location.hash.substring(1));
    } else if (location.pathname === '/') {
      setActiveSection('home');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [location.pathname]);

  // Handle section scrolling and navigation
  const handleNavClick = (section, e) => {
    e.preventDefault();
    setActiveSection(section);
    
    if (location.pathname !== '/') {
      navigate(`/#${section}`);
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      window.history.pushState(null, '', `#${section}`);
    }
  };

  // Check if a nav item is active
  const isActive = (section) => {
    // For cart, check if we're on the cart page
    if (section === 'cart') {
      return location.pathname === '/cart';
    }
    
    // For home, only active when no hash is present and we're on the home page
    if (section === 'home') {
      return location.pathname === '/' && !window.location.hash;
    }
    
    // For other sections, check the hash
    return activeSection === section;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="ml-2 text-xl font-bold text-gray-900">SRI SENTHIL DIGITAL PRINTINGS</span>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <motion.div whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.04 }}>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('');
                  navigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-2 text-sm font-medium ${isActive('home') ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
              >
                Home
              </a>
            </motion.div>
            <motion.div whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.04 }}>
              <a 
                href="#services" 
                onClick={(e) => handleNavClick('services', e)}
                className={`px-3 py-2 text-sm font-medium ${isActive('services') ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
              >
                Services
              </a>
            </motion.div>
            <motion.div whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.04 }}>
              <a 
                href="#about" 
                onClick={(e) => handleNavClick('about', e)}
                className={`px-3 py-2 text-sm font-medium ${isActive('about') ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
              >
                About
              </a>
            </motion.div>
            <motion.div whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.04 }}>
              <a 
                href="#contact" 
                onClick={(e) => handleNavClick('contact', e)}
                className={`px-3 py-2 text-sm font-medium ${isActive('contact') ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
              >
                Contact
              </a>
            </motion.div>
            <motion.div whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.04 }}>
              <NavLink 
                to="/cart" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium relative ${
                    isActive 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`
                }
              >
                Cart
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </NavLink>
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
}
