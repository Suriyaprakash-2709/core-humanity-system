
import { useState, useEffect } from 'react';
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
import { attendanceService } from '@/services/attendanceService';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface AttendanceTableProps {
  onMarkAttendance: () => void;
}

const AttendanceTable = ({ onMarkAttendance }: AttendanceTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch attendance data
  const { 
    data: attendanceData, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['attendance', selectedDate],
    queryFn: () => attendanceService.getAllAttendance(selectedDate),
  });

  const attendance = attendanceData?.data || [];

  // Handle date change
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  // Filter attendance records
  const filteredAttendance = attendance.filter((record: Attendance) => {
    let matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-50 text-red-800">
        <p>Error loading attendance records: {(error as Error).message}</p>
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

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
            onChange={(e) => handleDateChange(e.target.value)}
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
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
                    No attendance records found. Try adjusting your search or date.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttendance.map((record: Attendance) => {
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
      )}
    </div>
  );
};

export default AttendanceTable;
