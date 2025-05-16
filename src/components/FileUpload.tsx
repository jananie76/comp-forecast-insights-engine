
import React, { useState } from 'react';
import { Employee } from '@/data/employeeData';
import { processFile } from '@/utils/fileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  onDataImport: (employees: Employee[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataImport }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setFileName(null);
    setError(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Processing file:", file.name);
      const importedEmployees = await processFile(file);
      
      if (importedEmployees && importedEmployees.length > 0) {
        onDataImport(importedEmployees);
        toast({
          title: "Data imported successfully",
          description: `Loaded ${importedEmployees.length} employees from ${file.name}`
        });
      } else {
        setError("No valid employee data found in file. Please check your file format.");
        toast({
          title: "No valid data found",
          description: "The file contains no valid employee records",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error importing file:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to import data";
      setError(errorMessage);
      toast({
        title: "Import failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-md p-4 bg-card space-y-4">
      <div className="flex items-center space-x-2">
        <FileSpreadsheet className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Import Employee Data</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="file-upload">Upload CSV or Excel file</Label>
        <div className="flex items-center gap-2">
          <Input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isLoading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isLoading ? 'Processing...' : 'Select File'}
          </Button>
          
          {fileName && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetState}
              disabled={isLoading}
            >
              Clear
            </Button>
          )}
        </div>
        
        {fileName && (
          <p className="text-sm text-muted-foreground">{fileName}</p>
        )}
        
        {error && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="text-xs text-muted-foreground mt-2">
          <p className="font-medium">Required columns:</p>
          <ul className="list-disc pl-5 space-y-0.5 mt-1">
            <li>name: Employee full name</li>
            <li>role: Job title/role</li>
            <li>location: Office location</li>
            <li>experience: Years of experience (number)</li>
            <li>compensation: Annual compensation (number)</li>
            <li>status: "Active" or "Inactive" (optional)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
