import React from 'react';

const CATEGORIES = [
  { id: '1', title: 'NECKLACES', count: '24 items' },
  { id: '2', title: 'EARRINGS', count: '18 items' },
  { id: '3', title: 'BRACELETS', count: '32 items' },
  { id: '4', title: 'RINGS', count: '15 items' },
  { id: '5', title: 'PENDANTS', count: '20 items' },
];

export const ResponsiveCategoryList = () => {
  return (
    <section className="w-full pt-8 pb-[48px] md:pt-[48px] md:pb-[60px] border-b border-neutral-100 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 md:px-[50px]">
        
        {/* Section Heading - H2 styling */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="font-serif font-medium text-[20px] md:text-[25.2px] leading-[26px] md:leading-[32.4px] text-neutral-900">
            SHOP BY CATEGORY
          </h2>
          <a href="#" className="text-[13px] md:text-[15px] font-normal text-neutral-600 hover:text-neutral-900 underline underline-offset-4">
            View All
          </a>
        </div>

        {/* Category Cards Grid - 5 columns on Desktop, 2-3 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {CATEGORIES.map((cat) => (
            <a 
              key={cat.id} 
              href="#" 
              className="group flex flex-col items-center text-center p-2 rounded-lg hover:bg-neutral-50/80 transition-colors"
            >
              {/* 1:1 Aspect Ratio Square / Circle Avatar Container */}
              <div className="aspect-square w-full max-w-[210px] bg-neutral-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden border border-neutral-200/50">
                <span className="font-serif text-[28px] md:text-[36px] font-light text-neutral-400 select-none">
                  {cat.title[0]}
                </span>
              </div>

              <h3 className="text-[14px] md:text-[16px] leading-[20px] md:leading-[28.8px] font-medium text-neutral-900">
                {cat.title}
              </h3>
              <span className="text-[12px] md:text-[13px] text-neutral-500 font-normal">
                {cat.count}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
