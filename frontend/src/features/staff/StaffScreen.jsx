import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStaffStore } from '../../store/staffStore';
import Modal from '../../core/components/Modal';

export default function StaffScreen() {
  const { staff, loading, fetch, add, toggle } = useStaffStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'Delivery Person', phone: '' });

  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if (!form.name || !form.phone) { toast.error('Name and phone required'); return; }
    await add(form);
    toast.success(`${form.name} added to staff 🎉`);
    setForm({ name: '', role: 'Delivery Person', phone: '' });
    setShowModal(false);
  };

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back" id="btn-back-staff">
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <h1>Staff Management</h1>
          <div className="subtitle">{staff.filter(s=>s.isActive).length} Active members</div>
        </div>
      </header>

      <div className="scroll-area" style={{ padding: 0 }}>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className="card" style={{ margin: 16 }}>
            {staff.map((member) => (
              <div key={member._id} className="list-item">
                <div className="avatar" style={{
                  background: member.isActive
                    ? 'var(--gradient-primary)'
                    : 'linear-gradient(135deg,#9CA3AF,#D1D5DB)',
                }}>
                  {member.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                </div>
                <div className="list-item-info">
                  <div className="list-item-name">{member.name}</div>
                  <div className="list-item-sub">
                    {member.role} &nbsp;·&nbsp;
                    <Phone size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {member.phone}
                  </div>
                </div>
                <button
                  id={`toggle-${member._id}`}
                  className={`btn btn-sm ${member.isActive ? 'btn-ghost' : 'btn-outline'}`}
                  style={{ fontSize: '0.7rem', minHeight: 32, padding: '4px 10px' }}
                  onClick={() => {
                    toggle(member._id, member.isActive);
                    toast.success(`${member.name} ${member.isActive ? 'deactivated' : 'activated'}`);
                  }}
                >
                  {member.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button id="fab-add-staff" className="fab" onClick={() => setShowModal(true)} aria-label="Add staff">
        <Plus size={24} />
      </button>

      {/* Add Staff Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Staff">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="staff-name">Full Name</label>
            <input id="staff-name" className="input" placeholder="e.g. Ramu Kumar" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="staff-role">Role</label>
            <select id="staff-role" className="input" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
              <option>Delivery Person</option>
              <option>Loader</option>
              <option>Helper</option>
              <option>Supervisor</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="staff-phone">Phone</label>
            <input id="staff-phone" className="input" type="tel" inputMode="numeric" placeholder="10-digit number" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
          </div>
          <button id="btn-save-staff" className="btn btn-primary btn-full" onClick={handleAdd}>
            Add Staff Member
          </button>
        </div>
      </Modal>
    </div>
  );
}
