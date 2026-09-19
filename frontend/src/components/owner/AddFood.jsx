import React, { useState } from 'react';
import { MdRestaurantMenu } from 'react-icons/md';

const AddFood = () => {
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    price: 0,
    category: '',
    foodType: 'veg',
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
    console.log("Add Food form submitted", formData);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-white w-full max-w-[450px] p-8 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] flex flex-col items-center">
        
        {/* Icon */}
        <div className="bg-[#fff0ed] h-20 w-20 rounded-full flex items-center justify-center mb-4">
          <MdRestaurantMenu className="text-[#ff4d3d] text-4xl" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-gray-800 mb-6">Add Food</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="Enter Food Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Food Image</label>
            <input 
              type="file" 
              name="image"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#ff4d3d1a] file:text-primary hover:file:bg-[#ff4d3d2a] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Price</label>
            <input 
              type="number" 
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Select Category</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="">select Category</option>
              <option value="main_course">Main Course</option>
              <option value="appetizer">Appetizer</option>
              <option value="dessert">Dessert</option>
              <option value="beverage">Beverage</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Select Food Type</label>
            <select 
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="veg">veg</option>
              <option value="non-veg">non-veg</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 bg-[#ff4d3d] hover:bg-[#e64536] text-white font-semibold py-3 rounded-lg shadow-sm transition-colors duration-200"
          >
            Save
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddFood;
