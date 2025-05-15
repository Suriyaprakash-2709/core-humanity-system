
import { useState } from 'react';
import { Payroll } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, FileText, Upload, Download, Mail } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { payrollService } from '@/services/payrollService';
import { Skeleton } from '@/components/ui/skeleton';

interface PayrollTableProps {
  onUploadPayslip: () => void;
  isLoading?: boolean;
  payrollData?: Payroll[];
  month: string;
  year: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
}

const PayrollTable = ({ 
  onUploadPayslip, 
  isLoading = false,
  payrollData = [],
  month,
  year,
  onMonthChange,
  onYearChange
}: PayrollTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { user } = useAuth();
  const isEmployee = user?.role === 'employee';

  const handleDownloadPayslip = (payrollId: string) => {
    payrollService.downloadPayslip(payrollId)
      .then(() => toast.success('Payslip downloaded successfully'))
      .catch(() => toast.error('Failed to download payslip'));
  };

  const handleSendEmail = (payrollId: string) => {
    payrollService.sendPayslipEmail(payrollId)
      .then(() => toast.success('Payslip sent to email successfully'))
      .catch(() => toast.error('Failed to send payslip email'));
  };

  const filteredPayrolls = payrollData.filter((payroll) =>
    payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || payroll.status === statusFilter)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'processed':
        return <Badge className="bg-blue-500">Processed</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const years = ['2023', '2022', '2021', '2020', '2019'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payroll</h2>
          <p className="text-muted-foreground">
            View and manage employee salary information
          </p>
        </div>
        {isEmployee && (
          <Button onClick={onUploadPayslip}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Payslip
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Select value={month} onValueChange={onMonthChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={onYearChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-[300px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Basic</TableHead>
              <TableHead className="text-right">HRA</TableHead>
              <TableHead className="text-right">Allowances</TableHead>
              <TableHead className="text-right">Deductions</TableHead>
              <TableHead className="text-right">Net Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </>
            ) : filteredPayrolls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No payroll records found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayrolls.map((payroll) => {
                const monthName = months.find(m => m.value === payroll.month)?.label || payroll.month;

                return (
                  <TableRow key={payroll.id}>
                    <TableCell>{payroll.employeeName}</TableCell>
                    <TableCell>{`${monthName} ${payroll.year}`}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payroll.basic)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payroll.hra)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payroll.allowances)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payroll.deductions)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(payroll.netSalary)}</TableCell>
                    <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDownloadPayslip(payroll.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Payslip
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(payroll.id)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Email Payslip
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PayrollTable;
