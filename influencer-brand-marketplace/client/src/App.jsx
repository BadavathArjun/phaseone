import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import InfluencerProfile from './pages/InfluencerProfile';
import BrandProfile from './pages/BrandProfile';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import CreateCampaign from './pages/CreateCampaign';
import SearchInfluencers from './pages/SearchInfluencers';
import Messages from './pages/Messages';
import TrendsPage from './pages/TrendsPage';
import Proposals from './pages/Proposals';

import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/influencer-profile" element={
                    <ProtectedRoute allowedRoles={['influencer']}>
                      <InfluencerProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/brand-profile" element={
                    <ProtectedRoute allowedRoles={['brand']}>
                      <BrandProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/campaigns" element={
                    <ProtectedRoute>
                      <Campaigns />
                    </ProtectedRoute>
                  } />
                  <Route path="/campaigns/:id" element={
                    <ProtectedRoute>
                      <CampaignDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/create-campaign" element={
                    <ProtectedRoute allowedRoles={['brand']}>
                      <CreateCampaign />
                    </ProtectedRoute>
                  } />
                  <Route path="/search" element={
                    <ProtectedRoute allowedRoles={['brand']}>
                      <SearchInfluencers />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  } />
                  <Route path="/proposals" element={
                    <ProtectedRoute allowedRoles={['brand']}>
                      <Proposals />
                    </ProtectedRoute>
                  } />
                  <Route path="/trends/:influencerId" element={
                    <ProtectedRoute>
                      <TrendsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/home" element={<Dashboard />} />
                  <Route path="*" element={<Dashboard />} />
                </Routes>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
