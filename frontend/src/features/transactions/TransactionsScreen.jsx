import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTransactionStore } from '../../store/transactionStore';
import Modal from '../../core/components/Modal';

const today = () => new Date().toISOString().split('T')[0];

export default function TransactionsScreen() {
  const { transactions, loading, fetch, add, remove } = useTransactionStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', type: 'income', description: '' });

  useEffect(() => { fetch(); }, []);

  const totalIncome  = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const totalExpense = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);

  const handleAdd = async () => {
    if (!form.title || !form.amount) { toast.error('Title and amount are required'); return; }
    await add({ ...form, amount: Number(form.amount) });
    toast.success(`${form.type === 'income' ? '💰' : '💸'} Transaction added`);
    setForm({ title: '', amount: '', type: 'income', description: '' });
    setShowModal(false);
  };

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back" id="btn-back-txns">
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <h1>Transactions</h1>
          <div className="subtitle">Cash flow log</div>
        </div>
      </header>

      {/* Summary bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '12px 16px', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={18} color="var(--color-income)" />
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Income</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-income)' }}>₹{totalIncome.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingDown size={18} color="var(--color-expense)" />
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Expense</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-expense)' }}>₹{totalExpense.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      <div className="scroll-area" style={{ padding: 0 }}>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💰</div>
            <div className="empty-state-text">No transactions yet. Add one!</div>
          </div>
        ) : (
          <div className="card" style={{ margin: 16 }}>
            {transactions.map((txn) => (
              <div key={txn._id} className="list-item">
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-full)',
                  background: txn.type === 'income' ? '#DCFCE7' : '#FEE2E2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {txn.type === 'income'
                    ? <TrendingUp size={16} color="var(--color-income)" />
                    : <TrendingDown size={16} color="var(--color-expense)" />
                  }
                </div>
                <div className="list-item-info">
                  <div className="list-item-name">{txn.title}</div>
                  <div className="list-item-sub">{txn.date} {txn.description && `· ${txn.description}`}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: txn.type === 'income' ? 'var(--color-income)' : 'var(--color-expense)', fontSize: '0.95rem' }}>
                    {txn.type === 'income' ? '+' : '−'}₹{txn.amount.toLocaleString('en-IN')}
                  </span>
                  <button
                    className="icon-btn"
                    style={{ width: 30, height: 30, background: '#FEE2E2', color: 'var(--color-danger)' }}
                    onClick={() => { remove(txn._id); toast.success('Transaction deleted'); }}
                    aria-label="Delete transaction"
                    id={`del-txn-${txn._id}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button id="fab-add-txn" className="fab" onClick={() => setShowModal(true)} aria-label="Add transaction">
        <Plus size={24} />
      </button>

      {/* Add Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Transaction">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Type toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {['income', 'expense'].map((t) => (
              <button
                key={t}
                id={`type-${t}`}
                className={`btn btn-sm ${form.type === t ? (t === 'income' ? 'btn-primary' : 'btn-danger') : 'btn-ghost'}`}
                onClick={() => setForm(f => ({ ...f, type: t }))}
              >
                {t === 'income' ? '💰 Income' : '💸 Expense'}
              </button>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="txn-title">Title</label>
            <input id="txn-title" className="input" placeholder="e.g. Route A collection" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="txn-amount">Amount (₹)</label>
            <input id="txn-amount" className="input" type="number" placeholder="0" inputMode="numeric" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="txn-desc">Description (optional)</label>
            <input id="txn-desc" className="input" placeholder="Notes..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
          </div>

          <button id="btn-save-txn" className="btn btn-primary btn-full" onClick={handleAdd}>
            Save Transaction
          </button>
        </div>
      </Modal>
    </div>
  );
}
