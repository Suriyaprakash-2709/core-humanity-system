
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppSidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider } from '@/components/ui/sidebar';

const DashboardLayout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider defaultCollapsed={false}>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
