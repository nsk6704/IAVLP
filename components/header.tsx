"use client"

import * as React from "react"
import Link from "next/link"
import { GitGraph, ChevronRight, ChevronLeft, Menu, PanelLeft } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/app-sidebar"

export function Header() {
  // Access the sidebar state
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [sidebarVisible, setSidebarVisible] = React.useState(false)
  
  // Toggle sidebar visibility
  const handleToggleSidebar = () => {
    toggleSidebar()
    const newVisibility = !sidebarVisible
    setSidebarVisible(newVisibility)
    
    // Dispatch custom event for ContentWrapper to listen to
    const event = new CustomEvent('sidebarToggle', { 
      detail: { visible: newVisibility } 
    })
    window.dispatchEvent(event)
  }
  
  // Dispatch initial sidebar state on component mount
  React.useEffect(() => {
    const event = new CustomEvent('sidebarToggle', { 
      detail: { visible: sidebarVisible } 
    })
    window.dispatchEvent(event)
  }, [])
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-lg z-50",
        "border-b border-white/10 transition-all duration-300",
      )}
    >
      {/* Sidebar toggle button - positioned absolutely */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex"
        onClick={handleToggleSidebar}
        aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
      >
        {!sidebarVisible ? <PanelLeft className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </Button>
      
      {/* Conditionally rendered sidebar */}
      <div className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 transition-all duration-300",
        sidebarVisible ? "translate-x-0" : "-translate-x-full",
        "md:block"
      )}>
        <AppSidebar className="h-full" />
      </div>
      
      <div 
        className={cn(
          "h-full flex items-center justify-between",
          "px-4 md:px-8 ml-8 md:ml-24", // Added left margin to make room for the toggle button
        )}
      >
        {/* Logo on leftmost */}
        <Link href="/" className="flex items-center gap-2">
          <GitGraph className="w-7 h-7 text-purple-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text">
            AlgoViz
          </span>
        </Link>
        
        {/* Auth buttons and Contact Us */}
        <div className="flex items-center gap-3">
          {/* Contact Us button with improved styling */}
          <Link href="/contact">
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/90 to-cyan-500/90 text-white font-medium text-sm hover:from-purple-600 hover:to-cyan-600 transition-all shadow-md shadow-purple-500/20">
              Contact Us
            </button>
          </Link>
          
          <UserButton 
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8",
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}
