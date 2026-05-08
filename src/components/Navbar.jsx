import ThemeToggle from './ThemeToggle.jsx';

function Navbar({ theme, onThemeChange }) {
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-icon">ISS</span>
        <div>
          <h2>Mission Control</h2>
          <p>Live orbit tracker</p>
        </div>
      </div>

      <div className="navbar-actions">
        <span className="status-pill">
          <span className="status-dot" />
          Live telemetry
        </span>
        <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
      </div>
    </nav>
  );
}

export default Navbar;
