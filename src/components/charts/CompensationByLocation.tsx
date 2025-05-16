
import React from 'react';
import CompensationChart from '@/components/CompensationChart';

interface CompensationByLocationProps {
  locationCompensationData: { location: string; average: number }[];
}

const CompensationByLocation: React.FC<CompensationByLocationProps> = ({ 
  locationCompensationData 
}) => {
  return (
    <div className="lg:col-span-2">
      <CompensationChart data={locationCompensationData} />
    </div>
  );
};

export default CompensationByLocation;
