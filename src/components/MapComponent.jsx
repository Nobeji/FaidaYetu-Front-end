import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const supplierIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
}

export default function MapComponent({
  height = 360,
  center = [-6.7924, 39.2083],
  zoom = 12,
  userLocation,
  suppliers = [],
  deliveries = [],
  routePoints = [],
  radiusKm,
  driverLocation,
}) {
  const allMarkers = [];
  if (userLocation) allMarkers.push({ lat: userLocation[0], lng: userLocation[1] });
  if (driverLocation) allMarkers.push({ lat: driverLocation[0], lng: driverLocation[1] });
  suppliers.forEach(s => {
    const lat = s.profile?.lat || s.lat;
    const lng = s.profile?.lng || s.lng;
    if (lat && lng) allMarkers.push({ lat, lng });
  });
  deliveries.forEach(d => {
    const pl = d.pickup_lat || d.supplier_lat;
    const pn = d.pickup_lng || d.supplier_lng;
    const dl = d.dropoff_lat || d.delivery_lat;
    const dn = d.dropoff_lng || d.delivery_lng;
    if (pl && pn) allMarkers.push({ lat: pl, lng: pn });
    if (dl && dn) allMarkers.push({ lat: dl, lng: dn });
  });

  return (
    <div style={{ height, borderRadius: 16, overflow: 'hidden' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds markers={allMarkers} />

        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
            {radiusKm && (
              <Circle center={userLocation} radius={radiusKm * 1000} pathOptions={{ color: '#0f5238', fillOpacity: 0.1 }} />
            )}
          </>
        )}

        {driverLocation && (
          <Marker position={driverLocation} icon={driverIcon}>
            <Popup>Driver is here</Popup>
          </Marker>
        )}

        {suppliers.map(s => {
          const lat = s.profile?.lat || s.lat;
          const lng = s.profile?.lng || s.lng;
          if (!lat || !lng) return null;
          return (
            <Marker key={`s-${s.id}`} position={[lat, lng]} icon={supplierIcon}>
              <Popup>
                <strong>{s.business_name}</strong><br />
                {s.rating ? `⭐ ${s.rating} ` : ''}{s.product_count ? `• ${s.product_count} products` : ''}
              </Popup>
            </Marker>
          );
        })}

        {deliveries.map(d => {
          const pl = d.pickup_lat || d.supplier_lat;
          const pn = d.pickup_lng || d.supplier_lng;
          const dl = d.dropoff_lat || d.delivery_lat;
          const dn = d.dropoff_lng || d.delivery_lng;
          return (
            <React.Fragment key={`d-${d.id}`}>
              {pl && pn && (
                <Marker position={[pl, pn]} icon={deliveryIcon}>
                  <Popup>Pickup: {d.supplier_name || 'Supplier'}</Popup>
                </Marker>
              )}
              {dl && dn && (
                <Marker position={[dl, dn]} icon={userIcon}>
                  <Popup>Dropoff: {d.customer_name || 'Customer'}</Popup>
                </Marker>
              )}
            </React.Fragment>
          );
        })}

        {routePoints.length > 1 && (
          <Polyline positions={routePoints} pathOptions={{ color: '#0f5238', weight: 4, opacity: 0.7 }} />
        )}
      </MapContainer>
    </div>
  );
}
