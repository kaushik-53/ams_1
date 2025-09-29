import type { ReactNode, FC } from "react";
import { StudentDashboardLayout } from "./_components/student-dashboard-layout";

const StudentLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <StudentDashboardLayout>{children}</StudentDashboardLayout>;
};

export default StudentLayout;
