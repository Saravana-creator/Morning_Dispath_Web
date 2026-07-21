import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      toast.error('Please enter phone and password');
      return;
    }
    const ok = await login(phone.trim(), password);
    if (ok) {
      toast.success('Welcome back! 🥛');
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(error || 'Login failed');
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        {/* Logo */}
        <div className="logo-wrap">
          <div className="logo-icon">🥛</div>
          <div className="logo-title">Maram Manager</div>
          <div className="logo-sub">Branch Manager Login</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Phone */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-phone">Phone / Manager ID</label>
            <div className="input-icon-wrapper">
              <Phone size={18} className="input-icon" />
              <input
                id="login-phone"
                type="tel"
                className="input"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password / PIN</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder="Enter password or PIN"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ color: 'var(--color-danger)', fontSize: '0.82rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? (
              <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 20 }}>
          🔒 Secure manager-only access
        </p>
      </div>
    </div>
  );
}
