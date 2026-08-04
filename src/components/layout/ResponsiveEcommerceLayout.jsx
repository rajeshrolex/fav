import React, { useState } from 'react';
import { 
  Menu, X, Search, ShoppingBag, Heart, User, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowRight 
} from 'lucide-react';

/**
 * Replicated Layout System based on ramyanagendra.com analysis.
 * Implements exact responsive grid proportions, breakpoints, spacing, aspect ratios, and padding systems.
 * Pure layout reproduction - no external branding or copied content.
 */

// Sample demo items to demonstrate card proportions
const DEMO_PRODUCTS = [
  { id: 1, title: 'Sample Product Item One', price: '$49.00', originalPrice: '$65.00', badge: 'Best Seller' },
  { id: 2, title: 'Sample Product Item Two', price: '$89.00', badge: 'New' },
  { id: 3, title: 'Sample Product Item Three', price: '$29.00', originalPrice: '$35.00' },
  { id: 4, title: 'Sample Product Item Four', price: '$120.00', badge: 'Featured' },
  { id: 5, title: 'Sample Product Item Five', price: '$75.00' },
  { id: 6, title: 'Sample Product Item Six', price: '$55.00', originalPrice: '$70.00' },
  { id: 7, title: 'Sample Product Item Seven', price: '$95.00' },
  { id: 8, title: 'Sample Product Item Eight', price: '$110.00' },
  { id: 9, title: 'Sample Product Item Nine', price: '$65.00', badge: 'Trending' },
  { id: 10, title: 'Sample Product Item Ten', price: '$40.00' },
];

const DEMO_CATEGORIES = [
  { id: 1, title: 'Category One', count: '24 Items' },
  { id: 2, title: 'Category Two', count: '18 Items' },
  { id: 3, title: 'Category Three', count: '32 Items' },
  { id: 4, title: 'Category Four', count: '15 Items' },
  { id: 5, title: 'Category Five', count: '40 Items' },
];

