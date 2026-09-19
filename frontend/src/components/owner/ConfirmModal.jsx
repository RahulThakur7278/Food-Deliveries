import React from 'react';
import Modal from './Modal';
import { MdWarning } from 'react-icons/md';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 rounded-2xl w-full max-w-sm mx-auto shadow-xl flex flex-col items-center text-center">
        <div className="bg-red-50 h-16 w-16 rounded-full flex items-center justify-center mb-4">
          <MdWarning className="text-red-500 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        
        <div className="flex w-full gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
