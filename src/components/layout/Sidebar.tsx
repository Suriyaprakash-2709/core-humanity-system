
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Home
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();
  
  // Check if sidebar is collapsed based on state
  const collapsed = state === "collapsed";

  // Define routes based on user role
  const routes = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
      roles: ['admin', 'hr', 'employee'],
    },
    {
      title: 'Employees',
      url: '/employees',
      icon: Users,
      roles: ['admin', 'hr'],
    },
    {
      title: 'Attendance',
      url: '/attendance',
      icon: Calendar,
      roles: ['admin', 'hr', 'employee'],
    },
    {
      title: 'Leave',
      url: '/leave',
      icon: Calendar,
      roles: ['admin', 'hr', 'employee'],
    },
    {
      title: 'Payroll',
      url: '/payroll',
      icon: FileText,
      roles: ['admin', 'hr', 'employee'],
    },
    {
      title: 'Reports',
      url: '/reports',
      icon: BarChart3,
      roles: ['admin', 'hr'],
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
      roles: ['admin'],
    },
  ];

  // Filter routes based on user role
  const userRoutes = user ? routes.filter(route => route.roles.includes(user.role)) : [];

  const isActive = (path: string) => currentPath.startsWith(path);
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar
      className={cn('h-screen transition-all duration-300 ease-in-out border-r border-gray-200', 
        collapsed ? 'w-16' : 'w-64')}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <div className={cn('p-4 flex items-center justify-center', collapsed ? 'mb-2' : 'mb-6')}>
          {collapsed ? (
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              H
            </div>
          ) : (
            <h1 className="text-xl font-bold text-white">HRMS Portal</h1>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {userRoutes.map((route) => (
                <SidebarMenuItem key={route.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={route.url}
                      className={cn(
                        "flex items-center p-2 rounded-md w-full",
                        getNavCls
                      )}
                    >
                      <route.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
                      {!collapsed && <span>{route.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
