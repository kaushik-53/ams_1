
"use client";

import type { User, Class, AttendanceRecord } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";

export function StudentAttendanceReport({
    student,
    initialRecords,
    classes
}: {
    student: User,
    initialRecords: AttendanceRecord[],
    classes: Class[]
}) {
    const totalDays = initialRecords.length;
    const presentDays = initialRecords.filter(
        (r) => r.status === "present"
    ).length;
    const absentDays = totalDays - presentDays;
    const attendancePercentage =
        totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
    
    const attendanceSummary = [
        { status: "Present", count: presentDays, fill: "hsl(var(--chart-2))" },
        { status: "Absent", count: absentDays, fill: "hsl(var(--destructive))" },
        ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
          <CardDescription>
            Your overall attendance is {attendancePercentage}%.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ChartContainer config={{}} className="h-full w-full">
            <BarChart
              data={attendanceSummary}
              layout="vertical"
              margin={{ left: 10, right: 30 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="status"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-sm"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" radius={5}>
                {attendanceSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Detailed Report</CardTitle>
          <CardDescription>
            Here is a list of your attendance records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialRecords.length > 0 ? (
                initialRecords
                  .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        {classes.find((c) => c.id === record.classId)?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {record.status === "present" ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Present
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            Absent
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
