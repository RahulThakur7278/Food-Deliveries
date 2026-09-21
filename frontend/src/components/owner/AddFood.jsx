import React, { useState, useEffect } from 'react';
import { MdRestaurantMenu } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItemFn, updateItemFn } from '../../features/item/api';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import TextAreaField from '../ui/TextAreaField';
import Button from '../ui/Button';

const AddFood = ({ initialData = null, shopId, onClose }) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    price: '',
    category: '',
    food_type: 'Veg',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        image: null,
        price: initialData.price || '',
        category: initialData.category || '',
        food_type: initialData.food_type || 'Veg',
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
    <div className="p-8 flex flex-col items-center w-full">
      
      {/* Icon */}
      <div className="bg-[#fff0ed] h-16 w-16 rounded-full flex items-center justify-center mb-4">
          <MdRestaurantMenu className="text-[#ff4d3d] text-3xl" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-gray-800 mb-6">{initialData ? 'Edit Food' : 'Add Food'}</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-0">
          
          <InputField 
            label="Name"
            type="text" 
            name="name"
            placeholder="Enter Food Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <InputField 
            label="Food Image"
            type="file" 
            name="image"
            onChange={handleChange}
            required={!initialData}
          />

          <InputField 
            label="Price"
            type="number" 
            name="price"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <SelectField 
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              options={[
                { label: 'Select Category', value: '' },
                { label: 'Breakfast', value: 'Breakfast' },
                { label: 'Lunch', value: 'Lunch' },
                { label: 'Dinner', value: 'Dinner' },
                { label: 'Snack', value: 'Snack' },
                { label: 'Dessert', value: 'Dessert' },
                { label: 'Beverage', value: 'Beverage' },
                { label: 'Pizza', value: 'Pizza' },
                { label: 'Burger', value: 'Burger' },
                { label: 'Pasta', value: 'Pasta' },
                { label: 'Rice', value: 'Rice' },
                { label: 'Noodles', value: 'Noodles' }
              ]}
            />
            <SelectField 
              label="Food Type"
              name="food_type"
              value={formData.food_type}
              onChange={handleChange}
              required
              options={[
                { label: 'Veg', value: 'Veg' },
                { label: 'Non-Veg', value: 'Non-Veg' }
              ]}
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
              {isLoading ? 'Saving...' : (initialData ? 'Update' : 'Save')}
            </Button>
          </div>
        </form>
    </div>
  );
};

export default AddFood;
