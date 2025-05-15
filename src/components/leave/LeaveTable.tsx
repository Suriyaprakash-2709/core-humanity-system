
import { useState } from 'react';
import { Leave } from '@/lib/types';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Check, X, CalendarPlus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

// Mock leave data
const mockLeaves: Leave[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Smith',
    type: 'sick',
    startDate: '2023-05-20',
    endDate: '2023-05-21',
    reason: 'Not feeling well, have fever',
    status: 'pending',
    appliedOn: '2023-05-19',
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jane Doe',
    type: 'vacation',
    startDate: '2023-06-01',
    endDate: '2023-06-07',
    reason: 'Family vacation',
    status: 'approved',
    appliedOn: '2023-05-15',
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Robert Wilson',
    type: 'casual',
    startDate: '2023-05-25',
    endDate: '2023-05-25',
    reason: 'Personal work',
    status: 'pending',
    appliedOn: '2023-05-22',
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Sarah Johnson',
    type: 'sick',
    startDate: '2023-05-18',
    endDate: '2023-05-19',
    reason: 'Doctor appointment and rest',
    status: 'rejected',
    appliedOn: '2023-05-17',
  },
  {
    id: '5',
    employeeId: '5',
    employeeName: 'Michael Brown',
    type: 'other',
    startDate: '2023-05-30',
    endDate: '2023-05-30',
    reason: 'Family event',
    status: 'approved',
    appliedOn: '2023-05-20',
  },
];

interface LeaveTableProps {
  onApplyLeave: () => void;
}

const LeaveTable = ({ onApplyLeave }: LeaveTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [leaves] = useState<Leave[]>(mockLeaves);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr';
  const canApprove = isAdmin || isHR;

  const handleApprove = (leaveId: string) => {
    // In a real app, this would update the leave status via an API
    toast.success('Leave request approved');
  };

  const handleReject = (leaveId: string) => {
    // In a real app, this would update the leave status via an API
    toast.success('Leave request rejected');
  };

  const filteredLeaves = leaves.filter((leave) =>
    (leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.reason.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || leave.status === statusFilter)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case 'sick':
        return <Badge variant="destructive">Sick</Badge>;
      case 'vacation':
        return <Badge className="bg-blue-500">Vacation</Badge>;
      case 'casual':
        return <Badge className="bg-yellow-500">Casual</Badge>;
      case 'other':
        return <Badge variant="secondary">Other</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leave Management</h2>
          <p className="text-muted-foreground">
            Apply and manage employee leave requests
          </p>
        </div>
        <Button onClick={onApplyLeave}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Apply Leave
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Input
            placeholder="Search leaves..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-[300px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied On</TableHead>
              {canApprove && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canApprove ? 6 : 5} className="text-center py-8 text-muted-foreground">
                  No leave requests found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeaves.map((leave) => {
                const startDate = new Date(leave.startDate);
                const endDate = new Date(leave.endDate);
                let duration = '';
                
                if (startDate.toDateString() === endDate.toDateString()) {
                  duration = `1 day (${startDate.toLocaleDateString()})`;
                } else {
                  const days = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  duration = `${days} days (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`;
                }

                return (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.employeeName}</TableCell>
                    <TableCell>{getLeaveTypeBadge(leave.type)}</TableCell>
                    <TableCell>
                      <div>
                        <div>{duration}</div>
                        <div className="text-xs text-muted-foreground mt-1">{leave.reason}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    <TableCell>{new Date(leave.appliedOn).toLocaleDateString()}</TableCell>
                    {canApprove && (
                      <TableCell>
                        {leave.status === 'pending' ? (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleApprove(leave.id)}
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleReject(leave.id)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Reject</span>
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    )}
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

export default LeaveTable;
