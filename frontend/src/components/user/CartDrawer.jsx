import React from 'react';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
  addToCart,
  removeFromCart,
  deleteFromCart,
  clearCart,
} from '../../features/cart/cartSlice';
import { getImageUrl } from '../../utils/imageUrl';

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmount);
  const totalQuantity = useSelector(selectCartTotalQuantity);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 transform transition-transform duration-300">

        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <FiShoppingBag className="text-primary text-xl" />
            <h2 className="text-lg font-bold text-gray-800">Your Food Cart</h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Cart Content */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4 text-primary text-4xl">
              <FiShoppingBag />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Your cart is empty</h3>
            <p className="text-sm text-gray-500 max-w-xs mb-6">
              Looks like you haven't added anything to your cart yet. Explore our delicious food items!
            </p>
            <button
              onClick={onClose}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-md"
            >
              Browse Food Items
            </button>
          </div>
        ) : (
          <>
            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cartItems.map((item) => {
                const itemId = item._id || item.id;
                const isVeg = item.isVeg ?? (item.food_type === 'Veg');

                return (
                  <div key={itemId} className="flex items-center gap-3 border border-red-200 rounded-xl p-3 bg-white hover:border-primary transition-all shadow-xs">
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-red-100">
                      <img
                        src={
                          item.images?.[0] || item.image
                            ? getImageUrl(item.images?.[0] || item.image)
                            : 'https://via.placeholder.com/100'
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-2.5 h-2.5 border flex items-center justify-center rounded-xs ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
                          <div className={`w-1 h-1 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800 truncate">{item.name}</h4>
                      </div>
                      <div className="text-sm font-semibold text-gray-700">
                        ₹{item.price}{' '}
                        <span className="text-xs font-normal text-gray-400">
                          x {item.quantity} = ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                        <button
                          onClick={() => dispatch(removeFromCart(itemId))}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 text-xs font-bold transition-colors"
                        >
                          <FiMinus />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(addToCart(item))}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 text-xs font-bold transition-colors"
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <button
                        onClick={() => dispatch(deleteFromCart(itemId))}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                        title="Remove item"
                      >
                        <FiTrash2 className="text-base" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer / Summary */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold text-gray-900">
                  <span>Total Payable</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-red-600 border border-gray-300 rounded-lg hover:border-red-300 transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => {
                    alert('Order placed successfully! (Frontend demo)');
                    dispatch(clearCart());
                    onClose();
                  }}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md text-center"
                >
                  Checkout (₹{totalAmount})
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
