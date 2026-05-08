import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet markers missing in new builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

export default function ISSMap({ pos, path }) {
  const center = (pos && pos.lat !== 0) ? [pos.lat, pos.lon] : [0, 0];
  
  return (
    <MapContainer 
      center={center} 
      zoom={3} 
      className="w-full h-96 rounded-xl border border-gray-100 shadow-inner"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {pos && pos.lat !== 0 && (
        <Marker position={[pos.lat, pos.lon]} />
      )}
      <Polyline positions={path} color="#e53e3e" weight={4} />
    </MapContainer>
  );
}