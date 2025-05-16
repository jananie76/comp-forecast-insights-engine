
import React from 'react';
import { Employee } from '@/data/employeeData';
import FileUpload from '@/components/FileUpload';
import EmployeeTable from '@/components/EmployeeTable';

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
              <h4 className="font-medium mt-2">Required columns:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>name: Employee full name</li>
                <li>role: Job title/role (e.g., Developer, Manager)</li>
                <li>location: Office location</li>
                <li>experience: Years of experience (number)</li>
                <li>compensation: Annual compensation (number)</li>
                <li>status: "Active" or "Inactive"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Current Employee Data</h2>
        <p className="text-muted-foreground mb-4">
          {employeeData.length} employees loaded
          {employeeData !== employees && " from custom data file"}
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
