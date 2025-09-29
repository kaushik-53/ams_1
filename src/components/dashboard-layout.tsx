"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import AppLogo from "./app-logo";
import { UserNav } from "./user-nav";
import { Separator } from "./ui/separator";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const isNavItemActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <AppLogo />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold font-headline tracking-tight">
                AMS
              </h2>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={`${item.href}?userId=${userId}`}>
                  <SidebarMenuButton
                    isActive={isNavItemActive(item)}
                    tooltip={item.label}
                    asChild={false}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2" />
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {navItems.find(isNavItemActive)?.label || "Dashboard"}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
