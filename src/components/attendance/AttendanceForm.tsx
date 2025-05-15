
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { attendanceService } from '@/services/attendanceService';
import { employeeService } from '@/services/employeeService';
import { useQuery, useMutation } from '@tanstack/react-query';

interface AttendanceFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  isBulk?: boolean;
}

const AttendanceForm = ({ onSubmit, onCancel, isBulk = false }: AttendanceFormProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('present');
  const [checkIn, setCheckIn] = useState('09:00');
  const [checkOut, setCheckOut] = useState('17:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch employees for dropdown
  const { data: employeesData } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAllEmployees,
    enabled: !isBulk, // Only fetch if not bulk mode
  });

  const employees = employeesData?.data || [];

  // Attendance mutations
  const attendanceMutation = useMutation({
    mutationFn: (data: any) => {
      if (isBulk) {
        return attendanceService.markBulkAttendance(data);
      } else {
        return attendanceService.markAttendance(data);
      }
    },
    onSuccess: () => {
      toast.success(`Attendance ${isBulk ? 'bulk ' : ''}marked successfully`);
      onSubmit();
    },
    onError: (error: Error) => {
      toast.error(`Failed to mark attendance: ${error.message}`);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isBulk && !selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const data = {
        ...(isBulk ? {} : { employeeId: selectedEmployee }),
        date,
        status,
        ...(status !== 'absent' ? { checkIn, checkOut } : {})
      };
      
      attendanceMutation.mutate(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isBulk ? 'Bulk Attendance' : 'Mark Attendance'}</CardTitle>
          <CardDescription>
            {isBulk 
              ? 'Mark attendance for multiple employees' 
              : 'Record attendance for an individual employee'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isBulk && (
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee: any) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="half-day">Half Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status !== 'absent' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn">Check In Time</Label>
                <Input
                  id="checkIn"
                  type="time"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">Check Out Time</Label>
                <Input
                  id="checkOut"
                  type="time"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
          )}

          {isBulk && (
            <div className="bg-blue-50 p-4 rounded-md text-sm">
              <p className="font-medium text-blue-800">Bulk Attendance Settings</p>
              <p className="text-blue-600 mt-1">
                This will mark attendance with the selected status for all active employees.
                You can review and edit individual records afterward.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : (isBulk ? 'Mark Bulk Attendance' : 'Mark Attendance')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AttendanceForm;
