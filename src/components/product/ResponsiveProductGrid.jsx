import React from 'react';

const PRODUCTS = [
  { id: '1', name: 'Aesthetic Diamond Motif Pendant', category: 'FINE JEWELRY', price: '$240.00', badge: 'BESTSELLER' },
  { id: '2', name: 'Minimalist Handcrafted Pearl Ring', category: 'RINGS', price: '$180.00', badge: 'NEW' },
  { id: '3', name: 'Geometric Sculptural Hoop Earrings', category: 'EARRINGS', price: '$135.00', badge: null },
  { id: '4', name: 'Classic Artisanal Bangle Bracelet', category: 'BRACELETS', price: '$290.00', badge: null },
  { id: '5', name: 'Statement Layered Choker Chain', category: 'NECKLACES', price: '$310.00', badge: 'LIMITED' },
];

export const ResponsiveProductGrid = ({
  title = "FEATURED COLLECTION",
  subtitle = "Handpicked timeless designs featuring clean geometry and luxury finishing",
  columns = 5
}) => {
  return (
    <section className="w-full pt-[36px] pb-[52px] md:pt-[36px] md:pb-[52px] bg-white border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 md:px-[50px]">
        
        {/* Section Header */}
        <div className="text-center max-w-[700px] mx-auto mb-6 md:mb-8">
          <h2 className="font-serif font-medium text-[20px] md:text-[25.2px] leading-[26px] md:leading-[32.4px] text-neutral-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[13px] md:text-[15px] leading-[20px] md:leading-[27px] font-normal text-neutral-500 mt-1.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Product Grid System
            Desktop: 5 Columns (calc(20% - 9.6px)) or 4 Columns (calc(25% - 9px))
            Tablet: 3-4 Columns
            Mobile: 2 Columns (calc(50% - 3px))
        */}
        <div className={`grid grid-cols-2 ${columns === 5 ? 'sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'sm:grid-cols-2 md:grid-cols-4'} gap-x-2.5 gap-y-5 md:gap-x-3.5 md:gap-y-7`}>
          {PRODUCTS.slice(0, columns).map((product) => (
            <div 
              key={product.id} 
              className="group flex flex-col justify-between h-full bg-white transition-all duration-200"
            >
              <div>
                {/* 1:1 Aspect Ratio Image Container */}
                <div className="aspect-square w-full bg-neutral-100 relative overflow-hidden flex items-center justify-center border border-neutral-200/40">
                  {/* Hover scale effect */}
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <span className="font-serif text-[32px] md:text-[40px] text-neutral-300 font-light select-none">
                      {product.id}
                    </span>
                  </div>

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] md:text-[11px] font-medium tracking-wider bg-neutral-900 text-white rounded-full uppercase">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Meta details */}
                <div className="pt-3">
                  <span className="text-[10px] md:text-[11px] font-normal uppercase tracking-widest text-neutral-400 block">
                    {product.category}
                  </span>
                  <h3 className="text-[13px] md:text-[15px] font-normal leading-[18px] md:leading-[22px] text-neutral-900 mt-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mt-1.5 text-[13px] md:text-[15px] font-medium text-neutral-900">
                    {product.price}
                  </div>
                </div>
              </div>

              {/* Quick Add Button - h-40px mobile / h-47px desktop, rounded-7px */}
              <button className="w-full h-[40px] md:h-[47px] mt-3 rounded-[7px] border border-neutral-300 hover:border-neutral-900 text-[13px] md:text-[15px] font-normal text-neutral-800 hover:bg-neutral-900 hover:text-white transition-all duration-200 flex items-center justify-center">
                Quick Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
