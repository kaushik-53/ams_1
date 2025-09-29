"use client";

import { useEffect, useState, useTransition } from "react";
import type { User, AttendanceRecord, AttendanceStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { getAttendanceByDateAndClass, saveAttendance } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AttendanceState = Record<string, AttendanceStatus>;

export default function AttendanceForm({
  students,
  classId,
  teacherName,
  selectedDate,
}: {
  students: User[];
  classId: string;
  teacherName: string;
  selectedDate: Date;
}) {
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [existingRecords, setExistingRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    // Set initial attendance to 'present' for all students
    const initialAttendance = students.reduce((acc, student) => {
      acc[student.id] = "present";
      return acc;
    }, {} as AttendanceState);
    setAttendance(initialAttendance);
  }, [students]);

  useEffect(() => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    setIsLoading(true);
    getAttendanceByDateAndClass(formattedDate, classId).then((records) => {
      setExistingRecords(records);
      if (records.length > 0) {
        const loadedAttendance = records.reduce((acc, record) => {
          acc[record.studentId] = record.status;
          return acc;
        }, {} as AttendanceState);
        setAttendance(loadedAttendance);
      } else {
        // Reset to default if no records found for the new date
        const initialAttendance = students.reduce((acc, student) => {
            acc[student.id] = "present";
            return acc;
          }, {} as AttendanceState);
        setAttendance(initialAttendance);
      }
      setIsLoading(false);
    });
  }, [selectedDate, classId, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = () => {
    const attendanceData = Object.entries(attendance).map(
      ([studentId, status]) => ({ studentId, status })
    );

    startTransition(async () => {
      const result = await saveAttendance(
        attendanceData,
        classId,
        format(selectedDate, "yyyy-MM-dd"),
        teacherName
      );
      if (result.success) {
        toast({
          title: "Attendance Submitted",
          description: "Today's attendance has been recorded.",
        });
        setExistingRecords(attendanceData.map(ad => ({...ad, id: '', date: format(selectedDate, 'yyyy-MM-dd'), classId}))); // Optimistic update
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message,
        });
      }
    });
  };

  const isFormSubmittedForDay = existingRecords.length > 0;

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-right">
                    <RadioGroup
                      value={attendance[student.id]}
                      onValueChange={(value) =>
                        handleStatusChange(student.id, value as AttendanceStatus)
                      }
                      className="justify-end"
                      disabled={isFormSubmittedForDay || isPending}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="present" id={`present-${student.id}`} />
                        <Label htmlFor={`present-${student.id}`}>Present</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                        <Label htmlFor={`absent-${student.id}`}>Absent</Label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        </div>
      )}

      {isFormSubmittedForDay && !isLoading && (
        <Alert variant="default" className="bg-primary/10 border-primary/20">
            <CheckCircle className="h-4 w-4 text-primary"/>
            <AlertTitle className="text-primary">Attendance Already Submitted</AlertTitle>
            <AlertDescription>
                Attendance for {format(selectedDate, 'PPP')} has already been recorded for this class.
            </AlertDescription>
        </Alert>
      )}

      {!isFormSubmittedForDay && (
        <Button onClick={handleSubmit} disabled={isPending || isLoading || students.length === 0}>
          {isPending ? "Submitting..." : "Submit Attendance"}
        </Button>
      )}
    </div>
  );
}