import React, { useState } from 'react';
import { ResponsiveHeader } from '../layout/ResponsiveHeader';
import { ResponsiveHeroBanner } from '../hero/ResponsiveHeroBanner';
import { ResponsiveCategoryList } from '../collection/ResponsiveCategoryList';
import { ResponsiveProductGrid } from '../product/ResponsiveProductGrid';
import { ResponsiveCollageGrid } from '../collage/ResponsiveCollageGrid';
import { ResponsiveFooter } from '../layout/ResponsiveFooter';
import { Monitor, Tablet, Smartphone, Maximize2 } from 'lucide-react';

const BREAKPOINTS = [
  { label: '320px', width: 320, category: 'Mobile Compact', icon: Smartphone },
  { label: '360px', width: 360, category: 'Android Small', icon: Smartphone },
  { label: '375px', width: 375, category: 'iPhone Small', icon: Smartphone },
  { label: '390px', width: 390, category: 'iPhone Standard', icon: Smartphone },
  { label: '414px', width: 414, category: 'Mobile Plus', icon: Smartphone },
  { label: '430px', width: 430, category: 'iPhone Pro Max', icon: Smartphone },
  { label: '768px', width: 768, category: 'Tablet Portrait', icon: Tablet },
  { label: '1024px', width: 1024, category: 'Tablet Landscape', icon: Tablet },
  { label: '1280px', width: 1280, category: 'Desktop Laptop', icon: Monitor },
  { label: '1440px', width: 1440, category: 'Desktop Standard', icon: Monitor },
  { label: '1920px', width: 1920, category: 'Desktop Widescreen', icon: Monitor },
];

export const ResponsiveLayoutDemo = () => {
  const [activeWidth, setActiveWidth] = useState(null);

  return (
    <div className="w-full min-h-screen bg-neutral-100 flex flex-col items-center">
      
      {/* Breakpoint Switcher Toolbar Header */}
      <div className="w-full bg-neutral-900 text-white py-3 px-4 sticky top-0 z-50 shadow-md border-b border-neutral-800">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-400 tracking-wide">RESPONSIVE LAYOUT SYSTEM</span>
            <span className="text-neutral-400">| RamyaNagendra Geometry Replica</span>
          </div>

          {/* Breakpoint Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              onClick={() => setActiveWidth(null)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                activeWidth === null 
                  ? 'bg-amber-400 text-neutral-900 font-semibold' 
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <Maximize2 className="w-3 h-3" />
              Fluid (100%)
            </button>

            {BREAKPOINTS.map((bp) => {
              const Icon = bp.icon;
              const isActive = activeWidth === bp.width;
              return (
                <button
                  key={bp.label}
                  onClick={() => setActiveWidth(bp.width)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                    isActive 
                      ? 'bg-white text-neutral-900 font-semibold shadow-xs' 
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                  title={`${bp.label} (${bp.category})`}
                >
                  <Icon className="w-3 h-3 opacity-70" />
                  {bp.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Frame Container */}
      <div className="w-full flex-1 flex justify-center py-4 md:py-8 px-2">
        <div 
          className="bg-white transition-all duration-300 shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
          style={{ 
            width: activeWidth ? `${activeWidth}px` : '100%',
            maxWidth: activeWidth ? `${activeWidth}px` : '100%',
            minHeight: '800px'
          }}
        >
          {/* Active Viewport Label */}
          {activeWidth && (
            <div className="w-full bg-neutral-100 border-b border-neutral-200 py-1.5 px-4 text-center text-[11px] text-neutral-500 font-mono">
              Simulating Viewport Width: <span className="font-semibold text-neutral-800">{activeWidth}px</span>
            </div>
          )}

          {/* Core Page Assembly */}
          <ResponsiveHeader />
          <main className="flex-1">
            <ResponsiveHeroBanner />
            <ResponsiveCategoryList />
            <ResponsiveProductGrid 
              title="NEW ARRIVALS (5-COLUMN DESKTOP GRID)" 
              subtitle="Calculated 20% desktop column width (calc(20% - 9.6px)) scaling to 50% mobile grid"
              columns={5} 
            />
            <ResponsiveCollageGrid />
            <ResponsiveProductGrid 
              title="TRENDING SELECTION (4-COLUMN GRID)" 
              subtitle="Calculated 25% desktop column width scaling to 50% mobile grid"
              columns={4} 
            />
          </main>
          <ResponsiveFooter />

        </div>
      </div>
    </div>
  );
};
