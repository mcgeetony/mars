
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { FeatureCollection } from 'geojson';
import { Rover, RoverId, MapLayer, FeatureLayerId, FeatureLayer } from './types';
import { ROVERS, MAP_LAYERS, FEATURE_LAYERS } from './constants';
import { getRoverPath, getFeatureLayerData } from './services/marsApiService';
import MarsMap from './components/MarsMap';
import RoverSelector from './components/RoverSelector';
import LoadingSpinner from './components/LoadingSpinner';
import MapLayerSelector from './components/MapLayerSelector';
import FeatureLayerToggle from './components/FeatureLayerToggle';

const App: React.FC = () => {
  const [selectedRover, setSelectedRover] = useState<Rover>(ROVERS.perseverance);
  const [selectedLayerId, setSelectedLayerId] = useState<string>(MAP_LAYERS[0].id);
  const [roverPath, setRoverPath] = useState<FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [featureLayersData, setFeatureLayersData] = useState<Record<string, FeatureCollection | null>>({});
  const [featureLayersVisibility, setFeatureLayersVisibility] = useState<Record<string, boolean>>({});
  const [featureLayersLoading, setFeatureLayersLoading] = useState<Record<string, boolean>>({});

  const selectedLayer = useMemo(
    () => MAP_LAYERS.find(layer => layer.id === selectedLayerId) || MAP_LAYERS[0],
    [selectedLayerId]
  );

  const fetchRoverData = useCallback(async (rover: Rover) => {
    setIsLoading(true);
    setError(null);
    setRoverPath(null);
    try {
      const pathData = await getRoverPath(rover.id);
      setRoverPath(pathData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoverData(selectedRover);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRover]);

  const handleRoverSelect = (roverId: RoverId) => {
    const rover = Object.values(ROVERS).find(r => r.id === roverId);
    if (rover) {
      setSelectedRover(rover);
    }
  };

  const handleLayerSelect = (layerId: string) => {
    setSelectedLayerId(layerId);
  };

  const handleFeatureLayerToggle = useCallback(async (layer: FeatureLayer) => {
    const layerId = layer.id;
    // Toggle visibility
    const isVisible = !featureLayersVisibility[layerId];
    setFeatureLayersVisibility(prev => ({ ...prev, [layerId]: isVisible }));

    // Fetch data if it's the first time and it's being turned on
    if (isVisible && !featureLayersData[layerId]) {
      setFeatureLayersLoading(prev => ({ ...prev, [layerId]: true }));
      try {
        const data = await getFeatureLayerData(layer.url);
        setFeatureLayersData(prev => ({ ...prev, [layerId]: data }));
      } catch (err) {
        console.error(`Failed to fetch ${layer.name} data:`, err);
        // Turn it back off on failure
        setFeatureLayersVisibility(prev => ({ ...prev, [layerId]: false }));
      } finally {
        setFeatureLayersLoading(prev => ({ ...prev, [layerId]: false }));
      }
    }
  }, [featureLayersData, featureLayersVisibility]);


  return (
    <div className="relative h-screen w-screen text-white font-sans overflow-hidden">
      <MarsMap
        roverPath={roverPath}
        key={`${selectedRover.id}-${selectedLayer.id}`}
        layerUrl={selectedLayer.url}
        layerAttribution={selectedLayer.attribution}
        featureLayersData={featureLayersData}
        featureLayersVisibility={featureLayersVisibility}
      />
      
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-10">
        <header className="flex flex-col gap-4 sm:flex-row justify-between items-center max-w-7xl mx-auto">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-wider">MARS ROVER TRACKER</h1>
            <p className="text-cyan-300 text-sm">Visualizing paths on the Red Planet</p>
          </div>
          <div className="flex flex-col gap-4 items-center sm:items-end">
            <div className="flex flex-col sm:flex-row gap-4">
              <RoverSelector selectedRoverId={selectedRover.id} onSelect={handleRoverSelect} />
              <MapLayerSelector selectedLayerId={selectedLayer.id} onSelect={handleLayerSelect} />
            </div>
            <FeatureLayerToggle
              visibility={featureLayersVisibility}
              loading={featureLayersLoading}
              onToggle={handleFeatureLayerToggle}
            />
          </div>
        </header>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/50 flex flex-col justify-center items-center z-20 backdrop-blur-sm">
          <LoadingSpinner />
          <p className="mt-4 text-lg">Fetching data for {selectedRover.name}...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-red-900/80 flex justify-center items-center z-20 text-center p-4">
          <div>
            <h2 className="text-2xl font-bold">Error</h2>
            <p className="mt-2">{error}</p>
            <button
              onClick={() => fetchRoverData(selectedRover)}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <footer className="absolute bottom-0 right-0 p-2 text-xs text-gray-400 z-10 bg-black/50 rounded-tl-lg">
        Map Data: {selectedLayer.attribution} | Click map for coordinates.
      </footer>
    </div>
  );
};

export default App;
