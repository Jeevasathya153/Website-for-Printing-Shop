import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { sendContactMessage } from "../../api/contactApi";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await sendContactMessage(formData);
      setPopupType("success");
      setPopupMessage(response.message || "Message sent successfully! We will get back to you soon.");
      setShowPopup(true);
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });

      setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    } catch (error) {
      setPopupType("error");
      setPopupMessage(error.message || "Failed to send message. Please try again.");
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact" className="py-12 bg-gray-50">
      {showPopup && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`rounded-lg shadow-lg p-4 max-w-md ${
            popupType === "success" 
              ? "bg-green-50 border-l-4 border-green-500" 
              : "bg-red-50 border-l-4 border-red-500"
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {popupType === "success" ? (
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${
                  popupType === "success" ? "text-green-800" : "text-red-800"
                }`}>
                  {popupMessage}
                </p>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="ml-3 flex-shrink-0"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Contact Us</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Get in Touch
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            We'd love to hear from you! Reach out for quotes or any printing inquiries.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Our Information</h3>
            <div className="mt-6 space-y-4">
              <div className="flex">
                <span className="text-indigo-600 mr-2">📍</span>
                <div className="ml-3 text-base text-gray-500">
                  <p>No 3, Nethran Complex, Dhali Road,</p>
                  <p>Advocate Nagrajan Street,</p>
                  <p>Udumelpet, Tamil Nadu 642126</p>
                </div>
              </div>
              <div className="flex">
                <span className="text-indigo-600 mr-2">📞</span>
                <div className="ml-3 text-base text-gray-500">
                  <p>+91 98765 43210</p>
                  <p>+91 87654 32109</p>
                </div>
              </div>
              <div className="flex">
                <span className="text-indigo-600 mr-2">✉️</span>
                <div className="ml-3 text-base text-gray-500">
                  <p>info@srisenthilprinting.com</p>
                  <p>orders@srisenthilprinting.com</p>
                </div>
              </div>
              <div className="flex">
                <span className="text-indigo-600 mr-2">⏰</span>
                <div className="ml-3 text-base text-gray-500">
                  <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
                  <p>Sunday: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900">Follow Us</h4>
  
              <div className="flex space-x-4 justify-center mt-4">
                <a href="https://www.instagram.com/sri_senthil_printers/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors"><FaFacebook size={24} /></a>
                <a href="https://www.instagram.com/sri_senthil_printers/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors"><FaInstagram size={24} /></a>
                <a href="https://www.youtube.com/@srisenthildigitalcolorprin4529" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors"><FaTwitter size={24} /></a>
                <a href="https://www.youtube.com/@srisenthildigitalcolorprin4529" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors"><FaYoutube size={24} /></a>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" placeholder="Enter your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" placeholder="Enter your email" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" placeholder="Enter your phone number" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Your Message</label>
                <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" placeholder="How can we help you?"></textarea>
              </div>
              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;