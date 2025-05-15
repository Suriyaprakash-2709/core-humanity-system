
import { api } from './api';

export const leaveService = {
  // Get all leave requests
  getAllLeaves: () => api.get('/leave'),
  
  // Get leave by employee ID
  getLeavesByEmployee: (employeeId: string) => api.get(`/leave/employee/${employeeId}`),
  
  // Get leave balance for current user
  getLeaveBalance: () => api.get('/leave/balance'),
  
  // Apply for leave
  applyLeave: (data: {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => api.post('/leave', data),
  
  // Update leave status (approve/reject)
  updateLeaveStatus: (id: string, status: 'approved' | 'rejected', comment?: string) => 
    api.put(`/leave/${id}/status`, { status, comment }),
  
  // Cancel leave request
  cancelLeave: (id: string) => api.put(`/leave/${id}/cancel`, {}),
};
