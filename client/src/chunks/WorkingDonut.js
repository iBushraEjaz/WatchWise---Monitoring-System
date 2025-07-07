import React from "react";
import { Doughnut } from "react-chartjs-2";
import 'chart.js/auto';

const WorkingDonut = ({ predictions = [] }) => {
  let occupied = 0, unoccupied = 0;

  predictions.forEach(p => {
    if (p.occupied) {
      occupied++;
    } else {
      unoccupied++;
    }
  });

  const total = occupied + unoccupied;
  const occupiedPercentage = total ? ((occupied / total) * 100).toFixed(1) : 0;

  const data = {
    labels: ["Occupied", "Unoccupied"],
    datasets: [{
      data: [occupied, unoccupied],
      backgroundColor: ["#14b8a6", "#d1d5db"], // teal and gray
      borderWidth: 0,
      cutout: '70%'
    }]
  };

  const options = {
    cutout: '70%',
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#333',
          font: {
            size: 13,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const percent = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percent}%)`;
          }
        }
      },
      datalabels: {
        display: true,
        formatter: () => `${occupiedPercentage}%`,
        color: '#176f68',
        font: {
          weight: 'bold',
          size: 20
        }
      }
    }
  };

  return (
    <div className="card p-2 shadow-sm border-0" style={{ height: '165px', borderRadius: '1rem', background: 'linear-gradient(135deg,rgb(235, 247, 245) 0%,rgb(248, 248, 248) 100%)' }}>
      <h5 className="mb-3 text-dark">Occupancy Status</h5>
      <div style={{ height: '120px' }}>
        <Doughnut
          data={data}
          options={{ ...options, maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
};



export default WorkingDonut;
