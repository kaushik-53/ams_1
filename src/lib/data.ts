import type { User, Class, TimetableEntry, AttendanceRecord } from './types';

// In-memory data stores
export const users: User[] = [];
export const classes: Class[] = [];
export const timetable: TimetableEntry[] = [];
export const attendanceRecords: AttendanceRecord[] = [];


// Initial mock data for seeding
export const initialUsers: User[] = [
    // Admin
    { id: 'U1', name: 'Rohan Sharma', email: 'admin', role: 'admin', avatarId: '1', password: 'Admin@123' },
    
    // Teachers
    { id: 'U2', name: 'Priya Mehta', email: 'english', role: 'teacher', subject: 'English', avatarId: '2', password: 'English@123', classId: 'C11' },
    { id: 'U3', name: 'Vikram Singh', email: 'physics', role: 'teacher', subject: 'Physics', avatarId: '3', password: 'Physics@123' },
    { id: 'U4', name: 'Anjali Gupta', email: 'chemistry', role: 'teacher', subject: 'Chemistry', avatarId: '4', password: 'Chemistry@123', classId: 'C12' },
    { id: 'U5', name: 'Sanjay Kumar', email: 'maths', role: 'teacher', subject: 'Maths', avatarId: '5', password: 'Maths@123' },
  
    // Students - Class 11
    { id: 'S1101', name: 'Aarav Patel', email: 'class11_roll1', role: 'student', grade: 11, parentEmail: 'parent1101@example.com', avatarId: '6', password: 'Student@111', classId: 'C11' },
    { id: 'S1102', name: 'Diya Shah', email: 'class11_roll2', role: 'student', grade: 11, parentEmail: 'parent1102@example.com', avatarId: '7', password: 'Student@112', classId: 'C11' },
    { id: 'S1103', name: 'Ishaan Joshi', email: 'class11_roll3', role: 'student', grade: 11, parentEmail: 'parent1103@example.com', avatarId: '1', password: 'Student@113', classId: 'C11' },
    { id: 'S1104', name: 'Myra Reddy', email: 'class11_roll4', role: 'student', grade: 11, parentEmail: 'parent1104@example.com', avatarId: '2', password: 'Student@114', classId: 'C11' },
    { id: 'S1105', name: 'Rohan Verma', email: 'class11_roll5', role: 'student', grade: 11, parentEmail: 'parent1105@example.com' , avatarId: '3', password: 'Student@115', classId: 'C11'},
    { id: 'S1106', name: 'Saanvi Nair', email: 'class11_roll6', role: 'student', grade: 11, parentEmail: 'parent1106@example.com', avatarId: '4', password: 'Student@116', classId: 'C11' },
    { id: 'S1107', name: 'Arjun Desai', email: 'class11_roll7', role: 'student', grade: 11, parentEmail: 'parent1107@example.com', avatarId: '5', password: 'Student@117', classId: 'C11' },
    { id: 'S1108', name: 'Zara Khan', email: 'class11_roll8', role: 'student', grade: 11, parentEmail: 'parent1108@example.com', avatarId: '6', password: 'Student@118', classId: 'C11' },
    { id: 'S1109', name: 'Kabir Iyer', email: 'class11_roll9', role: 'student', grade: 11, parentEmail: 'parent1109@example.com', avatarId: '7', password: 'Student@119', classId: 'C11' },
    { id: 'S1110', name: 'Anika Pillai', email: 'class11_roll10', role: 'student', grade: 11, parentEmail: 'parent1110@example.com', avatarId: '1', password: 'Student@1110', classId: 'C11' },
  
    // Students - Class 12
    { id: 'S1201', name: 'Advait Rao', email: 'class12_roll1', role: 'student', grade: 12, parentEmail: 'parent1201@example.com', avatarId: '2', password: 'Student@121', classId: 'C12' },
    { id: 'S1202', name: 'Kiara Menon', email: 'class12_roll2', role: 'student', grade: 12, parentEmail: 'parent1202@example.com', avatarId: '3', password: 'Student@122', classId: 'C12' },
    { id: 'S1203', name: 'Vihaan Bhat', email: 'class12_roll3', role: 'student', grade: 12, parentEmail: 'parent1203@example.com', avatarId: '4', password: 'Student@123', classId: 'C12' },
    { id: 'S1204', name: 'Pari Sharma', email: 'class12_roll4', role: 'student', grade: 12, parentEmail: 'parent1204@example.com', avatarId: '5', password: 'Student@124', classId: 'C12' },
    { id: 'S1205', name: 'Reyansh Gupta', email: 'class12_roll5', role: 'student', grade: 12, parentEmail: 'parent1205@example.com', avatarId: '6', password: 'Student@125', classId: 'C12' },
    { id: 'S1206', name: 'Aisha Ali', email: 'class12_roll6', role: 'student', grade: 12, parentEmail: 'parent1206@example.com', avatarId: '7', password: 'Student@126', classId: 'C12' },
    { id: 'S1207', name: 'Dev Mukherjee', email: 'class12_roll7', role: 'student', grade: 12, parentEmail: 'parent1207@example.com', avatarId: '1', password: 'Student@127', classId: 'C12' },
    { id: 'S1208', name: 'Tara Chatterjee', email: 'class12_roll8', role: 'student', grade: 12, parentEmail: 'parent1208@example.com', avatarId: '2', password: 'Student@128', classId: 'C12' },
    { id: 'S1209', name: 'Ayaan Malik', email: 'class12_roll9', role: 'student', grade: 12, parentEmail: 'parent1209@example.com', avatarId: '3', password: 'Student@129', classId: 'C12' },
    { id: 'S1210', name: 'Ishita Prasad', email: 'class12_roll10', role: 'student', grade: 12, parentEmail: 'parent1210@example.com', avatarId: '4', password: 'Student@1210', classId: 'C12' },
];
  
