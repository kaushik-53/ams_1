import { getTeachers, getClasses } from "@/lib/actions";
import { TeachersTable } from "./_components/teachers-table";

export default async function AdminTeachersPage() {
    const teachers = await getTeachers();
    const classes = await getClasses();

    return (
        <div>
            <TeachersTable initialTeachers={teachers} classes={classes} />
        </div>
    )
}
