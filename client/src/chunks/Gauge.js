import React from "react";

const Gauge = ({ predictions }) => {
  const occupied = predictions.filter(p => p.occupied).length;
  console.log(predictions)
    console.log(occupied)


  const total = predictions.length;
  const percent = total ? Math.round((occupied / total) * 100) : 0;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '1rem',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        height: '60px',
        minWidth: '300px',
        border: 'none'
      }}
    >
      <span style={{ fontWeight: 'bold', color: '#176f68', fontSize: '14px' }}>
        Occupied Rate
      </span>

      <div
        style={{
          flexGrow: 1,
          height: '16px',
          margin: '0 12px',
          backgroundColor: '#e0f2f1',
          borderRadius: '1rem',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: 'linear-gradient(to right, #a0e7db, #47bfae, #176f68)',
            borderRadius: '1rem',
            transition: 'width 0.5s ease'
          }}
        />
      </div>

      <span style={{ fontWeight: 'bold', color: '#176f68', fontSize: '14px' }}>
        {percent}%
      </span>
    </div>
  );
};

export default Gauge;
