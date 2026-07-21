import { useEffect, useState } from 'react';
import { Users, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouteStore } from '../../store/routeStore';
import { useStaffStore } from '../../store/staffStore';
import StatusBadge from '../../core/components/StatusBadge';
import Modal from '../../core/components/Modal';

export default function RoutesScreen() {
  const { routes, loading, fetch: fetchRoutes, assignDp } = useRouteStore();
  const { staff, fetch: fetchStaff } = useStaffStore();
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    fetchRoutes();
    fetchStaff();
  }, []);

  const handleAssign = async (routeId, dpId) => {
    const dp = staff.find((s) => s._id === dpId);
    await assignDp(routeId, dpId);
    toast.success(dp ? `Route assigned to ${dp.name}` : 'DP removed from route');
    setSelectedRoute(null);
  };

  const deliveryPersons = staff.filter((s) => s.role === 'Delivery Person' && s.isActive);

  const getStatusStyle = (status) => {
    if (status === 'ready')   return { borderLeft: '4px solid var(--color-present)' };
    if (status === 'waiting') return { borderLeft: '4px solid var(--color-standby)' };
    return { borderLeft: '4px solid var(--color-absent)' };
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Routes & Allocation</h1>
          <div className="subtitle">Assign delivery persons to routes</div>
        </div>
        <div className="header-actions">
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.78rem',
            color: 'white',
            fontWeight: 600,
          }}>
            <UserCheck size={14} />
            {routes.filter(r => r.status === 'ready').length}/{routes.length} Ready
          </div>
        </div>
      </header>

      <div className="scroll-area">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          routes.map((route) => (
            <div key={route._id} className="card" style={getStatusStyle(route.status)}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div className="card-title">{route.name}</div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                        👤 {route.totalCustomers} customers
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                        🧴 {route.totalBottles} bottles
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={route.status} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {route.assignedDpName
                      ? <><strong style={{ color: 'var(--color-primary)' }}>{route.assignedDpName}</strong> assigned</>
                      : <span style={{ color: 'var(--color-absent)' }}>No DP assigned</span>
                    }
                  </div>
                  <button
                    id={`assign-btn-${route._id}`}
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedRoute(route)}
                  >
                    <Users size={14} />
                    {route.assignedDpId ? 'Re-assign' : 'Assign DP'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign DP Modal */}
      <Modal isOpen={!!selectedRoute} onClose={() => setSelectedRoute(null)} title={`Assign DP — ${selectedRoute?.name}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Unassign option */}
          {selectedRoute?.assignedDpId && (
            <button
              id="unassign-dp"
              className="btn btn-ghost btn-full"
              style={{ justifyContent: 'flex-start' }}
              onClick={() => handleAssign(selectedRoute._id, null)}
            >
              ✕ Remove Current DP
            </button>
          )}

          {deliveryPersons.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <div className="empty-state-text">No active delivery persons available</div>
            </div>
          ) : (
            deliveryPersons.map((dp) => (
              <button
                key={dp._id}
                id={`dp-option-${dp._id}`}
                className="btn btn-ghost btn-full"
                style={{
                  justifyContent: 'flex-start',
                  gap: 12,
                  borderColor: selectedRoute?.assignedDpId === dp._id ? 'var(--color-primary)' : undefined,
                  background: selectedRoute?.assignedDpId === dp._id ? '#F0FBF4' : undefined,
                }}
                onClick={() => handleAssign(selectedRoute._id, dp._id)}
              >
                <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
                  {dp.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{dp.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{dp.phone}</div>
                </div>
                {selectedRoute?.assignedDpId === dp._id && (
                  <span style={{ marginLeft: 'auto', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600 }}>Current</span>
                )}
              </button>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
