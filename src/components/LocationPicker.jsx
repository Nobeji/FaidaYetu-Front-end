import { useState, useRef } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const key = import.meta.env.VITE_TOMTOM_API_KEY;

const style = {
  version: 8,
  sources: {
    esri: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, attribution: '&copy; Esri' },
    labels: { type: 'raster', tiles: [`https://api.tomtom.com/map/1/tile/labels/main/{z}/{x}/{y}.png?tileSize=256&key=${key}`], tileSize: 256, attribution: '&copy; TomTom' },
  },
  layers: [
    { id: 'esri', type: 'raster', source: 'esri' },
    { id: 'labels', type: 'raster', source: 'labels', paint: { 'raster-opacity': 0.5 } },
  ],
};

export default function LocationPicker({ lat = -6.7924, lng = 39.2083, onChange, height = 250 }) {
  const markerRef = useRef(null);
  const [pos, setPos] = useState({ lat, lng });

  const handleDrag = (evt) => {
    const p = evt.target.getLngLat();
    setPos({ lat: p.lat, lng: p.lng });
    onChange(p.lat, p.lng);
  };

  const handleMapClick = (evt) => {
    const p = evt.lngLat;
    setPos({ lat: p.lat, lng: p.lng });
    onChange(p.lat, p.lng);
  };

  return (
    <div style={{ height, borderRadius: 10, overflow: 'hidden', border: '1px solid #ddd' }}>
      <Map
        initialViewState={{ latitude: pos.lat, longitude: pos.lng, zoom: 14 }}
        mapStyle={style}
        style={{ width: '100%', height: '100%' }}
        scrollZoom={true}
        attributionControl={false}
        onClick={handleMapClick}
      >
        <NavigationControl position="bottom-right" />
        <Marker
          ref={markerRef}
          longitude={pos.lng}
          latitude={pos.lat}
          anchor="bottom"
          draggable={true}
          onDragEnd={handleDrag}
        >
          <div style={{ width: 28, height: 42, cursor: 'grab' }}>
            <svg width="28" height="42" viewBox="0 0 28 42" fill="none">
              <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 28 14 28s14-17.5 14-28C28 6.3 21.7 0 14 0z" fill="#3b82f6" stroke="#fff" strokeWidth="2"/>
              <circle cx="14" cy="14" r="6" fill="#fff"/>
            </svg>
          </div>
        </Marker>
      </Map>
    </div>
  );
}
