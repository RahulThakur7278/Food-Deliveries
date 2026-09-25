import React from 'react';

const shops = [
  { id: 1, name: 'Krishna Bakery', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=80' },
  { id: 2, name: 'Chanchal Burger Corner', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=80' },
  { id: 3, name: 'Pizza Palace', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80' },
  { id: 4, name: 'Sweet Tooth', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&q=80' },
];

const ShopList = () => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-medium text-gray-700 mb-4">Best shops in Jhansi</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {shops.map((shop) => (
          <div key={shop.id} className="min-w-[110px] w-[110px] cursor-pointer group flex-shrink-0">
            <div className="h-[120px] rounded-xl overflow-hidden border border-red-200 group-hover:border-primary transition-all duration-300 flex flex-col bg-white shadow-sm p-1">
                <div className="h-[80px] w-full overflow-hidden rounded-lg">
                   <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="h-[30px] w-full flex items-center justify-center mt-1">
                  <span className="text-[11px] font-medium text-gray-700 truncate px-1 text-center leading-tight group-hover:text-primary transition-colors">{shop.name}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopList;
