
import { useState, useEffect } from 'react';
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
import { settingsService } from '@/services/settingsService';
import { Skeleton } from "@/components/ui/skeleton";

interface CompanyFormProps {
  company?: Company;
  isLoading?: boolean;
  onSave: (company: Company) => void;
}

const CompanyForm = ({ company, isLoading, onSave }: CompanyFormProps) => {
  const [form, setForm] = useState<Company>({
    name: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    taxId: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (company) {
      setForm(company);
    }
  }, [company]);

  const handleChange = (field: keyof Company, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const response = await settingsService.uploadCompanyLogo(file);
      return response.data.logo;
    } catch (error) {
      toast.error("Failed to upload logo");
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.address || !form.email || !form.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let updatedCompany = { ...form };
      
      if (logoFile) {
        const logoUrl = await handleLogoUpload(logoFile);
        updatedCompany.logo = logoUrl;
      }
      
      onSave(updatedCompany);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20 md:col-span-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Business Email*</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number*</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={form.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Business Address*</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / Business Registration</Label>
              <Input
                id="taxId"
                value={form.taxId}
                onChange={(e) => handleChange('taxId', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-center gap-4 mt-2">
              <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                {form.logo ? (
                  <img
                    src={form.logo}
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
                    setLogoFile(e.target.files[0]);
                    // Create a preview
                    const fakeUrl = URL.createObjectURL(e.target.files[0]);
                    handleChange('logo', fakeUrl);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setLogoFile(null);
                  handleChange('logo', '');
                }}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CompanyForm;
