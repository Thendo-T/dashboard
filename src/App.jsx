import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Headers from "./Utils/header";
import Landing from "./components/landingPage"; // Import Landing here if you want to route to it directly
import Dashboard from "./components/dashboard";
import Login from "./components/login";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Headers />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
