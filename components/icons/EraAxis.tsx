
import React from 'react';

interface EraAxisProps {
  className?: string;
  active?: boolean;
  size?: number;
  variant?: 'wordmark' | 'icon';
}

export const EraAxis: React.FC<EraAxisProps> = ({
  className = "",
  active = false,
  size = 20,
  variant = 'wordmark'
}) => {
  const scale = size / 20;
  const viewBox = variant === 'wordmark' ? "0 0 64 20" : "40 0 24 20";
  const width = variant === 'wordmark' ? 64 : 24;
  const strokeWidth = 2.4;
  const gradientId = `era-gradient-core-${variant}`;

  const isFlat = !active || size < 32;
  const strokeColor = isFlat ? "currentColor" : `url(#${gradientId})`;
  const dotColor = isFlat ? "currentColor" : `url(#${gradientId})`;

  return (
    <div className={`relative group inline-block text-white ${className}`} style={{ width: width * scale, height: 20 * scale }}>
      <svg
        width={width * scale}
        height={20 * scale}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0" y1="0" x2="64" y2="20"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#7C8CFF" />
            <stop offset="100%" stopColor="#6FE3B2" />
          </linearGradient>

          <filter id="core-glow-subtle" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {variant === 'wordmark' && (
          <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" className="transition-all duration-700">
            <path d="M 6 4 L 18 4" />
            <path d="M 6 10 L 16 10" />
            <path d="M 6 16 L 16.5 16" />
          </g>
        )}

        {variant === 'wordmark' && (
          <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700">
            <path d="M 28 4 L 28 16" />
            <path d="M 28 4 H 33 C 37 4 37 10 33 10 H 28" />
            <path d="M 33 10 L 38 16" />
          </g>
        )}

        <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700">
          <path d="M 44 16 L 53 5 L 62 16" />
        </g>

        <circle
          cx="53"
          cy="11"
          r="1.6"
          fill={dotColor}
          filter={!isFlat ? "url(#core-glow-subtle)" : "none"}
          className={`
            transition-all duration-500 ease-out origin-center
            group-hover:scale-125
            ${active ? 'animate-era-axis-pulse' : ''}
          `}
        />
      </svg>
    </div>
  );
};
