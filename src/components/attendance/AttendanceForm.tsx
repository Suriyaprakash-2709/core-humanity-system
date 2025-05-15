
import { useState } from 'react';
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

// Mock employee list for the dropdown
const mockEmployees = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Jane Doe' },
  { id: '3', name: 'Robert Wilson' },
  { id: '4', name: 'Sarah Johnson' },
  { id: '5', name: 'Michael Brown' },
];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isBulk && !selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }
    
    // In a real app, this would submit to an API
    toast.success(`Attendance ${isBulk ? 'bulk ' : ''}marked successfully`);
    onSubmit();
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
                  {mockEmployees.map((employee) => (
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
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isBulk ? 'Mark Bulk Attendance' : 'Mark Attendance'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AttendanceForm;
