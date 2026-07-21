import { useEffect } from 'react';
import { useInventoryStore } from '../../store/inventoryStore';
import Stepper from '../../core/components/Stepper';

export default function InventoryScreen() {
  const { items, loading, fetch, step } = useInventoryStore();

  useEffect(() => { fetch(); }, []);

  const remaining = (item) => item.received - item.delivered - item.damaged - item.leaked;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Inventory Entry</h1>
          <div className="subtitle">Load reconciliation — received vs delivered</div>
        </div>
      </header>

      <div className="scroll-area">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          items.map((item) => {
            const rem = remaining(item);
            return (
              <div key={item._id} className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">{item.name}</div>
                    <div className="card-subtitle">Received: <strong>{item.received}</strong> units</div>
                  </div>
                  <div style={{
                    textAlign: 'right',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: rem < 0 ? '#FEE2E2' : '#DCFCE7',
                  }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 600, color: rem < 0 ? 'var(--color-absent)' : 'var(--color-present)' }}>
                      Remaining
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: rem < 0 ? 'var(--color-absent)' : 'var(--color-primary)',
                      lineHeight: 1.2,
                    }}>
                      {rem}
                    </div>
                  </div>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { field: 'delivered', label: '📦 Delivered', value: item.delivered },
                    { field: 'damaged',   label: '💔 Damaged',   value: item.damaged },
                    { field: 'leaked',    label: '💧 Leaked',    value: item.leaked },
                  ].map(({ field, label, value }) => (
                    <div key={field} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                        {label}
                      </span>
                      <Stepper
                        value={value}
                        onDecrement={() => value > 0 && step(item._id, field, -1)}
                        onIncrement={() => step(item._id, field, 1)}
                        min={0}
                        max={item.received}
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
