import React from 'react';

export const ResponsiveHeroBanner = () => {
  return (
    <section className="w-full bg-neutral-900 text-white relative overflow-hidden">
      {/* Background Graphic Placeholder representing 16:5 Desktop aspect ratio banner media */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Hero Container - 1200px max width matching ramyanagendra layout */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 md:px-[50px] min-h-[220px] sm:min-h-[320px] md:min-h-[450px] py-10 md:py-[50px] flex flex-col justify-center items-center text-center relative z-10">
        
        <span className="text-[12px] md:text-[14px] uppercase tracking-[0.2em] font-normal text-neutral-300 mb-3">
          SEASONAL RELEASE
        </span>

        <h1 className="font-serif font-medium text-[28px] sm:text-[36px] md:text-[42px] leading-[34px] sm:leading-[44px] md:leading-[54px] max-w-[800px] text-white">
          THE ART OF MINIMALIST DESIGN
        </h1>

        <p className="text-[14px] md:text-[16px] leading-[22px] md:leading-[28.8px] font-normal text-neutral-300 max-w-[600px] mt-3">
          Explore curated proportions, responsive grid geometry, and precise layout architecture crafted for every screen.
        </p>

        {/* Primary CTA Button - h-47px, rounded-7px */}
        <a
          href="#explore"
          className="mt-6 md:mt-8 h-[40px] md:h-[47px] px-8 rounded-[7px] bg-white text-neutral-900 text-[14px] md:text-[15px] font-normal leading-[18px] inline-flex items-center justify-center hover:bg-neutral-100 transition-colors duration-200"
        >
          EXPLORE CATALOG
        </a>
      </div>
    </section>
  );
};
