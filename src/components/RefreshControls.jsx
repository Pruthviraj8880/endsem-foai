import formatTime from '../utils/formatTime.js';

function RefreshControls({ autoRefresh, onAutoRefreshChange, onRefresh, lastUpdated }) {
  return (
    <div className="refresh-card">
      <button className="primary-button" onClick={onRefresh}>
        Refresh Now
      </button>

      <label className="switch-row">
        <input type="checkbox" checked={autoRefresh} onChange={onAutoRefreshChange} />
        <span className="switch-slider" />
        <span>Auto-refresh every 15s</span>
      </label>

      <p className="last-updated">
        Last updated: {lastUpdated ? formatTime(lastUpdated.getTime()) : 'Waiting for first signal'}
      </p>
    </div>
  );
}

export default RefreshControls;
