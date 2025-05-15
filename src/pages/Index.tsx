
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking the auth status from the API
    const checkAuthStatus = async () => {
      try {
        // In a real app, this would verify the token with the backend
        setIsLoading(false);
        if (isAuthenticated) {
          navigate('/dashboard');
        }
      } catch (error) {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <Card className="w-[350px] p-8 flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-t-hrms-blue border-r-hrms-blue border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-3xl font-bold text-hrms-blue mb-2">HRMS Portal</h1>
        <p className="text-gray-600">Log in to access your HR management dashboard</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Employee Management System - Complete HR Solution</p>
      </div>
    </div>
  );
};

export default Index;
