import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/scans" element={<Dashboard />} />
          <Route path="/reports" element={<Dashboard />} />
          <Route path="/analytics" element={<Dashboard />} />
          <Route path="/team" element={<Dashboard />} />
          <Route path="/settings" element={<Profile />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;