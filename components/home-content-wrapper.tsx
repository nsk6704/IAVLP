"use client";

import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface HomeContentWrapperProps {
  children: React.ReactNode;
}

export function HomeContentWrapper({ children }: HomeContentWrapperProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  // Get sidebar visibility from header component's state
  const [sidebarVisible, setSidebarVisible] = React.useState(true);
  
  // Listen for sidebar visibility changes
  React.useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarVisible(e.detail.visible);
    };
    
    window.addEventListener('sidebarToggle' as any, handleSidebarToggle);
    return () => {
      window.removeEventListener('sidebarToggle' as any, handleSidebarToggle);
    };
  }, []);

  return (
    <div
      className={cn(
        "flex-1 overflow-auto h-full transition-all duration-300",
        sidebarVisible ? "flex justify-center" : "flex justify-center" // Center content when sidebar is hidden, align left when visible
      )}
    >
      <div 
        className={cn(
          "transition-all duration-300 w-full",
          
        )}
      >
        <main
          className={cn(
            "flex flex-col", // Vertical stacking
            "px-4 py-8 pt-20 min-h-screen transition-all duration-300",
            "w-full", // Full width to work with
          )}
        >
          <div 
            className="w-full transition-all duration-300"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
