import type { ReactNode, FC } from "react";
import { AdminDashboardLayout } from "./_components/admin-dashboard-layout";

const AdminLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
};

export default AdminLayout;
