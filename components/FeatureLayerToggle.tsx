
import React from 'react';
import { FEATURE_LAYERS } from '../constants';
import { FeatureLayer } from '../types';

interface FeatureLayerToggleProps {
  visibility: Record<string, boolean>;
  loading: Record<string, boolean>;
  onToggle: (layer: FeatureLayer) => void;
}

const MiniSpinner: React.FC = () => (
  <svg className="animate-spin h-4 w-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const FeatureLayerToggle: React.FC<FeatureLayerToggleProps> = ({ visibility, loading, onToggle }) => {
  return (
    <div className="flex items-center space-x-4 bg-gray-800/50 p-2 rounded-lg backdrop-blur-sm">
      {FEATURE_LAYERS.map((layer) => (
        <label key={layer.id} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-300 hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={!!visibility[layer.id]}
            onChange={() => onToggle(layer)}
            className="form-checkbox h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
          />
          <span>{layer.name}</span>
          {loading[layer.id] && <MiniSpinner />}
        </label>
      ))}
    </div>
  );
};

export default FeatureLayerToggle;
