
import React from 'react';
import CompensationChart from '@/components/CompensationChart';

interface CompensationByLocationProps {
  locationCompensationData: { location: string; average: number }[];
}

const CompensationByLocation: React.FC<CompensationByLocationProps> = ({ 
  locationCompensationData 
}) => {
  // Ensure we have valid data to display
  const validData = locationCompensationData.filter(item => 
    item && typeof item.average === 'number' && !isNaN(item.average)
  );
  
  return (
    <div className="lg:col-span-2">
      {validData.length > 0 ? (
        <CompensationChart data={validData} />
      ) : (
        <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            No compensation data available for locations
          </p>
        </div>
      )}
    </div>
  );
};

export default CompensationByLocation;
