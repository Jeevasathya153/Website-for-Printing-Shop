import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";

// Services with 10 products each with online images
const services = [
  {
    id: "invitation",
    title: "Invitation Printing",
    products: [
      { id: 1, name: "Elegant Wedding Card", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400", price: 299, description: "Beautiful wedding invitation cards" },
      { id: 2, name: "Royal Wedding Invite", image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400", price: 349, description: "Premium royal themed wedding cards" },
      { id: 3, name: "Floral Wedding Card", image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400", price: 279, description: "Delicate floral design wedding invites" },
      { id: 4, name: "Birthday Party Invite", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400", price: 149, description: "Fun birthday party invitations" },
      { id: 5, name: "Kids Birthday Card", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400", price: 129, description: "Colorful kids birthday invites" },
      { id: 6, name: "Anniversary Card", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400", price: 199, description: "Romantic anniversary cards" },
      { id: 7, name: "Golden Anniversary", image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400", price: 249, description: "Premium golden anniversary cards" },
      { id: 8, name: "Festival Invitation", image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400", price: 179, description: "Traditional festival invites" },
      { id: 9, name: "Diwali Card", image: "https://images.unsplash.com/photo-1605811625530-d3a0c0e1e8f4?w=400", price: 159, description: "Beautiful Diwali celebration cards" },
      { id: 10, name: "Christmas Invite", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400", price: 169, description: "Festive Christmas invitations" },
    ],
  },
  {
    id: "cards",
    title: "Cards Printing",
    products: [
      { id: 11, name: "Premium Business Card", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400", price: 499, description: "Professional business cards" },
      { id: 12, name: "Modern Business Card", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400", price: 449, description: "Sleek modern design business cards" },
      { id: 13, name: "Corporate Card", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", price: 399, description: "Corporate style business cards" },
      { id: 14, name: "Greeting Card Set", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400", price: 199, description: "Beautiful greeting card collection" },
      { id: 15, name: "Thank You Cards", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400", price: 149, description: "Elegant thank you cards" },
      { id: 16, name: "Visiting Card Gold", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400", price: 549, description: "Premium gold foil visiting cards" },
      { id: 17, name: "Visiting Card Classic", image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400", price: 349, description: "Classic design visiting cards" },
      { id: 18, name: "ID Card Standard", image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400", price: 99, description: "Durable ID cards" },
      { id: 19, name: "ID Card Premium", image: "https://images.unsplash.com/photo-1586281380614-bb1f0f1e4f3f?w=400", price: 149, description: "Premium quality ID cards" },
      { id: 20, name: "Gift Cards", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400", price: 179, description: "Custom gift cards" },
    ],
  },
  {
    id: "frames",
    title: "Photo Frames",
    products: [
      { id: 21, name: "Classic Wooden Frame", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400", price: 799, description: "Elegant wooden photo frame" },
      { id: 22, name: "Rustic Wood Frame", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400", price: 699, description: "Rustic style wooden frame" },
      { id: 23, name: "Modern Acrylic Frame", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400", price: 899, description: "Sleek acrylic photo frame" },
      { id: 24, name: "Crystal Clear Frame", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", price: 949, description: "Crystal clear acrylic frame" },
      { id: 25, name: "Collage Frame 4x6", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400", price: 1299, description: "Multi-photo collage frame" },
      { id: 26, name: "Family Collage Frame", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400", price: 1499, description: "Large family collage frame" },
      { id: 27, name: "Heart Shaped Frame", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", price: 599, description: "Romantic heart shaped frame" },
      { id: 28, name: "Round Custom Frame", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400", price: 649, description: "Unique round photo frame" },
      { id: 29, name: "Vintage Gold Frame", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400", price: 1099, description: "Vintage gold finish frame" },
      { id: 30, name: "Modern Black Frame", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", price: 749, description: "Minimalist black frame" },
    ],
  },
  {
    id: "flex",
    title: "Flex Printing",
    products: [
      { id: 31, name: "Shop Signage Board", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", price: 2499, description: "Professional shop signage" },
      { id: 32, name: "LED Shop Sign", image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400", price: 3999, description: "Illuminated LED shop sign" },
      { id: 33, name: "Event Banner Large", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400", price: 1999, description: "Large event banner" },
      { id: 34, name: "Event Banner Medium", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400", price: 1499, description: "Medium size event banner" },
      { id: 35, name: "Hoarding Board 10x20", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", price: 4999, description: "Large hoarding board" },
      { id: 36, name: "Hoarding Board 8x12", image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400", price: 3499, description: "Medium hoarding board" },
      { id: 37, name: "Vehicle Branding Full", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400", price: 8999, description: "Full vehicle branding" },
      { id: 38, name: "Vehicle Branding Partial", image: "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=400", price: 4999, description: "Partial vehicle branding" },
      { id: 39, name: "Standee Banner", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400", price: 1299, description: "Portable standee banner" },
      { id: 40, name: "Rollup Banner", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400", price: 1599, description: "Retractable rollup banner" },
    ],
  },
];

export default function ServiceDetailsPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { showNotification } = useNotification();
  const service = services.find((s) => s.id === serviceId);

  if (!service) return <div className="p-8 text-center">Service not found.</div>;

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    showNotification(
      <div className="flex items-center">
        <span className="mr-2">🛒</span>
        <span>{product.name} added to cart!</span>
      </div>,
      'success'
    );
  };

  const handleCustomize = (product, e) => {
    e.stopPropagation();
    // Navigate to custom design page with product info
    navigate('/custom-design', { state: { product } });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold mb-8 text-indigo-700">{service.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {service.products.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <img
              src={prod.image}
              alt={prod.name}
              className="w-full h-48 object-cover"
              onError={(e) => (e.target.src = "https://via.placeholder.com/400")}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{prod.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{prod.description}</p>
              <div className="mb-3">
                <span className="text-2xl font-bold text-indigo-600">₹{prod.price}</span>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => handleCustomize(prod, e)}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Customize
                </button>
                <button
                  onClick={(e) => handleAddToCart(prod, e)}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
