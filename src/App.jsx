import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { BottomNav } from './components/BottomNav';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';
import CreateKitty from './pages/CreateKitty';
import KittyDetail from './pages/KittyDetail';
import Withdraw from './pages/Withdraw';
import PublicContribute from './pages/PublicContribute';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function Chrome({ children, nav = true }) {
  return (
    <div className="app-shell">
      {children}
      {nav && <BottomNav />}
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Chrome nav={false}><Landing /></Chrome>} />
      <Route path="/login" element={<Chrome nav={false}><Login /></Chrome>} />
      <Route path="/register" element={<Chrome nav={false}><Register /></Chrome>} />
      <Route path="/verify" element={<Chrome nav={false}><VerifyOtp /></Chrome>} />
      {/* The share-link contribution page — no login (FR-AUTH-09) */}
      <Route path="/k/:shareToken" element={<Chrome nav={false}><PublicContribute /></Chrome>} />

      {/* Authenticated */}
      <Route path="/app" element={<RequireAuth><Chrome><Dashboard /></Chrome></RequireAuth>} />
      <Route path="/app/new" element={<RequireAuth><Chrome><CreateKitty /></Chrome></RequireAuth>} />
      <Route path="/app/kitty/:id" element={<RequireAuth><Chrome><KittyDetail /></Chrome></RequireAuth>} />
      <Route path="/app/kitty/:id/withdraw" element={<RequireAuth><Chrome nav={false}><Withdraw /></Chrome></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
