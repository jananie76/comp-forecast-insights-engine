
import React from 'react';
import { Employee } from '@/data/employeeData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmployeeTableProps {
  employees: Employee[];
  incrementedEmployees: Employee[] | null;
}

const EmployeeTable = ({ employees, incrementedEmployees }: EmployeeTableProps) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Experience (Years)</TableHead>
            <TableHead>Compensation ($)</TableHead>
            {incrementedEmployees && <TableHead>New Compensation ($)</TableHead>}
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={incrementedEmployees ? 7 : 6} className="text-center">
                No employees found
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.location}</TableCell>
                <TableCell>{employee.experience}</TableCell>
                <TableCell>{employee.compensation.toLocaleString()}</TableCell>
                {incrementedEmployees && (
                  <TableCell>
                    {incrementedEmployees.find(e => e.id === employee.id)?.compensation.toLocaleString()}
                  </TableCell>
                )}
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      employee.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {employee.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
