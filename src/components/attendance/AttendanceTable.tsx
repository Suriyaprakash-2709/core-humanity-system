
import { useState } from 'react';
import { Attendance } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock attendance data
const mockAttendance: Attendance[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Smith',
    date: '2023-05-15',
    status: 'present',
    checkIn: '09:00',
    checkOut: '17:30',
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jane Doe',
    date: '2023-05-15',
    status: 'late',
    checkIn: '09:45',
    checkOut: '18:00',
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Robert Wilson',
    date: '2023-05-15',
    status: 'present',
    checkIn: '08:50',
    checkOut: '17:15',
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Sarah Johnson',
    date: '2023-05-15',
    status: 'absent',
  },
  {
    id: '5',
    employeeId: '5',
    employeeName: 'Michael Brown',
    date: '2023-05-15',
    status: 'half-day',
    checkIn: '09:15',
    checkOut: '13:30',
  },
];

interface AttendanceTableProps {
  onMarkAttendance: () => void;
}

const AttendanceTable = ({ onMarkAttendance }: AttendanceTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendance] = useState<Attendance[]>(mockAttendance);

  const filteredAttendance = attendance.filter((record) =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-500">Late</Badge>;
      case 'half-day':
        return <Badge className="bg-blue-500">Half Day</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">
            Track and manage employee attendance
          </p>
        </div>
        <Button onClick={onMarkAttendance}>
          <Calendar className="mr-2 h-4 w-4" />
          Mark Attendance
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-[180px]"
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-[300px]"
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="half-day">Half Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No attendance records found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredAttendance.map((record) => {
                const checkInTime = record.checkIn 
                  ? new Date(`2023-01-01T${record.checkIn}`)
                  : null;
                const checkOutTime = record.checkOut
                  ? new Date(`2023-01-01T${record.checkOut}`)
                  : null;
                
                let duration = 'N/A';
                if (checkInTime && checkOutTime) {
                  const diff = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
                  duration = `${diff.toFixed(2)} hrs`;
                }

                return (
                  <TableRow key={record.id}>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.checkIn || 'N/A'}</TableCell>
                    <TableCell>{record.checkOut || 'N/A'}</TableCell>
                    <TableCell>{duration}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendanceTable;
