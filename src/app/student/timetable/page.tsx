import { getTimetable, getTeachers, getClasses, getUserById } from "@/lib/actions";
import { TimetableGrid } from "@/components/timetable-grid";

export default async function StudentTimetablePage({ searchParams }: { searchParams: { userId: string }}) {
    const { userId } = searchParams;
    const student = await getUserById(userId);

    if (!student || !student.classId) {
        return <p>Could not load student information.</p>
    }

    const timetable = (await getTimetable()).filter(t => t.classId === student.classId);
    const teachers = await getTeachers();
    const studentClass = (await getClasses()).find(c => c.id === student.classId);

    return (
        <div className="space-y-6">
            {studentClass &&
                <TimetableGrid 
                    title={`${studentClass.name} Schedule`}
                    description={`Weekly timetable for ${studentClass.name}.`}
                    timetable={timetable}
                    teachers={teachers}
                    classes={[studentClass]}
                />
            }
        </div>
    )
}
