
"use client";

import { useState, useMemo } from "react";
import type { User, Class, AttendanceRecord } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { exportToCsv } from "@/lib/utils";

export function AttendanceReport({
  initialRecords,
  students,
  classes,
}: {
  initialRecords: AttendanceRecord[];
  students: User[];
  classes: Class[];
}) {
  const [records] = useState(initialRecords);
  const [filters, setFilters] = useState({
    studentName: "",
    classId: "all",
    date: "",
  });

  const handleFilterChange = (
    key: "studentName" | "classId" | "date",
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredRecords = useMemo(() => {
    return records
      .map((record) => ({
        ...record,
        student: students.find((s) => s.id === record.studentId),
        class: classes.find((c) => c.id === record.classId),
      }))
      .filter((record) => {
        if (!record.student || !record.class) return false;
        const studentNameMatch = record.student.name
          .toLowerCase()
          .includes(filters.studentName.toLowerCase());
        const classMatch =
          filters.classId === "all" || record.classId === filters.classId;
        const dateMatch =
          filters.date === "" || new Date(record.date) <= new Date(filters.date);
        return studentNameMatch && classMatch && dateMatch;
      })
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records, filters, students, classes]);

  const attendanceSummary = useMemo(() => {
    const present = filteredRecords.filter((r) => r.status === "present").length;
    const absent = filteredRecords.filter((r) => r.status === "absent").length;
    return [
      { status: "Present", count: present, fill: "hsl(var(--chart-2))" },
      { status: "Absent", count: absent, fill: "hsl(var(--destructive))" },
    ];
  }, [filteredRecords]);

  const handleExport = () => {
    const dataToExport = filteredRecords.map(r => [
      r.student?.name || 'N/A',
      r.date,
      r.class?.name || 'N/A',
      r.status,
    ]);
    exportToCsv("attendance_report.csv", [
        ["Student", "Date", "Class", "Status"],
        ...dataToExport
    ]);
  }

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
          <CardDescription>
            Overall attendance based on current filters.
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
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>Detailed Attendance Report</CardTitle>
                <CardDescription>
                    Filter and view all attendance records.
                </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}><FileDown className="mr-2 h-4 w-4" /> Export CSV</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Input
              placeholder="Filter by student name..."
              value={filters.studentName}
              onChange={(e) => handleFilterChange("studentName", e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={filters.classId}
              onValueChange={(value) => handleFilterChange("classId", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="w-[180px]"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.student?.name || "N/A"}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.class?.name || "N/A"}</TableCell>
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
                    <TableCell colSpan={4} className="text-center h-24">
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
