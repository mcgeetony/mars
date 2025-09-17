import React, { useMemo, useState, useEffect } from 'react';
import type { FeatureCollection, LineString, Feature } from 'geojson';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L, { Layer } from 'leaflet';
// Fix: `FeatureLayerId` is an enum, which is used as a value. It should not be imported as a type.
import { FeatureLayerId, type LandingSiteProperties, type NamedFeatureProperties, type CraterProperties } from '../types';

interface MarsMapProps {
  roverPath: FeatureCollection | null;
  layerUrl: string;
  layerAttribution: string;
  featureLayersData: Record<string, FeatureCollection | null>;
  featureLayersVisibility: Record<string, boolean>;
}

const roverIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-navigation-2"><polygon points="12 2 19 21 12 17 5 21 12 2"></polygon></svg>`
  )}`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
  className: 'rover-icon'
});

const clickedLocationIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>`
  )}`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const landingSiteIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`
  )}`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const namedFeatureIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#facc15" stroke="#ca8a04" stroke-width="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
  )}`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const pathStyle = {
  color: '#06b6d4', // cyan-500
  weight: 3,
  opacity: 0.8,
};

const pointToLayerCrater = (feature: Feature, latlng: L.LatLng) => {
  const props = feature.properties as CraterProperties;
  const radius = Math.max(4, Math.min(20, props.DIAM_KM / 25));
  return L.circleMarker(latlng, {
    radius: radius,
    color: '#f97316', // orange-500
    fillColor: '#fb923c', // orange-400
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5,
  });
};

const onEachLandingSite = (feature: Feature, layer: Layer) => {
  const props = feature.properties as LandingSiteProperties;
  if (props && props.Name) {
    layer.bindPopup(`<div class="text-gray-800"><strong class="font-bold">${props.Name}</strong><br/>Mission: ${props.Mission}</div>`);
  }
};

const onEachNamedFeature = (feature: Feature, layer: Layer) => {
  const props = feature.properties as NamedFeatureProperties;
  if (props && props.NAME) {
    layer.bindPopup(`<div class="text-gray-800"><strong class="font-bold">${props.NAME}</strong><br/>Type: ${props.TYPE}</div>`);
  }
};

const onEachCrater = (feature: Feature, layer: Layer) => {
  const props = feature.properties as CraterProperties;
  if (props && props.NAME) {
    layer.bindPopup(`<div class="text-gray-800"><strong class="font-bold">${props.NAME}</strong><br/>Diameter: ${props.DIAM_KM.toFixed(1)} km</div>`);
  }
};

const PanToLocation: React.FC<{ position: L.LatLng | null }> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), {
        animate: true,
        duration: 1.5,
      });
    }
  }, [position, map]);
  return null;
};

const MarsMap: React.FC<MarsMapProps> = ({ roverPath, layerUrl, layerAttribution, featureLayersData, featureLayersVisibility }) => {
  const [clickedPosition, setClickedPosition] = useState<L.LatLng | null>(null);

  const currentPosition = useMemo<[number, number] | null>(() => {
    if (!roverPath || !roverPath.features || roverPath.features.length === 0) return null;
    const lineString = roverPath.features[0].geometry as LineString;
    if (!lineString || lineString.coordinates.length === 0) return null;
    const lastCoord = lineString.coordinates[lineString.coordinates.length - 1];
    return [lastCoord[1], lastCoord[0]];
  }, [roverPath]);
  
  const mapCenter: [number, number] = currentPosition || [18.44, 77.45];

  const MapEvents = () => {
    useMapEvents({ click(e) { setClickedPosition(e.latlng); } });
    return null;
  };

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <MapEvents />
        <PanToLocation position={clickedPosition} />
        <TileLayer attribution={layerAttribution} url={layerUrl} minZoom={2} maxZoom={18} noWrap={true} />
        
        {roverPath && <GeoJSON data={roverPath} style={pathStyle} />}
        {currentPosition && (
          <Marker position={currentPosition} icon={roverIcon}>
            {/* Fix: Use `className` instead of `class` in JSX */}
            <Popup><div className="text-gray-800"><h3 className="font-bold">Current Position</h3><p>Lat: {currentPosition[0].toFixed(4)}</p><p>Lon: {currentPosition[1].toFixed(4)}</p></div></Popup>
          </Marker>
        )}
        
        {clickedPosition && (
          <Marker position={clickedPosition} icon={clickedLocationIcon}>
            {/* Fix: Use `className` instead of `class` in JSX */}
            <Popup><div className="text-gray-800"><h3 className="font-bold">Clicked Location</h3><p>Lat: {clickedPosition.lat.toFixed(4)}</p><p>Lon: {clickedPosition.lng.toFixed(4)}</p></div></Popup>
          </Marker>
        )}

        {featureLayersVisibility[FeatureLayerId.LandingSites] && featureLayersData[FeatureLayerId.LandingSites] && (
          <GeoJSON 
            data={featureLayersData[FeatureLayerId.LandingSites]!} 
            pointToLayer={(feature, latlng) => L.marker(latlng, { icon: landingSiteIcon })}
            onEachFeature={onEachLandingSite}
          />
        )}
        
        {featureLayersVisibility[FeatureLayerId.NamedFeatures] && featureLayersData[FeatureLayerId.NamedFeatures] && (
          <GeoJSON 
            data={featureLayersData[FeatureLayerId.NamedFeatures]!} 
            pointToLayer={(feature, latlng) => L.marker(latlng, { icon: namedFeatureIcon })}
            onEachFeature={onEachNamedFeature}
          />
        )}

        {featureLayersVisibility[FeatureLayerId.Craters] && featureLayersData[FeatureLayerId.Craters] && (
          <GeoJSON 
            data={featureLayersData[FeatureLayerId.Craters]!} 
            pointToLayer={pointToLayerCrater}
            onEachFeature={onEachCrater}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MarsMap;