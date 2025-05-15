
import { useState } from 'react';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import AttendanceForm from '@/components/attendance/AttendanceForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Attendance = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);

  const handleMarkAttendance = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    // In a real app, this would save the attendance record to a database
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setIsBulkMode(false);
  };

  return (
    <>
      <AttendanceTable onMarkAttendance={handleMarkAttendance} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger 
                value="individual"
                onClick={() => setIsBulkMode(false)}
              >
                Individual
              </TabsTrigger>
              <TabsTrigger 
                value="bulk"
                onClick={() => setIsBulkMode(true)}
              >
                Bulk Attendance
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual">
              <AttendanceForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isBulk={false}
              />
            </TabsContent>
            
            <TabsContent value="bulk">
              <AttendanceForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isBulk={true}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Attendance;
