import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const imageContext = require.context("../assets/images", false, /^(.*\.(?:png|jpe?g))$/i);
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

// Services with 10 products each with online images
const services = [
  {
    id: "invitation",
    title: "Invitation Printing",
    products: [
      { id: 1, name: "Elegant Wedding Card", image: withLocalImage("Elegant Wedding Card", "https://images.pexels.com/photos/2072181/pexels-photo-2072181.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 299, description: "Beautiful wedding invitation cards" },
      { id: 2, name: "Royal Wedding Invite", image: withLocalImage("Royal Wedding Invite", "https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 349, description: "Premium royal themed wedding cards" },
      { id: 3, name: "Floral Wedding Card", image: withLocalImage("Floral Wedding Card", "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 279, description: "Delicate floral design wedding invites" },
      { id: 4, name: "Birthday Party Invite", image: withLocalImage("Birthday Party Invite", "https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 149, description: "Fun birthday party invitations" },
      { id: 5, name: "Kids Birthday Card", image: withLocalImage("Kids Birthday Card", "https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 129, description: "Colorful kids birthday invites" },
      { id: 6, name: "Anniversary Card", image: withLocalImage("Anniversary Card", "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 199, description: "Romantic anniversary cards" },
      { id: 7, name: "Golden Anniversary", image: withLocalImage("Golden Anniversary", "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 249, description: "Premium golden anniversary cards" },
      { id: 8, name: "Festival Invitation", image: withLocalImage("Festival Invitation", "https://images.pexels.com/photos/1303098/pexels-photo-1303098.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 179, description: "Traditional festival invites" },
      { id: 9, name: "Diwali Card", image: withLocalImage("Diwali Card", "https://images.pexels.com/photos/5765247/pexels-photo-5765247.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 159, description: "Beautiful Diwali celebration cards" },
      { id: 10, name: "Christmas Invite", image: withLocalImage("Christmas Invite", "https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 169, description: "Festive Christmas invitations" },
    ],
  },
  {
    id: "cards",
    title: "Cards Printing",
    products: [
      { id: 11, name: "Premium Business Card", image: withLocalImage("Premium Business Card", "https://images.pexels.com/photos/6177607/pexels-photo-6177607.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 499, description: "Professional business cards" },
      { id: 12, name: "Modern Business Card", image: withLocalImage("Modern Business Card", "https://images.pexels.com/photos/4467687/pexels-photo-4467687.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 449, description: "Sleek modern design business cards" },
      { id: 13, name: "Corporate Card", image: withLocalImage("Corporate Card", "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 399, description: "Corporate style business cards" },
      { id: 14, name: "Greeting Card Set", image: withLocalImage("Greeting Card Set", "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 199, description: "Beautiful greeting card collection" },
      { id: 15, name: "Thank You Cards", image: withLocalImage("Thank You Cards", "https://images.pexels.com/photos/6045083/pexels-photo-6045083.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 149, description: "Elegant thank you cards" },
      { id: 16, name: "Visiting Card Gold", image: withLocalImage("Visiting Card Gold", "https://images.pexels.com/photos/6177639/pexels-photo-6177639.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 549, description: "Premium gold foil visiting cards" },
      { id: 17, name: "Visiting Card Classic", image: withLocalImage("Visiting Card Classic", "https://images.pexels.com/photos/4467735/pexels-photo-4467735.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 349, description: "Classic design visiting cards" },
      { id: 18, name: "ID Card Standard", image: withLocalImage("ID Card Standard", "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 99, description: "Durable ID cards" },
      { id: 19, name: "ID Card Premium", image: withLocalImage("ID Card Premium", "https://images.pexels.com/photos/4386339/pexels-photo-4386339.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 149, description: "Premium quality ID cards" },
      { id: 20, name: "Gift Cards", image: withLocalImage("Gift Cards", "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 179, description: "Custom gift cards" },
    ],
  },
  {
    id: "frames",
    title: "Photo Frames",
    products: [
      { id: 21, name: "Classic Wooden Frame", image: withLocalImage("Classic Wooden Frame", "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 799, description: "Elegant wooden photo frame" },
      { id: 22, name: "Rustic Wood Frame", image: withLocalImage("Rustic Wood Frame", "https://images.pexels.com/photos/1697218/pexels-photo-1697218.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 699, description: "Rustic style wooden frame" },
      { id: 23, name: "Modern Acrylic Frame", image: withLocalImage("Modern Acrylic Frame", "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 899, description: "Sleek acrylic photo frame" },
      { id: 24, name: "Crystal Clear Frame", image: withLocalImage("Crystal Clear Frame", "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 949, description: "Crystal clear acrylic frame" },
      { id: 25, name: "Collage Frame 4x6", image: withLocalImage("Collage Frame 4x6", "https://images.pexels.com/photos/1054713/pexels-photo-1054713.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1299, description: "Multi-photo collage frame" },
      { id: 26, name: "Family Collage Frame", image: withLocalImage("Family Collage Frame", "https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1499, description: "Large family collage frame" },
      { id: 27, name: "Heart Shaped Frame", image: withLocalImage("Heart Shaped Frame", "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 599, description: "Romantic heart shaped frame" },
      { id: 28, name: "Round Custom Frame", image: withLocalImage("Round Custom Frame", "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 649, description: "Unique round photo frame" },
      { id: 29, name: "Vintage Gold Frame", image: withLocalImage("Vintage Gold Frame", "https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1099, description: "Vintage gold finish frame" },
      { id: 30, name: "Modern Black Frame", image: withLocalImage("Modern Black Frame", "https://images.pexels.com/photos/2002719/pexels-photo-2002719.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 749, description: "Minimalist black frame" },
    ],
  },
  {
    id: "flex",
    title: "Flex Printing",
    products: [
      { id: 31, name: "Shop Signage Board", image: withLocalImage("Shop Signage Board", "https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 2499, description: "Professional shop signage" },
      { id: 32, name: "LED Shop Sign", image: withLocalImage("LED Shop Sign", "https://images.pexels.com/photos/942317/pexels-photo-942317.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 3999, description: "Illuminated LED shop sign" },
      { id: 33, name: "Event Banner Large", image: withLocalImage("Event Banner Large", "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1999, description: "Large event banner" },
      { id: 34, name: "Event Banner Medium", image: withLocalImage("Event Banner Medium", "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1499, description: "Medium size event banner" },
      { id: 35, name: "Hoarding Board 10x20", image: withLocalImage("Hoarding Board 10x20", "https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 4999, description: "Large hoarding board" },
      { id: 36, name: "Hoarding Board 8x12", image: withLocalImage("Hoarding Board 8x12", "https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 3499, description: "Medium hoarding board" },
      { id: 37, name: "Vehicle Branding Full", image: withLocalImage("Vehicle Branding Full", "https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 8999, description: "Full vehicle branding" },
      { id: 38, name: "Vehicle Branding Partial", image: withLocalImage("Vehicle Branding Partial", "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 4999, description: "Partial vehicle branding" },
      { id: 39, name: "Standee Banner", image: withLocalImage("Standee Banner", "https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1299, description: "Portable standee banner" },
      { id: 40, name: "Rollup Banner", image: withLocalImage("Rollup Banner", "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=400"), price: 1599, description: "Retractable rollup banner" },
    ],
  },
];

export default function ServiceDetailsPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = services.find((s) => s.id === serviceId);

  if (!service) return <div className="p-8 text-center">Service not found.</div>;

  const handleViewVariants = (productId) => {
    navigate(`/product-variants/${productId}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold mb-8 text-indigo-700">{service.title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {service.products.map((prod) => (
          <div
            key={prod.id}
            onClick={() => handleViewVariants(prod.id)}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={prod.image}
                alt={prod.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x400/e2e8f0/475569?text=Product";
                }}
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 via-indigo-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                <span className="text-white font-medium text-sm flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Designs
                </span>
              </div>
            </div>
            <div className="p-4 text-center">
              <h3 className="text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {prod.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
