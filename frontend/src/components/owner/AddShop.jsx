import React, { useState, useEffect } from 'react';
import { MdStorefront, MdClose } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShopFn, updateShopFn } from '../../features/shop/api';
import InputField from '../ui/InputField';
import TextAreaField from '../ui/TextAreaField';
import Button from '../ui/Button';
import { getImageUrl } from '../../utils/imageUrl';

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

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        logo: null, 
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zipcode: initialData.zipcode || '',
        country: initialData.country || '',
        description: initialData.description || '',
      });
      if (initialData.logo) {
        setImagePreview(getImageUrl(initialData.logo));
      }
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
    if (type === 'file' && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
    <div className="p-8 flex flex-col items-center w-full">
      
      {/* Icon */}
      <div className="bg-[#fff0ed] h-16 w-16 rounded-full flex items-center justify-center mb-4">
          <MdStorefront className="text-[#ff4d3d] text-3xl" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-gray-800 mb-6">{initialData ? 'Edit Shop' : 'Add Shop'}</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-0">
          
          <InputField 
            label="Shop Name"
            type="text" 
            name="name"
            placeholder="Enter Shop Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col mb-4">
            {imagePreview && (
              <div className="relative mb-2 h-24 w-24 rounded-lg overflow-hidden border border-gray-200">
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => {
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, logo: null }));
                    const fileInput = document.getElementById('shop-logo-upload');
                    if (fileInput) fileInput.value = '';
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-md"
                >
                  <MdClose size={12} />
                </button>
              </div>
            )}
            <InputField 
              id="shop-logo-upload"
              label="Shop Logo"
              type="file" 
              name="logo"
              onChange={handleChange}
              required={!initialData && !formData.logo}
            />
          </div>

          <TextAreaField 
            label="Address"
            name="address"
            placeholder="Enter Shop Address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField 
              label="City"
              type="text" 
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <InputField 
              label="State"
              type="text" 
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField 
              label="Zipcode"
              type="text" 
              name="zipcode"
              placeholder="Zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              required
            />
            <InputField 
              label="Country"
              type="text" 
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <TextAreaField 
            label="Description"
            name="description"
            placeholder="Enter short description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
          />

          <div className="mt-2">
            <Button fullWidth type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (initialData ? 'Update Shop' : 'Save Shop')}
            </Button>
          </div>
        </form>
    </div>
  );
};

export default AddShop;
