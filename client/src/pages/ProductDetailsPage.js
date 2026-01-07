import React, { useState } from "react";
import { useParams } from "react-router-dom";

// Create a tiny, blurred version of each image (base64 encoded, ~20x15px)
const placeholderImages = {
  1: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAPABQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AV8AAf//Z",
  2: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAPABQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AV8AAf//Z",
  // Add more placeholders as needed
};

// Updated product data with unique, high-quality images
const products = [
  { 
    id: 1, 
    name: "Wedding Invitation Cards", 
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Elegant and customized wedding invitations for your special day. Available in various designs and paper qualities.", 
    price: 25 
  },
  { 
    id: 2, 
    name: "Business Cards", 
    image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Premium quality business cards with various finishing options including matte, glossy, and spot UV.", 
    price: 15 
  },
  { 
    id: 3, 
    name: "Brochures & Flyers", 
    image: "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Eye-catching brochures and flyers for effective marketing and promotions.", 
    price: 20 
  },
  { 
    id: 4, 
    name: "Posters & Banners", 
    image: "https://images.unsplash.com/photo-1579547621706-1e9c79d5c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "High-quality large format printing for posters and banners, perfect for events and advertising.", 
    price: 18 
  },
  { 
    id: 5, 
    name: "ID Cards & Badges", 
    image: "https://images.unsplash.com/photo-1534665482403-909a383def80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Durable ID cards and badges with options for lamination and holographic security features.", 
    price: 10 
  },
  { 
    id: 6, 
    name: "Letterheads & Envelopes", 
    image: "https://images.unsplash.com/photo-1592919508702-5e6ec02b7b0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Professional letterheads and envelopes to enhance your business correspondence.", 
    price: 12 
  },
  { 
    id: 7, 
    name: "Business Stationery", 
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Complete business stationery sets including notepads, memo pads, and more.", 
    price: 8 
  },
  { 
    id: 8, 
    name: "Custom Stickers & Labels", 
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Custom stickers and labels for product packaging, branding, and organization.", 
    price: 15 
  },
];

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const product = products.find((p) => p.id === parseInt(productId));
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-500">Product not found!</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex justify-center relative">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full max-w-sm rounded-lg shadow-lg object-cover h-64 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
              setImageLoaded(true);
            }}
            loading="lazy"
          />
          {!imageLoaded && (
            <div 
              className="absolute inset-0 bg-gray-200 animate-pulse"
              style={{
                backgroundImage: `url(${placeholderImages[product.id] || placeholderImages[1]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(10px)'
              }}
            />
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="text-indigo-600 font-bold text-xl mb-4">Price: ₹{product.price}</div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;