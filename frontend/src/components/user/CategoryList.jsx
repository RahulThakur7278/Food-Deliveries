import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const categories = [
  { id: 1, name: 'Snacks', image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=300&q=80' },
  { id: 2, name: 'Main Course', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&q=80' },
  { id: 3, name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&q=80' },
  { id: 4, name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80' },
  { id: 5, name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80' },
  { id: 6, name: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&q=80' },
  { id: 7, name: 'Snacks', image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=300&q=80' },
  { id: 8, name: 'Main Course', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&q=80' },
  { id: 9, name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&q=80' },
  { id: 10, name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80' },
  { id: 11, name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80' },
  { id: 12, name: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&q=80' },
];

const CategoryList = () => {
  const scrollRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
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
