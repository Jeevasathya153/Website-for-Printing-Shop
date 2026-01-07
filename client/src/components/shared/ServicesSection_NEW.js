import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const services = [
  {
    id: "invitation",
    title: "Invitation Printing",
    desc: "Elegant and customized invitations for weddings, birthdays, and all special occasions.",
    products: [
      { id: 1, name: "Elegant Wedding Card", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400", price: 299 },
      { id: 2, name: "Royal Wedding Invite", image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400", price: 349 },
      { id: 3, name: "Floral Wedding Card", image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400", price: 279 },
      { id: 4, name: "Birthday Party Invite", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400", price: 149 },
      { id: 5, name: "Kids Birthday Card", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400", price: 129 },
      { id: 6, name: "Anniversary Card", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400", price: 199 },
      { id: 7, name: "Golden Anniversary", image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400", price: 249 },
      { id: 8, name: "Festival Invitation", image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400", price: 179 },
      { id: 9, name: "Diwali Card", image: "https://images.unsplash.com/photo-1605811625530-d3a0c0e1e8f4?w=400", price: 159 },
      { id: 10, name: "Christmas Invite", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400", price: 169 },
    ],
  },
  {
    id: "cards",
    title: "Cards Printing",
    desc: "Professional and creative cards for business, personal greetings, and special occasions.",
    products: [
      { id: 11, name: "Premium Business Card", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400", price: 499 },
      { id: 12, name: "Modern Business Card", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400", price: 449 },
      { id: 13, name: "Corporate Card", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", price: 399 },
      { id: 14, name: "Greeting Card Set", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400", price: 199 },
      { id: 15, name: "Thank You Cards", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400", price: 149 },
      { id: 16, name: "Visiting Card Gold", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400", price: 549 },
      { id: 17, name: "Visiting Card Classic", image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400", price: 349 },
      { id: 18, name: "ID Card Standard", image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400", price: 99 },
      { id: 19, name: "ID Card Premium", image: "https://images.unsplash.com/photo-1586281380614-bb1f0f1e4f3f?w=400", price: 149 },
      { id: 20, name: "Gift Cards", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400", price: 179 },
    ],
  },
  {
    id: "frames",
    title: "Photo Frames",
    desc: "Beautifully crafted frames to preserve your precious memories in style.",
    products: [
      { id: 21, name: "Classic Wooden Frame", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400", price: 799 },
      { id: 22, name: "Rustic Wood Frame", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400", price: 699 },
      { id: 23, name: "Modern Acrylic Frame", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400", price: 899 },
      { id: 24, name: "Crystal Clear Frame", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", price: 949 },
      { id: 25, name: "Collage Frame 4x6", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400", price: 1299 },
      { id: 26, name: "Family Collage Frame", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400", price: 1499 },
      { id: 27, name: "Heart Shaped Frame", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", price: 599 },
      { id: 28, name: "Round Custom Frame", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400", price: 649 },
      { id: 29, name: "Vintage Gold Frame", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400", price: 1099 },
      { id: 30, name: "Modern Black Frame", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", price: 749 },
    ],
  },
  {
    id: "flex",
    title: "Flex Printing",
    desc: "High-quality flex banners and signage for advertising and promotional needs.",
    products: [
      { id: 31, name: "Shop Signage Board", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", price: 2499 },
      { id: 32, name: "LED Shop Sign", image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400", price: 3999 },
      { id: 33, name: "Event Banner Large", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400", price: 1999 },
      { id: 34, name: "Event Banner Medium", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400", price: 1499 },
      { id: 35, name: "Hoarding Board 10x20", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", price: 4999 },
      { id: 36, name: "Hoarding Board 8x12", image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400", price: 3499 },
      { id: 37, name: "Vehicle Branding Full", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400", price: 8999 },
      { id: 38, name: "Vehicle Branding Partial", image: "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=400", price: 4999 },
      { id: 39, name: "Standee Banner", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400", price: 1299 },
      { id: 40, name: "Rollup Banner", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400", price: 1599 },
    ],
  },
];

const ServicesSection = () => (
  <div className="py-12 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:text-center">
        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Services</h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Our Premium Printing Solutions
        </p>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          We offer a wide range of printing services to meet all your personal and business needs.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ scale: 1.04, boxShadow: "0 10px 25px rgba(99,102,241,0.15)" }}
            className="h-full flex"
          >
            <div className="flex flex-col bg-gray-50 rounded-lg px-6 pb-8 pt-6 w-full shadow service-card transition-all duration-300">
              <div>
                <h3 className="text-lg font-medium text-gray-900 text-center">{service.title}</h3>
                <p className="mt-3 text-base text-gray-500 text-center">{service.desc}</p>
                <div className="mt-4 mb-12">
                  <h4 className="text-sm font-medium text-gray-900">Products Offered:</h4>
                  <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {service.products.map((prod) => (
                      <li key={prod.id} className="text-sm text-gray-600">
                        {prod.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link
                to={`/service/${service.id}`}
                className="mt-auto inline-block w-full text-center font-semibold text-white py-3 rounded-xl shadow-lg transition
                  bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600
                  hover:from-indigo-600 hover:via-indigo-500 hover:to-purple-600
                  hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                style={{
                  letterSpacing: "1px",
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 16px 0 rgba(99,102,241,0.15)",
                }}
              >
                ORDER
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default ServicesSection;
