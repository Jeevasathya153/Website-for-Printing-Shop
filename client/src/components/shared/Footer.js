import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-gray-800">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Services</h3>
          <div className="mt-4 space-y-4">
            <a href="#" className="text-base text-gray-400 hover:text-white">Invitation Printing</a>
            <a href="#" className="text-base text-gray-400 hover:text-white block">Cards Printing</a>
            <a href="#" className="text-base text-gray-400 hover:text-white block">Photo Frames</a>
            <a href="#" className="text-base text-gray-400 hover:text-white block">Flex Printing</a>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
          <div className="mt-4 space-y-4">
            <a href="#about" className="text-base text-gray-400 hover:text-white">About Us</a>
            <a href="#" className="text-base text-gray-400 hover:text-white block">Our Team</a>
            <a href="#" className="text-base text-gray-400 hover:text-white block">Careers</a>
            <a href="#" className="text-base text-gray-400 hover:text-white block">Blog</a>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
          <div className="mt-4 space-y-4">
            <a href="#" className="text-base text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-base text-gray-400 hover:text-white block">Terms of Service</a>
            <a href="#" className="text-base text-gray-400 hover:text-white block">Shipping Policy</a>
            <a href="#" className="text-base text-gray-400 hover:text-white block">Returns Policy</a>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Subscribe</h3>
          <p className="mt-4 text-base text-gray-400">Get the latest updates on our services and offers.</p>
          <form className="mt-4 sm:flex sm:max-w-md">
            <input type="email" name="email" required className="appearance-none min-w-0 w-full bg-white border border-transparent rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white focus:placeholder-gray-400" placeholder="Enter your email" />
            <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button type="submit" className="w-full bg-indigo-500 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
        <div className="flex space-x-6 md:order-2">
          <a href="https://www.instagram.com/sri_senthil_printers/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <span className="sr-only">Facebook</span>
            <FaFacebook size={24} />
          </a>
          <a href="https://www.instagram.com/sri_senthil_printers/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <span className="sr-only">Instagram</span>
            <FaInstagram size={24} />
          </a>
          <a href="https://www.youtube.com/@srisenthildigitalcolorprin4529" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <span className="sr-only">Twitter</span>
            <FaTwitter size={24} />
          </a>
          <a href="https://www.youtube.com/@srisenthildigitalcolorprin4529" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <span className="sr-only">YouTube</span>
            <FaYoutube size={24} />
          </a>
        </div>
        <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
          &copy; 2025 SRI SENTHIL PRINTING SHOP. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;