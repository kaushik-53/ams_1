import { getAttendanceForStudent, getUserById, getClasses } from "@/lib/actions";
import { StudentAttendanceReport } from "./_components/student-attendance-report";
import type { User } from "@/lib/types";

export default async function StudentDashboardPage({
  searchParams,
}: {
  searchParams: { userId: string };
}) {
  const { userId } = searchParams;
  
  if (!userId) {
    return <p>Student not found. Please log in again.</p>;
  }

  const student = await getUserById(userId);
  const attendanceRecords = await getAttendanceForStudent(userId);
  const classes = await getClasses();

  if (!student) {
    return <p>Student not found.</p>;
  }

  return (
    <StudentAttendanceReport 
        student={student as User} 
        initialRecords={attendanceRecords} 
        classes={classes} 
    />
  );
}
