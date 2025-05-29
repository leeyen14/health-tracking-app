// client/src/components/HeartRateChart.js
import { Line } from 'react-chartjs-2';

export default function HeartRateChart({ data }) {
  const chartData = {
    labels: data.map(item => new Date(item.time).toLocaleTimeString()),
    datasets: [{
      label: 'Heart Rate (bpm)',
      data: data.map(item => item.value),
      borderColor: '#ff6384',
      fill: false
    }]
  };

  return <Line data={chartData} />;
}