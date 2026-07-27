export function Wordmark({ size = 26 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.28, background: 'var(--grad)',
        display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800,
        fontSize: size * 0.5, boxShadow: 'var(--shadow)',
      }}>M</div>
      <span style={{ fontWeight: 800, fontSize: size * 0.72, letterSpacing: '-0.03em' }}>
        M<span style={{ color: 'var(--brand)' }}>-</span>Pamoja
      </span>
    </div>
  );
}

export function PageHeader({ title, subtitle, right }) {
  return (
    <header style={{ padding: '22px 18px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem' }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 2 }}>{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
