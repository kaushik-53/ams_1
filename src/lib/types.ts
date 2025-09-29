export type UserRole = "admin" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarId: string;
  // For teachers
  classId?: string;
  subject?: string;
  // For students
  grade?: number;
  parentEmail?: string;
  password?: string; // Only in mock data, not sent to client
}

export interface Class {
  id:string;
  name: string;
  teacherId: string;
}

export type AttendanceStatus = "present" | "absent";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  classId: string;
}

export interface TimetableEntry {
    id: string;
    classId: string;
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    period: number;
    subject: string;
    teacherId: string;
}
