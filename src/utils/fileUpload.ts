
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Employee } from '@/data/employeeData';
import { toast } from '@/hooks/use-toast';

export interface EmployeeImport {
  name: string;
  role: string;
  location: string;
  experience: string | number;
  compensation: string | number;
  status: string;
}

/**
 * Validate and transform imported data to Employee format
 */
const validateAndTransformData = (data: EmployeeImport[]): Employee[] => {
  // Validate required fields
  const validEmployees: Employee[] = [];
  let id = 1000; // Start ID from 1000 to avoid conflicts with existing employee IDs
  
  data.forEach((item, index) => {
    try {
      if (!item.name || !item.role || !item.location) {
        console.warn(`Row ${index + 1}: Missing required fields (name, role, or location)`);
        return;
      }
      
      // Parse numbers and validate
      const experience = Number(item.experience);
      const compensation = Number(item.compensation);
      
      if (isNaN(experience) || isNaN(compensation)) {
        console.warn(`Row ${index + 1}: Invalid number format for experience or compensation`);
        return;
      }
      
      // Normalize status
      const status = item.status === 'Active' ? 'Active' : 'Inactive';
      
      // Create employee object
      validEmployees.push({
        id: id++,
        name: item.name,
        role: item.role,
        location: item.location,
        experience,
        compensation,
        status: status as 'Active' | 'Inactive'
      });
    } catch (error) {
      console.error(`Error processing row ${index + 1}:`, error);
    }
  });
  
  return validEmployees;
};

/**
 * Parse CSV file and return employee data
 */
export const parseCSV = (file: File): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const employees = validateAndTransformData(results.data as EmployeeImport[]);
          resolve(employees);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Parse Excel file and return employee data
 */
export const parseExcel = (file: File): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as EmployeeImport[];
        
        const employees = validateAndTransformData(jsonData);
        resolve(employees);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
};

/**
 * Process uploaded file based on file type
 */
export const processFile = async (file: File): Promise<Employee[]> => {
  try {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv') {
      return await parseCSV(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      return await parseExcel(file);
    } else {
      throw new Error('Unsupported file format. Please upload a CSV or Excel file.');
    }
  } catch (error) {
    toast({
      title: "Error processing file",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    return [];
  }
};
