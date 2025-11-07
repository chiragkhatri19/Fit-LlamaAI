
import React from 'react';

interface Props {
  protein: number;
  carbs: number;
  fat: number;
}

const MacroChart: React.FC<Props> = ({ protein, carbs, fat }) => {
    const totalMacros = protein + carbs + fat;

    if (totalMacros === 0) {
        return (
            <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    className="stroke-current text-gray-200 dark:text-gray-700"
                    strokeWidth="4"
                    fill="transparent"
                />
            </svg>
        );
    }

    const proteinPercentage = (protein / totalMacros) * 100;
    const carbsPercentage = (carbs / totalMacros) * 100;

    const proteinOffset = 0;
    const carbsOffset = proteinPercentage;

  return (
    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
      {/* Background Circle */}
      <circle
        cx="18"
        cy="18"
        r="15.9155"
        className="stroke-current text-gray-200 dark:text-gray-700"
        strokeWidth="4"
        fill="transparent"
      />
      {/* Fat */}
      <circle
        cx="18"
        cy="18"
        r="15.9155"
        className="stroke-current text-lime-500"
        strokeWidth="4"
        fill="transparent"
        strokeDasharray="100 100"
      />
       {/* Carbs */}
      <circle
        cx="18"
        cy="18"
        r="15.9155"
        className="stroke-current text-amber-500"
        strokeWidth="4"
        fill="transparent"
        strokeDasharray={`${carbsPercentage} ${100 - carbsPercentage}`}
        strokeDashoffset={-proteinOffset}
      />
      {/* Protein */}
      <circle
        cx="18"
        cy="18"
        r="15.9155"
        className="stroke-current text-sky-500"
        strokeWidth="4"
        fill="transparent"
        strokeDasharray={`${proteinPercentage} ${100 - proteinPercentage}`}
        strokeDashoffset="0"
      />
    </svg>
  );
};

export default MacroChart;

