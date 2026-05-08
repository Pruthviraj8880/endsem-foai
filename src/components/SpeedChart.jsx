import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

export default function SpeedChart({ data }) {
  return <Line data={{
    labels: data.map((_, i) => i),
    datasets: [{ label: 'ISS Speed (km/h)', data: data, borderColor: 'rgb(75, 192, 192)', tension: 0.1 }]
  }} />;
}