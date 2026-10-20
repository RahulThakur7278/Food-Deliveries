import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { MdStar } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, selectCartItems } from '../../features/cart/cartSlice';
import { getImageUrl } from '../../utils/imageUrl';

const FoodCard = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const itemId = item._id || item.id;
  const cartItem = cartItems.find((i) => (i._id || i.id) === itemId);
  const quantity = cartItem ? cartItem.quantity : 0;

  const isVeg = item.isVeg ?? (item.food_type === 'Veg');

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch(addToCart(item));
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (quantity > 0) {
      dispatch(removeFromCart(itemId));
    }
  };

  return (
    <div className="min-w-[200px] w-[200px] bg-white rounded-xl border border-red-200 overflow-hidden hover:border-primary transition-all shadow-sm hover:shadow-md group flex-shrink-0 flex flex-col">
      {/* Image Container */}
      <div className="h-[130px] w-full relative overflow-hidden">
        <img
          src={item.images?.[0] || item.image ? getImageUrl(item.images?.[0] || item.image) : 'https://via.placeholder.com/200'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Veg/Non-veg mark */}
        <div className="absolute top-2 right-2 bg-white rounded-sm p-[2px] shadow-sm">
          <div className={`w-3 h-3 border flex items-center justify-center rounded-sm ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-[14px] font-medium text-gray-800 line-clamp-1">{item.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex text-[#ffc107] text-[12px]">
            <MdStar /><MdStar /><MdStar /><MdStar /><MdStar className="text-gray-300" />
          </div>
          <span className="text-[10px] text-gray-500">({item.reviews || 0})</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="font-bold text-gray-800 text-[14px]">₹{item.price}</div>

          {/* Add to cart control */}
          <div className="flex items-center h-[26px]">
            <div className="flex items-center bg-gray-50 rounded-l-full h-full px-1 border border-gray-200 border-r-0">
              <button
                onClick={handleRemove}
                disabled={quantity === 0}
                className={`px-1.5 text-sm font-medium leading-none transition-colors ${quantity === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-primary cursor-pointer'
                  }`}
                title="Decrease quantity"
              >
                -
              </button>
              <span className="text-[11px] font-medium w-4 text-center">{quantity}</span>
              <button
                onClick={handleAdd}
                className="text-gray-500 hover:text-primary px-1.5 text-sm font-medium leading-none cursor-pointer"
                title="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              className="bg-primary text-white h-full px-2 rounded-r-full flex items-center justify-center hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
            >
              <FiShoppingCart className="text-[12px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

