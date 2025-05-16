
import { useState, useEffect } from 'react';
import { 
  employees, 
  Employee, 
  locations,
} from '@/data/employeeData';

export const useEmployeeData = () => {
  // Filter states
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [groupBy, setGroupBy] = useState<'location' | 'role' | null>(null);
  
  // Data states
  const [employeeData, setEmployeeData] = useState<Employee[]>(employees);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [incrementedEmployees, setIncrementedEmployees] = useState<Employee[] | null>(null);
  const [locationCompensationData, setLocationCompensationData] = useState<{ location: string; average: number }[]>([]);
  const [experienceData, setExperienceData] = useState<Record<string, Record<string, number>>>({});
  
  // Handle data import
  const handleDataImport = (importedEmployees: Employee[]) => {
    setEmployeeData(importedEmployees);
  };
  
  // Update filtered employees based on role and inactive status
  useEffect(() => {
    // Custom filtering since we might have imported data
    const filtered = employeeData.filter(employee => 
      (selectedRole === null || employee.role === selectedRole) && 
      (selectedLocation === null || employee.location === selectedLocation) &&
      (includeInactive || employee.status === 'Active')
    );
    setFilteredEmployees(filtered);
  }, [selectedRole, selectedLocation, includeInactive, employeeData]);
  
  // Update location compensation data
  useEffect(() => {
    const data = locations.map(location => ({
      location,
      average: calculateAverageCompensation(location)
    }));
    setLocationCompensationData(data);
  }, [includeInactive, employeeData]);
  
  // Calculate average compensation for a location
  const calculateAverageCompensation = (location: string) => {
    const filteredForLocation = employeeData.filter(
      employee => employee.location === location && (includeInactive || employee.status === 'Active')
    );
    
    if (filteredForLocation.length === 0) return 0;
    
    const totalCompensation = filteredForLocation.reduce(
      (sum, employee) => sum + employee.compensation, 0
    );
    
    return totalCompensation / filteredForLocation.length;
  };
  
  // Update experience data
  useEffect(() => {
    const data = calculateExperienceGroups(groupBy);
    setExperienceData(data);
  }, [groupBy, includeInactive, employeeData]);
  
  // Calculate experience groups
  const calculateExperienceGroups = (groupByParam: 'location' | 'role' | null) => {
    const result: Record<string, Record<string, number>> = {};
    const experienceRanges = [
      { label: '0-1 years', min: 0, max: 1 },
      { label: '1-2 years', min: 1, max: 2 },
      { label: '2-5 years', min: 2, max: 5 },
      { label: '5-10 years', min: 5, max: 10 },
      { label: '10+ years', min: 10, max: Infinity }
    ];
    
    const roles = [...new Set(employeeData.map(emp => emp.role))];
    const locs = [...new Set(employeeData.map(emp => emp.location))];
    
    experienceRanges.forEach(range => {
      result[range.label] = {};
      
      if (groupByParam === 'location') {
        locs.forEach(location => {
          result[range.label][location] = employeeData.filter(
            employee => 
              employee.experience >= range.min && 
              employee.experience < range.max &&
              employee.location === location &&
              (includeInactive || employee.status === 'Active')
          ).length;
        });
      } else if (groupByParam === 'role') {
        roles.forEach(role => {
          result[range.label][role] = employeeData.filter(
            employee => 
              employee.experience >= range.min && 
              employee.experience < range.max &&
              employee.role === role &&
              (includeInactive || employee.status === 'Active')
          ).length;
        });
      } else {
        result[range.label]['count'] = employeeData.filter(
          employee => 
            employee.experience >= range.min && 
            employee.experience < range.max &&
            (includeInactive || employee.status === 'Active')
        ).length;
      }
    });
    
    return result;
  };
  
  // Handle compensation increment simulation
  const handleApplyIncrement = (newIncrementedEmployees: Employee[]) => {
    if (newIncrementedEmployees.length === 0) {
      setIncrementedEmployees(null);
    } else {
      setIncrementedEmployees(newIncrementedEmployees);
    }
  };
  
  return {
    selectedRole,
    setSelectedRole,
    selectedLocation,
    setSelectedLocation,
    includeInactive,
    setIncludeInactive,
    groupBy,
    setGroupBy,
    employeeData,
    filteredEmployees,
    incrementedEmployees,
    locationCompensationData,
    experienceData,
    handleDataImport,
    handleApplyIncrement
  };
};
