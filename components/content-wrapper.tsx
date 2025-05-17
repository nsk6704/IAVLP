"use client";

import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface ContentWrapperProps {
  children: React.ReactNode;
}

export function ContentWrapper({ children }: ContentWrapperProps) {
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
        sidebarVisible ? "flex justify-start" : "flex justify-center" // Center content when sidebar is hidden, align left when visible
      )}
    >
      <div 
        className={cn(
          "transition-all duration-300",
          sidebarVisible ? "md:ml-64" : "md:ml-64" // Add margin only when sidebar is visible (16rem = 64 in tailwind units)
        )}
      >
        <main
          className={cn(
            "flex flex-col", // Vertical stacking
            "px-4 py-8 pt-20 min-h-screen transition-all duration-300",
            "w-full", // Full width to work with
            sidebarVisible ? "md:pl-6 md:pr-8 max-w-6xl" : "" // Center with mx-auto when sidebar is hidden
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