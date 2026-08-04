import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react';

export const ResponsiveHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="w-full bg-neutral-900 text-white text-center py-2 px-4 text-[12px] md:text-[13px] font-normal tracking-wide">
        <span>Complimentary Shipping & Express Worldwide Delivery</span>
      </div>

      {/* Main Header Container - 1200px max width */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 md:px-[50px] h-[69.7px] md:h-[86.3px] flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] gap-4">
        
        {/* Left Slot: Mobile Menu Trigger & Search */}
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 md:hidden text-neutral-800 hover:text-neutral-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <button 
            className="w-[44px] h-[44px] flex items-center justify-center text-neutral-800 hover:text-neutral-900 transition-colors"
            aria-label="Search items"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-[15px] lg:text-[16px] leading-[28.8px] font-normal text-neutral-700">
            <a href="#new" className="hover:text-neutral-900 transition-colors">New Arrivals</a>
            <a href="#collections" className="hover:text-neutral-900 transition-colors">Collections</a>
            <a href="#featured" className="hover:text-neutral-900 transition-colors">Featured</a>
            <a href="#about" className="hover:text-neutral-900 transition-colors">About Us</a>
          </nav>
        </div>

        {/* Center Slot: Brand Title / Logo Geometry */}
        <div className="text-center flex justify-center">
          <a href="#" className="inline-block">
            <span className="font-serif font-medium text-[24px] sm:text-[31.5px] md:text-[42px] leading-none tracking-tight text-neutral-900">
              ATELIER SYSTEM
            </span>
          </a>
        </div>

        {/* Right Slot: User Account & Shopping Cart */}
        <div className="flex items-center justify-end gap-2 md:gap-4">
          <button 
            className="hidden sm:flex w-[44px] h-[44px] items-center justify-center text-neutral-800 hover:text-neutral-900 transition-colors"
            aria-label="User Account"
          >
            <User className="w-5 h-5" />
          </button>
          
          <button 
            className="w-[44px] h-[44px] flex items-center justify-center text-neutral-800 hover:text-neutral-900 transition-colors relative"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-4 h-4 bg-neutral-900 text-white rounded-full text-[10px] font-medium flex items-center justify-center">
              2
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-white border-t border-neutral-100 py-4 px-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 text-[15px] font-normal text-neutral-800">
            <a href="#new" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-neutral-900">New Arrivals</a>
            <a href="#collections" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-neutral-900">Collections</a>
            <a href="#featured" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-neutral-900">Featured Products</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-neutral-900">About Us</a>
          </nav>
        </div>
      )}
    </header>
  );
};
