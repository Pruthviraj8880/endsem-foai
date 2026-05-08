import { useEffect } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';

function MapAutoCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    // flyTo creates a smoother visual movement when the ISS position changes.
    map.flyTo([position.lat, position.lng], map.getZoom(), {
      animate: true,
      duration: 1.2
    });
  }, [map, position]);

  return null;
}

function ISSMap({ position, positions }) {
  const path = positions.map((item) => [item.lat, item.lng]);

  return (
    <section className="panel map-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Interactive map</p>
          <h2>ISS Orbit Path</h2>
        </div>
        <span className="mini-badge">{positions.length} points</span>
      </div>

      <div className="map-wrapper">
        <MapContainer center={[position.lat, position.lng]} zoom={3} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polyline positions={path} pathOptions={{ color: '#f4a261', weight: 4, opacity: 0.85 }} />

          <CircleMarker
            center={[position.lat, position.lng]}
            radius={12}
            pathOptions={{
              color: '#ffffff',
              fillColor: '#f97316',
              fillOpacity: 1,
              weight: 3
            }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              ISS live position
            </Tooltip>
            <Popup>
              <strong>International Space Station</strong>
              <br />
              Latitude: {position.lat.toFixed(4)}
              <br />
              Longitude: {position.lng.toFixed(4)}
              <br />
              Speed: {Math.round(position.speed).toLocaleString()} km/h
              <br />
              Time: {new Date(position.timestamp).toLocaleTimeString()}
            </Popup>
          </CircleMarker>

          <MapAutoCenter position={position} />
        </MapContainer>
      </div>
    </section>
  );
}

export default ISSMap;
