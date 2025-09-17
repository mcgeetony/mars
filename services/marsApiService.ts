
import type { FeatureCollection } from 'geojson';
import { ROVERS } from '../constants';
import { RoverId } from '../types';

export const getRoverPath = async (roverId: RoverId): Promise<FeatureCollection> => {
  const rover = ROVERS[roverId];
  if (!rover) {
    throw new Error(`Invalid rover ID: ${roverId}`);
  }

  const response = await fetch(rover.pathUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch path data for ${rover.name}. Status: ${response.status}`);
  }

  const data: FeatureCollection = await response.json();
  
  return data;
};

export const getFeatureLayerData = async (url: string): Promise<FeatureCollection> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch feature layer data. Status: ${response.status}`);
  }
  const data: FeatureCollection = await response.json();
  return data;
};
