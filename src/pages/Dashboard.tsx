
import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, FileText, BarChart3 } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services/dashboardService';

const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardService.getStats,
  });
  
  const { data: departmentsData, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['departmentDistribution'],
    queryFn: dashboardService.getDepartmentDistribution,
  });
  
  const { data: activitiesData, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: dashboardService.getRecentActivities,
  });
  
  const stats = statsData?.data || {};
  const departments = departmentsData?.data || [];
  const activities = activitiesData?.data || [];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoadingStats ? (
          <>
            <Card className="p-6">
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-6 w-1/4" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-6 w-1/4" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-6 w-1/4" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-6 w-1/4" />
            </Card>
          </>
        ) : (
          <>
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees || "0"}
              icon={Users}
              description={`Active employees in the organization`}
              change={stats.employeeChange}
              iconColor="text-blue-500"
            />
            <StatCard
              title="Present Today"
              value={stats.presentToday || "0"}
              icon={Calendar}
              description={`Attendance rate: ${stats.attendanceRate || "0"}%`}
              change={stats.attendanceChange}
              iconColor="text-green-500"
            />
            <StatCard
              title="Pending Leaves"
              value={stats.pendingLeaves || "0"}
              icon={Calendar}
              description="Leave requests awaiting approval"
              change={stats.leaveChange}
              iconColor="text-yellow-500"
            />
            <StatCard
              title="Payroll Status"
              value={stats.payrollStatus || "Pending"}
              icon={FileText}
              description={stats.payrollDescription || "No information"}
              iconColor="text-purple-500"
            />
          </>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {isLoadingActivities ? (
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ) : (
          <RecentActivity activities={activities} />
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>
              Employee distribution by department
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {isLoadingDepartments ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : (
              departments.map((dept: any) => (
                <div key={dept.dept} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{dept.dept}</div>
                    <div className="text-muted-foreground text-sm">{dept.count} employees</div>
                  </div>
                  <div className="bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>{dept.percentage}%</div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
