
import { useState } from 'react';
import { Employee } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { employeeService } from '@/services/employeeService';

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (employee: Partial<Employee>) => void;
  onCancel: () => void;
}

const departments = [
  'IT',
  'HR',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'Customer Support',
];

const roles = [
  'Developer',
  'Designer',
  'Manager',
  'Director',
  'Accountant',
  'Analyst',
  'Coordinator',
  'Representative',
  'Specialist',
];

const EmployeeForm = ({ employee, onSubmit, onCancel }: EmployeeFormProps) => {
  const isEdit = !!employee;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Partial<Employee>>(
    employee || {
      name: '',
      email: '',
      phone: '',
      department: '',
      role: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
    }
  );

  const handleChange = (field: keyof Employee, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!form.name || !form.email || !form.department || !form.role) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEdit && employee?.id) {
        await employeeService.updateEmployee(employee.id, form);
        toast.success('Employee updated successfully');
      } else {
        await employeeService.createEmployee(form);
        toast.success('Employee added successfully');
      }
      
      onSubmit(form);
    } catch (error: any) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} employee: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
        <CardDescription>
          {isEdit
            ? 'Edit employee information and details'
            : 'Fill in the details to add a new employee'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name*</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address*</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number*</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date*</Label>
              <Input
                id="joinDate"
                type="date"
                value={form.joinDate}
                onChange={(e) => handleChange('joinDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department*</Label>
              <Select
                value={form.department}
                onValueChange={(value) => handleChange('department', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role*</Label>
              <Select
                value={form.role}
                onValueChange={(value) => handleChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status*</Label>
              <Select
                value={form.status}
                onValueChange={(value) => 
                  handleChange('status', value as 'active' | 'inactive')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 
              (isEdit ? 'Updating...' : 'Adding...') : 
              (isEdit ? 'Update' : 'Add Employee')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmployeeForm;
