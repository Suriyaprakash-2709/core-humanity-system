
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import LeaveTable from '@/components/leave/LeaveTable';
import LeaveForm from '@/components/leave/LeaveForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { leaveService } from '@/services/leaveService';

const Leave = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleApplyLeave = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    // The form itself handles the API call
    setIsFormOpen(false);
    // Invalidate the leave queries to refresh data
    refetch();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  const { data: leaveData, isLoading, error, refetch } = useQuery({
    queryKey: ['leaves'],
    queryFn: leaveService.getAllLeaves,
  });

  if (error) {
    toast.error('Failed to load leave data');
  }

  return (
    <>
      <LeaveTable 
        onApplyLeave={handleApplyLeave} 
        isLoading={isLoading} 
        leaveData={leaveData?.data || []} 
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <LeaveForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Leave;
