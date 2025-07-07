import socket from "../socket";
import 'bootstrap/dist/css/bootstrap.min.css';
import Gauge from "../chunks/Gauge";
// import ActivityChart from "../chunks/ActivityChart";
import TopActivities from "../chunks/TopActivities";
import StationSummary from "../chunks/StationSummary";
import WorkingDonut from "../chunks/WorkingDonut";
import WorkingIdlePieChart from "../chunks/pie";
import StationTable from "../chunks/StationTable";
import ActivityChart from "../chunks/ActivityChart";

import "../App.css";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

function GraphicalRepresentation() {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    socket.on("prediction", (data) => {
      setPredictions(prev => [data, ...prev.slice(0, 19)]);
    });
  }, []);

  return (
    <div className="dashboard-wrapper container-fluid py-3 px-4"style={{marginTop:"-32px"}}>

      {/* Row 1: Summary Cards */}

      <div className="d-flex flex-wrap justify-content-start align-items-start mb-4" >

{/* StationSummary */}
<div className="card-box compact p-2 me-2 " style={{ height: '193px', width: '200px',marginLeft:"-25px",margintop:"-29px" }}>
  <StationSummary predictions={predictions} />
</div>


{/* WorkingDonut */}
<div className="card-box compact p-2" style={{ height: '270px', width: '320px',marginLeft:"715px",marginTop:"-188px" }}>
  <WorkingIdlePieChart predictions={predictions} />
</div>


</div>


<div className="container" style={{width:"529px",marginTop:"-300px",height:"195px",marginLeft:"180px"}}>
  <div className="row justify-content-center"  >
    {/* pick your size (col-md-6 = half width on md+) */}
    <div className="col-md-4 col-lg-2 " style={{  width:"579px",marginLeft:"-10px",marginTop:"-10px"}}>
      <WorkingDonut predictions={predictions} />
    </div>
  </div>
</div>

<div className="card-box compact p-2 me-4" style={{ height: '80px', width: '729px',marginTop:"-45px",marginLeft:"-20px" }}>
  <Gauge predictions={predictions} />
</div>




      {/* Row 3: Bar Charts */}
      <div className="row mb-0" style={{marginTop:"193px"}}>
  {/* Column 1: StationTable */}
  <div className="col-lg-4 col-md-12 mb-0" style={{height: '100px', marginTop:"-190px"}}>
    <div className="card-box compact p-2" style={{ minHeight: '350px',width:"350px",marginLeft:"-20px" }}>
      <StationTable predictions={predictions} />
    </div>
  </div>

  {/* Column 2: ActivityChart */}
  <div className="col-lg-4 col-md-12 mb-3" style={{marginTop:"-190px"}}>
    <div className="card-box compact p-2 h-100" style={{marginLeft:"-10px"}}>
      <ActivityChart predictions={predictions} />
    </div>
  </div>

  {/* Column 3: TopActivities */}
  <div className="col-lg-4 col-md-12 mb-3" style={{marginTop:"-190px"}}>
    <div className="card-box compact p-2 h-100" style={{marginLeft:"-20px"}}>
      <TopActivities predictions={predictions} />
    </div>
  </div>
</div>



    </div>
  );
}

export default GraphicalRepresentation;