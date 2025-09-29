import { getStudents, getClasses, getAllAttendance } from "@/lib/actions";
import { AttendanceReport } from "./_components/attendance-report";

export default async function AdminAttendancePage() {
    const students = await getStudents();
    const classes = await getClasses();
    const attendanceRecords = await getAllAttendance();

    return (
        <div>
            <AttendanceReport 
                initialRecords={attendanceRecords} 
                students={students} 
                classes={classes} 
            />
        </div>
    )
}
