import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axiosClient from '../../api/axiosClient';
import { useUserLocation } from '../../hooks/useUserLocation';

import { getImageUrl } from '../../utils/imageUrl';

const ShopList = () => {
  const scrollRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { city } = useUserLocation(false);

  useEffect(() => {
    const fetchShops = async () => {
      if (!city || city === 'Detecting...' || city === 'Select Location' || city === 'Unknown City') return;
      
      try {
        setLoading(true);
        const res = await axiosClient.get(`/shops/city/${city}`);
        setShops(res.data?.shops || []);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [city]);

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
  }, [shops]); // Re-check scroll when shops are loaded

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstChild = container.firstElementChild;
      const itemWidth = firstChild ? firstChild.getBoundingClientRect().width : 110;
      const gap = 16;
      const scrollAmount = (itemWidth + gap) * 5;

      const { scrollLeft } = container;
      container.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return <div className="mb-10 animate-pulse h-32 bg-gray-100 rounded-lg"></div>;
  }

  if (shops.length === 0) {
    return null; // or empty state
  }

  return (
    <div className="mb-10">
      <h2 className="text-xl font-medium text-gray-700 mb-4">Best shops in {city !== 'Detecting...' && city !== 'Select Location' ? city : 'your area'}</h2>
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
          {shops.map((shop) => (
            <div key={shop._id || shop.id} className="min-w-[110px] w-[110px] cursor-pointer group flex-shrink-0">
              <div className="h-[120px] rounded-xl overflow-hidden border border-red-200 group-hover:border-primary transition-all duration-300 flex flex-col bg-white shadow-sm p-1">
                  <div className="h-[80px] w-full overflow-hidden rounded-lg">
                     <img src={shop.logo || shop.image ? getImageUrl(shop.logo || shop.image) : 'https://via.placeholder.com/150'} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="h-[30px] w-full flex items-center justify-center mt-1">
                    <span className="text-[11px] font-medium text-gray-700 truncate px-1 text-center leading-tight group-hover:text-primary transition-colors">{shop.name}</span>
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

export default ShopList;
