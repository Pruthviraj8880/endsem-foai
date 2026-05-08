function ISSInfoCards({ position, locationName, trackedCount }) {
  const cards = [
    { title: 'Latitude', value: position.lat.toFixed(4), note: 'North / South' },
    { title: 'Longitude', value: position.lng.toFixed(4), note: 'East / West' },
    { title: 'Speed', value: `${Math.round(position.speed).toLocaleString()} km/h`, note: 'Calculated with Haversine' },
    { title: 'Tracked Positions', value: trackedCount, note: 'Last 15 on map' }
  ];

  return (
    <section className="info-grid">
      {cards.map((card) => (
        <article className="info-card" key={card.title}>
          <p>{card.title}</p>
          <h3>{card.value}</h3>
          <span>{card.note}</span>
        </article>
      ))}

      <article className="info-card location-card">
        <p>Current Location</p>
        <h3>{locationName}</h3>
        <span>Nearest known area from reverse geocoding</span>
      </article>
    </section>
  );
}

export default ISSInfoCards;
