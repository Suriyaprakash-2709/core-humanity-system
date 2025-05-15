
import { api } from './api';

export const reportService = {
  // Generate report
  generateReport: (data: {
    reportType: string;
    month?: string;
    year?: string;
    department?: string;
    format?: string;
  }) => api.post('/reports/generate', data),
  
  // Get recent reports
  getRecentReports: () => api.get('/reports/recent'),
  
  // Download a report
  downloadReport: (reportId: string) => api.get(`/reports/${reportId}/download`, { responseType: 'blob' }),
  
  // Schedule a report
  scheduleReport: (data: {
    reportType: string;
    frequency: string;
    day?: number;
    dayOfWeek?: number;
    recipients: string;
  }) => api.post('/reports/schedule', data),
  
  // Get scheduled reports
  getScheduledReports: () => api.get('/reports/scheduled'),
};
