import React, { useState } from 'react';
import { MdAdd, MdStorefront, MdLocationOn, MdEdit, MdDeleteOutline } from 'react-icons/md';
import Modal from './Modal';
import AddShop from './AddShop';
import ConfirmModal from './ConfirmModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShopsFn, deleteShopFn } from '../../features/shop/api';
import { useSelector } from 'react-redux';

const ShopList = () => {
  const user = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const [isAddShopModalOpen, setIsAddShopModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  // Fetch Shops
  const { data: shopsResponse, isLoading, isError } = useQuery({
    queryKey: ['shops', user?._id],
    queryFn: () => getShopsFn({ owner: user?._id }),
    enabled: !!user?._id,
  });

  const shops = shopsResponse?.data?.shops || [];

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteShopFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    }
  });

  const handleEditClick = (shop) => {
    setSelectedShop(shop);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (shop) => {
    setSelectedShop(shop);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedShop) {
      deleteMutation.mutate(selectedShop._id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-10 text-gray-500">Loading shops...</div>;
  }

  if (isError) {
    return <div className="flex justify-center p-10 text-red-500">Failed to load shops.</div>;
  }

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
            <span className="text-primary font-black text-lg">{shops.length}</span>
          </div>
          <button 
            onClick={() => {
              setSelectedShop(null);
              setIsAddShopModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#ff4d3d] hover:bg-[#e64536] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm"
          >
            <MdAdd className="text-lg" />
            <span>Add Shop</span>
          </button>
        </div>
      </div>

      {/* Shop List Grid */}
      {shops.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          No shops found. Add a shop to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {shops.map((shop) => (
            <div key={shop._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start">
                <div className="bg-orange-50 h-12 w-12 rounded-full overflow-hidden flex items-center justify-center border border-orange-100">
                  {shop.logo ? (
                    <img src={shop.logo} alt={shop.name} className="h-full w-full object-cover" />
                  ) : (
                    <MdStorefront className="text-[#ff4d3d] text-2xl" />
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{shop.name}</h3>
                <div className="flex items-start gap-1.5 mt-2 text-gray-500 text-xs">
                  <MdLocationOn className="text-sm mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{shop.address}, {shop.city}, {shop.state} {shop.zipcode}</span>
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
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdDeleteOutline /> {deleteMutation.isPending && selectedShop?._id === shop._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Shop Modal */}
      <Modal isOpen={isAddShopModalOpen} onClose={() => setIsAddShopModalOpen(false)}>
        <AddShop onClose={() => setIsAddShopModalOpen(false)} />
      </Modal>

      {/* Edit Shop Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <AddShop initialData={selectedShop} onClose={() => setIsEditModalOpen(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Shop"
        message={`Are you sure you want to delete ${selectedShop?.name}? This action cannot be undone and will delete all associated food items.`}
      />

    </div>
  );
};

export default ShopList;
