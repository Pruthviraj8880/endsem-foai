export default function ISSCard({ issData, positions }) {

  if (!issData) return <p>Loading ISS...</p>;

  return (
    <div className="bg-white p-4 rounded shadow mb-5">

      <h2 className="text-xl font-bold mb-3">
        ISS Live Data
      </h2>

      <p>Latitude: {issData.latitude}</p>

      <p>Longitude: {issData.longitude}</p>

      <p>Speed: {issData.speed} km/h</p>

      <p>Tracked Positions: {positions.length}</p>

    </div>
  );
}