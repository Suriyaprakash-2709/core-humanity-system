
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: 'leave' | 'attendance' | 'employee' | 'payroll';
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
}

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'leave':
      return 'text-yellow-500 bg-yellow-100';
    case 'attendance':
      return 'text-blue-500 bg-blue-100';
    case 'employee':
      return 'text-purple-500 bg-purple-100';
    case 'payroll':
      return 'text-green-500 bg-green-100';
    default:
      return 'text-gray-500 bg-gray-100';
  }
};

const RecentActivity = ({ activities = [], isLoading = false }: RecentActivityProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest activities across the organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No recent activities found.
          </div>
        ) : (
          <ul className="space-y-4">
            {activities.map((item) => (
              <li key={item.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.user.avatar} />
                  <AvatarFallback>{item.user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{item.user.name}</span>
                    <span className="text-sm text-muted-foreground">{item.action}</span>
                    <span className="font-medium">{item.target}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                    <span className={cn("text-xs px-2 py-0.5 ml-2 rounded-full", getActivityColor(item.type))}>
                      {item.type}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
