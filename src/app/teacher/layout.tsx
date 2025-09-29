import type { ReactNode, FC } from "react";
import { TeacherDashboardLayout } from "./_components/teacher-dashboard-layout";

const TeacherLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <TeacherDashboardLayout>{children}</TeacherDashboardLayout>;
};

export default TeacherLayout;
