import { getTimetable, getTeachers, getClasses } from "@/lib/actions";
import { TimetableGrid } from "@/components/timetable-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminTimetablePage() {
    const timetable = await getTimetable();
    const teachers = await getTeachers();
    const classes = await getClasses();

    const class11Timetable = timetable.filter(t => t.classId === 'C11');
    const class12Timetable = timetable.filter(t => t.classId === 'C12');

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">School Timetable</h1>
            <Tabs defaultValue="class11">
                <TabsList>
                    <TabsTrigger value="class11">Class 11</TabsTrigger>
                    <TabsTrigger value="class12">Class 12</TabsTrigger>
                </TabsList>
                <TabsContent value="class11">
                    <TimetableGrid 
                        title="Class 11 Schedule"
                        description="Weekly timetable for Class 11."
                        timetable={class11Timetable}
                        teachers={teachers}
                        classes={classes}
                    />
                </TabsContent>
                <TabsContent value="class12">
                     <TimetableGrid 
                        title="Class 12 Schedule"
                        description="Weekly timetable for Class 12."
                        timetable={class12Timetable}
                        teachers={teachers}
                        classes={classes}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
