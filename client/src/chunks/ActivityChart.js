import React from "react";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';

const ActivityChart = ({ predictions }) => {
  const labels = predictions.map((_, i) => `#${i + 1}`);
  const activities = predictions.map(p => p.activity || 'no activity');

  const activityTypes = [...new Set(activities)];
  const tealShades = [
    '#14b8a6', '#70d9cc', '#47bfae', '#2da69c', '#178b80', '#0f6f66'
  ];

  const datasets = activityTypes.map((type, i) => ({
    label: type,
    data: activities.map(a => a === type ? 1 : 0),
    borderColor: tealShades[i % tealShades.length],
    backgroundColor: tealShades[i % tealShades.length] + '33',
    fill: true,
    tension: 0.5,
    pointRadius: 4,
    height: '200px',

    pointHoverRadius: 6
  }));

  const data = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        height: '200px',
        labels: {
          color: '#176f68',
          font: { size: 15, weight: 'bold' }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {  
                 // Add space above 1
    ticks: {
      stepSize: 1,
          color: '#0f6f66'
        },
        grid: {
          height: '200px',
          color: '#d9f2f0'
        }
      },
      x: {
        ticks: {
          color: '#0f6f66'
        },
        grid: {
          color: '#f0fbfa'
        }
      }
    }
  };

  return (
  <div
  className="card p-2 shadow-sm"
  style={{
    height: '300px',
    borderRadius: '1rem',
    background: 'linear-gradient(135deg,rgb(245, 253, 252) 0%, #f8f9fa 100%)',
    display: 'flex',
    flexDirection: 'column'
  }}
>
  <h5 className="mb-1 text-dark" >
    Activity Frequency Timeline
  </h5>

  <div style={{ flex: 1 , marginTop: '60px'}}>
    <Line data={data} options={options} />
  </div>
</div>

  );
};

export default ActivityChart;