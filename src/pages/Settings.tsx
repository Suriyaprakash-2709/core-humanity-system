
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CompanyForm from '@/components/settings/CompanyForm';
import RoleManagement from '@/components/settings/RoleManagement';
import { Company, RolePermission } from '@/lib/types';

const Settings = () => {
  const handleCompanySave = (company: Company) => {
    // In a real app, this would save to a database
    console.log('Company info saved:', company);
  };

  const handleRolePermissionsSave = (rolePermissions: RolePermission[]) => {
    // In a real app, this would save to a database
    console.log('Role permissions saved:', rolePermissions);
  };

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
          <CompanyForm onSave={handleCompanySave} />
        </TabsContent>
        
        <TabsContent value="roles">
          <RoleManagement onSave={handleRolePermissionsSave} />
        </TabsContent>
        
        <TabsContent value="system">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">System Settings</h3>
            <p className="text-muted-foreground">
              System settings are not available in the demo version.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
