import { useEffect } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAttendanceStore } from '../../store/attendanceStore';
import StatusBadge from '../../core/components/StatusBadge';

const FILTERS = ['all', 'present', 'standby', 'absent'];
const STATUSES = ['present', 'absent', 'standby'];

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function AttendanceScreen() {
  const { records, filter, loading, fetch, updateStatus, setFilter, getFiltered } = useAttendanceStore();

  useEffect(() => { fetch(); }, []);

  const filtered = getFiltered(records, filter);

  const handleStatusChange = async (staffId, newStatus, name) => {
    await updateStatus(staffId, newStatus);
    const label = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    toast.success(`${name} marked as ${label}`);
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Attendance</h1>
          <div className="subtitle">Mark today's staff attendance</div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Search" id="btn-search-attendance">
            <Search size={20} />
          </button>
        </div>
      </header>

      {/* Filter chips */}
      <div className="filter-bar" role="group" aria-label="Filter attendance">
        {FILTERS.map((f) => (
          <button
            key={f}
            id={`filter-${f}`}
            className={`chip${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span style={{ fontWeight: 700 }}>
                ({records.filter((r) => r.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="scroll-area" style={{ padding: 0 }}>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-text">No staff found</div>
          </div>
        ) : (
          <div className="card" style={{ margin: 16, borderRadius: 'var(--radius-lg)' }}>
            {filtered.map((record) => (
              <div key={record.staffId} className="list-item">
                {/* Avatar */}
                <div
                  className="avatar"
                  style={{
                    background: record.status === 'absent'
                      ? 'linear-gradient(135deg,#DC2626,#EF4444)'
                      : record.status === 'standby'
                      ? 'linear-gradient(135deg,#D97706,#F59E0B)'
                      : 'var(--gradient-primary)',
                  }}
                >
                  {getInitials(record.staffName)}
                </div>

                {/* Info */}
                <div className="list-item-info">
                  <div className="list-item-name">{record.staffName}</div>
                  <div className="list-item-sub">{record.role}</div>
                </div>

                {/* Status toggles */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      id={`att-${record.staffId}-${s}`}
                      onClick={() => handleStatusChange(record.staffId, s, record.staffName)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        border: '1.5px solid',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        borderColor:
                          s === 'present' ? 'var(--color-present)' :
                          s === 'absent'  ? 'var(--color-absent)'  : 'var(--color-standby)',
                        background: record.status === s
                          ? s === 'present' ? '#DCFCE7'
                          : s === 'absent'  ? '#FEE2E2' : '#FEF3C7'
                          : 'transparent',
                        color:
                          s === 'present' ? 'var(--color-present)' :
                          s === 'absent'  ? 'var(--color-absent)'  : 'var(--color-standby)',
                        opacity: record.status !== s ? 0.5 : 1,
                      }}
                    >
                      {s === 'present' ? 'P' : s === 'absent' ? 'A' : 'S'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
