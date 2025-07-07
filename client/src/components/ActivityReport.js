import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import axios from 'axios';
import autoTable from 'jspdf-autotable'; 

const ActivityReport = () => {
  const [reportData, setReportData] = useState([]);
  const [selectedReport, setSelectedReport] = useState("daily");
  const [selectedDate, setSelectedDate] = useState("");
  const [stationId, setStationId] = useState("");
  const [stations, setStations] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setSelectedDate(today);
    
    // Fetch list of stations when component loads
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stations/list");
      const data = await response.json();
      console.log(data); // Log the response to check the structure
  
      if (response.ok && data.station_ids) {
        // Map the station_ids array into an array of objects with id and name
        const stationsData = data.station_ids.map(id => ({ id, name: id }));
        setStations(stationsData);  // Update state with the transformed data
        setError(""); // Clear any previous errors
      } else {
        setError("Failed to fetch stations.");
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
      setError("Error fetching stations. Please try again later.");
    }
  };
  

  const getPeriodString = () => {
    if (selectedReport === "daily") return selectedDate;
    if (selectedReport === "weekly") return `week-${selectedDate}`;
    if (selectedReport === "monthly") return `month-${selectedDate}`;
  };

  const fetchReportData = async () => {
    if (!stationId) {
      setError("Please select a Station.");
      return;
    }

    setLoading(true);
    const period = getPeriodString();
    const endpoint = `http://localhost:5000/api/activity_summary?station_id=${stationId}&period=${period}`;

    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log(data)
      if (response.ok && data.success) {
        setReportData(data.data.activities || []);
        setError(""); // Clear any previous errors
      } else {
        setError("No data available for the selected period.");
        setReportData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  
    // Header styling
    doc.setFontSize(20);
    doc.setTextColor("#004D40");
    doc.text("Activity Summary Report", 105, 15, { align: "center" });
  
    // Subheading section
    doc.setFontSize(12);
    doc.setTextColor("#000000");
  
    const now = new Date();
    const generatedOn = now.toLocaleString();
    const fileDate = now.toISOString().split("T")[0];
  
    const infoY = 25;
    const lineSpacing = 7;
  
    doc.text(`Report Type      : ${selectedReport.toUpperCase()}`, 14, infoY);
    doc.text(`Selected Date    : ${selectedDate}`, 14, infoY + lineSpacing);
    doc.text(`Station ID       : ${stationId}`, 14, infoY + lineSpacing * 2);
    doc.text(`Generated On     : ${generatedOn}`, 14, infoY + lineSpacing * 3);
  
    doc.setDrawColor(180, 180, 180);
    doc.line(10, infoY + lineSpacing * 3 + 5, 200, infoY + lineSpacing * 3 + 5);
  
    const tableStartY = infoY + lineSpacing * 3 + 12;
  
    // Table
    if (reportData.length > 0) {
      const tableData = reportData.map((activity) => [
        stationId,
        activity.activity_type,
        `${activity.total_duration}s`,
      ]);
  
      autoTable(doc, {
        startY: tableStartY,
        head: [["Station ID", "Activity Type", "Total Duration"]],
        body: tableData,
        theme: "striped",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: "#004D40", textColor: "#FFFFFF" },
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor("#FF0000");
      doc.text("No data available for the selected report type.", 105, tableStartY + 10, { align: "center" });
    }
  
    // Footer: Page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor("#666666");
      doc.text(`Page ${i} of ${totalPages}`, 105, 290, { align: "center" });
    }
  
    // Save with formatted name
    doc.save(`Activity_Summary_${fileDate}.pdf`);
  };
  

  return (
    <div style={{ padding: "20px" }}>
      {/* Error Message Box at the Top */}
      {error && (
        <div style={{
          backgroundColor: "#fff9c4",  // Soft yellow background
          color: "#f57f17",            // Dark orange text
          padding: "10px 20px",        // Smaller padding for compactness
          borderRadius: "8px",         // Slightly rounded corners
          textAlign: "center",
          fontSize: "14px",             // Smaller text size for a less prominent message
          fontWeight: "normal",        // Make the font weight normal (less bold)
          maxWidth: "400px",           // Reduced width to make it more compact
          margin: "0 auto",            // Center the error box horizontally
          marginBottom: "20px",        // Add some space below the error box
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)", // Soft shadow to make it stand out
        }}>
          <strong>{"Reports not available"}</strong>
        </div>
      )}

      <h2 style={{ color: "#009688", textAlign: "center", marginBottom: "30px" }}>
        Activity Summary Report
      </h2>

     {/* Combined Station, Report Type, and Date Picker in one row */}
<div style={{
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  marginBottom: "20px"
}}>
  {/* Station Dropdown */}
  <div style={{ flex: "1" }}>
    <label style={{ fontWeight: "bold" }}>Station:</label>
    <select
      value={stationId}
      onChange={(e) => setStationId(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px"
      }}
    >
      <option value="">Select a Station</option>
      {stations.map((station) => (
        <option key={station.id} value={station.id}>
          {station.name}
        </option>
      ))}
    </select>
  </div>

  {/* Report Type */}
  <div style={{ flex: "1" }}>
    <label style={{ fontWeight: "bold" }}>Report Type:</label>
    <select
      value={selectedReport}
      onChange={(e) => setSelectedReport(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px"
      }}
    >
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
    </select>
  </div>

  {/* Date Picker */}
  <div style={{ flex: "1" }}>
    <label style={{ fontWeight: "bold" }}>Select Date:</label>
    {selectedReport === "monthly" ? (
      <select
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "5px",
          border: "1px solid #ccc",
          borderRadius: "4px"
        }}
      >
        {Array.from({ length: 12 }, (_, i) => {
          const month = (i + 1).toString().padStart(2, "0");
          const year = new Date().getFullYear();
          return (
            <option key={month} value={`${year}-${month}`}>
              {`${year}-${month}`}
            </option>
          );
        })}
      </select>
    ) : (
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "5px",
          border: "1px solid #ccc",
          borderRadius: "4px"
        }}
      />
    )}
  </div>
</div>



     {/* Buttons */}
<div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
  <button
    onClick={fetchReportData}
    style={{
      flex: 1,
      padding: "12px",
      backgroundColor: "#009688",
      color: "white",
      border: "none",
      fontSize: "16px",
      cursor: "pointer",
    }}
  >
    {loading ? "Loading..." : "Fetch Report"}
  </button>

  {reportData.length > 0 && (
    <button
      onClick={downloadPDF}
      style={{
        flex: 1,
        padding: "12px",
        backgroundColor: "white",
        color: "#009688",
        border: `2px solid #009688`,
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Download PDF
    </button>
  )}
</div>

{reportData.length > 0 ? (
  <div style={{
    border: `2px solid #009688`,
    borderRadius: "8px",
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    maxHeight: "400px",  // Limit the height for scrolling
    overflowY: "auto"    // Enable vertical scrolling if the content overflows
  }}>
    <h3 style={{ color: "#009688", textAlign: "center" }}>Report Details</h3>
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {reportData.map((activity, idx) => (
        <li key={idx} style={{ marginBottom: "10px" }}>
          <strong>{activity.activity_type}</strong>: {activity.total_duration}s
        </li>
      ))}
    </ul>
  </div>
) : (
  !loading && (
    <p style={{ textAlign: "center", color: "gray" }}>
    </p>
  )
)}

    </div>
  );
};

export default ActivityReport;
