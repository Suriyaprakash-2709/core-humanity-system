
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string, password: string }) => {
      try {
        // In a real app, this would call the actual login API endpoint
        const response = await api.post('/auth/login', credentials);
        return response;
      } catch (error) {
        throw new Error('Login failed');
      }
    },
    onSuccess: (data) => {
      // Call the login function from AuthContext with the response data
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the HRMS portal
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            Demo accounts:
            <div className="mt-1">
              <div><strong>Admin:</strong> admin@example.com / admin123</div>
              <div><strong>HR:</strong> hr@example.com / hr123</div>
              <div><strong>Employee:</strong> employee@example.com / employee123</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
