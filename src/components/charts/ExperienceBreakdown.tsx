
import React from 'react';
import ExperienceChart from '@/components/ExperienceChart';
import { Label } from '@radix-ui/react-label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart } from 'lucide-react';

interface ExperienceBreakdownProps {
  experienceData: Record<string, Record<string, number>>;
  groupBy: 'location' | 'role' | null;
  setGroupBy: (value: 'location' | 'role' | null) => void;
}

const ExperienceBreakdown: React.FC<ExperienceBreakdownProps> = ({ 
  experienceData, 
  groupBy, 
  setGroupBy 
}) => {
  return (
    <div className="grid lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <div className="p-4 border rounded-md bg-card space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-by">Group By</Label>
            <Select 
              value={groupBy || 'none'} 
              onValueChange={(value) => setGroupBy(value === 'none' ? null : value as 'location' | 'role')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grouping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="role">Role</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center">
            <BarChart className="h-12 w-12 text-primary" />
            <div className="ml-4">
              <h3 className="font-medium">Experience Breakdown</h3>
              <p className="text-sm text-muted-foreground">
                View employee counts by experience range
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-3">
        <ExperienceChart data={experienceData} groupBy={groupBy} />
      </div>
    </div>
  );
};

export default ExperienceBreakdown;
