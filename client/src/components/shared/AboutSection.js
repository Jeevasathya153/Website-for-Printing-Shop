import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import shopImage from "../../assets/images/shop.jpg";

const AboutSection = () => (
  <div id="about" className="py-12 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:text-center">
        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">About Us</h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Your Trusted Printing Partner in Udumelpet
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 items-center">
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <LazyLoadImage
              src={shopImage}
              alt="Our printing shop"
              className="w-full h-full object-cover aspect-[4/3]"
              effect="opacity"
              width="100%"
              height="100%"
              placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3' fill='%23e5e7eb'%3E%3Crect width='4' height='3'/%3E%3C/svg%3E"
            />
            <div className="absolute inset-0 bg-indigo-600 opacity-25"></div>
          </div>
        </div>
        <div className="prose prose-indigo text-gray-500 lg:max-w-none">
          <p>
            Established in 2010, SRI SENTHIL PRINTING SHOP has been serving the Udumelpet community with top-quality printing services. We take pride in our attention to detail and commitment to customer satisfaction.
          </p>
          <p>
            Our team of skilled professionals uses state-of-the-art printing technology to deliver exceptional results for every project, big or small. We understand that every print job tells a story, and we're dedicated to making yours stand out.
          </p>
          <p>What sets us apart:</p>
          <ul>
            <li>Premium quality materials and printing techniques</li>
            <li>Fast turnaround times without compromising quality</li>
            <li>Custom solutions tailored to your specific needs</li>
            <li>Competitive pricing with no hidden costs</li>
            <li>Personalized customer service</li>
          </ul>
          <p>
            Whether you need a single invitation card or large-scale flex printing for your business, we've got you covered with our comprehensive range of services.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default AboutSection;