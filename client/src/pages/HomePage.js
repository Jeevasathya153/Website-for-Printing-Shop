import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../components/shared/HeroSection";
import ServicesSection from "../components/shared/ServicesSection_NEW";
import AboutSection from "../components/shared/AboutSection";
import TestimonialsSection from "../components/shared/TestimonialsSection";
import ContactSection from "../components/shared/ContactSection";
import MapSection from "../components/shared/MapSection";

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <HeroSection />
      <div id="services"><ServicesSection /></div>
      <div id="about"><AboutSection /></div>
      <TestimonialsSection />
      <div id="contact"><ContactSection /></div>
      <MapSection />
    </>
  );
};

export default HomePage;