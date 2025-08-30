import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';


// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import AddWaste from './pages/farmer/AddWaste';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Farmer Routes */}
            <Route 
              path="/farmer/dashboard" 
              element={
                <ProtectedRoute requiredRole="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/farmer/add-waste" 
              element={
                <ProtectedRoute requiredRole="farmer">
                  <AddWaste />
                </ProtectedRoute>
              } 
            />

            {/* Redirect based on role */}
            <Route path="/dashboard" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;