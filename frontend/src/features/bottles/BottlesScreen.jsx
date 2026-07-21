import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBottleStore } from '../../store/bottleStore';
import Stepper from '../../core/components/Stepper';

export default function BottlesScreen() {
  const { records, loading, fetch, step, getTotalPending } = useBottleStore();
  const navigate = useNavigate();

  useEffect(() => { fetch(); }, []);

  const totalPending = getTotalPending();

  const pending = (r) => Math.max(0, r.issuedYesterday - r.collectedToday - r.missing - r.broken);

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back" id="btn-back-bottles">
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <h1>Empty Bottles</h1>
          <div className="subtitle">Track bottle collection by route</div>
        </div>
      </header>

      {/* Summary header */}
      <div className="summary-banner">
        <div>
          <div className="summary-banner-label">Total Pending Bottles</div>
          <div className="summary-banner-value">{totalPending}</div>
        </div>
        <span style={{ fontSize: '2.5rem' }}>🧴</span>
      </div>

      <div className="scroll-area">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          records.map((record) => {
            const p = pending(record);
            return (
              <div key={record._id} className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">{record.routeName}</div>
                    <div className="card-subtitle">Issued yesterday: {record.issuedYesterday}</div>
                  </div>
                  <div style={{ textAlign: 'right', padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: p > 0 ? '#FEE2E2' : '#DCFCE7' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: p > 0 ? 'var(--color-danger)' : 'var(--color-present)' }}>Pending</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: p > 0 ? 'var(--color-danger)' : 'var(--color-present)', fontSize: '1.25rem', lineHeight: 1.2 }}>{p}</div>
                  </div>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { field: 'collectedToday', label: '✅ Collected Today', value: record.collectedToday },
                    { field: 'missing',        label: '❓ Missing',         value: record.missing },
                    { field: 'broken',         label: '💔 Broken',          value: record.broken },
                  ].map(({ field, label, value }) => (
                    <div key={field} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{label}</span>
                      <Stepper
                        value={value}
                        onDecrement={() => value > 0 && step(record._id, field, -1)}
                        onIncrement={() => step(record._id, field, 1)}
                        min={0}
                        max={record.issuedYesterday}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
