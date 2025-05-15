
import { useState } from 'react';
import PayrollTable from '@/components/payroll/PayrollTable';
import PayslipForm from '@/components/payroll/PayslipForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Payroll = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleUploadPayslip = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    // In a real app, this would save the payslip to a database
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <PayrollTable onUploadPayslip={handleUploadPayslip} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <PayslipForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Payroll;