export const initialClasses: Class[] = [
    { id: 'C11', name: 'Class 11', teacherId: 'U2' },
    { id: 'C12', name: 'Class 12', teacherId: 'U4' },
];
  
export const initialTimetable: TimetableEntry[] = [
      // Class 11
      { id: 'T1', classId: 'C11', day: 'Monday', period: 1, subject: 'English', teacherId: 'U2' },
      { id: 'T2', classId: 'C11', day: 'Monday', period: 2, subject: 'Physics', teacherId: 'U3' },
      { id: 'T3', classId: 'C11', day: 'Tuesday', period: 1, subject: 'Maths', teacherId: 'U5' },
      { id: 'T4', classId: 'C11', day: 'Tuesday', period: 2, subject: 'Chemistry', teacherId: 'U4' },
      { id: 'T5', classId: 'C11', day: 'Wednesday', period: 1, subject: 'Physics', teacherId: 'U3' },
      { id: 'T6', classId: 'C11', day: 'Wednesday', period: 2, subject: 'English', teacherId: 'U2' },
      { id: 'T7', classId: 'C11', day: 'Thursday', period: 1, subject: 'Chemistry', teacherId: 'U4' },
      { id: 'T8', classId: 'C11', day: 'Thursday', period: 2, subject: 'Maths', teacherId: 'U5' },
      { id: 'T9', classId: 'C11', day: 'Friday', period: 1, subject: 'English', teacherId: 'U2' },
      { id: 'T10', classId: 'C11', day: 'Friday', period: 2, subject: 'Physics', teacherId: 'U3' },
  
      // Class 12
      { id: 'T11', classId: 'C12', day: 'Monday', period: 1, subject: 'Maths', teacherId: 'U5' },
      { id: 'T12', classId: 'C12', day: 'Monday', period: 2, subject: 'Chemistry', teacherId: 'U4' },
      { id: 'T13', classId: 'C12', day: 'Tuesday', period: 1, subject: 'English', teacherId: 'U2' },
      { id: 'T14', classId: 'C12', day: 'Tuesday', period: 2, subject: 'Physics', teacherId: 'U3' },
      { id: 'T15', classId: 'C12', day: 'Wednesday', period: 1, subject: 'Chemistry', teacherId: 'U4' },
      { id: 'T16', classId: 'C12', day: 'Wednesday', period: 2, subject: 'Maths', teacherId: 'U5' },
      { id: 'T17', classId: 'C12', day: 'Thursday', period: 1, subject: 'Physics', teacherId: 'U3' },
      { id: 'T18', classId: 'C12' , day: 'Thursday', period: 2, subject: 'English', teacherId: 'U2' },
      { id: 'T19', classId: 'C12', day: 'Friday', period: 1, subject: 'Maths', teacherId: 'U5' },
      { id: 'T20', classId: 'C12', day: 'Friday', period: 2, subject: 'Chemistry', teacherId: 'U4' },
  ];
  
  export const initialAttendance: AttendanceRecord[] = [
    // Past records for demo
    { id: 'A1', studentId: 'S1101', date: '2024-05-01', status: 'present', classId: 'C11' },
    { id: 'A2', studentId: 'S1102', date: '2024-05-01', status: 'absent', classId: 'C11' },
    { id: 'A3', studentId: 'S1201', date: '2024-05-01', status: 'present', classId: 'C12' },
    { id: 'A4', studentId: 'S1101', date: '2024-05-02', status: 'present', classId: 'C11' },
    { id: 'A5', studentId: 'S1102', date: '2024-05-02', status: 'present', classId: 'C11' },
  ];

// Initially, load the data stores with the initial data.
// In a real app, you would fetch this from a database.
users.push(...initialUsers);
classes.push(...initialClasses);
timetable.push(...initialTimetable);
attendanceRecords.push(...initialAttendance);
