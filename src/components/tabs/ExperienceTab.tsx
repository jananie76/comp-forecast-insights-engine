
import React from 'react';
import ExperienceBreakdown from '@/components/charts/ExperienceBreakdown';

interface ExperienceTabProps {
  experienceData: Record<string, Record<string, number>>;
  groupBy: 'location' | 'role' | null;
  setGroupBy: (value: 'location' | 'role' | null) => void;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({
  experienceData,
  groupBy,
  setGroupBy
}) => {
  return (
    <div className="space-y-6">
      <ExperienceBreakdown 
        experienceData={experienceData}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
      />
    </div>
  );
};

export default ExperienceTab;
