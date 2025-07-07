import React from "react";

const StationSummary = ({ predictions }) => {
  // ✅ Debug logs
  console.log("Predictions received in StationSummary:", predictions);
  console.log("Mapped stations:", predictions.map(p => p.station?.trim().toLowerCase()));

  const uniqueStations = new Set(
    predictions
      .map(p => p.station_id?.trim().toLowerCase())
      .filter(station => station && station !== "")
  );
  

  const totalStations = uniqueStations.size;

  return (
    <div
      className="shadow-sm border-0 p-3"
      style={{
        borderRadius: '1rem',
        backgroundColor: '#f8f9fa',
        width: '100%',
        maxWidth: '600px',
        height: '172px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <h6 className="text-dark mb-1" style={{ fontSize: '16px' }}>Total Stations</h6>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#176f68' }}>
          {totalStations}
        </div>
        <p className="text-muted mt-1" style={{ fontSize: '12px' }}>Real-time data</p>
      </div>

      {/* Station icon using SVG */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'linear-gradient(to right, #a0e7db, #47bfae, #176f68)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05.64.6.97 1.3.97 2.01V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      </div>
    </div>
  );
};

export default StationSummary;
