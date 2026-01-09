
import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export const ANIMATION_URLS = {
  // Using reliable public CDN links for lottie files. If these fail, the component handles it gracefully.
  scanning: "https://lottie.host/5a709033-6677-4903-b09e-782873859666/lP3Y7K3X1c.json",
  success: "https://lottie.host/9f6a4220-4222-4545-937d-513636243265/2e5c851c-8132-4d0f-9020-006230553026.json",
  confetti: "https://lottie.host/2e70e2f9-7e9b-430b-983e-903429396739/2e5c851c-8132-4d0f-9020-006230553026.json",
  processing: "https://lottie.host/02008779-3738-4e6b-a532-34907a3466f2/2e5c851c-8132-4d0f-9020-006230553026.json"
};

interface LottieAnimationProps {
  type: keyof typeof ANIMATION_URLS;
  className?: string;
  loop?: boolean;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({ type, className, loop = true }) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAnimation = async () => {
      try {
        const response = await fetch(ANIMATION_URLS[type]);
        if (!response.ok) throw new Error('Failed to load animation');
        const data = await response.json();
        if (isMounted) setAnimationData(data);
      } catch (err) {
        // Silently fail to avoid console spam for 404s/network issues in demo environment
        if (isMounted) setError(true);
      }
    };

    fetchAnimation();

    return () => { isMounted = false; };
  }, [type]);

  if (error || !Lottie) return null; // Safe guard if Lottie library is undefined
  if (!animationData) return <div className={`animate-pulse bg-white/5 rounded-full ${className}`} />;

  return (
    <div className={`animate-in fade-in duration-700 ${className}`}>
      <Lottie animationData={animationData} loop={loop} className="w-full h-full" />
    </div>
  );
};
