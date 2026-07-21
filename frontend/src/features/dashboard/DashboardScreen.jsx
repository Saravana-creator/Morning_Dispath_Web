import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, AlertTriangle, CheckCircle2, Clock, Circle,
  Fuel, DollarSign, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import { useRouteStore } from '../../store/routeStore';
import { useInventoryStore } from '../../store/inventoryStore';

const today = () => {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
};

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const { records: attendance, fetch: fetchAttendance } = useAttendanceStore();
  const { routes, fetch: fetchRoutes } = useRouteStore();
  const { items: inventory, fetch: fetchInventory } = useInventoryStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendance();
    fetchRoutes();
    fetchInventory();
  }, []);

  // Derived stats
  const absentCount = attendance.filter((a) => a.status === 'absent').length;
  const routesReady = routes.filter((r) => r.status === 'ready').length;
  const routesNoDp = routes.filter((r) => r.status === 'noDp').length;
  const attendanceDone = attendance.some((a) => a.status !== 'none');
  const inventoryDone = inventory.some((i) => i.delivered > 0);
  const routesDone = routesReady === routes.length && routes.length > 0;

  const workflowSteps = [
    { label: 'Mark Attendance', sub: attendanceDone ? `${attendance.filter(a=>a.status==='present').length} Present` : 'Not started', done: attendanceDone, route: '/attendance' },
    { label: 'Inventory Entry', sub: inventoryDone ? 'Delivery updated' : 'Not started', done: inventoryDone, route: '/inventory' },
    { label: 'Route Allocation', sub: `${routesReady}/${routes.length} Routes Ready`, done: routesDone, route: '/routes' },
    { label: 'Petrol Allowance', sub: 'Disburse to DPs', done: false, route: '/petrol' },
    { label: 'Dispatch Sign-off', sub: 'Final confirmation', done: false, route: null },
  ];

  const currentStep = workflowSteps.findIndex((s) => !s.done);

  return (
    <div className="page">
      {/* Header */}
      <header className="page-header">
        <div>
          <h1>Good Morning! 👋</h1>
          <div className="subtitle">{today()}</div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Notifications" id="btn-notifications">
            <Bell size={20} />
          </button>
        </div>
      </header>

      <div className="scroll-area">
        {/* Urgent Issues */}
        {(absentCount > 0 || routesNoDp > 0) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="section-title">⚠ Urgent Issues</p>
            {absentCount > 0 && (
              <div className="card card-alert">
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AlertTriangle size={18} color="var(--color-danger)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Staff Absent</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {absentCount} staff marked absent today
                    </div>
                  </div>
                </div>
              </div>
            )}
            {routesNoDp > 0 && (
              <div className="card card-alert card-alert-warning">
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AlertTriangle size={18} color="var(--color-warning)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Routes Unassigned</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {routesNoDp} routes have no delivery person
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon green"><CheckCircle2 size={18} /></div>
            <div className="stat-label">Routes Ready</div>
            <div className="stat-value green">{routesReady}/{routes.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber"><Clock size={18} /></div>
            <div className="stat-label">Staff Present</div>
            <div className="stat-value">{attendance.filter(a=>a.status==='present').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red"><AlertTriangle size={18} /></div>
            <div className="stat-label">Absent</div>
            <div className="stat-value red">{absentCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><Circle size={18} /></div>
            <div className="stat-label">Standby</div>
            <div className="stat-value">{attendance.filter(a=>a.status==='standby').length}</div>
          </div>
        </div>

        {/* Morning Workflow */}
        <div>
          <p className="section-title">Morning Workflow</p>
          <div className="card">
            {workflowSteps.map((step, i) => (
              <div
                key={step.label}
                className="workflow-step"
                style={{ cursor: step.route ? 'pointer' : 'default' }}
                onClick={() => step.route && navigate(step.route)}
                role={step.route ? 'button' : undefined}
                tabIndex={step.route ? 0 : undefined}
                id={`workflow-step-${i}`}
              >
                <div className={`step-dot ${step.done ? 'done' : i === currentStep ? 'active' : 'pending'}`}>
                  {step.done ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <div className="step-info">
                  <div className="step-name">{step.label}</div>
                  <div className="step-status">{step.sub}</div>
                </div>
                {step.route && <ChevronRight size={16} color="var(--color-text-muted)" />}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <p className="section-title">Quick Actions</p>
          <div className="quick-grid">
            <div className="quick-card" onClick={() => navigate('/petrol')} id="qa-petrol" role="button">
              <div className="quick-card-icon" style={{ background: '#DCFCE7' }}>
                <Fuel size={20} color="var(--color-primary)" />
              </div>
              <div className="quick-card-label">Petrol Allowance</div>
              <div className="quick-card-value" style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                Manage DPs
              </div>
            </div>
            <div className="quick-card" onClick={() => navigate('/salary')} id="qa-salary" role="button">
              <div className="quick-card-icon" style={{ background: '#FEF3C7' }}>
                <DollarSign size={20} color="var(--color-standby)" />
              </div>
              <div className="quick-card-label">Salary Advance</div>
              <div className="quick-card-value" style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                Give Advance
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
