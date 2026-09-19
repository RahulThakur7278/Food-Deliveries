import React, { useState } from 'react';
import { MdAdd, MdRestaurantMenu, MdEdit, MdDeleteOutline, MdFastfood } from 'react-icons/md';
import Modal from './Modal';
import AddFood from './AddFood';
import ConfirmModal from './ConfirmModal';

const mockFoods = [
  { id: 1, name: "Cheeseburger", category: "Main Course", type: "non-veg", price: 12, status: "Active" },
  { id: 2, name: "Margherita Pizza", category: "Main Course", type: "veg", price: 15, status: "Active" },
  { id: 3, name: "French Fries", category: "Appetizer", type: "veg", price: 5, status: "Inactive" },
  { id: 4, name: "Chocolate Cake", category: "Dessert", type: "veg", price: 8, status: "Active" },
];

const FoodList = () => {
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const activeCount = mockFoods.filter(f => f.status === 'Active').length;
  const inactiveCount = mockFoods.filter(f => f.status === 'Inactive').length;

  const handleEditClick = (food) => {
    setSelectedFood(food);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (food) => {
    setSelectedFood(food);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header and Metrics */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Food Items Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your food items, categories, and prices.</p>
        </div>
        
        {/* Metrics & Add Button */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center">
               <span className="text-gray-400 text-xs font-bold uppercase">Total Food</span>
               <span className="text-gray-800 font-black text-lg leading-tight">{mockFoods.length}</span>
             </div>
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center">
               <span className="text-green-500 text-xs font-bold uppercase">Active</span>
               <span className="text-green-600 font-black text-lg leading-tight">{activeCount}</span>
             </div>
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center">
               <span className="text-red-400 text-xs font-bold uppercase">Inactive</span>
               <span className="text-red-500 font-black text-lg leading-tight">{inactiveCount}</span>
             </div>
          </div>
          <button 
            onClick={() => setIsAddFoodModalOpen(true)}
            className="flex items-center gap-2 bg-[#ff4d3d] hover:bg-[#e64536] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm h-full"
          >
            <MdAdd className="text-lg" />
            <span>Add Food</span>
          </button>
        </div>
      </div>

      {/* Food List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
        {mockFoods.map((food) => (
          <div key={food.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div className="bg-red-50 h-12 w-12 rounded-full flex items-center justify-center">
                <MdRestaurantMenu className="text-[#ff4d3d] text-2xl" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${food.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {food.status}
              </span>
            </div>
            
            <div className="mt-1">
              <h3 className="text-lg font-bold text-gray-800">{food.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-primary font-black text-lg">${food.price}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${food.type === 'veg' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}`}>
                  {food.type.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-xs font-semibold">
                <MdFastfood className="text-sm shrink-0" />
                <span>{food.category}</span>
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
                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-semibold transition-colors"
              >
                <MdDeleteOutline /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Food Modal */}
      <Modal isOpen={isAddFoodModalOpen} onClose={() => setIsAddFoodModalOpen(false)}>
        <AddFood />
      </Modal>

      {/* Edit Food Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <AddFood /> {/* Pass selectedFood to prefill form in real app */}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => console.log("Deleted food:", selectedFood?.name)}
        title="Delete Food Item"
        message={`Are you sure you want to delete ${selectedFood?.name}? This action cannot be undone.`}
      />

    </div>
  );
};

export default FoodList;
