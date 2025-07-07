import React from "react";
import { Pie } from "react-chartjs-2";
import 'chart.js/auto';

const WorkingIdlePieChart = ({ predictions }) => {
  const working_activities = [
    "using laptop", "using computer",
    "using mobile", "using phone", "using tablet",
    "reading papers", "using papers"
  ];

  let working = 0, idle = 0;

  predictions.forEach(p => {
    if (working_activities.includes(p.activity?.toLowerCase())) {
      working++;
    } else {
      idle++;
    }
  });

  const data = {
    labels: ["Working", "Idle"],
    datasets: [{
      data: [working, idle],
      backgroundColor: ['#2da69c', '#a0e7db'],
      borderWidth: 1
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#176f68',
          font: {
            size: 13,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = working + idle;
            const percent = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percent}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="card p-4 shadow-sm border-0" style={{height: '250px', borderRadius: '1rem', background: 'linear-gradient(135deg,rgb(245, 253, 252) 0%, #f8f9fa 100%)' }}>
      <div style={{ height: '1px' ,width:'1px',marginTop:'-10px' }}></div>
      <Pie data={data} options={options} />
    </div>
  );
};

export default WorkingIdlePieChart;
