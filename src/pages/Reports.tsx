import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart3, FileText, Calendar, Download, Users } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { reportService } from '@/services/reportService';

const Reports = () => {
  const queryClient = useQueryClient();
  const [reportType, setReportType] = useState('attendance');
  const [month, setMonth] = useState('05');
  const [year, setYear] = useState('2023');
  const [department, setDepartment] = useState('all');
  const [format, setFormat] = useState('PDF');

  // Query for recent reports
  const { data: recentReportsData, isLoading: isLoadingRecentReports } = useQuery({
    queryKey: ['recentReports'],
    queryFn: reportService.getRecentReports,
  });

  // Mutation for generating report
  const generateReportMutation = useMutation({
    mutationFn: reportService.generateReport,
    onSuccess: () => {
      toast.success(`${getReportName()} generated successfully`);
      queryClient.invalidateQueries({ queryKey: ['recentReports'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    }
  });

  // Mutation for scheduling report
  const scheduleReportMutation = useMutation({
    mutationFn: reportService.scheduleReport,
    onSuccess: () => {
      toast.success('Report schedule saved');
    },
    onError: (error: Error) => {
      toast.error(`Failed to schedule report: ${error.message}`);
    }
  });

  const handleGenerateReport = () => {
    generateReportMutation.mutate({
      reportType,
      month,
      year,
      department,
      format
    });
  };

  const handleScheduleReport = (type: string, frequency: string, day: string, recipients: string) => {
    scheduleReportMutation.mutate({
      reportType: type,
      frequency,
      day: parseInt(day),
      recipients
    });
  };

  const handleDownloadReport = (reportId: string) => {
    // In a real application, this would download the report
    reportService.downloadReport(reportId)
      .then(() => toast.success('Report downloaded'))
      .catch(() => toast.error('Failed to download report'));
  };

  const getReportName = () => {
    const reportTypes = {
      attendance: 'Attendance Report',
      leave: 'Leave Report',
      payroll: 'Payroll Report',
      employee: 'Employee Report',
    };
    return reportTypes[reportType as keyof typeof reportTypes];
  };

  const getReportIcon = () => {
    const icons = {
      attendance: Calendar,
      leave: Calendar,
      payroll: FileText,
      employee: Users,
    };
    return icons[reportType as keyof typeof icons] || BarChart3;
  };

  const ReportIcon = getReportIcon();
  
  const recentReports = recentReportsData?.data || [];

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

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'it', label: 'IT' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
  ];

  const reportFormats = ['PDF', 'Excel', 'CSV'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate and download various reports
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ReportIcon className="mr-2 h-5 w-5" />
              {getReportName()}
            </CardTitle>
            <CardDescription>
              Configure and generate {reportType} reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Attendance Report</SelectItem>
                  <SelectItem value="leave">Leave Report</SelectItem>
                  <SelectItem value="payroll">Payroll Report</SelectItem>
                  <SelectItem value="employee">Employee Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="month">Month</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="year">Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue />
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
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <Label>Format</Label>
              <div className="flex space-x-2 mt-1">
                {reportFormats.map((formatOption) => (
                  <Button
                    key={formatOption}
                    variant={format === formatOption ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setFormat(formatOption)}
                  >
                    {formatOption}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleGenerateReport}
              disabled={generateReportMutation.isPending}
            >
              <Download className="mr-2 h-4 w-4" />
              {generateReportMutation.isPending ? 'Generating...' : 'Generate Report'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Recently generated reports for quick access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingRecentReports ? (
              <div className="text-center py-4">Loading recent reports...</div>
            ) : recentReports.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No recent reports found</div>
            ) : (
              recentReports.map((report: any) => (
                <div key={report.id} className="flex items-center justify-between py-2">
                  <div className="flex items-start gap-2">
                    {report.type === 'attendance' && <Calendar className="h-4 w-4 mt-1" />}
                    {report.type === 'payroll' && <FileText className="h-4 w-4 mt-1" />}
                    {report.type === 'leave' && <Calendar className="h-4 w-4 mt-1" />}
                    {report.type === 'employee' && <Users className="h-4 w-4 mt-1" />}
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Generated on {new Date(report.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDownloadReport(report.id)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>
            Configure reports to be automatically generated on a schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly">
            <TabsList className="mb-4">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="scheduled-report-type">Report Type</Label>
                  <Select defaultValue="attendance">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendance">Attendance Report</SelectItem>
                      <SelectItem value="leave">Leave Report</SelectItem>
                      <SelectItem value="payroll">Payroll Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="scheduled-day">Day of Month</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Input
                    id="recipients"
                    placeholder="Email addresses separated by comma"
                    defaultValue="admin@example.com, hr@example.com"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleScheduleReport('attendance', 'monthly', '1', 'admin@example.com, hr@example.com')}>
                  {scheduleReportMutation.isPending ? 'Saving...' : 'Save Schedule'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="weekly" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="scheduled-report-type">Report Type</Label>
                  <Select defaultValue="attendance">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendance">Attendance Report</SelectItem>
                      <SelectItem value="leave">Leave Report</SelectItem>
                      <SelectItem value="payroll">Payroll Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="scheduled-day">Day of Week</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Input
                    id="recipients"
                    placeholder="Email addresses separated by comma"
                    defaultValue="admin@example.com, hr@example.com"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => toast.success('Weekly report schedule saved')}>
                  Save Schedule
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="scheduled-report-type">Report Type</Label>
                  <Select defaultValue="attendance">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendance">Attendance Report</SelectItem>
                      <SelectItem value="leave">Leave Report</SelectItem>
                      <SelectItem value="payroll">Payroll Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select defaultValue="biweekly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Input
                    id="recipients"
                    placeholder="Email addresses separated by comma"
                    defaultValue="admin@example.com"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => toast.success('Custom report schedule saved')}>
                  Save Schedule
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
