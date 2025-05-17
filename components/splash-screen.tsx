"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SplashScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [skipSplash, setSkipSplash] = useState(false);

  useEffect(() => {
    // Always show splash for 3 seconds, then redirect
    const timer = setTimeout(() => {
      setLoading(false);
      router.push('/home');
    }, 3000); // 3 seconds
    
    return () => clearTimeout(timer);
  }, [router]);

  // Skip splash screen logic - for potential future use
  useEffect(() => {
    try {
      // Try to check localStorage, but handle potential errors
      const hasShownSplash = sessionStorage.getItem('hasShownSplash');
      
      if (hasShownSplash === 'true') {
        setSkipSplash(true);
        router.push('/home');
      } else {
        // Set the flag for future visits
        sessionStorage.setItem('hasShownSplash', 'true');
      }
    } catch (error) {
      // If localStorage is not available, just continue with splash
      console.log('Session storage not available:', error);
    }
  }, [router]);

  if (skipSplash) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      
      {/* Logo/Image placeholder - replace with your actual image */}
      <div className="relative w-96 h-96 mb-8">
        <Image 
          src="/image.png" 
          alt="AlgoViz Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      
      {/* Team information */}
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text">
          Alg(O)
        </h1>
        <p className="text-xl text-gray-400">
          Team 17
        </p>
      </div>
      
      {/* Loading animation */}
      <div className="mt-12 flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            style={{ 
              animation: `bounce 1.4s infinite ease-in-out both`,
              animationDelay: `${i * 0.16}s`
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 
          40% { 
            transform: scale(1.0);
          }
        }
      `}</style>
    </div>
  );
}
