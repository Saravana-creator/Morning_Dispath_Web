import { useNavigate } from 'react-router-dom';
import {
  Fuel, DollarSign, ShoppingCart, FlaskConical, Users, Wallet, BarChart3, LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const moreItems = [
  { to: '/petrol',       icon: Fuel,         label: 'Petrol Allowance', bg: '#DCFCE7', color: 'var(--color-primary)' },
  { to: '/transactions', icon: DollarSign,   label: 'Transactions',     bg: '#DBEAFE', color: 'var(--color-info)' },
  { to: '/pos',          icon: ShoppingCart, label: 'Point of Sale',    bg: '#FEF3C7', color: 'var(--color-standby)' },
  { to: '/bottles',      icon: FlaskConical, label: 'Empty Bottles',    bg: '#F3E8FF', color: '#7C3AED' },
  { to: '/staff',        icon: Users,        label: 'Staff Mgmt',       bg: '#FEE2E2', color: 'var(--color-absent)' },
  { to: '/salary',       icon: Wallet,       label: 'Salary & Advances',bg: '#FEF3C7', color: 'var(--color-standby)' },
  { to: '/reports',      icon: BarChart3,    label: 'Daily Reports',    bg: '#DCFCE7', color: 'var(--color-primary)' },
];

export default function MoreScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>More</h1>
          <div className="subtitle">Additional features & settings</div>
        </div>
      </header>

      <div className="scroll-area">
        {/* User info card */}
        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="avatar" style={{ width: 52, height: 52, fontSize: '1.1rem' }}>
              {user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'MG'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name || 'Manager'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>📱 {user?.phone}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: 2 }}>
                Branch Manager
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div>
          <p className="section-title">Features</p>
          <div className="more-grid">
            {moreItems.map(({ to, icon: Icon, label, bg, color }) => (
              <div
                key={to}
                className="more-item"
                onClick={() => navigate(to)}
                id={`more-${to.slice(1)}`}
                role="button"
                tabIndex={0}
              >
                <div className="more-item-icon" style={{ background: bg }}>
                  <Icon size={22} color={color} />
                </div>
                <div className="more-item-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          id="btn-logout"
          className="btn btn-ghost btn-full"
          onClick={handleLogout}
          style={{ color: 'var(--color-danger)', borderColor: '#FEE2E2', gap: 8 }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
