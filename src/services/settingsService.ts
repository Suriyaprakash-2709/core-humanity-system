
import { Company, RolePermission } from '@/lib/types';
import { api } from './api';

export const settingsService = {
  // Company Information
  getCompanyInfo: () => api.get('/settings/company'),
  
  updateCompanyInfo: (companyData: Company) => api.put('/settings/company', companyData),
  
  uploadCompanyLogo: async (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await fetch('/api/settings/company/logo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('hrmsToken')}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload logo');
    }
    
    return response.json();
  },
  
  // Role Permissions
  getRolePermissions: () => api.get('/settings/roles'),
  
  updateRolePermissions: (rolePermissions: RolePermission[]) => 
    api.put('/settings/roles', { roles: rolePermissions }),
};
