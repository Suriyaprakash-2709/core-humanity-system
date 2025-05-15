
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Company } from '@/lib/types';

interface CompanyFormProps {
  onSave: (company: Company) => void;
}

// Mock company data
const initialCompany: Company = {
  name: 'Acme Corporation',
  address: '123 Business Street, Suite 100, Business City, BZ 12345',
  email: 'info@acmecorp.com',
  phone: '(555) 123-4567',
  website: 'https://www.acmecorp.com',
  taxId: 'TAX-12345678',
};

const CompanyForm = ({ onSave }: CompanyFormProps) => {
  const [company, setCompany] = useState<Company>(initialCompany);

  const handleChange = (field: keyof Company, value: string) => {
    setCompany((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!company.name || !company.address || !company.email || !company.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    
    onSave(company);
    toast.success('Company information saved successfully');
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Manage your company details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name*</Label>
              <Input
                id="name"
                value={company.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Business Email*</Label>
              <Input
                id="email"
                type="email"
                value={company.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number*</Label>
              <Input
                id="phone"
                value={company.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={company.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Business Address*</Label>
              <Input
                id="address"
                value={company.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / Business Registration</Label>
              <Input
                id="taxId"
                value={company.taxId}
                onChange={(e) => handleChange('taxId', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-center gap-4 mt-2">
              <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt="Company Logo"
                    className="max-h-full max-w-full"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No logo</span>
                )}
              </div>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    // In a real app, this would upload to a server and get a URL
                    const fakeUrl = URL.createObjectURL(e.target.files[0]);
                    handleChange('logo', fakeUrl);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleChange('logo', '')}
              >
                Remove
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CompanyForm;
