
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CompanyForm from '@/components/settings/CompanyForm';
import RoleManagement from '@/components/settings/RoleManagement';
import { Company, RolePermission } from '@/lib/types';
import { settingsService } from '@/services/settingsService';
import { toast } from '@/components/ui/sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Settings = () => {
  const queryClient = useQueryClient();
  
  // Company information query
  const { 
    data: companyData,
    isLoading: isCompanyLoading,
    error: companyError
  } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: settingsService.getCompanyInfo,
  });

  // Role permissions query
  const {
    data: rolesData,
    isLoading: isRolesLoading,
    error: rolesError
  } = useQuery({
    queryKey: ['rolePermissions'],
    queryFn: settingsService.getRolePermissions,
  });

  // Company update mutation
  const companyMutation = useMutation({
    mutationFn: settingsService.updateCompanyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyInfo'] });
      toast.success('Company information updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update company information: ${error.message}`);
    }
  });

  // Role permissions mutation
  const rolesMutation = useMutation({
    mutationFn: settingsService.updateRolePermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
      toast.success('Role permissions updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update role permissions: ${error.message}`);
    }
  });

  const handleCompanySave = (company: Company) => {
    companyMutation.mutate(company);
  };

  const handleRolePermissionsSave = (rolePermissions: RolePermission[]) => {
    rolesMutation.mutate(rolePermissions);
  };

  if (companyError || rolesError) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Settings</h2>
        <Card className="p-6">
          <div className="text-red-500">
            Error loading settings: {companyError?.message || rolesError?.message}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage system settings and configurations
        </p>
      </div>
      
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <CompanyForm 
            company={companyData?.data} 
            isLoading={isCompanyLoading}
            onSave={handleCompanySave}
          />
        </TabsContent>
        
        <TabsContent value="roles">
          <RoleManagement 
            rolePermissions={rolesData?.data?.roles} 
            isLoading={isRolesLoading}
            onSave={handleRolePermissionsSave}
          />
        </TabsContent>
        
        <TabsContent value="system">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">System Settings</h3>
            <p className="text-muted-foreground">
              System settings are available through API integration.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
