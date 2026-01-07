import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";

const CustomDesignPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { showNotification } = useNotification();
  const canvasRef = useRef(null);
  
  const [designData, setDesignData] = useState({
    text: "Your Text Here",
    fontSize: 24,
    fontColor: "#000000",
    backgroundColor: "#ffffff",
    fontFamily: "Arial",
    textAlign: "center",
  });
  
  const [uploadedImage, setUploadedImage] = useState(null);
  const [price, setPrice] = useState(499);

  const handleTextChange = (e) => {
    setDesignData({ ...designData, text: e.target.value });
  };

  const handleFontSizeChange = (e) => {
    setDesignData({ ...designData, fontSize: parseInt(e.target.value) });
  };

  const handleFontColorChange = (e) => {
    setDesignData({ ...designData, fontColor: e.target.value });
  };

  const handleBackgroundColorChange = (e) => {
    setDesignData({ ...designData, backgroundColor: e.target.value });
  };

  const handleFontFamilyChange = (e) => {
    setDesignData({ ...designData, fontFamily: e.target.value });
  };

  const handleTextAlignChange = (e) => {
    setDesignData({ ...designData, textAlign: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = async () => {
    try {
      // Create a canvas element to capture the design
      const canvas = document.createElement('canvas');
      const previewElement = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to match the preview
      canvas.width = previewElement.offsetWidth;
      canvas.height = previewElement.offsetHeight;
      
      // Draw background
      ctx.fillStyle = designData.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw uploaded image if exists
      if (uploadedImage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = () => {
            ctx.globalAlpha = 0.3; // 30% opacity for the background image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
            resolve();
          };
          img.src = uploadedImage;
        });
      }
      
      // Draw text
      ctx.fillStyle = designData.fontColor;
      ctx.font = `${designData.fontSize}px ${designData.fontFamily}`;
      ctx.textAlign = designData.textAlign;
      
      // Calculate text position based on alignment
      const x = designData.textAlign === 'center' ? canvas.width / 2 :
                designData.textAlign === 'right' ? canvas.width - 20 : 20;
      
      // Draw text with word wrap
      const lineHeight = designData.fontSize * 1.2;
      const lines = designData.text.split('\n');
      
      lines.forEach((line, i) => {
        ctx.fillText(line, x, 50 + (i * lineHeight));
      });
      
      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL('image/png');
      
      const customDesign = {
        id: `custom-${Date.now()}`,
        name: "Custom Design",
        price: price, // Use the selected price
        image: imageDataUrl,
        customData: designData,
      };

      addToCart(customDesign);
      showNotification(
        <div className="flex items-center">
          <span className="mr-2">🎨</span>
          <span>Custom design added to cart!</span>
        </div>,
        'success'
      );
      navigate("/cart");
    } catch (error) {
      console.error('Error creating custom design:', error);
      showNotification(
        <div className="flex items-center">
          <span className="mr-2">❌</span>
          <span>Failed to save design. Please try again.</span>
        </div>,
        'error'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          Create Your Custom Design
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Design Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Preview</h2>
            <div className="w-full h-96 border-2 border-gray-300 rounded-lg overflow-hidden">
              <div
                ref={canvasRef}
                className="w-full h-full flex items-center justify-center relative"
                style={{
                  backgroundColor: designData.backgroundColor,
                  padding: '20px',
                  wordBreak: 'break-word',
                }}
              >
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Uploaded background"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                )}
                <div
                  className="z-10"
                  style={{
                    fontSize: `${designData.fontSize}px`,
                    color: designData.fontColor,
                    fontFamily: designData.fontFamily,
                    textAlign: designData.textAlign,
                    maxWidth: '100%',
                    lineHeight: 1.2,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {designData.text}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-indigo-600">₹{price}</span>
                <button
                  onClick={handleAddToCart}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Design Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Customize</h2>
            
            <div className="space-y-6">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Content
                </label>
                <input
                  type="text"
                  value={designData.text}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your text"
                />
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size: {designData.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={designData.fontSize}
                  onChange={handleFontSizeChange}
                  className="w-full"
                />
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={designData.fontFamily}
                  onChange={handleFontFamilyChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                </select>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Alignment
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDesignData({ ...designData, textAlign: "left" })}
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      designData.textAlign === "left"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    Left
                  </button>
                  <button
                    onClick={() => setDesignData({ ...designData, textAlign: "center" })}
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      designData.textAlign === "center"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    Center
                  </button>
                  <button
                    onClick={() => setDesignData({ ...designData, textAlign: "right" })}
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      designData.textAlign === "right"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    Right
                  </button>
                </div>
              </div>

              {/* Font Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={designData.fontColor}
                    onChange={handleFontColorChange}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{designData.fontColor}</span>
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={designData.backgroundColor}
                    onChange={handleBackgroundColorChange}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{designData.backgroundColor}</span>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Background Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Price Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Size/Price
                </label>
                <select
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="299">Small - ₹299</option>
                  <option value="499">Medium - ₹499</option>
                  <option value="799">Large - ₹799</option>
                  <option value="1299">Extra Large - ₹1299</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDesignPage;
