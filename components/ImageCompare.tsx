
import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as Icons from './icons';

interface ImageCompareProps {
  beforeSrc: string;
  afterSrc: string;
}

const ImageCompare: React.FC<ImageCompareProps> = ({ beforeSrc, afterSrc }) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    handleMove(e.touches[0].clientX);
  };
  
  const handleEnd = () => {
    isDragging.current = false;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  useEffect(() => {
    // Add listeners to window to allow dragging outside the component
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [handleMouseMove, handleTouchMove]);


  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <img src={beforeSrc} alt="Before" className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={afterSrc} alt="After" className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm cursor-ew-resize"
        style={{ left: `calc(${sliderPos}% - 0.5px)` }}
      >
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white/70 flex items-center justify-center text-zinc-900 shadow-lg"
        >
          <Icons.CompareSliderIcon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default ImageCompare;
