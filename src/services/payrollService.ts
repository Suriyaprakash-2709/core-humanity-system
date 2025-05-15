
import { api } from './api';
import { Payroll } from '@/lib/types';

export const payrollService = {
  // Get all payroll records
  getAllPayroll: () => api.get('/payroll'),
  
  // Get payroll by employee ID
  getPayrollByEmployee: (employeeId: string) => api.get(`/payroll/employee/${employeeId}`),
  
  // Get payroll by month and year
  getPayrollByPeriod: (month: string, year: string) => api.get(`/payroll/period/${year}/${month}`),
  
  // Upload a payslip
  uploadPayslip: (data: FormData) => api.upload('/payroll/upload', data),
  
  // Send payslip via email
  sendPayslipEmail: (payrollId: string) => api.post(`/payroll/${payrollId}/email`, {}),
  
  // Download payslip
  downloadPayslip: (payrollId: string) => api.get(`/payroll/${payrollId}/download`, { responseType: 'blob' }),
  
  // Process payroll for a period
  processPayroll: (month: string, year: string) => api.post('/payroll/process', { month, year }),
};
