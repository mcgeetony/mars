
import React from 'react';
import { RoverId } from '../types';
import { ROVERS } from '../constants';

interface RoverSelectorProps {
  selectedRoverId: RoverId;
  onSelect: (roverId: RoverId) => void;
}

const RoverSelector: React.FC<RoverSelectorProps> = ({ selectedRoverId, onSelect }) => {
  return (
    <div className="flex space-x-2 bg-gray-800/50 p-1 rounded-lg backdrop-blur-sm">
      {Object.values(ROVERS).map((rover) => (
        <button
          key={rover.id}
          onClick={() => onSelect(rover.id)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 ${
            selectedRoverId === rover.id
              ? 'bg-cyan-500 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-700/50'
          }`}
        >
          {rover.name}
        </button>
      ))}
    </div>
  );
};

export default RoverSelector;
