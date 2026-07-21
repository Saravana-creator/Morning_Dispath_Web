import { useEffect } from 'react';
import { ArrowLeft, TrendingUp, Clock, MapPin, AlertTriangle, Fuel, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReportStore } from '../../store/reportStore';

export default function ReportsScreen() {
  const { report, loading, fetch } = useReportStore();
  const navigate = useNavigate();

  useEffect(() => { fetch(); }, []);

  const reportCards = report
    ? [
        {
          label: 'Total Collections',
          value: `₹${report.totalCollections.toLocaleString('en-IN')}`,
          icon: TrendingUp,
          iconBg: '#DCFCE7',
          iconColor: 'var(--color-primary)',
        },
        {
          label: 'Pending Advances',
          value: `₹${report.pendingAdvances.toLocaleString('en-IN')}`,
          icon: Clock,
          iconBg: '#FEF3C7',
          iconColor: 'var(--color-standby)',
        },
        {
          label: 'Routes Completed',
          value: `${report.routesCompleted}/${report.totalRoutes}`,
          icon: MapPin,
          iconBg: '#DBEAFE',
          iconColor: 'var(--color-info)',
        },
        {
          label: 'Missing Bottles',
          value: `${report.missingBottles}`,
          icon: AlertTriangle,
          iconBg: '#FEE2E2',
          iconColor: 'var(--color-danger)',
        },
        {
          label: 'Petrol Paid',
          value: `₹${report.totalPetrolPaid.toLocaleString('en-IN')}`,
          icon: Fuel,
          iconBg: '#DCFCE7',
          iconColor: 'var(--color-primary)',
        },
      ]
    : [];

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back" id="btn-back-reports">
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <h1>Daily Reports</h1>
          <div className="subtitle">End-of-day summary</div>
        </div>
        <button className="icon-btn" onClick={() => fetch()} aria-label="Refresh" id="btn-refresh-reports">
          <RefreshCw size={18} />
        </button>
      </header>

      <div className="scroll-area">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : !report ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-text">No report data available</div>
          </div>
        ) : (
          <>
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-md)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              fontSize: '0.82rem',
              textAlign: 'center',
              fontWeight: 500,
            }}>
              📅 Report for {new Date(report.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>

            <div className="stat-grid">
              {reportCards.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
                <div key={label} className="stat-card">
                  <div className="stat-icon" style={{ background: iconBg }}>
                    <Icon size={18} color={iconColor} />
                  </div>
                  <div className="stat-label">{label}</div>
                  <div className="stat-value">{value}</div>
                </div>
              ))}
            </div>

            {/* Quick status bar */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Day Overview</div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Routes Completed', pct: report.totalRoutes > 0 ? (report.routesCompleted / report.totalRoutes) * 100 : 0, color: 'var(--color-primary)' },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{label}</span>
                      <span style={{ color, fontWeight: 700 }}>{Math.round(pct)}%</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 'var(--radius-full)', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
