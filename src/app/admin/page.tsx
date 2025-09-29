import {
  getAllAttendance,
  getStudents,
  getTeachers,
} from "@/lib/actions";
import { AdminDashboard } from "./_components/admin-dashboard";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const students = await getStudents();
  const teachers = await getTeachers();
  const attendanceRecords = await getAllAttendance();
  
  const isDataSeeded = students.length > 0 || teachers.length > 0;

  const recentAbsences = attendanceRecords
    .filter((a) => a.status === "absent")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(record => {
        const student = students.find(s => s.id === record.studentId);
        return {
            ...record,
            studentName: student?.name,
        }
    });

  return (
    <AdminDashboard 
        students={students}
        teachers={teachers}
        attendanceRecords={attendanceRecords}
        recentAbsences={recentAbsences}
        searchParams={searchParams}
        isDataSeeded={isDataSeeded}
    />
  );
}
