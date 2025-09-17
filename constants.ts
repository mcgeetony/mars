
import { Rover, RoverId, MapLayer, FeatureLayer, FeatureLayerId } from './types';

export const ROVERS: Record<RoverId, Rover> = {
  [RoverId.Perseverance]: {
    id: RoverId.Perseverance,
    name: 'Perseverance',
    pathUrl: 'https://mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_traverse.json',
  },
  [RoverId.Curiosity]: {
    id: RoverId.Curiosity,
    name: 'Curiosity',
    pathUrl: 'https://mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_traverse_path.json',
  },
};

export const MAP_LAYERS: MapLayer[] = [
  {
    id: 'ctx',
    name: 'CTX Mosaic',
    url: 'https://trek.nasa.gov/tiles/Mars/EQ/CTX_S_Viking_MDIM21_Color_Global_463m/1.0.0//default/default028mm/{z}/{y}/{x}.jpg',
    attribution: 'NASA / JPL-Caltech / ASU / MSSS',
  },
  {
    id: 'viking',
    name: 'Viking Color',
    url: 'https://trek.nasa.gov/tiles/Mars/EQ/Viking_Color_Global_Mosaic_1km/1.0.0//default/default028mm/{z}/{y}/{x}.jpg',
    attribution: 'NASA / JPL / USGS',
  },
  {
    id: 'mola',
    name: 'MOLA Elevation',
    url: 'https://trek.nasa.gov/tiles/Mars/EQ/MOLA_Color_Global_463m/1.0.0//default/default028mm/{z}/{y}/{x}.jpg',
    attribution: 'NASA / JPL-Caltech / GSFC',
  },
];

export const FEATURE_LAYERS: FeatureLayer[] = [
  {
    id: FeatureLayerId.LandingSites,
    name: 'Landing Sites',
    url: 'https://trek.nasa.gov/arcgis/rest/services/Mars/Mars_LandingSites/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson',
  },
  {
    id: FeatureLayerId.NamedFeatures,
    name: 'Named Features',
    url: 'https://trek.nasa.gov/arcgis/rest/services/Mars/Mars_NamedFeatures/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson',
  },
  {
    id: FeatureLayerId.Craters,
    name: 'Craters',
    url: 'https://trek.nasa.gov/arcgis/rest/services/Mars/Mars_Craters/FeatureServer/0/query?where=DIAM_KM+%3E+50&outFields=*&outSR=4326&f=geojson',
  },
];
