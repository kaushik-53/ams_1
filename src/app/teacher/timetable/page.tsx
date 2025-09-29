import { getTimetable, getTeachers, getClasses, getUserById } from "@/lib/actions";
import { TimetableGrid } from "@/components/timetable-grid";

export default async function TeacherTimetablePage({ searchParams }: { searchParams: { userId: string }}) {
    const { userId } = searchParams;
    const teacher = await getUserById(userId);

    if (!teacher) {
        return <p>Could not load teacher information.</p>
    }

    const timetable = (await getTimetable()).filter(t => t.teacherId === teacher.id);
    const allTeachers = await getTeachers();
    const allClasses = await getClasses();

    return (
        <div className="space-y-6">
            <TimetableGrid 
                title={`${teacher.name}'s Schedule`}
                description="Your weekly teaching timetable."
                timetable={timetable}
                teachers={allTeachers}
                classes={allClasses}
                userId={teacher.id}
            />
        </div>
    )
}
