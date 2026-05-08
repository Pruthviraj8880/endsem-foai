import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

function SpeedChart({ data }) {
  return (
    <section className="panel chart-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Live analytics</p>
          <h2>ISS Speed Chart</h2>
        </div>
        <span className="mini-badge">{data.length}/30 readings</span>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--grid-line)" />
            <XAxis dataKey="time" tick={{ fill: 'var(--muted-text)', fontSize: 11 }} minTickGap={20} />
            <YAxis tick={{ fill: 'var(--muted-text)', fontSize: 11 }} width={76} />
            <Tooltip
              contentStyle={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                color: 'var(--main-text)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="speed"
              name="Speed km/h"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default SpeedChart;
