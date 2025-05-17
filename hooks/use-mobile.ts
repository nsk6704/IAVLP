"use client";

import { useEffect, useState } from "react";

// Custom hook to detect if the current viewport is mobile-sized
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if the viewport width is mobile-sized
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is a common breakpoint for mobile
    };

    // Check on initial render
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
