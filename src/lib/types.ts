
export type Role = 'admin' | 'hr' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
  salary?: number;
  address?: string;
  designation?: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: 'present' | 'absent' | 'half-day' | 'late';
  checkIn?: string;
  checkOut?: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'casual' | 'sick' | 'vacation' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: string;
  basic: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
  payslipUrl?: string;
}

export interface Company {
  name: string;
  logo?: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
  taxId?: string;
}

export interface RolePermission {
  role: Role;
  permissions: {
    employees: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    attendance: {
      view: boolean;
      mark: boolean;
      edit: boolean;
    };
    leave: {
      view: boolean;
      apply: boolean;
      approve: boolean;
    };
    payroll: {
      view: boolean;
      generate: boolean;
      approve: boolean;
    };
    reports: {
      view: boolean;
      export: boolean;
    };
    settings: {
      view: boolean;
      edit: boolean;
    };
  };
}
