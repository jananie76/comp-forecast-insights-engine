
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToCSV } from '@/utils/csvExport';
import { toast } from '@/hooks/use-toast';
import { employees } from '@/data/employeeData';
import { useEmployeeData } from '@/hooks/useEmployeeData';

// Import tab components
import FilterDisplayTab from '@/components/tabs/FilterDisplayTab';
import ExperienceTab from '@/components/tabs/ExperienceTab';
import SimulationTab from '@/components/tabs/SimulationTab';
import ImportTab from '@/components/tabs/ImportTab';

const Index = () => {
  const {
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
  } = useEmployeeData();
  
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
          <TabsContent value="filter">
            <FilterDisplayTab
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              includeInactive={includeInactive}
              setIncludeInactive={setIncludeInactive}
              filteredEmployees={filteredEmployees}
              incrementedEmployees={incrementedEmployees}
              locationCompensationData={locationCompensationData}
              handleExportCSV={handleExportCSV}
            />
          </TabsContent>

          {/* Experience Analysis Tab */}
          <TabsContent value="experience">
            <ExperienceTab
              experienceData={experienceData}
              groupBy={groupBy}
              setGroupBy={setGroupBy}
            />
          </TabsContent>

          {/* Simulation Tab */}
          <TabsContent value="simulate">
            <SimulationTab
              filteredEmployees={filteredEmployees}
              incrementedEmployees={incrementedEmployees}
              handleApplyIncrement={handleApplyIncrement}
              handleExportCSV={handleExportCSV}
            />
          </TabsContent>

          {/* Import Data Tab */}
          <TabsContent value="import">
            <ImportTab
              handleDataImport={handleDataImport}
              employeeData={employeeData}
              employees={employees}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
