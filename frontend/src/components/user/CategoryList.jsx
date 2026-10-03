import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { useGetCategoriesQuery } from '../../features/item/queries';

const categoryImageMap = {
  'Breakfast': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300&q=80',
  'Lunch': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80',
  'Dinner': 'https://images.unsplash.com/photo-1544025162-83b6f2874136?w=300&q=80',
  'Snack': 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=300&q=80',
  'Dessert': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&q=80',
  'Beverage': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80',
  'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80',
  'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80',
  'Pasta': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300&q=80',
  'Rice': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&q=80',
  'Noodles': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&q=80',
};

const CategoryList = () => {
  const scrollRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data: categoriesResponse, isLoading } = useGetCategoriesQuery();
  const categories = categoriesResponse?.data || Object.keys(categoryImageMap);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const hasOverflow = scrollWidth > clientWidth + 2;
      setIsScrollable(hasOverflow);
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    let resizeObserver;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => checkScroll());
      resizeObserver.observe(el);
    }

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstChild = container.firstElementChild;
      const itemWidth = firstChild ? firstChild.getBoundingClientRect().width : 120;
      const gap = 16;
      const scrollAmount = (itemWidth + gap) * 5;

      const { scrollLeft } = container;
      container.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-medium text-gray-700 mb-4">Inspiration for your first order</h2>
      <div className="relative">
        {isScrollable && (
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md transition-all ${
              !canScrollLeft ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 active:scale-95 cursor-pointer'
            }`}
            aria-label="Scroll left"
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>
        )}

        {isLoading && (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="min-w-[120px] w-[120px] h-[130px] rounded-2xl bg-gray-200 animate-pulse shrink-0"></div>
            ))}
          </div>
        )}

        {!isLoading && (
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {categories.map((category) => (
              <div key={category} className="min-w-[120px] w-[120px] cursor-pointer group flex-shrink-0">
                <div className="h-[130px] rounded-2xl overflow-hidden border border-red-200 group-hover:border-primary transition-all duration-300 flex flex-col bg-gray-50 shadow-sm">
                  <div className="h-[100px] w-full overflow-hidden">
                    <img 
                      src={categoryImageMap[category] || 'https://images.unsplash.com/photo-1495195134817-a165d42e2736?w=300&q=80'} 
                      alt={category} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="h-[30px] w-full flex items-center justify-center bg-gray-200/40">
                    <span className="text-[12px] font-medium text-gray-700 group-hover:text-primary transition-colors">{category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isScrollable && (
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md transition-all ${
              !canScrollRight ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 active:scale-95 cursor-pointer'
            }`}
            aria-label="Scroll right"
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
