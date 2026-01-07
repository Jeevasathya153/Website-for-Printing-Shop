import React from "react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Wedding Client",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "The wedding invitations from SRI SENTHIL PRINTING were absolutely stunning! They paid attention to every detail and delivered exactly what we envisioned. All our guests complimented the beautiful design.",
  },
  {
    name: "Priya Anand",
    role: "Business Owner",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "We've been getting all our business cards and shop signage from SRI SENTHIL for years. Their quality is consistently excellent, and they always deliver on time. Highly recommended for professional printing needs.",
  },
  {
    name: "Arun Balaji",
    role: "Event Organizer",
    img: "https://randomuser.me/api/portraits/men/46.jpg",
    text: "For our annual college festival, we needed large flex banners and custom invitations. SRI SENTHIL PRINTING delivered beyond our expectations with vibrant colors and durable materials. Will definitely work with them again!",
  },
];

const TestimonialsSection = () => (
  <div className="py-12 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:text-center">
        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Testimonials</h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          What Our Customers Say
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        {testimonials.map((t, idx) => (
          <div key={t.name} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center">
              <img className="h-10 w-10 rounded-full" src={t.img} alt={t.name} />
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 italic">"{t.text}"</p>
            </div>
            <div className="mt-4 flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 mr-1">★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TestimonialsSection;