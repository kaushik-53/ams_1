
"use client";

import { useState, useMemo } from "react";
import type { User, Class } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, PlusCircle, FileDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { saveStudent, deleteUser } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { exportToCsv } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const studentFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  grade: z.coerce.number().min(1, "Grade is required"),
  parentEmail: z.string().email("Invalid parent email"),
  classId: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

export function StudentsTable({
  initialStudents,
  classes,
}: {
  initialStudents: User[];
  classes: Class[];
}) {
  const [students, setStudents] = useState(initialStudents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const { toast } = useToast();

  const studentsByClass = useMemo(() => {
    return students.reduce((acc, student) => {
      const classId = student.classId || 'unassigned';
      if (!acc[classId]) {
        acc[classId] = [];
      }
      acc[classId].push(student);
      return acc;
    }, {} as Record<string, User[]>);
  }, [students]);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: { name: "", email: "", grade: undefined, parentEmail: "" },
  });

  const handleEdit = (student: User) => {
    setEditingStudent(student);
    form.reset({
        id: student.id,
        name: student.name,
        email: student.email,
        grade: student.grade,
        parentEmail: student.parentEmail,
        classId: student.classId
    });
    setIsDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingStudent(null);
    form.reset({ id: undefined, name: "", email: "", grade: undefined, parentEmail: "", classId: "" });
    setIsDialogOpen(true);
  }

  const handleDelete = async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.success) {
      setStudents(students.filter((s) => s.id !== userId));
      toast({ title: "Success", description: result.message });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
  };

  const onSubmit = async (values: StudentFormValues) => {
    const result = await saveStudent(values);
    if (result.success) {
        if (editingStudent) {
            setStudents(students.map(s => s.id === editingStudent.id ? {...s, ...values, id: s.id} : s));
        } else {
            // Optimistic update for new student
            const newStudent: User = { 
                ...values,
                id: `new-${Math.random()}`,
                role: 'student', 
                avatarId: `${(students.length % 7) + 1}`
            };
            setStudents([...students, newStudent]);
        }
        toast({ title: "Success", description: result.message });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
    setIsDialogOpen(false);
  };
  
  const handleExport = () => {
    const dataToExport = students.map(s => [
      s.id,
      s.name,
      s.email,
      s.grade || 'N/A',
      s.parentEmail || 'N/A',
      classes.find(c => c.id === s.classId)?.name || 'N/A',
    ]);
    exportToCsv("students.csv", [
        ["ID", "Name", "Email", "Grade", "Parent Email", "Class"],
        ...dataToExport
    ]);
  }
  
  const getAvatarUrl = (user: User) => {
    const placeholder = PlaceHolderImages.find(p => p.id === user.avatarId);
    return placeholder?.imageUrl || `https://picsum.photos/seed/${user.id}/40/40`;
  }
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
  }

  const renderStudentTable = (studentList: User[]) => (
     <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Parent's Email</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {studentList.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                   <AvatarImage src={getAvatarUrl(student)} alt={student.name} data-ai-hint="student avatar" />
                   <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span>{student.name}</span>
                    <span className="text-xs text-muted-foreground">{student.email}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>{student.grade}</TableCell>
            <TableCell>{student.parentEmail}</TableCell>
            <TableCell>
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => handleEdit(student)}>Edit</DropdownMenuItem>
                     <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the student account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(student.id)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Students</CardTitle>
              <CardDescription>Manage student records, grouped by class.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}><FileDown className="mr-2 h-4 w-4" /> Export All</Button>
              <Button size="sm" onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Add New Student</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={[...classes.map(c => c.id), 'unassigned']} className="w-full">
            {classes.map((c) => (
              studentsByClass[c.id] && studentsByClass[c.id].length > 0 &&
              <AccordionItem value={c.id} key={c.id}>
                <AccordionTrigger className="text-lg font-medium">{c.name}</AccordionTrigger>
                <AccordionContent>
                  {renderStudentTable(studentsByClass[c.id])}
                </AccordionContent>
              </AccordionItem>
            ))}
            {studentsByClass['unassigned'] && studentsByClass['unassigned'].length > 0 && (
               <AccordionItem value="unassigned">
                <AccordionTrigger className="text-lg font-medium">Unassigned Students</AccordionTrigger>
                <AccordionContent>
                  {renderStudentTable(studentsByClass['unassigned'])}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Login ID)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="grade" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="parentEmail" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent's Email</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="classId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="">Unassign</SelectItem>
                            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
