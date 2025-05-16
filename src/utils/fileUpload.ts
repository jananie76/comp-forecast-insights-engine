
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
 * Find a matching key in the imported data based on expected keys
 */
const findMatchingKey = (obj: any, keyToFind: string): string | null => {
  const normalizedKeyToFind = keyToFind.toLowerCase().trim();
  
  // Map of possible alternative names for each field
  const keyMappings: Record<string, string[]> = {
    'name': ['name', 'employee name', 'full name', 'employee'],
    'role': ['role', 'job title', 'position', 'designation', 'title'],
    'location': ['location', 'office', 'city', 'place', 'work location'],
    'experience': ['experience', 'years of experience', 'years of experien', 'exp', 'years', 'tenure'],
    'compensation': ['compensation', 'salary', 'pay', 'income', 'current comp', 'current comp (in)', 'comp'],
    'status': ['status', 'active?', 'active', 'is active'],
    'lastWorkingDay': ['last working day', 'end date', 'termination date', 'exit date']
  };
  
  // Check if there's a direct key match
  const keys = Object.keys(obj);
  for (const key of keys) {
    if (key.toLowerCase().trim() === normalizedKeyToFind) {
      return key;
    }
  }
  
  // Check for alternative key names
  const alternatives = keyMappings[normalizedKeyToFind] || [];
  for (const alt of alternatives) {
    for (const key of keys) {
      if (key.toLowerCase().trim() === alt) {
        return key;
      }
    }
  }
  
  return null;
};

/**
 * Parse experience value which might be a range (e.g., "1-2")
 */
const parseExperienceValue = (value: any): number => {
  if (value === undefined || value === null) return 0;
  
  const stringValue = String(value).trim();
  
  // Check if it's a range format like "1-2"
  if (stringValue.includes('-')) {
    const [min, max] = stringValue.split('-').map(v => parseFloat(v.trim()));
    // Take the average of the range
    if (!isNaN(min) && !isNaN(max)) {
      return (min + max) / 2;
    }
  }
  
  // Try to parse as a number
  const numValue = parseFloat(stringValue);
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Parse compensation value which might include commas and currency symbols
 */
const parseCompensationValue = (value: any): number => {
  if (value === undefined || value === null) return 0;
  
  // Convert to string and remove non-numeric characters except decimals
  const stringValue = String(value)
    .replace(/[^\d.]/g, '')  // Remove anything that's not a digit or decimal point
    .trim();
    
  const numValue = parseFloat(stringValue);
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Parse status value (e.g., "Y"/"N", "Active"/"Inactive")
 */
const parseStatusValue = (value: any): 'Active' | 'Inactive' => {
  if (value === undefined || value === null) return 'Active';
  
  const stringValue = String(value).toLowerCase().trim();
  
  // Check for various inactive indicators
  if (
    stringValue === 'n' || 
    stringValue === 'no' || 
    stringValue === 'false' || 
    stringValue === '0' || 
    stringValue === 'inactive' ||
    stringValue === 'terminated'
  ) {
    return 'Inactive';
  }
  
  // Default to active
  return 'Active';
};

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
      // Find matching keys for required fields
      const nameKey = findMatchingKey(item, 'name');
      const roleKey = findMatchingKey(item, 'role');
      const locationKey = findMatchingKey(item, 'location');
      const experienceKey = findMatchingKey(item, 'experience');
      const compensationKey = findMatchingKey(item, 'compensation');
      const statusKey = findMatchingKey(item, 'status');
      
      // Extract values using the found keys
      const name = nameKey ? item[nameKey] : null;
      const role = roleKey ? item[roleKey] : null;
      const location = locationKey ? item[locationKey] : null;
      
      if (!name || !role || !location) {
        console.warn(`Row ${index + 1}: Missing required fields:`, { 
          name: nameKey ? name : 'Not found',
          role: roleKey ? role : 'Not found',
          location: locationKey ? location : 'Not found' 
        });
        return;
      }
      
      // Parse experience
      const experienceRaw = experienceKey ? item[experienceKey] : null;
      const experience = parseExperienceValue(experienceRaw);
      
      // Parse compensation
      const compensationRaw = compensationKey ? item[compensationKey] : null;
      const compensation = parseCompensationValue(compensationRaw);
      
      // Parse status
      const statusRaw = statusKey ? item[statusKey] : null;
      const status = parseStatusValue(statusRaw);
      
      // Create employee object
      validEmployees.push({
        id: id++,
        name,
        role,
        location,
        experience,
        compensation,
        status
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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: "A", raw: false });
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
              item[headerName.toString()] = row[cell];
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
