"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { User, AttendanceRecord } from "@/lib/types";
import { Users, UserCheck, Percent, XCircle } from "lucide-react";
import Link from 'next/link';
import { seedDatabase } from "@/lib/actions";

interface AdminDashboardProps {
    students: User[];
    teachers: User[];
    attendanceRecords: AttendanceRecord[];
    recentAbsences: (AttendanceRecord & { studentName: string | undefined })[];
    searchParams: { [key: string]: string | string[] | undefined };
    isDataSeeded: boolean;
}

export function AdminDashboard({
    students,
    teachers,
    attendanceRecords,
    recentAbsences,
    searchParams,
    isDataSeeded
}: AdminDashboardProps) {

    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const overallAttendance =
        attendanceRecords.length > 0
            ? (
                (attendanceRecords.filter((a) => a.status === "present").length /
                    attendanceRecords.length) *
                100
            ).toFixed(1)
            : "0";
            
    if (!isDataSeeded) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to AMS</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">Your database is currently empty. Click the button below to seed it with initial sample data.</p>
                    <form action={seedDatabase}>
                        <Button type="submit">Seed Database</Button>
                    </form>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Students
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTeachers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Overall Attendance
                        </CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallAttendance}%</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Absences</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentAbsences.length > 0 ? (
                                recentAbsences.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.studentName || "Unknown"}</TableCell>
                                        <TableCell>{record.date}</TableCell>
                                        <TableCell>
                                            <span className="flex items-center text-destructive">
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Absent
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">
                                        No recent absences.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button asChild>
                    <Link href={`/admin/students?userId=${searchParams.userId}`}>Manage Students</Link>
                </Button>
                <Button asChild variant="secondary">
                    <Link href={`/admin/teachers?userId=${searchParams.userId}`}>Manage Teachers</Link>
                </Button>
            </div>
        </div>
    )
}
