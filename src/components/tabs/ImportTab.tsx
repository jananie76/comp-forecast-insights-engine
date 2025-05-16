
import React from 'react';
import { Employee } from '@/data/employeeData';
import FileUpload from '@/components/FileUpload';
import EmployeeTable from '@/components/EmployeeTable';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

interface ImportTabProps {
  handleDataImport: (importedEmployees: Employee[]) => void;
  employeeData: Employee[];
  employees: Employee[];
}

const ImportTab: React.FC<ImportTabProps> = ({
  handleDataImport,
  employeeData,
  employees
}) => {
  const isCustomData = employeeData !== employees;
  
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FileUpload onDataImport={handleDataImport} />
        </div>
        <div className="lg:col-span-2">
          <div className="border rounded-md p-4 bg-card">
            <h3 className="text-lg font-medium mb-4">Import Instructions</h3>
            <div className="space-y-4">
              <p>
                Upload a CSV or Excel file with employee data to use in the application.
              </p>
              <Alert className="bg-blue-50 border-blue-100">
                <InfoIcon className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-sm text-blue-700">
                  Your data should have headers in the first row. The app will attempt to match 
                  column names to required fields. Common variations of field names are supported.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <h4 className="font-medium">Supported fields:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Required</Badge>
                    <span>Name: Employee full name</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Required</Badge>
                    <span>Role: Job title/role</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Required</Badge>
                    <span>Location: Office location</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Optional</Badge>
                    <span>Experience: Years (numeric or range)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Optional</Badge>
                    <span>Compensation: Annual compensation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Optional</Badge>
                    <span>Status: Active/Inactive or Y/N</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Current Employee Data</h2>
          {isCustomData && (
            <Badge variant="secondary" className="ml-2">
              Custom Data
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground mb-4">
          {employeeData.length} employees loaded
        </p>
        
        <EmployeeTable 
          employees={employeeData.slice(0, 10)} 
          incrementedEmployees={null}
        />
        
        {employeeData.length > 10 && (
          <p className="text-sm text-muted-foreground mt-2">
            Showing first 10 employees. Use the Filter tab to view all data.
          </p>
        )}
      </div>
    </div>
  );
};

export default ImportTab;
