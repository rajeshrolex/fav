import React from 'react';

export const ResponsiveFooter = () => {
  return (
    <footer className="w-full bg-neutral-900 text-neutral-300 pt-8 pb-4 md:pt-[32px] md:pb-[16px]">
      {/* Footer Container - 1200px max width */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 md:px-[50px]">
        
        {/* Top Content Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8 md:pb-[50px] border-b border-neutral-800">
          
          {/* Col 1 */}
          <div>
            <h4 className="font-medium text-[15px] md:text-[16px] text-white uppercase tracking-wider mb-3 md:mb-4">
              ABOUT ATELIER
            </h4>
            <p className="text-[13px] md:text-[15px] leading-[22px] md:leading-[27px] font-normal text-neutral-400">
              Dedicated to precision spacing, harmonious visual proportions, and pure layout system engineering across all devices.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-medium text-[15px] md:text-[16px] text-white uppercase tracking-wider mb-3 md:mb-4">
              COLLECTIONS
            </h4>
            <ul className="space-y-2 text-[13px] md:text-[15px] leading-[22px] md:leading-[27px] font-normal text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">Fine Necklaces</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Earring Sets</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Statement Bangles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Artisanal Rings</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-medium text-[15px] md:text-[16px] text-white uppercase tracking-wider mb-3 md:mb-4">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-[13px] md:text-[15px] leading-[22px] md:leading-[27px] font-normal text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Care Instructions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-medium text-[15px] md:text-[16px] text-white uppercase tracking-wider mb-3 md:mb-4">
              NEWSLETTER
            </h4>
            <p className="text-[13px] md:text-[15px] leading-[22px] md:leading-[27px] text-neutral-400 mb-3">
              Subscribe to receive updates on new catalog releases.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter email..." 
                className="w-full bg-neutral-800 border border-neutral-700 rounded-l-[7px] px-3 py-2 text-[13px] text-white focus:outline-none focus:border-neutral-500"
              />
              <button className="bg-white text-neutral-900 px-4 rounded-r-[7px] text-[13px] font-medium hover:bg-neutral-200 transition-colors">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[12px] md:text-[14px] text-neutral-500 gap-3">
          <p>© 2026 Layout System Replica. Recreated layout proportions only.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-300">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
