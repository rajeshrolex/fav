import React from 'react';

export const ResponsiveCollageGrid = () => {
  return (
    <section className="w-full pt-[36px] pb-[36px] md:pt-[36px] md:pb-[36px] bg-white border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 md:px-[50px]">
        
        {/* Section Title - H1 / H2 level */}
        <h2 className="font-serif font-medium text-[28px] md:text-[42px] leading-[36px] md:leading-[54px] text-neutral-900 mb-6 md:mb-8 text-center md:text-left">
          CURATED GALLERY
        </h2>

        {/* Asymmetric Desktop Collage Grid (7/12 split), Stacked Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          
          {/* Main Large Featured Item (Left Column) */}
          <div className="md:col-span-7 lg:col-span-8 bg-neutral-100 min-h-[350px] md:min-h-[500px] rounded-none p-6 md:p-10 flex flex-col justify-end relative overflow-hidden border border-neutral-200/50 group">
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent z-10" />
            
            <div className="relative z-20 text-white">
              <span className="text-[11px] md:text-[12px] uppercase tracking-widest text-neutral-300 font-normal">
                FEATURED LOOKBOOK
              </span>
              <h3 className="font-serif font-medium text-[22px] md:text-[32px] leading-[28px] md:leading-[40px] mt-1">
                ARCHITECTURAL SILHOUETTES
              </h3>
              <p className="text-[13px] md:text-[15px] text-neutral-200 mt-2 max-w-[450px]">
                Exploring proportions, negative space, and bold geometric structures in modern craftsmanship.
              </p>
              <a href="#" className="inline-flex items-center gap-2 mt-4 text-[14px] md:text-[15px] font-normal underline underline-offset-4 hover:text-white">
                Discover Campaign
              </a>
            </div>
          </div>

          {/* Secondary Stacked Items (Right Column) */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4 md:gap-6">
            
            {/* Top Right Item */}
            <div className="bg-neutral-100 min-h-[220px] md:min-h-[238px] p-6 flex flex-col justify-end relative overflow-hidden border border-neutral-200/50 group">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent z-10" />
              <div className="relative z-20 text-white">
                <span className="text-[11px] uppercase tracking-widest text-neutral-300">
                  NEW ARRIVALS
                </span>
                <h4 className="font-serif text-[18px] md:text-[20px] font-medium leading-[24px] mt-1">
                  Sculptural Rings
                </h4>
              </div>
            </div>

            {/* Bottom Right Item */}
            <div className="bg-neutral-100 min-h-[220px] md:min-h-[238px] p-6 flex flex-col justify-end relative overflow-hidden border border-neutral-200/50 group">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent z-10" />
              <div className="relative z-20 text-white">
                <span className="text-[11px] uppercase tracking-widest text-neutral-300">
                  LIMITED EDITION
                </span>
                <h4 className="font-serif text-[18px] md:text-[20px] font-medium leading-[24px] mt-1">
                  Artisanal Pendants
                </h4>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