export default function ResponsiveEcommerceLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans antialiased">
      {/* Top Announcement Bar */}
      <div className="bg-neutral-900 text-white text-xs py-2 px-4 text-center font-medium tracking-wide">
        Complimentary Shipping on Orders Over $100 | Worldwide Express Delivery
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-16 lg:h-20 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button & Desktop Left Navigation */}
          <div className="flex items-center gap-4 lg:w-1/3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-neutral-700">
              <a href="#home" className="hover:text-neutral-900 transition-colors border-b-2 border-neutral-900 pb-0.5">Home</a>
              <a href="#shop" className="hover:text-neutral-900 transition-colors">Shop</a>
              <a href="#categories" className="hover:text-neutral-900 transition-colors">Categories</a>
              <a href="#about" className="hover:text-neutral-900 transition-colors">About Us</a>
              <a href="#contact" className="hover:text-neutral-900 transition-colors">Contact</a>
            </nav>
          </div>

          {/* Centered Brand Logo Placeholder */}
          <div className="lg:w-1/3 text-center flex justify-center">
            <a href="#" className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              <span className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-serif text-base">L</span>
              <span>BRAND</span>
            </a>
          </div>

          {/* Right Icons (Search, Account, Wishlist, Cart) */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 lg:w-1/3 text-neutral-700">
            <button className="p-1.5 hover:text-neutral-900 transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="hidden sm:block p-1.5 hover:text-neutral-900 transition-colors" aria-label="Account">
              <User size={20} />
            </button>
            <button className="p-1.5 hover:text-neutral-900 transition-colors relative" aria-label="Wishlist">
              <Heart size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-900 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">2</span>
            </button>
            <button className="p-1.5 hover:text-neutral-900 transition-colors relative" aria-label="Cart">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-900 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">3</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-neutral-200 px-6 py-5 flex flex-col gap-4 text-base font-medium">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="py-1 text-neutral-900 font-semibold">Home</a>
            <a href="#shop" onClick={() => setMobileMenuOpen(false)} className="py-1 text-neutral-700">Shop</a>
            <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="py-1 text-neutral-700">Categories</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-1 text-neutral-700">About Us</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-1 text-neutral-700">Contact</a>
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main className="w-full">
        
        {/* Section 1: Hero Banner Component */}
        <section className="w-full bg-neutral-200 relative overflow-hidden">
          <div className="w-full max-w-[1440px] mx-auto min-h-[220px] xs:min-h-[260px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-[480px] flex items-center justify-center p-6 sm:p-10 lg:p-16 relative">
            <div className="absolute inset-0 bg-neutral-900/40 z-10" />
            <div className="relative z-20 text-center max-w-2xl text-white px-4">
              <span className="inline-block uppercase tracking-widest text-[11px] sm:text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-3">
                New Season Collection
              </span>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
                Contemporary Elegance & Timeless Style
              </h1>
              <p className="text-sm sm:text-base text-neutral-100 font-normal leading-relaxed mb-6 max-w-xl mx-auto hidden sm:block">
                Explore curated artisanal designs crafted with exceptional precision and modern aesthetics.
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <a href="#shop" className="px-6 py-2.5 sm:py-3 bg-white text-neutral-900 text-xs sm:text-sm font-semibold rounded-lg hover:bg-neutral-100 transition-colors shadow-sm inline-flex items-center gap-2">
                  Shop Collection <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Best Sellers Grid (5-column Desktop, 3-column Tablet, 2-column Mobile) */}
        <section id="shop" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14 lg:py-16">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 tracking-tight">Best Sellers</h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">Our most popular designs loved by customers</p>
            </div>
            <a href="#all" className="text-xs sm:text-sm font-semibold text-neutral-900 hover:underline inline-flex items-center gap-1">
              View All <ChevronRight size={16} />
            </a>
          </div>

          {/* 5-Column Grid Layout matching Desktop/Mobile proportion system */}
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {DEMO_PRODUCTS.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Section 3: Categories Grid */}
        <section id="categories" className="w-full bg-neutral-100/70 border-y border-neutral-200/80 py-10 sm:py-14 lg:py-16">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 tracking-tight">Top Categories</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700" aria-label="Previous">
                  <ChevronLeft size={18} />
                </button>
                <button className="p-2 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700" aria-label="Next">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {DEMO_CATEGORIES.map((cat) => (
                <div key={cat.id} className="group bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm hover:shadow-md transition-all text-center cursor-pointer">
                  <div className="w-full aspect-square bg-neutral-200 rounded-md mb-3 group-hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center text-neutral-400">
                    Category Image
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">{cat.title}</h3>
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Collection Highlights (10 Items 5-col Grid Desktop, 2-col Mobile) */}
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14 lg:py-16">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-bold text-neutral-900 tracking-tight mb-2">Handmade Collection</h2>
            <p className="text-xs sm:text-sm text-neutral-600">Thoughtfully curated and individually crafted items</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {DEMO_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </main>

      {/* Footer Component */}
      <footer className="w-full bg-neutral-900 text-white border-t border-neutral-800 py-10 sm:py-14">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col items-center gap-8 text-center">
          
          {/* Footer Nav Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-neutral-300 font-medium">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">Shop All</a>
            <a href="#" className="hover:text-white transition-colors">Categories</a>
            <a href="#" className="hover:text-white transition-colors">About Us</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </nav>

          {/* Divider */}
          <div className="w-16 h-px bg-neutral-800" />

          {/* Social Icons Placeholder & Copyright */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-4 text-neutral-400">
              <span className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 hover:text-white cursor-pointer transition-colors text-xs">FB</span>
              <span className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 hover:text-white cursor-pointer transition-colors text-xs">IG</span>
              <span className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 hover:text-white cursor-pointer transition-colors text-xs">YT</span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-500">
              © {new Date().getFullYear()} BRAND NAME. All rights reserved. Built with Responsive Proportional System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-component: Reusable Product Card maintaining exact layout metrics & aspect ratios
function ProductCard({ product }) {
  return (
    <div className="group bg-white rounded-lg sm:rounded-xl border border-neutral-200/80 p-2.5 sm:p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200">
      <div>
        {/* Product Aspect Square Placeholder Image Container */}
        <div className="w-full aspect-square bg-neutral-200 rounded-md overflow-hidden relative mb-2.5 flex items-center justify-center text-neutral-400 text-xs">
          {product.badge && (
            <span className="absolute top-2 left-2 z-10 bg-neutral-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              {product.badge}
            </span>
          )}
          Product Image (1:1)
        </div>

        {/* Product Title */}
        <h3 className="text-xs sm:text-sm font-medium text-neutral-900 group-hover:text-neutral-700 line-clamp-2 leading-snug">
          {product.title}
        </h3>
      </div>

      {/* Price Container */}
      <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-baseline gap-2">
        <span className="text-xs sm:text-sm font-bold text-neutral-900">{product.price}</span>
        {product.originalPrice && (
          <span className="text-[11px] text-neutral-400 line-through font-normal">{product.originalPrice}</span>
        )}
      </div>
    </div>
  );
}
