// Brand Color Palette — Maram Manager
export const colors = {
  primary:       '#1A7A3C',
  primaryLight:  '#23A455',
  primaryDark:   '#0F5429',
  accent:        '#F0A500',
  accentLight:   '#FFD166',

  // Backgrounds
  bg:            '#F0F4F0',
  surface:       '#FFFFFF',
  surface2:      '#F6FDF8',
  border:        '#E2EDE6',

  // Status
  present:  '#16A34A',
  absent:   '#DC2626',
  standby:  '#D97706',
  info:     '#2563EB',
  success:  '#16A34A',
  warning:  '#D97706',
  danger:   '#DC2626',
  income:   '#16A34A',
  expense:  '#DC2626',

  // Text
  textPrimary:   '#0F2417',
  textSecondary: '#4A6757',
  textMuted:     '#8BA898',
  textOnDark:    '#FFFFFF',
};

export const gradients = {
  bg:      'linear-gradient(135deg, #0F5429 0%, #1A7A3C 40%, #0E7060 75%, #F0F4F0 100%)',
  primary: 'linear-gradient(135deg, #1A7A3C, #23A455)',
  header:  'linear-gradient(135deg, #0F5429 0%, #1A7A3C 100%)',
  accent:  'linear-gradient(135deg, #F0A500, #FFD166)',
};

export const statusColors = {
  present: { bg: '#DCFCE7', text: '#15803D' },
  absent:  { bg: '#FEE2E2', text: '#B91C1C' },
  standby: { bg: '#FEF3C7', text: '#B45309' },
  none:    { bg: '#F3F4F6', text: '#6B7280' },
  ready:   { bg: '#DCFCE7', text: '#15803D' },
  waiting: { bg: '#FEF3C7', text: '#B45309' },
  noDp:    { bg: '#FEE2E2', text: '#B91C1C' },
  income:  { bg: '#DCFCE7', text: '#15803D' },
  expense: { bg: '#FEE2E2', text: '#B91C1C' },
};
