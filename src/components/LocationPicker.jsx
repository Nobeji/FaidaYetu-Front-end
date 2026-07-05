import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

function DraggableMarker({ lat, lng, onMove }) {
  const [pos, setPos] = useState([lat, lng]);
  useMapEvents({
    click(e) {
      setPos([e.latlng.lat, e.latlng.lng]);
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });
  return (
    <Marker
      position={pos}
      icon={markerIcon}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const p = e.target.getLatLng();
          setPos([p.lat, p.lng]);
          onMove(p.lat, p.lng);
        },
      }}
    />
  );
}

export default function LocationPicker({ lat = -6.7924, lng = 39.2083, onChange, height = 250 }) {
  return (
    <div style={{ height, borderRadius: 10, overflow: 'hidden', border: '1px solid #ddd' }}>
      <MapContainer center={[lat, lng]} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker lat={lat} lng={lng} onMove={onChange} />
      </MapContainer>
    </div>
  );
}
