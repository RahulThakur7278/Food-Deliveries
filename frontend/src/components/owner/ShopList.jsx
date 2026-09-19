import React, { useState } from 'react';
import { MdAdd, MdStorefront, MdLocationOn, MdPhone, MdEdit, MdDeleteOutline } from 'react-icons/md';
import Modal from './Modal';
import AddShop from './AddShop';
import ConfirmModal from './ConfirmModal';

const mockShops = [
  { id: 1, name: "Burger King", address: "123 Main St, New York", phone: "123-456-7890", status: "Active" },
  { id: 2, name: "Pizza Hut", address: "456 Broadway, New York", phone: "098-765-4321", status: "Active" },
  { id: 3, name: "Taco Bell", address: "789 5th Ave, New York", phone: "555-123-4567", status: "Inactive" },
];

const ShopList = () => {
  const [isAddShopModalOpen, setIsAddShopModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  const handleEditClick = (shop) => {
    setSelectedShop(shop);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (shop) => {
    setSelectedShop(shop);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header and Metrics */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Shop Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your shop locations and details.</p>
        </div>
        
        {/* Total Count & Add Button */}
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2">
            <span className="text-gray-500 text-sm font-semibold">Total Shops:</span>
            <span className="text-primary font-black text-lg">{mockShops.length}</span>
          </div>
          <button 
            onClick={() => setIsAddShopModalOpen(true)}
            className="flex items-center gap-2 bg-[#ff4d3d] hover:bg-[#e64536] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm"
          >
            <MdAdd className="text-lg" />
            <span>Add Shop</span>
          </button>
        </div>
      </div>

      {/* Shop List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {mockShops.map((shop) => (
          <div key={shop.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div className="bg-orange-50 h-12 w-12 rounded-full flex items-center justify-center">
                <MdStorefront className="text-[#ff4d3d] text-2xl" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${shop.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {shop.status}
              </span>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-800">{shop.name}</h3>
              <div className="flex items-start gap-1.5 mt-2 text-gray-500 text-xs">
                <MdLocationOn className="text-sm mt-0.5 shrink-0" />
                <span>{shop.address}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-xs">
                <MdPhone className="text-sm shrink-0" />
                <span>{shop.phone}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-50 flex justify-end gap-2">
              <button 
                onClick={() => handleEditClick(shop)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-semibold transition-colors"
              >
                <MdEdit /> Edit
              </button>
              <button 
                onClick={() => handleDeleteClick(shop)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-semibold transition-colors"
              >
                <MdDeleteOutline /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Shop Modal */}
      <Modal isOpen={isAddShopModalOpen} onClose={() => setIsAddShopModalOpen(false)}>
        <AddShop />
      </Modal>

      {/* Edit Shop Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <AddShop /> {/* In a real app, pass selectedShop as prop to populate form */}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => console.log("Deleted shop:", selectedShop?.name)}
        title="Delete Shop"
        message={`Are you sure you want to delete ${selectedShop?.name}? This action cannot be undone.`}
      />

    </div>
  );
};

export default ShopList;
