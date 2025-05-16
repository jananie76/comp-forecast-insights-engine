
import React, { useState } from 'react';
import { Employee } from '@/data/employeeData';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface CompensationSimulatorProps {
  employees: Employee[];
  onApplyIncrement: (incrementedEmployees: Employee[]) => void;
}

const CompensationSimulator = ({ employees, onApplyIncrement }: CompensationSimulatorProps) => {
  const [globalIncrement, setGlobalIncrement] = useState<string>('');
  const [simulationMode, setSimulationMode] = useState<'global' | 'custom'>('global');
  const [customIncrements, setCustomIncrements] = useState<Record<string, string>>({});
  const [customType, setCustomType] = useState<'employee' | 'location'>('location');

  const handleGlobalIncrementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalIncrement(e.target.value);
  };

  const handleCustomIncrementChange = (key: string, value: string) => {
    setCustomIncrements({
      ...customIncrements,
      [key]: value,
    });
  };

  const applyIncrement = () => {
    let incrementedEmployees: Employee[] = [];

    if (simulationMode === 'global') {
      const percentageIncrement = parseFloat(globalIncrement);
      
      if (isNaN(percentageIncrement)) {
        toast({
          title: "Invalid increment",
          description: "Please enter a valid percentage increment",
          variant: "destructive"
        });
        return;
      }

      incrementedEmployees = employees.map(employee => ({
        ...employee,
        compensation: Math.round(employee.compensation * (1 + percentageIncrement / 100)),
      }));
      
    } else if (simulationMode === 'custom') {
      incrementedEmployees = employees.map(employee => {
        let incrementPercentage = 0;

        if (customType === 'employee') {
          incrementPercentage = parseFloat(customIncrements[employee.id.toString()] || '0');
        } else {
          incrementPercentage = parseFloat(customIncrements[employee.location] || '0');
        }

        return {
          ...employee,
          compensation: Math.round(employee.compensation * (1 + incrementPercentage / 100)),
        };
      });
    }

    onApplyIncrement(incrementedEmployees);
    toast({
      title: "Increment applied",
      description: "The compensation has been updated with the increment"
    });
  };

  const resetSimulation = () => {
    onApplyIncrement([]);
    toast({
      title: "Simulation reset",
      description: "The compensation simulation has been reset"
    });
  };

  const getUniqueValues = <T, K extends keyof T>(data: T[], key: K): T[K][] => {
    return [...new Set(data.map(item => item[key]))];
  };

  const uniqueLocations = getUniqueValues(employees, 'location');

  return (
    <div className="border rounded-md p-4 bg-card">
      <h3 className="text-lg font-medium mb-4">Simulate Compensation Increments</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Simulation Type</Label>
          <Select 
            value={simulationMode} 
            onValueChange={(value) => setSimulationMode(value as 'global' | 'custom')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select simulation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global Percentage</SelectItem>
              <SelectItem value="custom">Custom Percentages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {simulationMode === 'global' && (
          <div className="space-y-2">
            <Label htmlFor="global-increment">Global Increment Percentage (%)</Label>
            <Input 
              id="global-increment"
              type="number"
              value={globalIncrement}
              onChange={handleGlobalIncrementChange}
              placeholder="e.g. 5 for 5%"
            />
          </div>
        )}

        {simulationMode === 'custom' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Custom Increment Type</Label>
              <Select 
                value={customType} 
                onValueChange={(value) => setCustomType(value as 'employee' | 'location')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select custom type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="location">Per Location</SelectItem>
                  <SelectItem value="employee">Per Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {customType === 'location' && (
              <div className="space-y-2">
                <Label>Location-based Increments (%)</Label>
                {uniqueLocations.map(location => (
                  <div key={location} className="flex items-center gap-2">
                    <span className="w-32">{location}:</span>
                    <Input 
                      type="number"
                      value={customIncrements[location] || ''}
                      onChange={(e) => handleCustomIncrementChange(location, e.target.value)}
                      placeholder="e.g. 5 for 5%"
                      className="w-32"
                    />
                  </div>
                ))}
              </div>
            )}

            {customType === 'employee' && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <Label>Employee-based Increments (%)</Label>
                {employees.map(employee => (
                  <div key={employee.id} className="flex items-center gap-2">
                    <span className="w-32 truncate" title={employee.name}>{employee.name}:</span>
                    <Input 
                      type="number"
                      value={customIncrements[employee.id.toString()] || ''}
                      onChange={(e) => handleCustomIncrementChange(employee.id.toString(), e.target.value)}
                      placeholder="e.g. 5 for 5%"
                      className="w-32"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-2">
          <Button onClick={applyIncrement}>Apply Increment</Button>
          <Button variant="outline" onClick={resetSimulation}>Reset</Button>
        </div>
      </div>
    </div>
  );
};

export default CompensationSimulator;
