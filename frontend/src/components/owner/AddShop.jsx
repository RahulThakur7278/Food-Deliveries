import React, { useState } from 'react';
import { MdStorefront } from 'react-icons/md';

const AddShop = () => {
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    address: '',
    phone: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Add Shop form submitted", formData);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-white w-full max-w-[450px] p-8 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] flex flex-col items-center">
        
        {/* Icon */}
        <div className="bg-[#fff0ed] h-20 w-20 rounded-full flex items-center justify-center mb-4">
          <MdStorefront className="text-[#ff4d3d] text-4xl" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-gray-800 mb-6">Add Shop</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Shop Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="Enter Shop Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Shop Image</label>
            <input 
              type="file" 
              name="image"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#ff4d3d1a] file:text-primary hover:file:bg-[#ff4d3d2a] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Address</label>
            <textarea 
              name="address"
              placeholder="Enter Shop Address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            ></textarea>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Phone</label>
            <input 
              type="text" 
              name="phone"
              placeholder="Enter Shop Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Description</label>
            <textarea 
              name="description"
              placeholder="Enter short description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 bg-[#ff4d3d] hover:bg-[#e64536] text-white font-semibold py-3 rounded-lg shadow-sm transition-colors duration-200"
          >
            Save Shop
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddShop;
