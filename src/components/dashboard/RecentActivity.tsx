
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const activityItems: ActivityItem[] = [
  {
    id: '1',
    user: {
      name: 'John Employee',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    action: 'requested',
    target: 'sick leave for 2 days',
    timestamp: '10 minutes ago',
    type: 'leave',
  },
  {
    id: '2',
    user: {
      name: 'HR Manager',
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
    action: 'approved',
    target: 'Jane Smith\'s leave request',
    timestamp: '1 hour ago',
    type: 'leave',
  },
  {
    id: '3',
    user: {
      name: 'Admin User',
      avatar: 'https://i.pravatar.cc/150?img=65',
    },
    action: 'processed',
    target: 'April payroll for all employees',
    timestamp: '3 hours ago',
    type: 'payroll',
  },
  {
    id: '4',
    user: {
      name: 'Mary Johnson',
    },
    action: 'marked',
    target: 'attendance for today',
    timestamp: '5 hours ago',
    type: 'attendance',
  },
  {
    id: '5',
    user: {
      name: 'Admin User',
      avatar: 'https://i.pravatar.cc/150?img=65',
    },
    action: 'added',
    target: 'a new employee Robert Wilson',
    timestamp: '1 day ago',
    type: 'employee',
  },
];

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

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest activities across the organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activityItems.map((item) => (
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
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
