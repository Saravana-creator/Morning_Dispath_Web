import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import BottomNav from './core/components/BottomNav';

// Auth screens
import SplashScreen from './features/auth/SplashScreen';
import LoginScreen from './features/auth/LoginScreen';

// Main screens
import DashboardScreen from './features/dashboard/DashboardScreen';
import AttendanceScreen from './features/attendance/AttendanceScreen';
import RoutesScreen from './features/routes/RoutesScreen';
import InventoryScreen from './features/inventory/InventoryScreen';
import MoreScreen from './features/more/MoreScreen';

// Secondary screens
import PetrolScreen from './features/petrol/PetrolScreen';
import TransactionsScreen from './features/transactions/TransactionsScreen';
import PosScreen from './features/pos/PosScreen';
import BottlesScreen from './features/bottles/BottlesScreen';
import StaffScreen from './features/staff/StaffScreen';
import SalaryScreen from './features/salary/SalaryScreen';
import ReportsScreen from './features/reports/ReportsScreen';

// Protected layout shell (includes bottom nav)
function AppShell() {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Outlet />
      <BottomNav />
    </div>
  );
}

// Guest layout (no nav)
function GuestShell() {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.88rem',
            borderRadius: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          },
          success: { iconTheme: { primary: '#1A7A3C', secondary: '#DCFCE7' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<SplashScreen />} />
        <Route element={<GuestShell />}>
          <Route path="/login" element={<LoginScreen />} />
        </Route>

        {/* Protected */}
        <Route element={<AppShell />}>
          <Route path="/dashboard"    element={<DashboardScreen />} />
          <Route path="/attendance"   element={<AttendanceScreen />} />
          <Route path="/routes"       element={<RoutesScreen />} />
          <Route path="/inventory"    element={<InventoryScreen />} />
          <Route path="/more"         element={<MoreScreen />} />
          <Route path="/petrol"       element={<PetrolScreen />} />
          <Route path="/transactions" element={<TransactionsScreen />} />
          <Route path="/pos"          element={<PosScreen />} />
          <Route path="/bottles"      element={<BottlesScreen />} />
          <Route path="/staff"        element={<StaffScreen />} />
          <Route path="/salary"       element={<SalaryScreen />} />
          <Route path="/reports"      element={<ReportsScreen />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
