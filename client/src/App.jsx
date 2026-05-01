import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Fields from './pages/Fields';
import CropCatalog from './pages/CropCatalog';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { LanguageProvider } from './context/LanguageContext';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* App Layout (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/catalog" element={<CropCatalog />} />
            <Route path="/fields" element={<Fields />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
