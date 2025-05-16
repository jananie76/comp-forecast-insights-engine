
import React from 'react';
import { locations } from '@/data/employeeData';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface CompensationChartProps {
  data: { location: string; average: number }[];
}

const CompensationChart = ({ data }: CompensationChartProps) => {
  const chartConfig = {
    bar1: { theme: { light: "#8884d8", dark: "#8884d8" } },
  };

  return (
    <div className="border rounded-md p-4 bg-card">
      <h3 className="text-lg font-medium mb-4">Average Compensation by Location</h3>
      <div className="h-64">
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Average Compensation']}
            />
            <Bar dataKey="average" name="Average Compensation" fill="var(--color-bar1)" />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default CompensationChart;
