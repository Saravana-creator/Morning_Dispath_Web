import { useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePetrolStore } from '../../store/petrolStore';

export default function PetrolScreen() {
  const { records, loading, fetch, pay } = usePetrolStore();
  const navigate = useNavigate();

  useEffect(() => { fetch(); }, []);

  const handlePay = async (record) => {
    if (record.isPaid) return;
    await pay(record._id);
    toast.success(`₹${record.todaysPA} paid to ${record.dpName} ✅`);
  };

  const totalPayable = records.reduce((s, r) => s + (!r.isPaid ? Math.max(0, r.todaysPA - r.advanceRemaining) : 0), 0);

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(-1)} id="btn-back-petrol" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <h1>Petrol Allowance</h1>
          <div className="subtitle">Total Payable: ₹{totalPayable}</div>
        </div>
      </header>

      <div className="scroll-area">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⛽</div>
            <div className="empty-state-text">No petrol records for today.<br />Assign DPs to routes first.</div>
          </div>
        ) : (
          records.map((record) => {
            const payable = Math.max(0, record.todaysPA - record.advanceRemaining);
            return (
              <div key={record._id} className="card" style={{ borderLeft: record.isPaid ? '4px solid var(--color-present)' : '4px solid var(--color-border)' }}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div className="card-title">{record.dpName}</div>
                      <div className="card-subtitle">📍 {record.routeName}</div>
                    </div>
                    {record.isPaid
                      ? <span className="badge badge-paid"><CheckCircle size={12} />Paid</span>
                      : <span className="badge badge-unpaid">Pending</span>
                    }
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {[
                      { label: "Today's PA", value: `₹${record.todaysPA}` },
                      { label: 'Advance Deduct', value: `₹${record.advanceRemaining}` },
                      { label: 'Payable', value: `₹${record.isPaid ? 0 : payable}`, highlight: true },
                    ].map(({ label, value, highlight }) => (
                      <div key={label} style={{ textAlign: 'center', padding: '6px 4px', background: highlight ? '#F0FBF4' : 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '0.64rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{label}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: highlight ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    id={`pay-btn-${record._id}`}
                    className={`btn btn-full btn-sm ${record.isPaid ? 'btn-ghost' : 'btn-primary'}`}
                    onClick={() => handlePay(record)}
                    disabled={record.isPaid}
                  >
                    {record.isPaid ? '✓ Already Paid' : `Pay ₹${payable}`}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
