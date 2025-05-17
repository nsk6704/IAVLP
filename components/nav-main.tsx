"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home, BookOpen, Code, Brain } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

// Navigation items for the main sidebar
const navItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Sorting Algorithms",
    href: "/sorting",
    icon: Code,
    items: [
      { title: "Bubble Sort", url: "/sorting/bubble" },
      { title: "Quick Sort", url: "/sorting/quick" },
      { title: "Merge Sort", url: "/sorting/merge" },
      { title: "Insertion Sort", url: "/sorting/insertion" },
    ],
  },
  {
    title: "Take Quiz",
    href: "/quiz",
    icon: Brain,
  },
  {
    title: "Learning Resources",
    href: "/resources",
    icon: BookOpen,
  },
]

export function NavMain() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {!isCollapsed && "Navigation"}
      </SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => {
          // If the item has sub-items, render a collapsible menu
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible key={item.title}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      isActive={pathname?.startsWith(item.href)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                      <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }
          
          // Otherwise, render a simple menu item
          return (
            <SidebarMenuItem key={item.title}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  isActive={pathname === item.href}
                >
                  <div className="flex w-full items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
