
import { useState } from 'react';
import LeaveTable from '@/components/leave/LeaveTable';
import LeaveForm from '@/components/leave/LeaveForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Leave = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleApplyLeave = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    // In a real app, this would save the leave request to a database
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <LeaveTable onApplyLeave={handleApplyLeave} />

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
