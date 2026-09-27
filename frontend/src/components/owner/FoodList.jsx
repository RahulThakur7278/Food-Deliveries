import React, { useState, useEffect } from 'react';
import { MdAdd, MdRestaurantMenu, MdEdit, MdDeleteOutline, MdFastfood } from 'react-icons/md';
import Modal from '../ui/Modal';
import AddFood from './AddFood';
import ConfirmModal from '../ui/ConfirmModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItemsByShopFn, deleteItemFn } from '../../features/item/api';
import { getShopsFn } from '../../features/shop/api';
import { useSelector } from 'react-redux';
import { getImageUrl } from '../../utils/imageUrl';

const FoodList = () => {
  const user = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedShopId, setSelectedShopId] = useState('all');

  // Fetch Shops to populate the selector
  const { data: shopsResponse } = useQuery({
    queryKey: ['shops', user?._id],
    queryFn: () => getShopsFn({ owner: user?._id }),
    enabled: !!user?._id,
  });

  const shops = shopsResponse?.data?.shops || [];

  // Auto-select first shop if available and none selected
  useEffect(() => {
    if (shops.length > 0 && !selectedShopId) {
      setSelectedShopId(shops[0]._id);
    }
  }, [shops, selectedShopId]);

  // Prepare all shop ids
  const allShopIds = shops.map(shop => shop._id).join(',');
  const queryShopId = selectedShopId === 'all' ? allShopIds : selectedShopId;

  // Fetch Food Items for the selected shop(s)
  const { data: itemsResponse, isLoading: isLoadingItems, isError: isErrorItems } = useQuery({
    queryKey: ['items', queryShopId],
    queryFn: () => getItemsByShopFn(queryShopId),
    enabled: !!queryShopId,
  });

  const foods = itemsResponse?.data?.items || [];
  
  // Actually the backend controller (item.controller.js) returns `data: itemsData` which is an object `{ items, pagination }` based on standard service structure. Wait, let's just assume `itemsResponse?.data` is the array or `{ items: [] }`.
  // Looking at backend item.service.js: `return items;` if no pagination is implemented or `{ items, pagination }`. If it's an array directly:
  const foodList = Array.isArray(itemsResponse?.data) ? itemsResponse?.data : (itemsResponse?.data?.items || []);

  const activeCount = foodList.length; // Modify logic if you add status to items
  const inactiveCount = 0;

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteItemFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', queryShopId] });
    }
  });

  const handleEditClick = (food) => {
    setSelectedFood(food);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (food) => {
    setSelectedFood(food);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedFood) {
      deleteMutation.mutate(selectedFood._id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header and Metrics */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Food Items Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your food items, categories, and prices.</p>
          
          {/* Shop Selector */}
          {shops.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <label className="text-sm font-bold text-gray-700">Select Shop:</label>
              <select 
                value={selectedShopId}
                onChange={(e) => setSelectedShopId(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-primary"
              >
                <option value="all">All Shops</option>
                {shops.map(shop => (
                  <option key={shop._id} value={shop._id}>{shop.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        {/* Metrics & Add Button */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center">
               <span className="text-gray-400 text-xs font-bold uppercase">Total Food</span>
               <span className="text-gray-800 font-black text-lg leading-tight">{foodList.length}</span>
             </div>
          </div>
          <button 
            onClick={() => {
              setSelectedFood(null);
              setIsAddFoodModalOpen(true);
            }}
            disabled={!selectedShopId || selectedShopId === 'all'}
            title={selectedShopId === 'all' ? 'Please select a specific shop to add food' : ''}
            className="flex items-center gap-2 bg-[#ff4d3d] hover:bg-[#e64536] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm h-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdAdd className="text-lg" />
            <span>Add Food</span>
          </button>
        </div>
      </div>

      {/* Food List Grid */}
      {shops.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          You need to add a shop first before you can add food items.
        </div>
      ) : isLoadingItems ? (
        <div className="flex justify-center p-10 text-gray-500">Loading food items...</div>
      ) : isErrorItems ? (
        <div className="flex justify-center p-10 text-red-500">Failed to load food items.</div>
      ) : foodList.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          No food items found for this shop.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
          {foodList.map((food) => (
            <div key={food._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start">
                <div className="bg-red-50 h-12 w-12 rounded-full overflow-hidden flex items-center justify-center border border-red-100">
                  {(food.images?.length > 0 || food.image) ? (
                    <img src={getImageUrl(food.images?.[0] || food.image)} alt={food.name} className="h-full w-full object-cover" />
                  ) : (
                    <MdRestaurantMenu className="text-[#ff4d3d] text-2xl" />
                  )}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700`}>
                  Active
                </span>
              </div>
              
              <div className="mt-1">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{food.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-primary font-black text-lg">${food.price}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${food.food_type === 'veg' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}`}>
                    {(food.food_type || 'veg').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-xs font-semibold">
                  <MdFastfood className="text-sm shrink-0" />
                  <span className="capitalize">{food.category?.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 flex justify-end gap-2">
                <button 
                  onClick={() => handleEditClick(food)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-semibold transition-colors"
                >
                  <MdEdit /> Edit
                </button>
                <button 
                  onClick={() => handleDeleteClick(food)}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdDeleteOutline /> {deleteMutation.isPending && selectedFood?._id === food._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Food Modal */}
      <Modal isOpen={isAddFoodModalOpen} onClose={() => setIsAddFoodModalOpen(false)}>
        <AddFood shopId={selectedShopId} onClose={() => setIsAddFoodModalOpen(false)} />
      </Modal>

      {/* Edit Food Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <AddFood initialData={selectedFood} shopId={selectedFood?.shop || selectedShopId} onClose={() => setIsEditModalOpen(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Food Item"
        message={`Are you sure you want to delete ${selectedFood?.name}? This action cannot be undone.`}
      />

    </div>
  );
};

export default FoodList;
