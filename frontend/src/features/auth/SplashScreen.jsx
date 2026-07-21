import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function SplashScreen() {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(token ? '/dashboard' : '/login', { replace: true });
    }, 1800);
    return () => clearTimeout(timer);
  }, [token, navigate]);

  return (
    <div className="auth-screen" style={{ gap: 0 }}>
      <div style={{ textAlign: 'center', animation: 'pageSlideIn 0.6s ease' }}>
        <div className="logo-icon" style={{ margin: '0 auto 20px', fontSize: '2.5rem' }}>🥛</div>
        <div className="logo-title" style={{ color: 'white', fontSize: '2rem' }}>Maram Manager</div>
        <div className="logo-sub" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8, fontSize: '0.88rem' }}>
          Dairy Operations Platform
        </div>
        <div style={{ marginTop: 48 }}>
          <div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white', margin: '0 auto' }} />
        </div>
      </div>
    </div>
  );
}
