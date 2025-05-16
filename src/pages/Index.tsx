
import { useState, useEffect } from 'react';
import { 
  employees, 
  Employee, 
  getEmployeesByRole, 
  getAverageCompensationByLocation,
  locations,
  groupEmployeesByExperience
} from '@/data/employeeData';
import EmployeeFilter from '@/components/EmployeeFilter';
import EmployeeTable from '@/components/EmployeeTable';
import CompensationChart from '@/components/CompensationChart';
import ExperienceChart from '@/components/ExperienceChart';
import CompensationSimulator from '@/components/CompensationSimulator';
import FileUpload from '@/components/FileUpload';
import { exportToCSV } from '@/utils/csvExport';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@radix-ui/react-label';
import { Download, BarChart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
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
      (includeInactive || employee.status === 'Active')
    );
    setFilteredEmployees(filtered);
  }, [selectedRole, includeInactive, employeeData]);
  
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
  
  // Handle CSV export
  const handleExportCSV = () => {
    exportToCSV(filteredEmployees, incrementedEmployees);
    toast({
      title: "Export successful",
      description: "Employee data has been exported to CSV"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Employee Compensation Forecasting</h1>
          <p className="mt-2 text-primary-foreground/90">
            Analyze, forecast, and export employee compensation data
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="filter">
          <TabsList className="w-full justify-start mb-6 overflow-x-auto">
            <TabsTrigger value="filter">Filter & Display</TabsTrigger>
            <TabsTrigger value="experience">Experience Analysis</TabsTrigger>
            <TabsTrigger value="simulate">Simulate Increments</TabsTrigger>
            <TabsTrigger value="import">Import Data</TabsTrigger>
          </TabsList>

          {/* Filter and Display Tab */}
          <TabsContent value="filter" className="space-y-6">
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
              <div className="lg:col-span-2">
                <CompensationChart data={locationCompensationData} />
              </div>
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
          </TabsContent>

          {/* Experience Analysis Tab */}
          <TabsContent value="experience" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="p-4 border rounded-md bg-card space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-by">Group By</Label>
                    <Select 
                      value={groupBy || 'none'} 
                      onValueChange={(value) => setGroupBy(value === 'none' ? null : value as 'location' | 'role')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grouping" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                        <SelectItem value="role">Role</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center">
                    <BarChart className="h-12 w-12 text-primary" />
                    <div className="ml-4">
                      <h3 className="font-medium">Experience Breakdown</h3>
                      <p className="text-sm text-muted-foreground">
                        View employee counts by experience range
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3">
                <ExperienceChart data={experienceData} groupBy={groupBy} />
              </div>
            </div>
          </TabsContent>

          {/* Simulation Tab */}
          <TabsContent value="simulate" className="space-y-6">
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
          </TabsContent>

          {/* Import Data Tab */}
          <TabsContent value="import" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
