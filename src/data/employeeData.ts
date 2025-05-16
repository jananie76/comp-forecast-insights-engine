
export interface Employee {
  id: number;
  name: string;
  role: string;
  location: string;
  experience: number;
  compensation: number;
  status: 'Active' | 'Inactive';
}

// Mock data for the application
export const employees: Employee[] = [
  { id: 1, name: "John Doe", role: "Developer", location: "New York", experience: 3, compensation: 85000, status: "Active" },
  { id: 2, name: "Jane Smith", role: "Designer", location: "San Francisco", experience: 5, compensation: 90000, status: "Active" },
  { id: 3, name: "Robert Johnson", role: "Manager", location: "Chicago", experience: 8, compensation: 120000, status: "Active" },
  { id: 4, name: "Emily Davis", role: "Developer", location: "New York", experience: 2, compensation: 75000, status: "Active" },
  { id: 5, name: "Michael Wilson", role: "Designer", location: "San Francisco", experience: 4, compensation: 85000, status: "Inactive" },
  { id: 6, name: "Sarah Martinez", role: "Manager", location: "Chicago", experience: 7, compensation: 115000, status: "Active" },
  { id: 7, name: "David Thompson", role: "Developer", location: "Austin", experience: 1, compensation: 65000, status: "Active" },
  { id: 8, name: "Lisa Anderson", role: "Designer", location: "Austin", experience: 3, compensation: 78000, status: "Inactive" },
  { id: 9, name: "Thomas White", role: "Manager", location: "New York", experience: 10, compensation: 130000, status: "Active" },
  { id: 10, name: "Jessica Brown", role: "Developer", location: "San Francisco", experience: 4, compensation: 88000, status: "Active" },
  { id: 11, name: "Daniel Miller", role: "Designer", location: "Chicago", experience: 6, compensation: 92000, status: "Active" },
  { id: 12, name: "Jennifer Davis", role: "Developer", location: "Austin", experience: 2, compensation: 72000, status: "Active" },
  { id: 13, name: "Christopher Wilson", role: "Manager", location: "New York", experience: 9, compensation: 125000, status: "Inactive" },
  { id: 14, name: "Amanda Taylor", role: "Developer", location: "San Francisco", experience: 5, compensation: 90000, status: "Active" },
  { id: 15, name: "Ryan Johnson", role: "Designer", location: "Chicago", experience: 3, compensation: 80000, status: "Active" },
  { id: 16, name: "Sophia Lee", role: "Developer", location: "Austin", experience: 1, compensation: 68000, status: "Inactive" },
  { id: 17, name: "Matthew Harris", role: "Manager", location: "San Francisco", experience: 8, compensation: 118000, status: "Active" },
  { id: 18, name: "Olivia Martin", role: "Developer", location: "New York", experience: 4, compensation: 85000, status: "Active" },
  { id: 19, name: "Andrew Clark", role: "Designer", location: "Chicago", experience: 7, compensation: 95000, status: "Active" },
  { id: 20, name: "Emma Rodriguez", role: "Manager", location: "Austin", experience: 6, compensation: 110000, status: "Active" }
];

// Helper function to get unique values
export const getUniqueValues = <T, K extends keyof T>(data: T[], key: K): T[K][] => {
  return [...new Set(data.map(item => item[key]))];
};

// Get unique roles from the employee data
export const roles = getUniqueValues(employees, 'role');

// Get unique locations from the employee data
export const locations = getUniqueValues(employees, 'location');

// Define experience ranges for grouping
export const experienceRanges = [
  { label: '0-1 years', min: 0, max: 1 },
  { label: '1-2 years', min: 1, max: 2 },
  { label: '2-5 years', min: 2, max: 5 },
  { label: '5-10 years', min: 5, max: 10 },
  { label: '10+ years', min: 10, max: Infinity }
];

// Helper function to get employees by role
export const getEmployeesByRole = (role: string | null, includeInactive: boolean) => {
  return employees.filter(employee => 
    (role === null || employee.role === role) && 
    (includeInactive || employee.status === 'Active')
  );
};

// Helper function to calculate average compensation by location
export const getAverageCompensationByLocation = (location: string, includeInactive: boolean) => {
  const filteredEmployees = employees.filter(
    employee => employee.location === location && (includeInactive || employee.status === 'Active')
  );
  
  if (filteredEmployees.length === 0) return 0;
  
  const totalCompensation = filteredEmployees.reduce(
    (sum, employee) => sum + employee.compensation, 0
  );
  
  return totalCompensation / filteredEmployees.length;
};

// Helper function to group employees by experience range
export const groupEmployeesByExperience = (
  groupBy: 'location' | 'role' | null,
  includeInactive: boolean
) => {
  const result: Record<string, Record<string, number>> = {};
  
  experienceRanges.forEach(range => {
    result[range.label] = {};
    
    if (groupBy === 'location') {
      locations.forEach(location => {
        result[range.label][location] = employees.filter(
          employee => 
            employee.experience >= range.min && 
            employee.experience < range.max &&
            employee.location === location &&
            (includeInactive || employee.status === 'Active')
        ).length;
      });
    } else if (groupBy === 'role') {
      roles.forEach(role => {
        result[range.label][role] = employees.filter(
          employee => 
            employee.experience >= range.min && 
            employee.experience < range.max &&
            employee.role === role &&
            (includeInactive || employee.status === 'Active')
        ).length;
      });
    } else {
      result[range.label]['count'] = employees.filter(
        employee => 
          employee.experience >= range.min && 
          employee.experience < range.max &&
          (includeInactive || employee.status === 'Active')
      ).length;
    }
  });
  
  return result;
};
