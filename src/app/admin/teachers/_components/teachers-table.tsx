
"use client";

import { useState } from "react";
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
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveTeacher, deleteUser } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { exportToCsv } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const teacherFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Login ID is required"),
  classId: z.string().optional(),
  subject: z.string().optional(),
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

export function TeachersTable({
  initialTeachers,
  classes,
}: {
  initialTeachers: User[];
  classes: Class[];
}) {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
  const { toast } = useToast();

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: { name: "", email: "", classId: "", subject: "" },
  });

  const handleEdit = (teacher: User) => {
    setEditingTeacher(teacher);
    form.reset({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        classId: teacher.classId,
        subject: teacher.subject,
    });
    setIsDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingTeacher(null);
    form.reset({ id: undefined, name: "", email: "", classId: "", subject: "" });
    setIsDialogOpen(true);
  }

  const handleDelete = async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.success) {
      setTeachers(teachers.filter((t) => t.id !== userId));
      toast({ title: "Success", description: result.message });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
  };

  const onSubmit = async (values: TeacherFormValues) => {
    const result = await saveTeacher(values);
    if (result.success) {
      // Simplification for optimistic update
      if (editingTeacher) {
          setTeachers(teachers.map(t => t.id === editingTeacher.id ? {...t, ...values, id: t.id} : t));
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
    const dataToExport = teachers.map(t => [
      t.id,
      t.name,
      t.email,
      t.subject || 'N/A',
      classes.find(c => c.id === t.classId)?.name || 'N/A',
    ]);
    exportToCsv("teachers.csv", [
        ["ID", "Name", "Email", "Subject", "Class"],
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Teachers</CardTitle>
            <CardDescription>Manage teacher records and class assignments.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}><FileDown className="mr-2 h-4 w-4" /> Export CSV</Button>
            <Button size="sm" onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Add New</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Assigned Class</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={getAvatarUrl(teacher)} alt={teacher.name} data-ai-hint="teacher avatar" />
                       <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                    </Avatar>
                     <div className="flex flex-col">
                        <span>{teacher.name}</span>
                        <span className="text-xs text-muted-foreground">{teacher.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{teacher.subject || 'N/A'}</TableCell>
                <TableCell>{classes.find(c => c.id === teacher.classId)?.name || 'Unassigned'}</TableCell>
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
                        <DropdownMenuItem onSelect={() => handleEdit(teacher)}>Edit</DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the teacher account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(teacher.id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}
              />
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Login ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}
              />
               <FormField control={form.control} name="subject" render={({ field }) => (
                  <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
