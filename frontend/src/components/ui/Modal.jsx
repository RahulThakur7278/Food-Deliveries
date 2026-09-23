import React, { useEffect } from 'react';
import { MdClose } from 'react-icons/md';

const Modal = ({ isOpen, onClose, children, maxWidth = 'max-w-lg', hideCloseButton = false }) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={`relative bg-white rounded-2xl w-full ${maxWidth} shadow-xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar`}>
        {/* Close Button */}
        {!hideCloseButton && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-gray-50 hover:bg-gray-200 text-gray-500 rounded-full p-1.5 transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default Modal;
