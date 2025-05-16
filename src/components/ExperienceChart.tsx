
import React from 'react';
import { experienceRanges } from '@/data/employeeData';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ExperienceChartProps {
  data: Record<string, Record<string, number>>;
  groupBy: 'location' | 'role' | null;
}

const ExperienceChart = ({ data, groupBy }: ExperienceChartProps) => {
  const chartConfig = {
    bar1: { theme: { light: "#8884d8", dark: "#8884d8" } },
    bar2: { theme: { light: "#82ca9d", dark: "#82ca9d" } },
    bar3: { theme: { light: "#ffc658", dark: "#ffc658" } },
    bar4: { theme: { light: "#ff8042", dark: "#ff8042" } },
  };
  
  // Transform the data for the chart
  const transformedData = Object.keys(data).map(range => ({
    range,
    ...data[range],
  }));

  // Get the keys for the bars (either locations, roles, or just 'count')
  const barKeys = Object.keys(transformedData[0] || {}).filter(key => key !== 'range');

  const getBarColor = (index: number) => {
    const colors = ["var(--color-bar1)", "var(--color-bar2)", "var(--color-bar3)", "var(--color-bar4)"];
    return colors[index % colors.length];
  };

  return (
    <div className="border rounded-md p-4 bg-card">
      <h3 className="text-lg font-medium mb-4">
        Employee Count by Experience Range
        {groupBy && ` (Grouped by ${groupBy})`}
      </h3>
      <div className="h-64">
        <ChartContainer config={chartConfig}>
          <BarChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            {barKeys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                name={key} 
                fill={getBarColor(index)}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default ExperienceChart;
