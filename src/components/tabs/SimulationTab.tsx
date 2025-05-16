
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Employee } from '@/data/employeeData';
import CompensationSimulator from '@/components/CompensationSimulator';
import EmployeeTable from '@/components/EmployeeTable';

interface SimulationTabProps {
  filteredEmployees: Employee[];
  incrementedEmployees: Employee[] | null;
  handleApplyIncrement: (newIncrementedEmployees: Employee[]) => void;
  handleExportCSV: () => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({
  filteredEmployees,
  incrementedEmployees,
  handleApplyIncrement,
  handleExportCSV
}) => {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CompensationSimulator 
            employees={filteredEmployees} 
            onApplyIncrement={handleApplyIncrement}
          />
        </div>
        <div className="lg:col-span-2">
          <div className="border rounded-md p-4 bg-card">
            <h3 className="text-lg font-medium mb-4">Simulation Results</h3>
            {incrementedEmployees ? (
              <div className="space-y-4">
                <p>
                  Showing compensation with applied increments. You can export this data using the button below.
                </p>
                <Button onClick={handleExportCSV} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Simulation as CSV
                </Button>
              </div>
            ) : (
              <p>Apply an increment to see the simulation results here.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Employee Table with Incremented Values */}
      {incrementedEmployees && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Simulated Compensation</h2>
          <EmployeeTable 
            employees={filteredEmployees} 
            incrementedEmployees={incrementedEmployees}
          />
        </div>
      )}
    </div>
  );
};

export default SimulationTab;
