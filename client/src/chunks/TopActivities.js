import React from "react";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';

const TopActivities = ({ predictions }) => {
  const countMap = {};
  predictions.forEach(p => {
    if (p.activity !== "no activity") {
      countMap[p.activity] = (countMap[p.activity] || 0) + 1;
    }
  });

  const sorted = Object.entries(countMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const labels = sorted.map(([a]) => a);
  const values = sorted.map(([_, v]) => v);

  const tealShades = ["#26a69a", "#33bfb1", "#47cfc0", "#66dcd0", "#80e8df"];

  const data = {
    labels,
    datasets: [{
      label: "Occurrences",
      data: values,
      backgroundColor: tealShades.slice(0, values.length)
    }]
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#176f68",
          font: { weight: "bold" }
        },
        grid: {
          color: "#e0f2f1",
          height: "300px"

        }
      },
      x: {
        ticks: {
          color: "#176f68",
          font: { weight: "bold" }
        },
        grid: {
          color: "#f0f7f6"
        }
      }
    }
  };

  return (

    <div
  className="card p-4 shadow-sm"
  style={{
    height: '300px',
    borderRadius: '1rem',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column'
  }}
>
  <h5 className="mb-1 text-dark" style={{ marginBottom: '4px' }}>
    Top 5 Activities
  </h5>

  <div style={{ flex: 1 , marginTop: '40px'
  }}>
    <Bar data={data} options={options} />
  </div>
</div>

  );
};

export default TopActivities;