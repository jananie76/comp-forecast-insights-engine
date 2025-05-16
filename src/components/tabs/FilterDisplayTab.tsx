
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import EmployeeFilter from '@/components/EmployeeFilter';
import EmployeeTable from '@/components/EmployeeTable';
import { Employee } from '@/data/employeeData';
import CompensationByLocation from '@/components/charts/CompensationByLocation';

interface FilterDisplayTabProps {
  selectedRole: string | null;
  setSelectedRole: (role: string | null) => void;
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
  includeInactive: boolean;
  setIncludeInactive: (include: boolean) => void;
  filteredEmployees: Employee[];
  incrementedEmployees: Employee[] | null;
  locationCompensationData: { location: string; average: number }[];
  handleExportCSV: () => void;
}

const FilterDisplayTab: React.FC<FilterDisplayTabProps> = ({
  selectedRole,
  setSelectedRole,
  selectedLocation,
  setSelectedLocation,
  includeInactive,
  setIncludeInactive,
  filteredEmployees,
  incrementedEmployees,
  locationCompensationData,
  handleExportCSV
}) => {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <EmployeeFilter 
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            includeInactive={includeInactive}
            setIncludeInactive={setIncludeInactive}
          />
        </div>
        <CompensationByLocation locationCompensationData={locationCompensationData} />
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Data</h2>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export as CSV
        </Button>
      </div>
      
      <EmployeeTable 
        employees={filteredEmployees} 
        incrementedEmployees={incrementedEmployees}
      />
    </div>
  );
};

export default FilterDisplayTab;
