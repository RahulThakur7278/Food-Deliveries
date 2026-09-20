import React, { useState, useEffect } from 'react';
import { MdRestaurantMenu } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItemFn, updateItemFn } from '../../features/item/api';

const AddFood = ({ initialData = null, shopId, onClose }) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    price: '',
    category: '',
    food_type: 'veg',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        image: null,
        price: initialData.price || '',
        category: initialData.category || '',
        food_type: initialData.food_type || 'veg',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const createMutation = useMutation({
    mutationFn: createItemFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', shopId] });
      if (onClose) onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateItemFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', shopId] });
      if (onClose) onClose();
    }
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
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });
    
    // Add shop ID
    data.append('shop', shopId);

    if (initialData) {
      updateMutation.mutate({ itemId: initialData._id, itemData: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-white w-full max-w-[500px] p-8 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] flex flex-col items-center">
        
        {/* Icon */}
        <div className="bg-[#fff0ed] h-16 w-16 rounded-full flex items-center justify-center mb-4">
          <MdRestaurantMenu className="text-[#ff4d3d] text-3xl" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-gray-800 mb-6">{initialData ? 'Edit Food' : 'Add Food'}</h2>

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
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Food Image</label>
            <input 
              type="file" 
              name="image"
              onChange={handleChange}
              required={!initialData}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#ff4d3d1a] file:text-primary hover:file:bg-[#ff4d3d2a] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Price</label>
            <input 
              type="number" 
              name="price"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              >
                <option value="">Select Category</option>
                <option value="main_course">Main Course</option>
                <option value="appetizer">Appetizer</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700">Food Type</label>
              <select 
                name="food_type"
                value={formData.food_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Description</label>
            <textarea 
              name="description"
              placeholder="Enter short description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full mt-4 bg-[#ff4d3d] hover:bg-[#e64536] text-white font-semibold py-3 rounded-lg shadow-sm transition-colors duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update' : 'Save')}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddFood;
