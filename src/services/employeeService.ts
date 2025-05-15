
import { Employee } from '@/lib/types';
import { api } from './api';

export const employeeService = {
  // Get all employees
  getAllEmployees: () => api.get('/employees'),
  
  // Get employee by id
  getEmployeeById: (id: string) => api.get(`/employees/${id}`),
  
  // Create new employee
  createEmployee: (employeeData: Partial<Employee>) => api.post('/employees', employeeData),
  
  // Update employee
  updateEmployee: (id: string, employeeData: Partial<Employee>) => api.put(`/employees/${id}`, employeeData),
  
  // Delete employee
  deleteEmployee: (id: string) => api.delete(`/employees/${id}`),
  
  // Upload employee avatar
  uploadAvatar: (id: string, file: File) => api.upload(`/employees/${id}/avatar`, file, 'avatar'),
};
