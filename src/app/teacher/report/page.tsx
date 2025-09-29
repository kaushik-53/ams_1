
import { getClasses, getUserById, getTimetable, getStudents, getAllAttendance } from "@/lib/actions";
import { TeacherAttendanceReport } from "./_components/teacher-attendance-report";

export default async function TeacherReportPage({
  searchParams,
}: {
  searchParams: { userId: string };
}) {
  const { userId } = searchParams;
  const teacher = await getUserById(userId);

  if (!teacher) {
    return <p>Could not load teacher information.</p>;
  }

  const allStudents = await getStudents();
  const allAttendanceRecords = await getAllAttendance();
  const allClasses = await getClasses();
  const timetable = await getTimetable();

  // Get class IDs from timetable where the current teacher teaches
  const classIdsFromTimetable = timetable.filter(t => t.teacherId === teacher.id).map(t => t.classId);
  
  // Get class IDs where the teacher is the main class teacher
  const classIdsFromClassList = allClasses.filter(c => c.teacherId === teacher.id).map(c => c.id);

  // Combine and get unique class IDs for all classes the teacher is associated with
  const teacherClassIds = [...new Set([...classIdsFromTimetable, ...classIdsFromClassList])];

  const teacherClasses = allClasses.filter(c => teacherClassIds.includes(c.id));

  // Filter records to only those in the teacher's classes
  const recordsForTeacherClasses = allAttendanceRecords.filter(r => r.classId && teacherClassIds.includes(r.classId));
  
  // Correctly gather ALL students from the teacher's classes to pass to the client component.
  // The client component will handle filtering per-class.
  const studentsForTeacherClasses = allStudents.filter(s => s.classId && teacherClassIds.includes(s.classId));


  return (
    <div>
      <TeacherAttendanceReport
        allRecords={recordsForTeacherClasses}
        allStudents={studentsForTeacherClasses}
        teacherClasses={teacherClasses}
      />
    </div>
  );
}
