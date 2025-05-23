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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import { leaveService } from '@/services/leaveService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface LeaveFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const LeaveForm = ({ onSubmit, onCancel }: LeaveFormProps) => {
  const { user } = useAuth();
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch leave balance
  const { data: leaveBalanceData, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['leaveBalance'],
    queryFn: leaveService.getLeaveBalance,
  });

  const leaveBalance = leaveBalanceData?.data || {
    casual: 0,
    sick: 0,
    vacation: 0,
    total: 0,
  };

  // Apply leave mutation
  const applyLeaveMutation = useMutation({
    mutationFn: leaveService.applyLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveBalance'] });
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success('Leave request submitted successfully');
      onSubmit();
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit leave request: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!leaveType || !startDate || !endDate || !reason) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      toast.error('End date cannot be before start date');
      return;
    }
    
    setIsSubmitting(true);
    
    applyLeaveMutation.mutate({
      leaveType,
      startDate,
      endDate,
      reason
    });
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Apply for Leave</CardTitle>
          <CardDescription>
            Submit a request for time off work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md text-sm mb-4">
            <p className="font-medium text-blue-800">Leave Balance</p>
            {isLoadingBalance ? (
              <p className="text-blue-600 mt-1">Loading balance...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                <div>
                  <span className="text-blue-600">Casual:</span>
                  <span className="font-medium ml-1">{leaveBalance.casual} days</span>
                </div>
                <div>
                  <span className="text-blue-600">Sick:</span>
                  <span className="font-medium ml-1">{leaveBalance.sick} days</span>
                </div>
                <div>
                  <span className="text-blue-600">Vacation:</span>
                  <span className="font-medium ml-1">{leaveBalance.vacation} days</span>
                </div>
                <div>
                  <span className="text-blue-600">Total:</span>
                  <span className="font-medium ml-1">{leaveBalance.total} days</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type*</Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual Leave</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="vacation">Vacation Leave</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date*</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date*</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave*</Label>
            <Textarea
              id="reason"
              placeholder="Please provide details about your leave request"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            * Required fields
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LeaveForm;
