
import { Employee } from '@/data/employeeData';

export const exportToCSV = (employees: Employee[], incrementedEmployees: Employee[] | null) => {
  // Prepare data for CSV
  const headers = [
    'Name', 
    'Role', 
    'Location', 
    'Experience', 
    'Compensation',
    ...(incrementedEmployees ? ['New Compensation'] : []),
    'Status'
  ];

  const rows = employees.map(employee => {
    const incrementedEmployee = incrementedEmployees?.find(e => e.id === employee.id);
    
    return [
      employee.name,
      employee.role,
      employee.location,
      employee.experience,
      employee.compensation,
      ...(incrementedEmployees ? [incrementedEmployee?.compensation || employee.compensation] : []),
      employee.status
    ];
  });

  // Format CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'employee_compensation_data.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
