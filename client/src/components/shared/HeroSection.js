import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-white py-20">
    {/* Decorative SVG Shape Divider */}
    <div className="absolute inset-x-0 bottom-0">
      <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#6366f1" fillOpacity="0.08" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z"></path>
      </svg>
    </div>

    <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
      {/* Optional: Illustration */}
      <img
        src="/images/printing-illustration.svg"
        alt="Printing Illustration"
        className="w-40 mb-6 animate-float"
        style={{ animation: "float 3s ease-in-out infinite" }}
        onError={e => (e.target.style.display = "none")}
      />

      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-indigo-700 mb-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Welcome to <span className="text-indigo-600">SRI SENTHIL DIGITAL PRINTINGS</span>
      </motion.h1>
      <motion.p
        className="text-lg sm:text-xl text-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Premium Printing Services in Udumelpet <br />
        <span className="text-indigo-500 font-semibold">Invitations, Cards, Flex, Frames &amp; More</span>
      </motion.p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
          <Link
            to="#services"
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-indigo-700 transition"
          >
            Explore Services
          </Link>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
          <Link
            to="#contact"
            className="bg-white text-indigo-700 border border-indigo-600 px-8 py-3 rounded-full font-semibold shadow hover:bg-indigo-50 transition"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </div>

    {/* Floating Animation Keyframes */}
    <style>
      {`
        @keyframes float {
          0% { transform: translateY(0px);}
          50% { transform: translateY(-16px);}
          100% { transform: translateY(0px);}
        }
      `}
    </style>
  </section>
);

export default HeroSection;