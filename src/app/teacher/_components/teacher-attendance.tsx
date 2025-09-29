"use client";

import { useState, useEffect, useMemo } from "react";
import type { User, Class, TimetableEntry } from "@/lib/types";
import { getStudentsByClass } from "@/lib/actions";
import AttendanceForm from "./attendance-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function TeacherAttendance({ teacher, teacherClasses, timetable }: { teacher: User, teacherClasses: Class[], timetable: TimetableEntry[] }) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [students, setStudents] = useState<User[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setDate(new Date());
    }, []);

    const classesForSelectedDay = useMemo(() => {
        if (!date) return [];
        const dayOfWeek = dayMap[date.getDay()];
        const classIdsForDay = [...new Set(timetable.filter(t => t.day === dayOfWeek).map(t => t.classId))];
        return teacherClasses.filter(tc => classIdsForDay.includes(tc.id));
    }, [date, timetable, teacherClasses]);

    useEffect(() => {
        // Reset selected class if it's not in the new list of available classes for the day
        if (selectedClassId && !classesForSelectedDay.some(c => c.id === selectedClassId)) {
            setSelectedClassId(null);
            setStudents([]);
        }
    }, [classesForSelectedDay, selectedClassId]);

    const handleClassChange = async (classId: string) => {
        setSelectedClassId(classId);
        if (classId) {
            const fetchedStudents = await getStudentsByClass(classId);
            setStudents(fetchedStudents);
        } else {
            setStudents([]);
        }
    }
    
    const selectedClass = teacherClasses.find(c => c.id === selectedClassId);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mark Attendance</CardTitle>
                <CardDescription>Select a date, then a class to mark student attendance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                             <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                disabled={(d) => !isClient || d > new Date() || d.getDay() === 0 || d.getDay() === 6}
                            />
                        </PopoverContent>
                    </Popover>

                    <Select onValueChange={handleClassChange} value={selectedClassId || ""} disabled={!date || classesForSelectedDay.length === 0}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                            {classesForSelectedDay.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {date && selectedClassId && selectedClass ? (
                    <AttendanceForm 
                        key={`${selectedClassId}-${format(date, "yyyy-MM-dd")}`} // Re-mount component when class or date changes
                        students={students} 
                        classId={selectedClassId}
                        teacherName={teacher.name}
                        selectedDate={date}
                    />
                ) : (
                    <div className="text-muted-foreground pt-4 text-center border-t mt-4">
                        {!date ? "Please select a date." :
                         classesForSelectedDay.length === 0 && isClient ? `You have no classes scheduled for ${format(date, "PPP")}.` :
                         "Please select a class to start marking attendance."
                        }
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
