import React from 'react';
import FoodCard from './FoodCard';

const items = [
  { id: 1, name: 'Corn Pizza', price: 199, reviews: 0, isVeg: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80' },
  { id: 2, name: 'chicken Burger', price: 99, reviews: 0, isVeg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
  { id: 3, name: 'burger', price: 99, reviews: 0, isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80' },
  { id: 4, name: 'Samosa 2 pieces', price: 49, reviews: 0, isVeg: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80' },
  { id: 5, name: 'Paneer Tikka', price: 149, reviews: 12, isVeg: true, image: 'https://images.unsplash.com/photo-1567188040759-bf8c962b083b?w=500&q=80' },
];

const ItemList = () => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-medium text-gray-700 mb-4">Suggested items</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ItemList;
