
import React, { useState } from 'react';
import { Employee } from '@/data/employeeData';
import { processFile } from '@/utils/fileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileSpreadsheet, AlertCircle, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onDataImport: (employees: Employee[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataImport }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const resetState = () => {
    setFileName(null);
    setError(null);
    setProgress(0);
    setSuccess(false);
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
    setSuccess(false);
    setProgress(10); // Start progress animation
    
    try {
      console.log("Processing file:", file.name);
      setProgress(30); // Update progress
      
      const importedEmployees = await processFile(file);
      setProgress(80); // Update progress
      
      if (importedEmployees && importedEmployees.length > 0) {
        onDataImport(importedEmployees);
        setProgress(100);
        setSuccess(true);
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
        
        {isLoading && progress > 0 && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">Processing file...</p>
          </div>
        )}
        
        {success && (
          <Alert className="bg-green-50 border-green-200 mt-3">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">File imported successfully!</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="text-xs text-muted-foreground mt-2 border-t pt-2">
          <p className="font-medium">Data Format Information:</p>
          <ul className="list-disc pl-5 space-y-0.5 mt-1">
            <li>Your file should have headers in the first row</li>
            <li>Required columns: Name, Role, Location</li>
            <li>Experience can be numeric or ranges (e.g., "1-2")</li>
            <li>"Active?" column can use Y/N or any variant</li>
            <li>Compensation values can include formatting (e.g., commas)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
