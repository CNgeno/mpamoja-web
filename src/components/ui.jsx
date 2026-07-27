import { fmtKes, pct } from '../lib/format';

export function Button({ children, variant = 'primary', full, disabled, loading, ...props }) {
  const base = {
    fontWeight: 600, fontSize: '0.95rem', padding: '13px 20px',
    borderRadius: 'var(--radius-sm)', transition: 'transform 0.12s, box-shadow 0.18s, opacity 0.18s',
    width: full ? '100%' : undefined, opacity: disabled || loading ? 0.6 : 1,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  };
  const variants = {
    primary:   { background: 'var(--grad)', color: '#fff', boxShadow: 'var(--shadow)' },
    money:     { background: 'var(--grad-money)', color: '#fff', boxShadow: 'var(--shadow)' },
    ghost:     { background: 'var(--bg-tint)', color: 'var(--brand)' },
    outline:   { background: 'transparent', color: 'var(--text)', border: '1.5px solid var(--border)' },
    danger:    { background: 'transparent', color: 'var(--danger)', border: '1.5px solid var(--danger)' },
  };
  return (
    <button style={{ ...base, ...variants[variant] }} disabled={disabled || loading} {...props}>
      {loading ? 'Please wait…' : children}
    </button>
  );
}

export function Card({ children, style, ...props }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow)', padding: 18, ...style,
    }} {...props}>
      {children}
    </div>
  );
}

export function Field({ label, hint, error, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      {label && <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>{label}</div>}
      {children}
      {hint && !error && <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 5 }}>{hint}</div>}
      {error && <div style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: 5 }}>{error}</div>}
    </label>
  );
}

export function ProgressBar({ raised, goal }) {
  const p = pct(raised, goal);
  return (
    <div>
      <div style={{ height: 10, background: 'var(--bg-tint)', borderRadius: 60, overflow: 'hidden' }}>
        <div style={{ width: `${p}%`, height: '100%', background: 'var(--grad-money)', borderRadius: 60, transition: 'width 0.5s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, fontSize: '0.8rem' }}>
        <span className="amount" style={{ color: 'var(--emerald)', fontWeight: 600 }}>{fmtKes(raised)}</span>
        <span style={{ color: 'var(--muted)' }}>of <span className="amount">{fmtKes(goal)}</span> · {p}%</span>
      </div>
    </div>
  );
}

export function Banner({ kind = 'error', children }) {
  const styles = {
    error:   { bg: 'var(--danger)', tint: '#FFF5F5', fg: '#B00009' },
    success: { bg: 'var(--emerald)', tint: '#ECFDF5', fg: '#065F46' },
    info:    { bg: 'var(--brand)', tint: 'var(--bg-tint)', fg: 'var(--brand)' },
  }[kind];
  if (!children) return null;
  return (
    <div style={{
      background: styles.tint, color: styles.fg, borderLeft: `3px solid ${styles.bg}`,
      padding: '11px 14px', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem', marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
      <div style={{
        width: 28, height: 28, margin: '0 auto 12px', borderRadius: '50%',
        border: '3px solid var(--bg-tint)', borderTopColor: 'var(--brand)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {label}
    </div>
  );
}
