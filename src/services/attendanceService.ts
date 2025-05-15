
import { api } from './api';

export const attendanceService = {
  // Get all attendance records
  getAllAttendance: (date?: string) => {
    const queryParam = date ? `?date=${date}` : '';
    return api.get(`/attendance${queryParam}`);
  },
  
  // Get attendance by employee ID
  getAttendanceByEmployee: (employeeId: string) => api.get(`/attendance/employee/${employeeId}`),
  
  // Mark attendance for single employee
  markAttendance: (data: {
    employeeId: string;
    date: string;
    status: string;
    checkIn?: string;
    checkOut?: string;
  }) => api.post('/attendance', data),
  
  // Mark bulk attendance for multiple employees
  markBulkAttendance: (data: {
    date: string;
    status: string;
    checkIn?: string;
    checkOut?: string;
  }) => api.post('/attendance/bulk', data),
  
  // Update attendance record
  updateAttendance: (id: string, data: {
    status?: string;
    checkIn?: string;
    checkOut?: string;
  }) => api.put(`/attendance/${id}`, data),
};
