
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icons } from '../Icons';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const PULL_THRESHOLD = 80;
  const MAX_PULL = 150;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].pageY;
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling || refreshing) return;

    const currentY = e.touches[0].pageY;
    const diff = currentY - startY.current;

    if (diff > 0 && window.scrollY === 0) {
      // Elastic resistance formula
      const resistance = 0.4;
      const distance = Math.min(diff * resistance, MAX_PULL);
      setPullDistance(distance);

      if (e.cancelable) e.preventDefault();
    } else {
      setPulling(false);
      setPullDistance(0);
    }
  };

  const handleTouchEnd = async () => {
    if (!pulling || refreshing) return;

    if (pullDistance >= PULL_THRESHOLD) {
      setRefreshing(true);
      setPullDistance(PULL_THRESHOLD);
      try {
        await onRefresh();
      } finally {
        // Smooth return
        setTimeout(() => {
          setRefreshing(false);
          setPullDistance(0);
          setPulling(false);
        }, 500);
      }
    } else {
      setPullDistance(0);
      setPulling(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full touch-none"
      style={{
        transform: `translateY(${pullDistance}px)`,
        transition: pulling ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0, 0, 1)'
      }}
    >
      {/* Refresh Indicator */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center pointer-events-none"
        style={{
          top: -60,
          opacity: Math.min(pullDistance / PULL_THRESHOLD, 1),
          transform: `scale(${Math.min(pullDistance / PULL_THRESHOLD, 1)})`
        }}
      >
        <div className="bg-white/5 backdrop-blur-3xl p-3 rounded-full border border-white/10 text-white shadow-2xl">
          {refreshing ? (
            <Icons.Loader2 size={24} className="animate-spin text-indigo-500" />
          ) : (
            <Icons.ArrowDown size={24} style={{ transform: `rotate(${pullDistance * 2}deg)` }} />
          )}
        </div>
      </div>

      <div className="w-full h-full overflow-y-auto no-scrollbar" style={{ height: '100vh' }}>
        {children}
      </div>
    </div>
  );
};
