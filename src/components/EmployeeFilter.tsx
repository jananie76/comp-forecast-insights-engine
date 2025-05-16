
import React from 'react';
import { roles, locations } from '@/data/employeeData';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';

interface EmployeeFilterProps {
  selectedRole: string | null;
  setSelectedRole: (role: string | null) => void;
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
  includeInactive: boolean;
  setIncludeInactive: (include: boolean) => void;
}

const EmployeeFilter = ({
  selectedRole,
  setSelectedRole,
  selectedLocation,
  setSelectedLocation,
  includeInactive,
  setIncludeInactive
}: EmployeeFilterProps) => {
  return (
    <div className="grid gap-4 p-4 border rounded-md bg-card">
      <div className="space-y-2">
        <Label htmlFor="role">Filter by Role</Label>
        <Select 
          value={selectedRole || ''} 
          onValueChange={(value) => setSelectedRole(value ? value : null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            {roles.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Filter by Location</Label>
        <Select 
          value={selectedLocation || ''} 
          onValueChange={(value) => setSelectedLocation(value ? value : null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Locations</SelectItem>
            {locations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="include-inactive" 
          checked={includeInactive}
          onCheckedChange={setIncludeInactive}
        />
        <Label htmlFor="include-inactive">Include Inactive Employees</Label>
      </div>
    </div>
  );
};

export default EmployeeFilter;
