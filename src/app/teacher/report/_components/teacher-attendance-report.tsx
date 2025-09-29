
"use client";

import { useState, useMemo } from "react";
import type { User, Class, AttendanceRecord } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttendanceReport } from "./attendance-report";

export function TeacherAttendanceReport({ 
    allRecords, 
    allStudents, 
    teacherClasses 
}: { 
    allRecords: AttendanceRecord[], 
    allStudents: User[], 
    teacherClasses: Class[] 
}) {
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    const selectedClass = useMemo(() => {
        return teacherClasses.find(c => c.id === selectedClassId);
    }, [selectedClassId, teacherClasses]);

    const recordsForClass = useMemo(() => {
        if (!selectedClassId) return [];
        return allRecords.filter(r => r.classId === selectedClassId);
    }, [selectedClassId, allRecords]);
    
    // Corrected Logic: The component already receives all necessary students via props.
    // The filtering should happen here to pass only the relevant students for the selected class.
    const studentsForClass = useMemo(() => {
        if (!selectedClassId) return [];
        return allStudents.filter(s => s.classId === selectedClassId);
    }, [selectedClassId, allStudents]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
                <CardDescription>Select a class to view its attendance report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Select onValueChange={setSelectedClassId} value={selectedClassId || ""} disabled={teacherClasses.length === 0}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                            {teacherClasses.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedClassId ? (
                    <AttendanceReport 
                        initialRecords={recordsForClass}
                        students={studentsForClass}
                        selectedClass={selectedClass}
                    />
                ) : (
                    <div className="text-muted-foreground pt-4 text-center border-t mt-4">
                        <p>Please select a class to view the report.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
