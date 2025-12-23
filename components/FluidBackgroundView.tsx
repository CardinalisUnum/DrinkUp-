import React from 'react';
import { DrinkUpColors } from '../constants';

interface FluidBackgroundViewProps {
  currentHydrationPercentage: number; // 0.0 to 1.0
}

export const FluidBackgroundView: React.FC<FluidBackgroundViewProps> = ({ currentHydrationPercentage }) => {
  // Clamp percentage
  const pct = Math.min(Math.max(currentHydrationPercentage, 0), 1);
  
  // Calculate the "Liquid Level". 
  // 0% -> blobs at bottom (-20%)
  // 100% -> blobs fill screen (100%)
  // We use a CSS transform to move the container up.
  const liquidHeight = pct * 110; 

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#050505]">
      {/* 
        SVG Filter for "Gooey" effect.
        This blends the overlapping blurred divs together to look like a single liquid mass.
      */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>

      {/* Background Gradient Base */}
      <div 
        className="absolute inset-0"
        style={{
           background: `radial-gradient(circle at 50% 120%, #001525 0%, ${DrinkUpColors.voidBlack} 80%)`
        }}
      />

      {/* The Liquid Container */}
      <div 
        className="absolute w-full h-full left-0 transition-transform duration-[1500ms] cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        style={{
            transform: `translateY(${100 - liquidHeight}%)`,
            // Apply the goo filter to this container
            filter: 'url(#goo)', 
        }}
      >
        {/* We use a container that is taller than the screen to hold the blobs */}
        <div className="absolute bottom-0 w-full h-[120vh]">
            
            {/* Orb 1: Main Body */}
            <div 
              className="absolute rounded-full animate-drift-slow mix-blend-screen"
              style={{
                backgroundColor: DrinkUpColors.deepOceanBlue,
                width: '140vw',
                height: '140vw',
                left: '-20%',
                bottom: '-60vw',
                opacity: 0.9,
              }}
            />

            {/* Orb 2: Highlight/Cyan */}
            <div 
              className="absolute rounded-full animate-drift-medium mix-blend-screen"
              style={{
                backgroundColor: DrinkUpColors.bioCyan,
                width: '100vw',
                height: '100vw',
                right: '-20%',
                bottom: '-40vw',
                opacity: 0.7,
              }}
            />

            {/* Orb 3: Floating detail */}
            <div 
              className="absolute rounded-full animate-drift-fast mix-blend-screen"
              style={{
                backgroundColor: DrinkUpColors.bioCyan,
                width: '60vw',
                height: '60vw',
                left: '20%',
                bottom: '10%',
                opacity: 0.5,
              }}
            />
            
            {/* Orb 4: Deep filler */}
             <div 
              className="absolute rounded-full animate-pulse-slow"
              style={{
                backgroundColor: '#0033aa',
                width: '150vw',
                height: '80vh',
                left: '-25%',
                bottom: '-10%',
                opacity: 0.8,
              }}
            />
        </div>
      </div>

      <style>{`
        @keyframes drift-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(2deg); }
        }
        @keyframes drift-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(1.05); }
        }
        @keyframes drift-fast {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(40px, -50px); }
          66% { transform: translate(-20px, 20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
        .animate-drift-slow { animation: drift-slow 15s ease-in-out infinite; }
        .animate-drift-medium { animation: drift-medium 10s ease-in-out infinite; }
        .animate-drift-fast { animation: drift-fast 8s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};