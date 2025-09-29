import { getStudents, getClasses } from "@/lib/actions";
import { StudentsTable } from "./_components/students-table";

export default async function AdminStudentsPage() {
    const students = await getStudents();
    const classes = await getClasses();

    return (
        <div>
            <StudentsTable initialStudents={students} classes={classes} />
        </div>
    )
}
