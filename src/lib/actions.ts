
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sendAbsentEmailNotification } from "@/ai/flows/absent-email-notifications";
import {
  users,
  classes,
  attendanceRecords,
  timetable,
  initialUsers,
  initialClasses,
  initialTimetable,
  initialAttendance,
} from "./data";
import type {
  User,
  Class,
  AttendanceRecord,
  AttendanceStatus,
  TimetableEntry,
} from "./types";

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);

const loginSchema = z.object({
  username: z.string().min(1, { message: "Please enter your username." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(passwordValidation, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
});

// --- Authentication ---

export async function loginAction(
  prevState: { message: string },
  formData: FormData
) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    const error = parsed.error.flatten().fieldErrors.password?.[0];
    return { message: error || "Invalid username or password format." };
  }

  const { username, password } = parsed.data;

  const user = users.find(
    (u) => u.email === username && u.password === password
  );

  if (!user) {
    return { message: "Incorrect username or password." };
  }

  const url = `/${user.role}?userId=${user.id}`;
  redirect(url);
}

export async function logoutAction() {
  revalidatePath("/", "layout");
  redirect("/login");
}

// --- Data Fetching ---

export async function getUserById(userId: string): Promise<User | undefined> {
  const user = users.find((u) => u.id === userId);
  if (!user) return undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getStudents(): Promise<User[]> {
  return users
    .filter((u) => u.role === "student")
    .map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
}

export async function getTeachers(): Promise<User[]> {
  return users
    .filter((u) => u.role === "teacher")
    .map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
}

export async function getClasses(): Promise<Class[]> {
  return classes;
}

export async function getStudentsByClass(classId: string): Promise<User[]> {
  return users
    .filter((u) => u.role === "student" && u.classId === classId)
    .map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
}

export async function getAttendanceForStudent(
  studentId: string
): Promise<AttendanceRecord[]> {
  return attendanceRecords.filter((a) => a.studentId === studentId);
}

export async function getAttendanceByDateAndClass(
  date: string,
  classId: string
): Promise<AttendanceRecord[]> {
  return attendanceRecords.filter(
    (a) => a.date === date && a.classId === classId
  );
}

export async function getAllAttendance(): Promise<AttendanceRecord[]> {
  return attendanceRecords;
}

export async function getAttendanceByClass(
  classId: string
): Promise<AttendanceRecord[]> {
  return attendanceRecords.filter((a) => a.classId === classId);
}

export async function getTimetable(): Promise<TimetableEntry[]> {
  return timetable;
}

// --- Data Mutations ---

export async function saveAttendance(
  attendanceData: { studentId: string; status: AttendanceStatus }[],
  classId: string,
  date: string,
  teacherName: string
) {
  try {
    // Remove existing records for this date and class to avoid duplicates
    const existingIndices = attendanceRecords
      .map((rec, index) =>
        rec.date === date && rec.classId === classId ? index : -1
      )
      .filter((index) => index !== -1);

    for (let i = existingIndices.length - 1; i >= 0; i--) {
      attendanceRecords.splice(existingIndices[i], 1);
    }

    // Add new records
    const newRecords = attendanceData.map((att) => ({
      id: `att-${Date.now()}-${att.studentId}`,
      studentId: att.studentId,
      status: att.status,
      date,
      classId,
    }));
    attendanceRecords.push(...newRecords);

    // Trigger AI email notifications and revalidate paths for absent students
    for (const record of newRecords) {
        
      // Revalidate student's own dashboard to show updated summary
      revalidatePath(`/student?userId=${record.studentId}`);

      if (record.status === "absent") {
        const student = users.find((u) => u.id === record.studentId);
        const aClass = classes.find((c) => c.id === record.classId);
        if (student && student.parentEmail && aClass) {
          // This is an async call, but we don't need to wait for it.
          // Let it run in the background.
          sendAbsentEmailNotification({
            studentName: student.name,
            parentEmail: student.parentEmail,
            absenceDate: date,
            className: aClass.name,
          });
        }
      }
    }
    revalidatePath("/teacher");
    revalidatePath("/teacher/report");
    revalidatePath("/admin/attendance");
    revalidatePath("/admin");

    return { success: true, message: "Attendance saved successfully." };
  } catch (error) {
    console.error("Error saving attendance: ", error);
    return { success: false, message: "Failed to save attendance." };
  }
}

async function upsertUser(user: Omit<User, "password"> & { password?: string }) {
  const { id, ...userData } = user;

  if (id) {
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData, id };
    }
  } else {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      avatarId: `${(users.length % 7) + 1}`,
      password: user.password || "Password123!",
    };
    users.push(newUser);
  }
  revalidatePath("/admin/students");
  revalidatePath("/admin/teachers");
  revalidatePath("/admin");
  return {
    success: true,
    message: `User ${id ? "updated" : "created"} successfully.`,
  };
}

export async function saveStudent(studentData: {
  id?: string;
  name: string;
  email: string;
  grade: number;
  parentEmail: string;
  classId?: string;
}) {
  return upsertUser({ ...studentData, role: "student" });
}

export async function saveTeacher(teacherData: {
  id?: string;
  name: string;
  email: string;
  classId: string;
  subject?: string;
}) {
  return upsertUser({ ...teacherData, role: "teacher" });
}

export async function deleteUser(userId: string) {
  const index = users.findIndex((u) => u.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    revalidatePath("/admin/students");
    revalidatePath("/admin/teachers");
    revalidatePath("/admin");
    return { success: true, message: "User deleted successfully." };
  }
  return { success: false, message: "User not found." };
}

export async function seedDatabase() {
  console.log("Seeding database...");
  // Clear existing data
  if (users.length === 0) {
    console.log("No data found. Seeding now.");
    users.push(...initialUsers);
    classes.push(...initialClasses);
    timetable.push(...initialTimetable);
    attendanceRecords.push(...initialAttendance);
    console.log("Database seeded.");
    revalidatePath("/admin");
  } else {
    console.log("Database already contains data. Seeding skipped.");
  }
}
