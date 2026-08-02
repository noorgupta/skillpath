import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import RoadmapDetail from "./pages/RoadmapDetail.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/roadmap/:id" element={<RoadmapDetail />} />
    </Routes>
  );
}

export default App;