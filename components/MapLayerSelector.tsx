
import React from 'react';
import { MAP_LAYERS } from '../constants';

interface MapLayerSelectorProps {
  selectedLayerId: string;
  onSelect: (layerId: string) => void;
}

const MapLayerSelector: React.FC<MapLayerSelectorProps> = ({ selectedLayerId, onSelect }) => {
  return (
    <div className="flex space-x-2 bg-gray-800/50 p-1 rounded-lg backdrop-blur-sm">
      {MAP_LAYERS.map((layer) => (
        <button
          key={layer.id}
          onClick={() => onSelect(layer.id)}
          className={`px-3 py-2 text-xs font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 ${
            selectedLayerId === layer.id
              ? 'bg-cyan-500 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-700/50'
          }`}
          title={layer.name}
        >
          {layer.name}
        </button>
      ))}
    </div>
  );
};

export default MapLayerSelector;
