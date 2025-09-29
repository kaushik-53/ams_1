
"use client";

import { useState, useMemo, useEffect } from "react";
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
  selectedClass,
}: {
  initialRecords: AttendanceRecord[];
  students: User[];
  selectedClass?: Class;
}) {
  const [records, setRecords] = useState(initialRecords);
  const [filters, setFilters] = useState({
    studentName: "",
    date: "",
  });

  useEffect(() => {
    setRecords(initialRecords);
  }, [initialRecords]);

  const handleFilterChange = (
    key: "studentName" | "date",
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredRecords = useMemo(() => {
    return records
      .map((record) => ({
        ...record,
        student: students.find((s) => s.id === record.studentId),
      }))
      .filter((record) => {
        if (!record.student) return false;
        const studentNameMatch = record.student.name
          .toLowerCase()
          .includes(filters.studentName.toLowerCase());
        const dateMatch =
          filters.date === "" || new Date(record.date) <= new Date(filters.date);
        return studentNameMatch && dateMatch;
      })
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records, filters, students]);

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
      r.status,
    ]);
    exportToCsv(`attendance_report_${selectedClass?.name}.csv`, [
        ["Student", "Date", "Status"],
        ...dataToExport
    ]);
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary for {selectedClass?.name}</CardTitle>
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
                    Filter and view attendance records for your class.
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
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.student?.name || "N/A"}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        {record.status === "present" ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 border-green-200"
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
                    <TableCell colSpan={3} className="text-center h-24">
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
