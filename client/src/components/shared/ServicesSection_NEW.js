import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const imageContext = require.context("../../assets/images", false, /^(.*\.(?:png|jpe?g))$/i);
const localImages = imageContext.keys().reduce((acc, key) => {
  const fileName = key.replace(/^\.\//, "");
  acc[fileName] = imageContext(key);
  return acc;
}, {});

const resolveLocalImage = (name) => {
  const extensions = [".png", ".jpg", ".jpeg"];
  for (const ext of extensions) {
    const fileName = `${name}${ext}`;
    if (localImages[fileName]) {
      return localImages[fileName];
    }
  }
  return null;
};

const withLocalImage = (name, fallback) => resolveLocalImage(name) || fallback;

const services = [
  {
    id: "invitation",
    title: "Invitation Printing",
    desc: "Elegant and customized invitations for weddings, birthdays, and all special occasions.",
    products: [
      { id: 1, name: "Elegant Wedding Card", image: withLocalImage("Elegant Wedding Card", "https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 299 },
      { id: 2, name: "Royal Wedding Invite", image: withLocalImage("Royal Wedding Invite", "https://images.pexels.com/photos/2253842/pexels-photo-2253842.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 349 },
      { id: 3, name: "Floral Wedding Card", image: withLocalImage("Floral Wedding Card", "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 279 },
      { id: 4, name: "Birthday Party Invite", image: withLocalImage("Birthday Party Invite", "https://images.pexels.com/photos/1857216/pexels-photo-1857216.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 149 },
      { id: 5, name: "Kids Birthday Card", image: withLocalImage("Kids Birthday Card", "https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 129 },
      { id: 6, name: "Anniversary Card", image: withLocalImage("Anniversary Card", "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 199 },
      { id: 7, name: "Golden Anniversary", image: withLocalImage("Golden Anniversary", "https://images.pexels.com/photos/6479600/pexels-photo-6479600.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 249 },
      { id: 8, name: "Festival Invitation", image: withLocalImage("Festival Invitation", "https://images.pexels.com/photos/5765247/pexels-photo-5765247.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 179 },
      { id: 9, name: "Diwali Card", image: withLocalImage("Diwali Card", "https://images.pexels.com/photos/5713210/pexels-photo-5713210.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 159 },
      { id: 10, name: "Christmas Invite", image: withLocalImage("Christmas Invite", "https://images.pexels.com/photos/5765244/pexels-photo-5765244.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 169 },
    ],
  },
  {
    id: "cards",
    title: "Cards Printing",
    desc: "Professional and creative cards for business, personal greetings, and special occasions.",
    products: [
      { id: 11, name: "Premium Business Card", image: withLocalImage("Premium Business Card", "https://images.pexels.com/photos/6177607/pexels-photo-6177607.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 499 },
      { id: 12, name: "Modern Business Card", image: withLocalImage("Modern Business Card", "https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 449 },
      { id: 13, name: "Corporate Card", image: withLocalImage("Corporate Card", "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 399 },
      { id: 14, name: "Greeting Card Set", image: withLocalImage("Greeting Card Set", "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 199 },
      { id: 15, name: "Thank You Cards", image: withLocalImage("Thank You Cards", "https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 149 },
      { id: 16, name: "Visiting Card Gold", image: withLocalImage("Visiting Card Gold", "https://images.pexels.com/photos/6177639/pexels-photo-6177639.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 549 },
      { id: 17, name: "Visiting Card Classic", image: withLocalImage("Visiting Card Classic", "https://images.pexels.com/photos/4467735/pexels-photo-4467735.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 349 },
      { id: 18, name: "ID Card Standard", image: withLocalImage("ID Card Standard", "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 99 },
      { id: 19, name: "ID Card Premium", image: withLocalImage("ID Card Premium", "https://images.pexels.com/photos/7014411/pexels-photo-7014411.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 149 },
      { id: 20, name: "Gift Cards", image: withLocalImage("Gift Cards", "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 179 },
    ],
  },
  {
    id: "frames",
    title: "Photo Frames",
    desc: "Beautifully crafted frames to preserve your precious memories in style.",
    products: [
      { id: 21, name: "Classic Wooden Frame", image: withLocalImage("Classic Wooden Frame", "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 799 },
      { id: 22, name: "Rustic Wood Frame", image: withLocalImage("Rustic Wood Frame", "https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 699 },
      { id: 23, name: "Modern Acrylic Frame", image: withLocalImage("Modern Acrylic Frame", "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 899 },
      { id: 24, name: "Crystal Clear Frame", image: withLocalImage("Crystal Clear Frame", "https://images.pexels.com/photos/2746187/pexels-photo-2746187.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 949 },
      { id: 25, name: "Collage Frame 4x6", image: withLocalImage("Collage Frame 4x6", "https://images.pexels.com/photos/1054713/pexels-photo-1054713.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1299 },
      { id: 26, name: "Family Collage Frame", image: withLocalImage("Family Collage Frame", "https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1499 },
      { id: 27, name: "Heart Shaped Frame", image: withLocalImage("Heart Shaped Frame", "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 599 },
      { id: 28, name: "Round Custom Frame", image: withLocalImage("Round Custom Frame", "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 649 },
      { id: 29, name: "Vintage Gold Frame", image: withLocalImage("Vintage Gold Frame", "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1099 },
      { id: 30, name: "Modern Black Frame", image: withLocalImage("Modern Black Frame", "https://images.pexels.com/photos/2002719/pexels-photo-2002719.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 749 },
    ],
  },
  {
    id: "flex",
    title: "Flex Printing",
    desc: "High-quality flex banners and signage for advertising and promotional needs.",
    products: [
      { id: 31, name: "Shop Signage Board", image: withLocalImage("Shop Signage Board", "https://images.pexels.com/photos/2529179/pexels-photo-2529179.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 2499 },
      { id: 32, name: "LED Shop Sign", image: withLocalImage("LED Shop Sign", "https://images.pexels.com/photos/942317/pexels-photo-942317.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 3999 },
      { id: 33, name: "Event Banner Large", image: withLocalImage("Event Banner Large", "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1999 },
      { id: 34, name: "Event Banner Medium", image: withLocalImage("Event Banner Medium", "https://images.pexels.com/photos/7648047/pexels-photo-7648047.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1499 },
      { id: 35, name: "Hoarding Board 10x20", image: withLocalImage("Hoarding Board 10x20", "https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 4999 },
      { id: 36, name: "Hoarding Board 8x12", image: withLocalImage("Hoarding Board 8x12", "https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 3499 },
      { id: 37, name: "Vehicle Branding Full", image: withLocalImage("Vehicle Branding Full", "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 8999 },
      { id: 38, name: "Vehicle Branding Partial", image: withLocalImage("Vehicle Branding Partial", "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 4999 },
      { id: 39, name: "Standee Banner", image: withLocalImage("Standee Banner", "https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1299 },
      { id: 40, name: "Rollup Banner", image: withLocalImage("Rollup Banner", "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1599 },
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
