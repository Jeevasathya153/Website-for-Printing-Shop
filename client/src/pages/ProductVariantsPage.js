import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";

// Tamil Nadu themed product variants data
const productVariants = {
  // Invitation Printing - Wedding Cards
  1: {
    name: "Elegant Wedding Card",
    category: "Wedding Invitations",
    variants: [
      { id: "1-1", name: "Traditional Tamil Wedding Card", image: "https://images.pexels.com/photos/8060254/pexels-photo-8060254.jpeg?auto=compress&cs=tinysrgb&w=400", price: 299, description: "Classic Tamil Thirumana Pathrikai with temple motifs" },
      { id: "1-2", name: "South Indian Temple Design", image: "https://images.pexels.com/photos/350797/pexels-photo-350797.jpeg?auto=compress&cs=tinysrgb&w=400", price: 349, description: "Featuring Meenakshi Temple inspired artwork" },
      { id: "1-3", name: "Kolam Pattern Wedding Card", image: "https://images.pexels.com/photos/7098231/pexels-photo-7098231.jpeg?auto=compress&cs=tinysrgb&w=400", price: 279, description: "Beautiful kolam rangoli border design" },
      { id: "1-4", name: "Brass Lamp Theme Card", image: "https://images.pexels.com/photos/207962/pexels-photo-207962.jpeg?auto=compress&cs=tinysrgb&w=400", price: 329, description: "Traditional kuthuvilakku lamp design" },
      { id: "1-5", name: "Mango Motif Wedding Card", image: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400", price: 319, description: "Paisley mango design with gold foil" },
      { id: "1-6", name: "Banana Leaf Theme Card", image: "https://images.pexels.com/photos/86860/pexels-photo-86860.jpeg?auto=compress&cs=tinysrgb&w=400", price: 289, description: "Traditional vazhai ilai feast theme" },
    ]
  },
  2: {
    name: "Royal Wedding Invite",
    category: "Wedding Invitations",
    variants: [
      { id: "2-1", name: "Chettinad Palace Theme", image: "https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=400", price: 449, description: "Inspired by Chettinad architecture" },
      { id: "2-2", name: "Tanjore Art Wedding Card", image: "https://images.pexels.com/photos/826349/pexels-photo-826349.jpeg?auto=compress&cs=tinysrgb&w=400", price: 499, description: "Thanjavur painting style design" },
      { id: "2-3", name: "Royal Nayak Design", image: "https://images.pexels.com/photos/1876440/pexels-photo-1876440.jpeg?auto=compress&cs=tinysrgb&w=400", price: 399, description: "Madurai Nayak period inspired" },
      { id: "2-4", name: "Kanchipuram Silk Pattern", image: "https://images.pexels.com/photos/1451346/pexels-photo-1451346.jpeg?auto=compress&cs=tinysrgb&w=400", price: 429, description: "Traditional silk saree border motifs" },
      { id: "2-5", name: "Temple Gopuram Design", image: "https://images.pexels.com/photos/3560049/pexels-photo-3560049.jpeg?auto=compress&cs=tinysrgb&w=400", price: 379, description: "Dravidian temple tower artwork" },
    ]
  },
  3: {
    name: "Floral Wedding Card",
    category: "Wedding Invitations", 
    variants: [
      { id: "3-1", name: "Jasmine Malli Flower Theme", image: "https://images.pexels.com/photos/953460/pexels-photo-953460.jpeg?auto=compress&cs=tinysrgb&w=400", price: 279, description: "Traditional malli poo garland design" },
      { id: "3-2", name: "Rose Petals Design", image: "https://images.pexels.com/photos/984127/pexels-photo-984127.jpeg?auto=compress&cs=tinysrgb&w=400", price: 299, description: "Romantic rose theme with Tamil text" },
      { id: "3-3", name: "Lotus Thamarai Theme", image: "https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=400", price: 319, description: "Sacred lotus flower design" },
      { id: "3-4", name: "Marigold Samanthi Design", image: "https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=400", price: 259, description: "Festive marigold flower pattern" },
      { id: "3-5", name: "Mixed Flower Garland", image: "https://images.pexels.com/photos/247301/pexels-photo-247301.jpeg?auto=compress&cs=tinysrgb&w=400", price: 289, description: "Colorful poo malai design" },
    ]
  },
  4: {
    name: "Birthday Party Invite",
    category: "Birthday Invitations",
    variants: [
      { id: "4-1", name: "Kids Cartoon Theme", image: "https://images.pexels.com/photos/1857216/pexels-photo-1857216.jpeg?auto=compress&cs=tinysrgb&w=400", price: 149, description: "Colorful cartoon characters design" },
      { id: "4-2", name: "Princess Theme Card", image: "https://images.pexels.com/photos/1857216/pexels-photo-1857216.jpeg?auto=compress&cs=tinysrgb&w=400", price: 179, description: "Royal princess birthday theme" },
      { id: "4-3", name: "Superhero Theme Card", image: "https://images.pexels.com/photos/1857216/pexels-photo-1857216.jpeg?auto=compress&cs=tinysrgb&w=400", price: 169, description: "Action hero birthday invitation" },
      { id: "4-4", name: "Balloon Celebration Theme", image: "https://images.pexels.com/photos/1857216/pexels-photo-1857216.jpeg?auto=compress&cs=tinysrgb&w=400", price: 139, description: "Colorful balloons party design" },
      { id: "4-5", name: "Cake & Candles Theme", image: "https://images.pexels.com/photos/1857216/pexels-photo-1857216.jpeg?auto=compress&cs=tinysrgb&w=400", price: 159, description: "Birthday cake celebration design" },
    ]
  },
  5: {
    name: "Kids Birthday Card",
    category: "Birthday Invitations",
    variants: [
      { id: "5-1", name: "Ayush Homam Invitation", image: "https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=400", price: 129, description: "First birthday ayush homam card" },
      { id: "5-2", name: "Annaprasana Invitation", image: "https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=400", price: 149, description: "Rice ceremony invitation card" },
      { id: "5-3", name: "Cradle Ceremony Card", image: "https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=400", price: 139, description: "Thottil function invitation" },
      { id: "5-4", name: "Naming Ceremony Card", image: "https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=400", price: 119, description: "Namakarana invitation design" },
      { id: "5-5", name: "First Haircut Ceremony", image: "https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=400", price: 129, description: "Mottai function invitation" },
    ]
  },
  6: {
    name: "Anniversary Card",
    category: "Anniversary Invitations",
    variants: [
      { id: "6-1", name: "Silver Jubilee Card", image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400", price: 199, description: "25th anniversary celebration" },
      { id: "6-2", name: "Golden Jubilee Card", image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400", price: 249, description: "50th anniversary special design" },
      { id: "6-3", name: "Sashtiapthapoorthi Card", image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400", price: 279, description: "60th birthday celebration card" },
      { id: "6-4", name: "Sadabishekam Invitation", image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400", price: 299, description: "80th birthday celebration" },
      { id: "6-5", name: "Diamond Jubilee Card", image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400", price: 229, description: "60th anniversary premium design" },
    ]
  },
  7: {
    name: "Golden Anniversary",
    category: "Anniversary Invitations",
    variants: [
      { id: "7-1", name: "Traditional Gold Theme", image: "https://images.pexels.com/photos/6479600/pexels-photo-6479600.jpeg?auto=compress&cs=tinysrgb&w=400", price: 249, description: "Classic golden border design" },
      { id: "7-2", name: "Temple Wedding Anniversary", image: "https://images.pexels.com/photos/6479600/pexels-photo-6479600.jpeg?auto=compress&cs=tinysrgb&w=400", price: 279, description: "Temple blessing ceremony theme" },
      { id: "7-3", name: "Family Portrait Theme", image: "https://images.pexels.com/photos/6479600/pexels-photo-6479600.jpeg?auto=compress&cs=tinysrgb&w=400", price: 299, description: "Photo frame anniversary card" },
      { id: "7-4", name: "Pooja Theme Anniversary", image: "https://images.pexels.com/photos/6479600/pexels-photo-6479600.jpeg?auto=compress&cs=tinysrgb&w=400", price: 259, description: "Traditional pooja ceremony design" },
    ]
  },
  8: {
    name: "Festival Invitation",
    category: "Festival Cards",
    variants: [
      { id: "8-1", name: "Pongal Invitation Card", image: "https://images.pexels.com/photos/5765247/pexels-photo-5765247.jpeg?auto=compress&cs=tinysrgb&w=400", price: 179, description: "Thai Pongal celebration card" },
      { id: "8-2", name: "Tamil New Year Card", image: "https://images.pexels.com/photos/5765247/pexels-photo-5765247.jpeg?auto=compress&cs=tinysrgb&w=400", price: 169, description: "Puthandu wishes card" },
      { id: "8-3", name: "Vinayagar Chaturthi Card", image: "https://images.pexels.com/photos/5765247/pexels-photo-5765247.jpeg?auto=compress&cs=tinysrgb&w=400", price: 159, description: "Ganesha festival invitation" },
      { id: "8-4", name: "Navaratri Golu Card", image: "https://images.pexels.com/photos/5765247/pexels-photo-5765247.jpeg?auto=compress&cs=tinysrgb&w=400", price: 189, description: "Kolu invitation card" },
      { id: "8-5", name: "Karthigai Deepam Card", image: "https://images.pexels.com/photos/5765247/pexels-photo-5765247.jpeg?auto=compress&cs=tinysrgb&w=400", price: 149, description: "Festival of lights invitation" },
    ]
  },
  9: {
    name: "Diwali Card",
    category: "Festival Cards",
    variants: [
      { id: "9-1", name: "Deepavali Lamp Design", image: "https://images.pexels.com/photos/5713210/pexels-photo-5713210.jpeg?auto=compress&cs=tinysrgb&w=400", price: 159, description: "Traditional diya lamp theme" },
      { id: "9-2", name: "Lakshmi Pooja Card", image: "https://images.pexels.com/photos/5713210/pexels-photo-5713210.jpeg?auto=compress&cs=tinysrgb&w=400", price: 179, description: "Goddess Lakshmi blessing design" },
      { id: "9-3", name: "Fireworks Theme Card", image: "https://images.pexels.com/photos/5713210/pexels-photo-5713210.jpeg?auto=compress&cs=tinysrgb&w=400", price: 149, description: "Colorful crackers celebration" },
      { id: "9-4", name: "Rangoli Kolam Diwali", image: "https://images.pexels.com/photos/5713210/pexels-photo-5713210.jpeg?auto=compress&cs=tinysrgb&w=400", price: 169, description: "Beautiful kolam border design" },
      { id: "9-5", name: "Gold Coin Theme Card", image: "https://images.pexels.com/photos/5713210/pexels-photo-5713210.jpeg?auto=compress&cs=tinysrgb&w=400", price: 189, description: "Prosperity and wealth theme" },
    ]
  },
  10: {
    name: "Christmas Invite",
    category: "Festival Cards",
    variants: [
      { id: "10-1", name: "Christmas Star Theme", image: "https://images.pexels.com/photos/5765244/pexels-photo-5765244.jpeg?auto=compress&cs=tinysrgb&w=400", price: 169, description: "Traditional star decoration design" },
      { id: "10-2", name: "Church Celebration Card", image: "https://images.pexels.com/photos/5765244/pexels-photo-5765244.jpeg?auto=compress&cs=tinysrgb&w=400", price: 179, description: "Church festival invitation" },
      { id: "10-3", name: "Santa Theme Card", image: "https://images.pexels.com/photos/5765244/pexels-photo-5765244.jpeg?auto=compress&cs=tinysrgb&w=400", price: 159, description: "Fun Santa Claus design" },
      { id: "10-4", name: "Nativity Scene Card", image: "https://images.pexels.com/photos/5765244/pexels-photo-5765244.jpeg?auto=compress&cs=tinysrgb&w=400", price: 189, description: "Holy family theme design" },
    ]
  },
  // Cards Printing
  11: {
    name: "Premium Business Card",
    category: "Business Cards",
    variants: [
      { id: "11-1", name: "Gold Foil Business Card", image: "https://images.pexels.com/photos/6177607/pexels-photo-6177607.jpeg?auto=compress&cs=tinysrgb&w=400", price: 499, description: "Premium gold foil stamping" },
      { id: "11-2", name: "Embossed Business Card", image: "https://images.pexels.com/photos/6177607/pexels-photo-6177607.jpeg?auto=compress&cs=tinysrgb&w=400", price: 549, description: "Raised letter embossing design" },
      { id: "11-3", name: "Spot UV Business Card", image: "https://images.pexels.com/photos/6177607/pexels-photo-6177607.jpeg?auto=compress&cs=tinysrgb&w=400", price: 479, description: "Glossy spot UV coating" },
      { id: "11-4", name: "Metallic Finish Card", image: "https://images.pexels.com/photos/6177607/pexels-photo-6177607.jpeg?auto=compress&cs=tinysrgb&w=400", price: 529, description: "Shiny metallic paper finish" },
      { id: "11-5", name: "Velvet Touch Card", image: "https://images.pexels.com/photos/6177607/pexels-photo-6177607.jpeg?auto=compress&cs=tinysrgb&w=400", price: 559, description: "Soft velvet lamination" },
    ]
  },
  12: {
    name: "Modern Business Card",
    category: "Business Cards",
    variants: [
      { id: "12-1", name: "Minimalist White Card", image: "https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=400", price: 449, description: "Clean minimal design" },
      { id: "12-2", name: "Dark Theme Card", image: "https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=400", price: 469, description: "Professional dark background" },
      { id: "12-3", name: "Gradient Modern Card", image: "https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=400", price: 459, description: "Trendy gradient colors" },
      { id: "12-4", name: "QR Code Business Card", image: "https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=400", price: 479, description: "Digital QR code integration" },
    ]
  },
  13: {
    name: "Corporate Card",
    category: "Business Cards",
    variants: [
      { id: "13-1", name: "Company Logo Card", image: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400", price: 399, description: "Custom company branding" },
      { id: "13-2", name: "Executive Card", image: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400", price: 449, description: "Premium executive design" },
      { id: "13-3", name: "Team Business Cards", image: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400", price: 379, description: "Bulk team card printing" },
      { id: "13-4", name: "Multi-Language Card", image: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400", price: 429, description: "Tamil & English bilingual" },
    ]
  },
  14: {
    name: "Greeting Card Set",
    category: "Greeting Cards",
    variants: [
      { id: "14-1", name: "Tamil Wishes Card Set", image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400", price: 199, description: "Traditional Tamil greetings" },
      { id: "14-2", name: "Festival Greeting Set", image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400", price: 229, description: "Multi-festival card collection" },
      { id: "14-3", name: "Family Greeting Cards", image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400", price: 179, description: "Family wishes card pack" },
      { id: "14-4", name: "Business Greeting Set", image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400", price: 249, description: "Corporate greeting cards" },
    ]
  },
  15: {
    name: "Thank You Cards",
    category: "Greeting Cards",
    variants: [
      { id: "15-1", name: "Wedding Thank You Card", image: "https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=400", price: 149, description: "Post-wedding gratitude cards" },
      { id: "15-2", name: "Function Thank You Card", image: "https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=400", price: 129, description: "Event appreciation cards" },
      { id: "15-3", name: "Business Thank You Card", image: "https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=400", price: 169, description: "Corporate thank you notes" },
      { id: "15-4", name: "Tamil Nandri Card", image: "https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=400", price: 139, description: "Traditional nandri design" },
    ]
  },
  16: {
    name: "Visiting Card Gold",
    category: "Visiting Cards",
    variants: [
      { id: "16-1", name: "Doctor Visiting Card", image: "https://images.pexels.com/photos/6177639/pexels-photo-6177639.jpeg?auto=compress&cs=tinysrgb&w=400", price: 549, description: "Medical professional card" },
      { id: "16-2", name: "Lawyer Visiting Card", image: "https://images.pexels.com/photos/6177639/pexels-photo-6177639.jpeg?auto=compress&cs=tinysrgb&w=400", price: 549, description: "Legal professional design" },
      { id: "16-3", name: "CA/Auditor Card", image: "https://images.pexels.com/photos/6177639/pexels-photo-6177639.jpeg?auto=compress&cs=tinysrgb&w=400", price: 549, description: "Chartered accountant card" },
      { id: "16-4", name: "Real Estate Agent Card", image: "https://images.pexels.com/photos/6177639/pexels-photo-6177639.jpeg?auto=compress&cs=tinysrgb&w=400", price: 529, description: "Property dealer card" },
    ]
  },
  17: {
    name: "Visiting Card Classic",
    category: "Visiting Cards",
    variants: [
      { id: "17-1", name: "Shop Owner Card", image: "https://images.pexels.com/photos/4467735/pexels-photo-4467735.jpeg?auto=compress&cs=tinysrgb&w=400", price: 349, description: "Retail shop business card" },
      { id: "17-2", name: "Contractor Card", image: "https://images.pexels.com/photos/4467735/pexels-photo-4467735.jpeg?auto=compress&cs=tinysrgb&w=400", price: 349, description: "Building contractor design" },
      { id: "17-3", name: "Teacher/Tutor Card", image: "https://images.pexels.com/photos/4467735/pexels-photo-4467735.jpeg?auto=compress&cs=tinysrgb&w=400", price: 329, description: "Education professional card" },
      { id: "17-4", name: "Electrician/Plumber Card", image: "https://images.pexels.com/photos/4467735/pexels-photo-4467735.jpeg?auto=compress&cs=tinysrgb&w=400", price: 299, description: "Service provider card" },
    ]
  },
  18: {
    name: "ID Card Standard",
    category: "ID Cards",
    variants: [
      { id: "18-1", name: "School Student ID", image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400", price: 99, description: "School identity card" },
      { id: "18-2", name: "College Student ID", image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400", price: 99, description: "College identity card" },
      { id: "18-3", name: "Employee ID Card", image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400", price: 109, description: "Office staff ID card" },
      { id: "18-4", name: "Factory Worker ID", image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400", price: 89, description: "Industrial worker card" },
    ]
  },
  19: {
    name: "ID Card Premium",
    category: "ID Cards",
    variants: [
      { id: "19-1", name: "Smart Chip ID Card", image: "https://images.pexels.com/photos/7014411/pexels-photo-7014411.jpeg?auto=compress&cs=tinysrgb&w=400", price: 149, description: "NFC/RFID enabled card" },
      { id: "19-2", name: "Photo ID with Barcode", image: "https://images.pexels.com/photos/7014411/pexels-photo-7014411.jpeg?auto=compress&cs=tinysrgb&w=400", price: 129, description: "Barcode scanning enabled" },
      { id: "19-3", name: "Hologram Security ID", image: "https://images.pexels.com/photos/7014411/pexels-photo-7014411.jpeg?auto=compress&cs=tinysrgb&w=400", price: 179, description: "Security hologram feature" },
      { id: "19-4", name: "Magnetic Strip ID", image: "https://images.pexels.com/photos/7014411/pexels-photo-7014411.jpeg?auto=compress&cs=tinysrgb&w=400", price: 159, description: "Magnetic stripe card" },
    ]
  },
  20: {
    name: "Gift Cards",
    category: "Gift Cards",
    variants: [
      { id: "20-1", name: "Wedding Gift Voucher", image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400", price: 179, description: "Marriage gift card" },
      { id: "20-2", name: "Birthday Gift Card", image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400", price: 149, description: "Birthday celebration voucher" },
      { id: "20-3", name: "Festival Gift Card", image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400", price: 159, description: "Festive season gift card" },
      { id: "20-4", name: "Shop Discount Voucher", image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400", price: 129, description: "Store discount coupon" },
    ]
  },
  // Photo Frames
  21: {
    name: "Classic Wooden Frame",
    category: "Wooden Frames",
    variants: [
      { id: "21-1", name: "Teak Wood Frame 8x10", image: "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=400", price: 799, description: "Premium teak wood frame" },
      { id: "21-2", name: "Rosewood Frame 8x10", image: "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=400", price: 899, description: "Elegant rosewood finish" },
      { id: "21-3", name: "Mahogany Frame 8x10", image: "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=400", price: 849, description: "Classic mahogany design" },
      { id: "21-4", name: "Sandalwood Frame 8x10", image: "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=400", price: 949, description: "Fragrant sandalwood frame" },
    ]
  },
  22: {
    name: "Rustic Wood Frame",
    category: "Wooden Frames",
    variants: [
      { id: "22-1", name: "Antique Finish Frame", image: "https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg?auto=compress&cs=tinysrgb&w=400", price: 699, description: "Vintage antique look" },
      { id: "22-2", name: "Distressed Wood Frame", image: "https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg?auto=compress&cs=tinysrgb&w=400", price: 649, description: "Weathered rustic finish" },
      { id: "22-3", name: "Bamboo Frame", image: "https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg?auto=compress&cs=tinysrgb&w=400", price: 599, description: "Eco-friendly bamboo design" },
      { id: "22-4", name: "Driftwood Style Frame", image: "https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg?auto=compress&cs=tinysrgb&w=400", price: 749, description: "Beach driftwood inspired" },
    ]
  },
  23: {
    name: "Modern Acrylic Frame",
    category: "Acrylic Frames",
    variants: [
      { id: "23-1", name: "Clear Acrylic Frame", image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400", price: 899, description: "Crystal clear acrylic" },
      { id: "23-2", name: "Frosted Acrylic Frame", image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400", price: 949, description: "Frosted glass effect" },
      { id: "23-3", name: "Colored Acrylic Frame", image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400", price: 879, description: "Tinted color options" },
      { id: "23-4", name: "LED Acrylic Frame", image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1199, description: "LED backlit acrylic" },
    ]
  },
  24: {
    name: "Crystal Clear Frame",
    category: "Acrylic Frames",
    variants: [
      { id: "24-1", name: "3D Crystal Frame", image: "https://images.pexels.com/photos/2746187/pexels-photo-2746187.jpeg?auto=compress&cs=tinysrgb&w=400", price: 949, description: "3D laser engraved crystal" },
      { id: "24-2", name: "Diamond Cut Frame", image: "https://images.pexels.com/photos/2746187/pexels-photo-2746187.jpeg?auto=compress&cs=tinysrgb&w=400", price: 999, description: "Diamond edge cutting" },
      { id: "24-3", name: "Photo Crystal Block", image: "https://images.pexels.com/photos/2746187/pexels-photo-2746187.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1099, description: "Solid crystal photo block" },
      { id: "24-4", name: "Crystal Heart Frame", image: "https://images.pexels.com/photos/2746187/pexels-photo-2746187.jpeg?auto=compress&cs=tinysrgb&w=400", price: 899, description: "Heart shaped crystal" },
    ]
  },
  25: {
    name: "Collage Frame 4x6",
    category: "Collage Frames",
    variants: [
      { id: "25-1", name: "4 Photo Collage Frame", image: "https://images.pexels.com/photos/1054713/pexels-photo-1054713.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1299, description: "4 photo arrangement" },
      { id: "25-2", name: "6 Photo Collage Frame", image: "https://images.pexels.com/photos/1054713/pexels-photo-1054713.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1499, description: "6 photo arrangement" },
      { id: "25-3", name: "9 Photo Grid Frame", image: "https://images.pexels.com/photos/1054713/pexels-photo-1054713.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1699, description: "9 photo grid layout" },
      { id: "25-4", name: "Mixed Size Collage", image: "https://images.pexels.com/photos/1054713/pexels-photo-1054713.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1399, description: "Various photo sizes" },
    ]
  },
  26: {
    name: "Family Collage Frame",
    category: "Collage Frames",
    variants: [
      { id: "26-1", name: "Family Tree Frame", image: "https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1499, description: "Family tree design" },
      { id: "26-2", name: "Generation Frame", image: "https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1599, description: "Multi-generation display" },
      { id: "26-3", name: "Wedding Memories Frame", image: "https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1699, description: "Wedding photo collection" },
      { id: "26-4", name: "Baby Growth Frame", image: "https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1399, description: "Baby milestone photos" },
    ]
  },
  27: {
    name: "Heart Shaped Frame",
    category: "Decorative Frames",
    variants: [
      { id: "27-1", name: "Couple Heart Frame", image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=400", price: 599, description: "Romantic couple frame" },
      { id: "27-2", name: "Double Heart Frame", image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=400", price: 699, description: "Twin heart design" },
      { id: "27-3", name: "LED Heart Frame", image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=400", price: 799, description: "LED lit heart frame" },
      { id: "27-4", name: "Crystal Heart Frame", image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=400", price: 749, description: "Crystal heart shape" },
    ]
  },
  28: {
    name: "Round Custom Frame",
    category: "Decorative Frames",
    variants: [
      { id: "28-1", name: "Circular Mirror Frame", image: "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400", price: 649, description: "Round mirror border" },
      { id: "28-2", name: "Oval Portrait Frame", image: "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400", price: 699, description: "Classic oval shape" },
      { id: "28-3", name: "Rotating Round Frame", image: "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400", price: 799, description: "360 rotating display" },
      { id: "28-4", name: "Clock Photo Frame", image: "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400", price: 749, description: "Photo frame with clock" },
    ]
  },
  29: {
    name: "Vintage Gold Frame",
    category: "Premium Frames",
    variants: [
      { id: "29-1", name: "Antique Gold Frame", image: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1099, description: "Vintage antique gold" },
      { id: "29-2", name: "Royal Gold Frame", image: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1199, description: "Royal palace design" },
      { id: "29-3", name: "Temple Gold Frame", image: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1299, description: "Temple deity frame" },
      { id: "29-4", name: "Ornate Gold Frame", image: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1149, description: "Intricate ornate design" },
    ]
  },
  30: {
    name: "Modern Black Frame",
    category: "Premium Frames",
    variants: [
      { id: "30-1", name: "Matte Black Frame", image: "https://images.pexels.com/photos/2002719/pexels-photo-2002719.jpeg?auto=compress&cs=tinysrgb&w=400", price: 749, description: "Elegant matte finish" },
      { id: "30-2", name: "Glossy Black Frame", image: "https://images.pexels.com/photos/2002719/pexels-photo-2002719.jpeg?auto=compress&cs=tinysrgb&w=400", price: 799, description: "Shiny glossy black" },
      { id: "30-3", name: "Black Metal Frame", image: "https://images.pexels.com/photos/2002719/pexels-photo-2002719.jpeg?auto=compress&cs=tinysrgb&w=400", price: 849, description: "Industrial metal design" },
      { id: "30-4", name: "Floating Black Frame", image: "https://images.pexels.com/photos/2002719/pexels-photo-2002719.jpeg?auto=compress&cs=tinysrgb&w=400", price: 899, description: "Floating effect display" },
    ]
  },
  // Flex Printing
  31: {
    name: "Shop Signage Board",
    category: "Shop Boards",
    variants: [
      { id: "31-1", name: "Textile Shop Board", image: "https://images.pexels.com/photos/2529179/pexels-photo-2529179.jpeg?auto=compress&cs=tinysrgb&w=400", price: 2499, description: "Saree & textile shop sign" },
      { id: "31-2", name: "Grocery Shop Board", image: "https://images.pexels.com/photos/2529179/pexels-photo-2529179.jpeg?auto=compress&cs=tinysrgb&w=400", price: 2299, description: "Kirana store signage" },
      { id: "31-3", name: "Medical Shop Board", image: "https://images.pexels.com/photos/2529179/pexels-photo-2529179.jpeg?auto=compress&cs=tinysrgb&w=400", price: 2699, description: "Pharmacy shop board" },
      { id: "31-4", name: "Restaurant Board", image: "https://images.pexels.com/photos/2529179/pexels-photo-2529179.jpeg?auto=compress&cs=tinysrgb&w=400", price: 2899, description: "Hotel & restaurant sign" },
      { id: "31-5", name: "Jewellery Shop Board", image: "https://images.pexels.com/photos/2529179/pexels-photo-2529179.jpeg?auto=compress&cs=tinysrgb&w=400", price: 3499, description: "Gold shop premium board" },
    ]
  },
  32: {
    name: "LED Shop Sign",
    category: "LED Boards",
    variants: [
      { id: "32-1", name: "LED Name Board", image: "https://images.pexels.com/photos/942317/pexels-photo-942317.jpeg?auto=compress&cs=tinysrgb&w=400", price: 3999, description: "Illuminated shop name" },
      { id: "32-2", name: "3D LED Letters", image: "https://images.pexels.com/photos/942317/pexels-photo-942317.jpeg?auto=compress&cs=tinysrgb&w=400", price: 4999, description: "3D letter lighting" },
      { id: "32-3", name: "LED Neon Sign", image: "https://images.pexels.com/photos/942317/pexels-photo-942317.jpeg?auto=compress&cs=tinysrgb&w=400", price: 3499, description: "Neon style LED board" },
      { id: "32-4", name: "Scrolling LED Board", image: "https://images.pexels.com/photos/942317/pexels-photo-942317.jpeg?auto=compress&cs=tinysrgb&w=400", price: 5999, description: "Moving text display" },
    ]
  },
  33: {
    name: "Event Banner Large",
    category: "Event Banners",
    variants: [
      { id: "33-1", name: "Wedding Stage Banner", image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1999, description: "Kalyana mandapam banner" },
      { id: "33-2", name: "Temple Festival Banner", image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400", price: 2299, description: "Kovil thiruvizha banner" },
      { id: "33-3", name: "Political Meeting Banner", image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400", price: 2499, description: "Party meeting flex" },
      { id: "33-4", name: "School Function Banner", image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1799, description: "Annual day banner" },
      { id: "33-5", name: "Sports Event Banner", image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1899, description: "Cricket/sports tournament" },
    ]
  },
  34: {
    name: "Event Banner Medium",
    category: "Event Banners",
    variants: [
      { id: "34-1", name: "Birthday Function Banner", image: "https://images.pexels.com/photos/7648047/pexels-photo-7648047.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1499, description: "Pirandhanaal vizha banner" },
      { id: "34-2", name: "Ear Piercing Ceremony", image: "https://images.pexels.com/photos/7648047/pexels-photo-7648047.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1399, description: "Kaadhu kuthu function" },
      { id: "34-3", name: "Puberty Function Banner", image: "https://images.pexels.com/photos/7648047/pexels-photo-7648047.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1499, description: "Manjal neerattu vizha" },
      { id: "34-4", name: "House Warming Banner", image: "https://images.pexels.com/photos/7648047/pexels-photo-7648047.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1299, description: "Griha pravesam banner" },
      { id: "34-5", name: "Shop Opening Banner", image: "https://images.pexels.com/photos/7648047/pexels-photo-7648047.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1599, description: "Inauguration ceremony" },
    ]
  },
  35: {
    name: "Hoarding Board 10x20",
    category: "Hoardings",
    variants: [
      { id: "35-1", name: "Movie Promotion Hoarding", image: "https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=400", price: 4999, description: "Cinema release hoarding" },
      { id: "35-2", name: "Political Campaign Hoarding", image: "https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=400", price: 5499, description: "Election campaign board" },
      { id: "35-3", name: "Real Estate Hoarding", image: "https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=400", price: 4499, description: "Property advertisement" },
      { id: "35-4", name: "Business Promotion Hoarding", image: "https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=400", price: 4799, description: "Commercial advertising" },
    ]
  },
  36: {
    name: "Hoarding Board 8x12",
    category: "Hoardings",
    variants: [
      { id: "36-1", name: "Hospital Hoarding", image: "https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=400", price: 3499, description: "Medical center board" },
      { id: "36-2", name: "Education Institute Board", image: "https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=400", price: 3299, description: "School/college hoarding" },
      { id: "36-3", name: "Temple Announcement Board", image: "https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=400", price: 3199, description: "Kovil event hoarding" },
      { id: "36-4", name: "Sports Academy Board", image: "https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=400", price: 3399, description: "Cricket/sports academy" },
    ]
  },
  37: {
    name: "Vehicle Branding Full",
    category: "Vehicle Branding",
    variants: [
      { id: "37-1", name: "Auto Rickshaw Branding", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400", price: 8999, description: "Full auto wrap design" },
      { id: "37-2", name: "Van/Mini Truck Branding", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400", price: 12999, description: "Delivery van branding" },
      { id: "37-3", name: "Bus Branding Full", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400", price: 24999, description: "Complete bus wrap" },
      { id: "37-4", name: "Car Branding Full", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400", price: 15999, description: "Full car wrap design" },
    ]
  },
  38: {
    name: "Vehicle Branding Partial",
    category: "Vehicle Branding",
    variants: [
      { id: "38-1", name: "Bike Sticker Branding", image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400", price: 4999, description: "Two-wheeler branding" },
      { id: "38-2", name: "Car Door Branding", image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400", price: 5999, description: "Side door graphics" },
      { id: "38-3", name: "Truck Cabin Branding", image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400", price: 6999, description: "Lorry cabin design" },
      { id: "38-4", name: "Auto Back Panel", image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400", price: 3499, description: "Auto back advertisement" },
    ]
  },
  39: {
    name: "Standee Banner",
    category: "Display Stands",
    variants: [
      { id: "39-1", name: "X-Stand Banner", image: "https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1299, description: "X-frame standee" },
      { id: "39-2", name: "L-Stand Banner", image: "https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1199, description: "L-frame display" },
      { id: "39-3", name: "Tripod Stand Banner", image: "https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1499, description: "Three-leg stand" },
      { id: "39-4", name: "Adjustable Standee", image: "https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1399, description: "Height adjustable" },
    ]
  },
  40: {
    name: "Rollup Banner",
    category: "Display Stands",
    variants: [
      { id: "40-1", name: "Standard Rollup 3x6", image: "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1599, description: "Regular size rollup" },
      { id: "40-2", name: "Wide Rollup 4x7", image: "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=400", price: 1999, description: "Extra wide display" },
      { id: "40-3", name: "Double Side Rollup", image: "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=400", price: 2499, description: "Two-sided printing" },
      { id: "40-4", name: "Premium Rollup Stand", image: "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=400", price: 2199, description: "Heavy duty stand" },
    ]
  }
};

export default function ProductVariantsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { showNotification } = useNotification();
  const [previewVariant, setPreviewVariant] = useState(null);
  
  const product = productVariants[productId];
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (variant, e) => {
    e.stopPropagation();
    const cartItem = {
      id: variant.id,
      name: variant.name,
      price: variant.price,
      image: variant.image,
      description: variant.description,
      parentProduct: product.name,
      category: product.category
    };
    addToCart(cartItem);
    showNotification(
      <div className="flex items-center">
        <span className="mr-2">🛒</span>
        <span>{variant.name} added to cart!</span>
      </div>,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
        </div>

        {/* Variants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {product.variants.map((variant) => (
            <div
              key={variant.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-gray-100">
                <img
                  src={variant.image}
                  alt={variant.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/400x300/e2e8f0/475569?text=Design+Image";
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Name with Customize Icon */}
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/custom-design', { 
                        state: { 
                          product: {
                            ...variant,
                            parentProduct: product.name,
                            category: product.category
                          }
                        } 
                      });
                    }}
                    className="text-purple-600 hover:text-purple-800 transition-colors"
                    title="Customize this design"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {variant.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {variant.description}
                </p>
                
                {/* Price */}
                <div className="mb-4 mt-auto">
                  <span className="text-2xl font-bold text-indigo-600">₹{variant.price}</span>
                  <span className="text-sm text-gray-400 ml-1">onwards</span>
                </div>

                {/* Preview Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewVariant(variant);
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Services
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewVariant && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewVariant(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800">{previewVariant.name}</h3>
              <button
                onClick={() => setPreviewVariant(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={previewVariant.image}
                    alt={previewVariant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x600/e2e8f0/475569?text=Design+Preview";
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col">
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{previewVariant.name}</h4>
                  <p className="text-gray-600 mb-4">{previewVariant.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">Product Details</h5>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        High quality printing
                      </li>
                      <li className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Premium paper/material
                      </li>
                      <li className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Customizable text & images
                      </li>
                      <li className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Fast delivery available
                      </li>
                    </ul>
                  </div>

                  <div className="mt-auto">
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-indigo-600">₹{previewVariant.price}</span>
                      <span className="text-sm text-gray-400 ml-2">onwards</span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          navigate('/custom-design', { 
                            state: { 
                              product: {
                                ...previewVariant,
                                parentProduct: product.name,
                                category: product.category
                              }
                            } 
                          });
                        }}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Customize
                      </button>
                      <button
                        onClick={(e) => {
                          handleAddToCart(previewVariant, e);
                          setPreviewVariant(null);
                        }}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
