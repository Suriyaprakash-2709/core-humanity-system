
import { useState } from 'react';
import { Employee } from '@/lib/types';
import EmployeeTable from '@/components/employees/EmployeeTable';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Employees = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);

  const handleAddEmployee = () => {
    setEditingEmployee(undefined);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (employee: Partial<Employee>) => {
    // In a real app, this would save the employee to a database
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <EmployeeTable 
        onAddEmployee={handleAddEmployee} 
        onEditEmployee={handleEditEmployee} 
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <EmployeeForm
            employee={editingEmployee}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Employees;
