// KES formatting. Backend sends decimal shillings (already /100 in API responses).
export const fmtKes = (n) =>
  `KES ${Number(n ?? 0).toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

export const fmtKesFull = (n) =>
  `KES ${Number(n ?? 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const pct = (raised, goal) =>
  goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

export const timeAgo = (iso) => {
  if (!iso) return '';
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

// Kenyan phone display: +254712345678 → 0712 345 678
export const fmtPhone = (p) => {
  if (!p) return '';
  const local = p.replace('+254', '0').replace(/\D/g, '');
  return local.length === 10 ? `${local.slice(0,4)} ${local.slice(4,7)} ${local.slice(7)}` : p;
};
