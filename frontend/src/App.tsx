import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WeatherProvider } from './context/WeatherContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import UVAwareness from './pages/UVAwareness';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import backgroundVideo from './assets/background.mp4';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WeatherProvider>
        <Router>
          <div className="min-vh-100 d-flex flex-column position-relative">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="background-video"
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
            <div className="content-overlay">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/uv-awareness" element={<UVAwareness />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </div>
        </Router>
      </WeatherProvider>
    </AuthProvider>
  );
};

export default App;
