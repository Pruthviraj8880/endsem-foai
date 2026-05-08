import { Doughnut } from "react-chartjs-2";

export default function NewsChart({ news }) {

  const data = {
    labels: ["Articles"],

    datasets: [
      {
        data: [news.length]
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-5">
      <Doughnut data={data} />
    </div>
  );
}