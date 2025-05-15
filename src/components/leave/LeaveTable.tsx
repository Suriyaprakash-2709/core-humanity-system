
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
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { leaveService } from '@/services/leaveService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface LeaveTableProps {
  onApplyLeave: () => void;
  isLoading?: boolean;
  leaveData?: Leave[];
}

const LeaveTable = ({ 
  onApplyLeave, 
  isLoading = false,
  leaveData = []
}: LeaveTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr';
  const canApprove = isAdmin || isHR;

  // Mutation for approving leave
  const approveLeaveMutation = useMutation({
    mutationFn: (leaveId: string) => leaveService.updateLeaveStatus(leaveId, 'approved'),
    onSuccess: () => {
      toast.success('Leave request approved');
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve leave: ${error.message}`);
    }
  });

  // Mutation for rejecting leave
  const rejectLeaveMutation = useMutation({
    mutationFn: (leaveId: string) => leaveService.updateLeaveStatus(leaveId, 'rejected'),
    onSuccess: () => {
      toast.success('Leave request rejected');
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to reject leave: ${error.message}`);
    }
  });

  const handleApprove = (leaveId: string) => {
    approveLeaveMutation.mutate(leaveId);
  };

  const handleReject = (leaveId: string) => {
    rejectLeaveMutation.mutate(leaveId);
  };

  const filteredLeaves = leaveData.filter((leave) =>
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
            {isLoading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    {canApprove && <TableCell><Skeleton className="h-6 w-16" /></TableCell>}
                  </TableRow>
                ))}
              </>
            ) : filteredLeaves.length === 0 ? (
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
                              disabled={approveLeaveMutation.isPending}
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleReject(leave.id)}
                              disabled={rejectLeaveMutation.isPending}
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
