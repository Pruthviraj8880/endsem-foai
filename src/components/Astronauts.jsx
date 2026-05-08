import Loader from './Loader.jsx';

function Astronauts({ astronauts, loading }) {
  return (
    <section className="panel astronauts-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">People in space</p>
          <h2>Astronaut Crew Board</h2>
        </div>
        <span className="mini-badge">{astronauts.length} astronauts</span>
      </div>

      {loading && <Loader message="Loading astronaut data..." small />}

      {!loading && astronauts.length === 0 && (
        <p className="empty-text">Astronaut data is not available right now.</p>
      )}

      {!loading && astronauts.length > 0 && (
        <div className="astronaut-grid">
          {astronauts.map((person) => (
            <article className="astronaut-card" key={`${person.name}-${person.craft}`}>
              <div className="avatar">{person.name.charAt(0)}</div>
              <div>
                <h3>{person.name}</h3>
                <p>{person.craft || 'Spacecraft unknown'}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Astronauts;
