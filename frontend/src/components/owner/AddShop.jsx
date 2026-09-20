import React, { useState, useEffect } from 'react';
import { MdStorefront } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShopFn, updateShopFn } from '../../features/shop/api';

const AddShop = ({ initialData = null, onClose }) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    logo: null,
    address: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        logo: null, // Don't prefill file input
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zipcode: initialData.zipcode || '',
        country: initialData.country || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const createMutation = useMutation({
    mutationFn: createShopFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      if (onClose) onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateShopFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
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

    if (initialData) {
      updateMutation.mutate({ shopId: initialData._id, shopData: data });
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
          <MdStorefront className="text-[#ff4d3d] text-3xl" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-gray-800 mb-6">{initialData ? 'Edit Shop' : 'Add Shop'}</h2>

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
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Shop Logo</label>
            <input 
              type="file" 
              name="logo"
              onChange={handleChange}
              required={!initialData}
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
              required
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700">City</label>
              <input 
                type="text" 
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700">State</label>
              <input 
                type="text" 
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700">Zipcode</label>
              <input 
                type="text" 
                name="zipcode"
                placeholder="Zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700">Country</label>
              <input 
                type="text" 
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
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
            {isLoading ? 'Saving...' : (initialData ? 'Update Shop' : 'Save Shop')}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddShop;
