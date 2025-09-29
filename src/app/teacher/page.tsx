
import { getUserById, getClasses, getTimetable } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeacherAttendance } from "./_components/teacher-attendance";

export default async function TeacherDashboardPage({
  searchParams,
}: {
  searchParams: { [key:string]: string | string[] | undefined };
}) {
  const userId = searchParams.userId as string;
  const teacher = await getUserById(userId);

  if (!teacher || teacher.role !== 'teacher') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not load teacher information. Please log in again.</p>
        </CardContent>
      </Card>
    )
  }
  
  const timetable = await getTimetable();
  const allClasses = await getClasses();

  const teacherClassIds = [...new Set(timetable.filter(t => t.teacherId === teacher.id).map(t => t.classId))];
  const teacherClasses = allClasses.filter(c => teacherClassIds.includes(c.id));


  return (
    <div>
        <TeacherAttendance 
            teacher={teacher}
            teacherClasses={teacherClasses}
            timetable={timetable.filter(t => t.teacherId === teacher.id)}
        />
    </div>
  );
}
