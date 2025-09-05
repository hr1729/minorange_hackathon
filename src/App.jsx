import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Team from './pages/Team';
import { NotificationProvider } from './components/notifications/NotificationProvider';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/scans" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<Profile />} />
          </Routes>
        </MainLayout>
      </NotificationProvider>
    </Router>
  );
}

export default App;