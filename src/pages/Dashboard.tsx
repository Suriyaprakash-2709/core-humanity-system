
import { Users, Calendar, FileText, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value="42"
          icon={Users}
          description="Active employees in the organization"
          change={5}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Present Today"
          value="38"
          icon={Calendar}
          description="Attendance rate: 90.5%"
          change={2}
          iconColor="text-green-500"
        />
        <StatCard
          title="Pending Leaves"
          value="7"
          icon={Calendar}
          description="Leave requests awaiting approval"
          change={-3}
          iconColor="text-yellow-500"
        />
        <StatCard
          title="Payroll Status"
          value="Completed"
          icon={FileText}
          description="May 2023 payroll processed"
          iconColor="text-purple-500"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity />
        
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>
              Employee distribution by department
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {[
              { dept: 'IT', count: 14, percentage: 33 },
              { dept: 'HR', count: 5, percentage: 12 },
              { dept: 'Finance', count: 8, percentage: 19 },
              { dept: 'Marketing', count: 6, percentage: 14 },
              { dept: 'Sales', count: 9, percentage: 22 },
            ].map((dept) => (
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
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
