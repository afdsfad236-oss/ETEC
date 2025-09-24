// Implemented the ProgressBar component to show exam progress.
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  answered: boolean[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, answered }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl my-4">
      <p className="text-sm text-gray-400 mb-2">Questão {current + 1} de {total}</p>
      <div className="flex w-full gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i === current ? 'bg-violet-500' : answered[i] ? 'bg-green-500' : 'bg-gray-700'
            } transition-colors duration-300`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;