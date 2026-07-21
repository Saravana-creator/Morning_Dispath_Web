import { useEffect } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePosStore } from '../../store/posStore';
import Stepper from '../../core/components/Stepper';

export default function PosScreen() {
  const { items, loading, fetch, adjustQty, checkout, getTotal } = usePosStore();
  const navigate = useNavigate();

  useEffect(() => { fetch(); }, []);

  const total = getTotal();

  const handleCheckout = async () => {
    if (total === 0) { toast.error('Add items to checkout'); return; }
    await checkout();
    toast.success(`✅ Sale of ₹${total.toLocaleString('en-IN')} completed!`);
  };

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back" id="btn-back-pos">
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <h1>Point of Sale</h1>
          <div className="subtitle">Counter / walk-in sales</div>
        </div>
        <div className="header-actions">
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)', padding: '4px 12px', color: 'white', fontSize: '0.78rem', fontWeight: 700 }}>
            <ShoppingCart size={12} style={{ display: 'inline', marginRight: 4 }} />
            {items.filter(i=>i.quantity>0).length} items
          </div>
        </div>
      </header>

      <div className="scroll-area" style={{ paddingBottom: 0 }}>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="card">
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div className="card-title" style={{ fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-primary)', fontSize: '1rem', marginTop: 4 }}>
                    ₹{item.price}
                    {item.quantity > 0 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 400, marginLeft: 6 }}>
                        = ₹{item.price * item.quantity}
                      </span>
                    )}
                  </div>
                </div>
                <Stepper
                  value={item.quantity}
                  onDecrement={() => adjustQty(item._id, -1)}
                  onIncrement={() => adjustQty(item._id, 1)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sticky checkout bar */}
      <div className="pos-bottom-bar">
        <div>
          <div className="pos-total-label">Total Amount</div>
          <div className="pos-total-amount">₹{total.toLocaleString('en-IN')}</div>
        </div>
        <button
          id="btn-checkout"
          className="btn btn-primary"
          onClick={handleCheckout}
          disabled={total === 0}
          style={{ minWidth: 130 }}
        >
          <ShoppingCart size={16} />
          Checkout
        </button>
      </div>
    </div>
  );
}
