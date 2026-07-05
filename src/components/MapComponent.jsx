import { useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl, useMap, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';

const satelliteStyle = {
  version: 8,
  sources: {
    esri: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, attribution: '&copy; Esri' },
    labels: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '&copy; OpenStreetMap' },
  },
  layers: [
    { id: 'esri', type: 'raster', source: 'esri' },
    { id: 'labels', type: 'raster', source: 'labels', paint: { 'raster-opacity': 0.3 } },
  ],
};

const streetStyle = {
  version: 8,
  sources: {
    osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '&copy; OpenStreetMap' },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

const markerHtml = (color) => `<svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="#fff"/></svg>`;

function FitBounds({ markers, mapRef }) {
  useEffect(() => {
    const map = mapRef?.getMap();
    if (!map || !markers?.length) return;
    const bounds = markers.reduce((b, m) => b.extend([m.lng, m.lat]), new maplibregl.LngLatBounds(markers[0].lng, markers[0].lat));
    map.fitBounds(bounds, { padding: 50 });
  }, [markers, mapRef]);
  return null;
}

function FitBoundsWrapper({ markers }) {
  const { current: mapRef } = useMap();
  return <FitBounds markers={markers} mapRef={mapRef} />;
}

function circleToGeoJSON(center, radiusKm) {
  const [lat, lng] = center;
  const points = 64;
  const coords = [];
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dy = radiusKm / 111.32;
    const dx = radiusKm / (111.32 * Math.cos(lat * Math.PI / 180));
    coords.push([lng + dx * Math.sin(angle), lat + dy * Math.cos(angle)]);
  }
  return { type: 'Polygon', coordinates: [coords] };
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
  const [satellite, setSatellite] = useState(true);
  const [selected, setSelected] = useState(null);

  const allMarkers = [];
  if (userLocation) allMarkers.push({ lat: userLocation[0], lng: userLocation[1] });
  if (driverLocation) allMarkers.push({ lat: driverLocation[0], lng: driverLocation[1] });
  suppliers.forEach(s => {
    const lat = s.profile?.lat || s.lat;
    const lng = s.profile?.lng || s.lng;
    if (lat && lng) allMarkers.push({ lat, lng });
  });
  deliveries.forEach(d => {
    const pl = d.pickup_lat || d.supplier_lat; const pn = d.pickup_lng || d.supplier_lng;
    const dl = d.dropoff_lat || d.delivery_lat; const dn = d.dropoff_lng || d.delivery_lng;
    if (pl && pn) allMarkers.push({ lat: pl, lng: pn });
    if (dl && dn) allMarkers.push({ lat: dl, lng: dn });
  });

  const showFitBounds = allMarkers.length > 0;
  const routeGeoJSON = routePoints.length > 1 ? {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: routePoints.map(p => [p[1], p[0]]) },
  } : null;

  const radiusGeoJSON = userLocation && radiusKm ? circleToGeoJSON(userLocation, radiusKm) : null;

  return (
    <div style={{ height, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
      <button onClick={() => setSatellite(v => !v)} style={{
        position: 'absolute', top: 10, right: 10, zIndex: 1000,
        padding: '6px 12px', borderRadius: 8, border: '1px solid #ccc',
        background: 'rgba(255,255,255,0.95)', cursor: 'pointer',
        fontSize: 12, fontWeight: 600, boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span>{satellite ? '🗺️' : '🛰️'}</span>
        {satellite ? 'Street' : 'Satellite'}
      </button>
      <Map
        initialViewState={{ latitude: center[0], longitude: center[1], zoom }}
        mapStyle={satellite ? satelliteStyle : streetStyle}
        style={{ width: '100%', height: '100%' }}
        scrollZoom={true}
        attributionControl={false}
        onClick={() => setSelected(null)}
      >
        <NavigationControl position="bottom-right" />
        {showFitBounds && <FitBoundsWrapper markers={allMarkers} />}

        {radiusGeoJSON && (
          <Source id="radius" type="geojson" data={radiusGeoJSON}>
            <Layer id="radius-fill" type="fill" paint={{ 'fill-color': '#0f5238', 'fill-opacity': 0.08 }} />
            <Layer id="radius-outline" type="line" paint={{ 'line-color': '#0f5238', 'line-opacity': 0.3, 'line-width': 2 }} />
          </Source>
        )}

        {routeGeoJSON && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer id="route-line" type="line" paint={{ 'line-color': '#0f5238', 'line-width': 4, 'line-opacity': 0.7 }} />
          </Source>
        )}

        {userLocation && (
          <Marker longitude={userLocation[1]} latitude={userLocation[0]} anchor="bottom" onClick={() => setSelected('user')}>
            <div style={{ width: 24, height: 36 }} dangerouslySetInnerHTML={{ __html: markerHtml('#3b82f6', '') }} />
          </Marker>
        )}
        {selected === 'user' && userLocation && (
          <Popup longitude={userLocation[1]} latitude={userLocation[0]} anchor="top" onClose={() => setSelected(null)} closeButton={true}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>You are here</div>
          </Popup>
        )}

        {driverLocation && (
          <Marker longitude={driverLocation[1]} latitude={driverLocation[0]} anchor="bottom" onClick={() => setSelected('driver')}>
            <div style={{ width: 24, height: 36 }} dangerouslySetInnerHTML={{ __html: markerHtml('#f97316', '') }} />
          </Marker>
        )}
        {selected === 'driver' && driverLocation && (
          <Popup longitude={driverLocation[1]} latitude={driverLocation[0]} anchor="top" onClose={() => setSelected(null)}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Driver is here</div>
          </Popup>
        )}

        {suppliers.map(s => {
          const lat = s.profile?.lat || s.lat;
          const lng = s.profile?.lng || s.lng;
          if (!lat || !lng) return null;
          return (
            <div key={`s-${s.id}`}>
              <Marker longitude={lng} latitude={lat} anchor="bottom" onClick={() => setSelected(`s-${s.id}`)}>
                <div style={{ width: 24, height: 36 }} dangerouslySetInnerHTML={{ __html: markerHtml('#16a34a', '') }} />
              </Marker>
              {selected === `s-${s.id}` && (
                <Popup longitude={lng} latitude={lat} anchor="top" onClose={() => setSelected(null)}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.business_name}</div>
                  {s.rating ? <div style={{ fontSize: 12, color: '#666' }}>⭐ {s.rating} {s.product_count ? `• ${s.product_count} products` : ''}</div> : null}
                </Popup>
              )}
            </div>
          );
        })}

        {deliveries.map(d => {
          const pl = d.pickup_lat || d.supplier_lat; const pn = d.pickup_lng || d.supplier_lng;
          const dl = d.dropoff_lat || d.delivery_lat; const dn = d.dropoff_lng || d.delivery_lng;
          return (
            <div key={`d-${d.id}`}>
              {pl && pn && (
                <Marker longitude={pn} latitude={pl} anchor="bottom" onClick={() => setSelected(`dp-${d.id}`)}>
                  <div style={{ width: 24, height: 36 }} dangerouslySetInnerHTML={{ __html: markerHtml('#dc2626', '') }} />
                </Marker>
              )}
              {selected === `dp-${d.id}` && pl && pn && (
                <Popup longitude={pn} latitude={pl} anchor="top" onClose={() => setSelected(null)}>
                  <div style={{ fontSize: 13 }}>Pickup: {d.supplier_name || 'Supplier'}</div>
                </Popup>
              )}
              {dl && dn && (
                <Marker longitude={dn} latitude={dl} anchor="bottom" onClick={() => setSelected(`dd-${d.id}`)}>
                  <div style={{ width: 24, height: 36 }} dangerouslySetInnerHTML={{ __html: markerHtml('#3b82f6', '') }} />
                </Marker>
              )}
              {selected === `dd-${d.id}` && dl && dn && (
                <Popup longitude={dn} latitude={dl} anchor="top" onClose={() => setSelected(null)}>
                  <div style={{ fontSize: 13 }}>Dropoff: {d.customer_name || 'Customer'}</div>
                </Popup>
              )}
            </div>
          );
        })}
      </Map>
    </div>
  );
}
