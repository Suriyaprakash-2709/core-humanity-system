
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import PayrollTable from '@/components/payroll/PayrollTable';
import PayslipForm from '@/components/payroll/PayslipForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { payrollService } from '@/services/payrollService';

const Payroll = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [month, setMonth] = useState('05');
  const [year, setYear] = useState('2023');
  
  const handleUploadPayslip = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    // Form handles the API call
    setIsFormOpen(false);
    // Invalidate the queries to refresh data
    refetch();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  const { data: payrollData, isLoading, error, refetch } = useQuery({
    queryKey: ['payroll', month, year],
    queryFn: () => payrollService.getPayrollByPeriod(month, year),
  });

  if (error) {
    toast.error('Failed to load payroll data');
  }

  return (
    <>
      <PayrollTable 
        onUploadPayslip={handleUploadPayslip} 
        isLoading={isLoading} 
        payrollData={payrollData?.data || []}
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

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
