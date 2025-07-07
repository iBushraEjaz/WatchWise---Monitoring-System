import React from "react";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';

const StackedBarChart = ({ predictions }) => {
  const stationMap = {};

  predictions.forEach(p => {
    const s = p.station || "Unknown";
    const a = p.activity || "no activity";
    if (!stationMap[s]) stationMap[s] = {};
    stationMap[s][a] = (stationMap[s][a] || 0) + 1;
  });

  const stations = Object.keys(stationMap);
  const activityTypes = [...new Set(predictions.map(p => p.activity))];

  const tealShades = [
    '#a0e7db', '#70d9cc', '#47bfae', '#2da69c', '#178b80', '#0f6f66'
  ];

  const datasets = activityTypes.map((type, i) => ({
    label: type,
    data: stations.map(s => stationMap[s][type] || 0),
    backgroundColor: tealShades[i % tealShades.length]
  }));

  const data = { labels: stations, datasets };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#176f68',
          font: { size: 13, weight: 'bold' }
        }
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: { color: '#0f6f66' },
        grid: { color: '#f0fbfa' }
      },
      y: {
        stacked: true,
        ticks: { color: '#0f6f66' },
        grid: { color: '#d9f2f0' }
      }
    }
  };

  return (
    <div className="card p-4 shadow-sm " style={{ height:'30px', borderRadius: '1rem', background: 'linear-gradient(135deg,rgb(255, 255, 255) 0%, #f8f9fa 100%)' }}>
      <h5 className="mb-2 text-dark">Station-wise Activity (Stacked)</h5>
      <Bar data={data} options={options} />
    </div>
  );
};

export default StackedBarChart;
