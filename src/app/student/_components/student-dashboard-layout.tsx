"use client";

import type { ReactNode, FC } from "react";
import {
  DashboardLayout,
  type NavItem,
} from "@/components/dashboard-layout";
import { BarChart3, CalendarDays } from "lucide-react";

const studentNavItems: NavItem[] = [
  { href: "/student", label: "My Attendance", icon: BarChart3, exact: true },
  { href: "/student/timetable", label: "Timetable", icon: CalendarDays },
];

export const StudentDashboardLayout: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <DashboardLayout navItems={studentNavItems}>{children}</DashboardLayout>
  );
};
