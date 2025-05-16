
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
const validateAndTransformData = (data: any[]): Employee[] => {
  // Validate required fields
  const validEmployees: Employee[] = [];
  let id = 1000; // Start ID from 1000 to avoid conflicts with existing employee IDs
  
  // Debug info
  console.log("Raw imported data:", data);
  
  data.forEach((item, index) => {
    try {
      // Normalize keys to lowercase for case-insensitive matching
      const normalizedItem: Record<string, any> = {};
      Object.keys(item).forEach(key => {
        normalizedItem[key.toLowerCase().trim()] = item[key];
      });
      
      // Check for required fields with case-insensitive keys
      const name = normalizedItem.name;
      const role = normalizedItem.role;
      const location = normalizedItem.location;
      const experienceRaw = normalizedItem.experience;
      const compensationRaw = normalizedItem.compensation;
      const statusRaw = normalizedItem.status;
      
      if (!name || !role || !location) {
        console.warn(`Row ${index + 1}: Missing required fields:`, { name, role, location });
        return;
      }
      
      // Parse numbers and validate
      const experience = Number(experienceRaw);
      const compensation = Number(compensationRaw);
      
      if (isNaN(experience) || isNaN(compensation)) {
        console.warn(`Row ${index + 1}: Invalid number format:`, { experience: experienceRaw, compensation: compensationRaw });
        return;
      }
      
      // Normalize status - default to "Active" if not specified or invalid
      const status = statusRaw?.toString().toLowerCase() === 'inactive' ? 'Inactive' : 'Active';
      
      // Create employee object
      validEmployees.push({
        id: id++,
        name,
        role,
        location,
        experience,
        compensation,
        status: status as 'Active' | 'Inactive'
      });
    } catch (error) {
      console.error(`Error processing row ${index + 1}:`, error);
    }
  });
  
  console.log("Validated employees:", validEmployees);
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
          console.log("CSV Parse results:", results);
          if (results.errors && results.errors.length > 0) {
            console.warn("CSV parsing errors:", results.errors);
          }
          
          const employees = validateAndTransformData(results.data as any[]);
          resolve(employees);
        } catch (error) {
          console.error("Error processing CSV:", error);
          reject(error);
        }
      },
      error: (error) => {
        console.error("Papa parse error:", error);
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
        
        // Convert Excel sheet to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
        console.log("Excel raw data:", jsonData);
        
        // If first row is headers, process with headers
        if (jsonData.length > 0) {
          // Skip header row if present and convert to expected format
          const headers = jsonData[0];
          const dataRows = jsonData.slice(1);
          
          // Map rows to objects with column headers
          const formattedData = dataRows.map(row => {
            const item: Record<string, any> = {};
            Object.keys(row).forEach(cell => {
              const headerName = headers[cell]?.toString() || cell;
              item[headerName.toString().toLowerCase()] = row[cell];
            });
            return item;
          });
          
          console.log("Excel formatted data:", formattedData);
          const employees = validateAndTransformData(formattedData);
          resolve(employees);
        } else {
          console.warn("No data in Excel file");
          resolve([]);
        }
      } catch (error) {
        console.error("Error processing Excel file:", error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
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
    console.log(`Processing file with extension: ${fileExtension}`);
    
    if (fileExtension === 'csv') {
      return await parseCSV(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      return await parseExcel(file);
    } else {
      throw new Error('Unsupported file format. Please upload a CSV or Excel file.');
    }
  } catch (error) {
    console.error("Error in processFile:", error);
    toast({
      title: "Error processing file",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    throw error; // Re-throw to handle in the component
  }
};
