
export enum RoverId {
  Perseverance = 'perseverance',
  Curiosity = 'curiosity',
}

export interface Rover {
  id: RoverId;
  name: string;
  pathUrl: string;
}

export interface MapLayer {
  id: string;
  name: string;
  url: string;
  attribution: string;
}

export enum FeatureLayerId {
  LandingSites = 'landingsites',
  NamedFeatures = 'namedfeatures',
  Craters = 'craters',
}

export interface FeatureLayer {
  id: FeatureLayerId;
  name: string;
  url: string;
}

export interface LandingSiteProperties {
  Name: string;
  Mission: string;
  Landing_Site: string;
}

export interface NamedFeatureProperties {
  NAME: string;
  TYPE: string;
  APPROVAL_DATE: string;
}

export interface CraterProperties {
  NAME: string;
  DIAM_KM: number;
  DEPTH_KM: number;
}
