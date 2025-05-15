import { useState, useEffect } from 'react';
import { RolePermission, Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Skeleton } from "@/components/ui/skeleton";

interface RoleManagementProps {
  rolePermissions?: RolePermission[];
  isLoading?: boolean;
  onSave: (rolePermissions: RolePermission[]) => void;
}

// Default permissions structure if API call fails
const defaultRolePermissions: RolePermission[] = [
  {
    role: 'admin',
    permissions: {
      employees: { view: true, create: true, edit: true, delete: true },
      attendance: { view: true, mark: true, edit: true },
      leave: { view: true, apply: true, approve: true },
      payroll: { view: true, generate: true, approve: true },
      reports: { view: true, export: true },
      settings: { view: true, edit: true },
    },
  },
  {
    role: 'hr',
    permissions: {
      employees: { view: true, create: true, edit: true, delete: false },
      attendance: { view: true, mark: true, edit: true },
      leave: { view: true, apply: true, approve: true },
      payroll: { view: true, generate: true, approve: false },
      reports: { view: true, export: true },
      settings: { view: false, edit: false },
    },
  },
  {
    role: 'employee',
    permissions: {
      employees: { view: false, create: false, edit: false, delete: false },
      attendance: { view: true, mark: true, edit: false },
      leave: { view: true, apply: true, approve: false },
      payroll: { view: true, generate: false, approve: false },
      reports: { view: false, export: false },
      settings: { view: false, edit: false },
    },
  },
];

const RoleManagement = ({ rolePermissions, isLoading, onSave }: RoleManagementProps) => {
  const [permissions, setPermissions] = useState<RolePermission[]>(defaultRolePermissions);
  const [activeTab, setActiveTab] = useState<Role>('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rolePermissions) {
      setPermissions(rolePermissions);
    }
  }, [rolePermissions]);

  const handlePermissionChange = (
    module: keyof RolePermission['permissions'],
    action: string,
    checked: boolean
  ) => {
    setPermissions((prevPermissions) => {
      return prevPermissions.map((rolePermission) => {
        if (rolePermission.role === activeTab) {
          return {
            ...rolePermission,
            permissions: {
              ...rolePermission.permissions,
              [module]: {
                ...rolePermission.permissions[module],
                [action]: checked,
              },
            },
          };
        }
        return rolePermission;
      });
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    try {
      onSave(permissions);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRolePermission = permissions.find(
    (rp) => rp.role === activeTab
  );

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-6" />
          <div className="space-y-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array(4).fill(0).map((_, j) => (
                    <Skeleton key={j} className="h-8" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>
          Configure permissions for different user roles in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Role)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="hr">HR</TabsTrigger>
            <TabsTrigger value="employee">Employee</TabsTrigger>
          </TabsList>
          
          {currentRolePermission && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Employee Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emp-view">View Employees</Label>
                    <Switch
                      id="emp-view"
                      checked={currentRolePermission.permissions.employees.view}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('employees', 'view', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emp-create">Create Employees</Label>
                    <Switch
                      id="emp-create"
                      checked={currentRolePermission.permissions.employees.create}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('employees', 'create', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emp-edit">Edit Employees</Label>
                    <Switch
                      id="emp-edit"
                      checked={currentRolePermission.permissions.employees.edit}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('employees', 'edit', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emp-delete">Delete Employees</Label>
                    <Switch
                      id="emp-delete"
                      checked={currentRolePermission.permissions.employees.delete}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('employees', 'delete', checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Attendance Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="att-view">View Attendance</Label>
                    <Switch
                      id="att-view"
                      checked={currentRolePermission.permissions.attendance.view}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('attendance', 'view', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="att-mark">Mark Attendance</Label>
                    <Switch
                      id="att-mark"
                      checked={currentRolePermission.permissions.attendance.mark}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('attendance', 'mark', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="att-edit">Edit Attendance</Label>
                    <Switch
                      id="att-edit"
                      checked={currentRolePermission.permissions.attendance.edit}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('attendance', 'edit', checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Leave Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="leave-view">View Leave</Label>
                    <Switch
                      id="leave-view"
                      checked={currentRolePermission.permissions.leave.view}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('leave', 'view', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="leave-apply">Apply Leave</Label>
                    <Switch
                      id="leave-apply"
                      checked={currentRolePermission.permissions.leave.apply}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('leave', 'apply', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="leave-approve">Approve Leave</Label>
                    <Switch
                      id="leave-approve"
                      checked={currentRolePermission.permissions.leave.approve}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('leave', 'approve', checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Payroll Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payroll-view">View Payroll</Label>
                    <Switch
                      id="payroll-view"
                      checked={currentRolePermission.permissions.payroll.view}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('payroll', 'view', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payroll-generate">Generate Payroll</Label>
                    <Switch
                      id="payroll-generate"
                      checked={currentRolePermission.permissions.payroll.generate}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('payroll', 'generate', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payroll-approve">Approve Payroll</Label>
                    <Switch
                      id="payroll-approve"
                      checked={currentRolePermission.permissions.payroll.approve}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('payroll', 'approve', checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Reports & Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reports-view">View Reports</Label>
                    <Switch
                      id="reports-view"
                      checked={currentRolePermission.permissions.reports.view}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('reports', 'view', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reports-export">Export Reports</Label>
                    <Switch
                      id="reports-export"
                      checked={currentRolePermission.permissions.reports.export}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('reports', 'export', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="settings-view">View Settings</Label>
                    <Switch
                      id="settings-view"
                      checked={currentRolePermission.permissions.settings.view}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('settings', 'view', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="settings-edit">Edit Settings</Label>
                    <Switch
                      id="settings-edit"
                      checked={currentRolePermission.permissions.settings.edit}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('settings', 'edit', checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Permissions"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoleManagement;
