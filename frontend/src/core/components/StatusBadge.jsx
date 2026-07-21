const STATUS_MAP = {
  present: 'Present',
  absent:  'Absent',
  standby: 'Standby',
  none:    'Not Marked',
  ready:   'Ready',
  waiting: 'Waiting',
  noDp:    'No DP',
  income:  'Income',
  expense: 'Expense',
  active:  'Active',
  inactive:'Inactive',
  paid:    'Paid',
  unpaid:  'Unpaid',
};

export default function StatusBadge({ status, label, className = '' }) {
  const text = label || STATUS_MAP[status] || status;
  return (
    <span className={`badge badge-${status} ${className}`} role="status">
      {text}
    </span>
  );
}
