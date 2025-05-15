
import { api } from './api';

export const dashboardService = {
  // Get dashboard stats
  getStats: () => api.get('/dashboard/stats'),
  
  // Get department distribution
  getDepartmentDistribution: () => api.get('/dashboard/departments'),
  
  // Get recent activities
  getRecentActivities: () => api.get('/dashboard/activities'),
  
  // Get attendance summary
  getAttendanceSummary: () => api.get('/dashboard/attendance'),
};
