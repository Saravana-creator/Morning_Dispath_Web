import { useEffect } from 'react';
import { ArrowLeft, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSalaryStore } from '../../store/salaryStore';

export default function SalaryScreen() {
  const { records, loading, fetch, giveAdvance } = useSalaryStore();
  const navigate = useNavigate();

  useEffect(() => { fetch(); }, []);

  const handleAdvance = async (record) => {
    const amount = 500;
    await giveAdvance(record._id, amount);
    toast.success(`₹${amount} advance given to ${record.staffName} 💸`);
  };

  const netPayable = (r) => Math.max(0, r.baseSalary - r.advanceTaken - r.penalties);

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back" id="btn-back-salary">
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <h1>Salary & Advances</h1>
          <div className="subtitle">Manage staff payments this month</div>
        </div>
      </header>

      <div className="scroll-area">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          records.map((record) => {
            const net = netPayable(record);
            return (
              <div key={record._id} className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="avatar" style={{ width: 40, height: 40, fontSize: '0.85rem' }}>
                      {record.staffName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                    </div>
                    <div>
                      <div className="card-title">{record.staffName}</div>
                      <div className="card-subtitle">{record.role}</div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                    {[
                      { label: 'Base Salary', value: record.baseSalary, color: 'var(--color-text-primary)' },
                      { label: 'Advance Taken', value: record.advanceTaken, color: 'var(--color-expense)' },
                      { label: 'Net Payable', value: net, color: 'var(--color-primary)', bold: true },
                    ].map(({ label, value, color, bold }) => (
                      <div key={label} style={{ textAlign: 'center', padding: '8px 4px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 3 }}>{label}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: bold ? 800 : 600, color, fontSize: bold ? '1.05rem' : '0.92rem' }}>
                          ₹{value.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    id={`advance-btn-${record._id}`}
                    className="btn btn-accent btn-full btn-sm"
                    onClick={() => handleAdvance(record)}
                    style={{ gap: 6 }}
                  >
                    <Wallet size={14} />
                    Give ₹500 Advance
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
