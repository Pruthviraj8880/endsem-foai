import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function ISSMap({ pos, path }) {
  return (
    <MapContainer center={[pos.lat, pos.lon]} zoom={3} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[pos.lat, pos.lon]}>
        <Tooltip permanent>ISS Current Position</Tooltip>
      </Marker>
      <Polyline positions={path} color="red" />
    </MapContainer>
  );
}