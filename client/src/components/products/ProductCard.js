import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

const ProductCard = ({ product }) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
    <div className="relative w-full h-32 overflow-hidden bg-gray-100">
      <LazyLoadImage
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
        effect="opacity"
        width="100%"
        height="128"
        placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
      />
    </div>
    <h3 className="mt-2 font-bold">{product.name}</h3>
    <p className="text-gray-600">{product.description}</p>
    <div className="mt-2 font-semibold text-indigo-600">₹{product.price}</div>
  </div>
);
export default ProductCard;