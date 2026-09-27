import React, { useState, useEffect } from 'react';
import { MdRestaurantMenu, MdClose } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItemFn, updateItemFn } from '../../features/item/api';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import TextAreaField from '../ui/TextAreaField';
import Button from '../ui/Button';
import { getImageUrl } from '../../utils/imageUrl';

const AddFood = ({ initialData = null, shopId, onClose }) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    images: [],
    existingImages: [],
    price: '',
    category: '',
    food_type: 'Veg',
    description: '',
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (initialData) {
      const existing = initialData.images?.length > 0 ? initialData.images : (initialData.image ? [initialData.image] : []);
      setFormData({
        name: initialData.name || '',
        images: [],
        existingImages: existing,
        price: initialData.price || '',
        category: initialData.category || '',
        food_type: initialData.food_type || 'Veg',
        description: initialData.description || '',
      });
      setImagePreviews(existing.map(img => getImageUrl(img)));
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
    if (type === 'file' && files.length > 0) {
      const newFiles = Array.from(files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    } else if (type !== 'file') {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (index) => {
    const totalExisting = formData.existingImages.length;
    if (index < totalExisting) {
        setFormData(prev => ({
            ...prev,
            existingImages: prev.existingImages.filter((_, i) => i !== index)
        }));
    } else {
        const newFileIndex = index - totalExisting;
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== newFileIndex)
        }));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    const fileInput = document.getElementById('food-images-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'images') {
        formData.images.forEach(file => data.append('images', file));
      } else if (key === 'existingImages') {
        formData.existingImages.forEach(img => data.append('existingImages', img));
      } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
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

          <div className="flex flex-col mb-4">
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-200">
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-md"
                    >
                      <MdClose size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <InputField 
              id="food-images-upload"
              label="Food Images"
              type="file" 
              name="images"
              multiple
              onChange={handleChange}
              required={!initialData && imagePreviews.length === 0}
            />
          </div>

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
