import React from 'react';

const categories = [
  { id: 1, name: 'Snacks', image: 'https://images.unsplash.com/photo-1599487405702-86bb5f661c99?w=300&q=80' },
  { id: 2, name: 'Main Course', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&q=80' },
  { id: 3, name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&q=80' },
  { id: 4, name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80' },
  { id: 5, name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80' },
  { id: 6, name: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&q=80' },
];

const CategoryList = () => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-medium text-gray-700 mb-4">Inspiration for your first order</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((category) => (
          <div key={category.id} className="min-w-[120px] w-[120px] cursor-pointer group flex-shrink-0">
            <div className="h-[130px] rounded-2xl overflow-hidden border border-red-200 group-hover:border-primary transition-all duration-300 flex flex-col bg-gray-50 shadow-sm">
                <div className="h-[100px] w-full overflow-hidden">
                   <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="h-[30px] w-full flex items-center justify-center bg-gray-200/40">
                  <span className="text-[12px] font-medium text-gray-700 group-hover:text-primary transition-colors">{category.name}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
