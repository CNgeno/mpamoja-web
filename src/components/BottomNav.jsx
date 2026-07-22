import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const items = [
  { to: '/app', label: 'Home', icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { to: '/app/new', label: 'Create', icon: 'M12 5v14M5 12h14' },
];

export function BottomNav() {
  const { logout } = useAuth();
  const nav = useNavigate();
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 'var(--maxw)', background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '10px 0 max(10px, env(safe-area-inset-bottom))', zIndex: 50,
    }}>
      {items.map((it) => (
        <NavLink key={it.to} to={it.to} end style={({ isActive }) => ({
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          fontSize: '0.68rem', fontWeight: 600, color: isActive ? 'var(--brand)' : 'var(--muted)',
        })}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={it.icon} />
          </svg>
          {it.label}
        </NavLink>
      ))}
      <button onClick={() => { logout(); nav('/'); }} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        fontSize: '0.68rem', fontWeight: 600, color: 'var(--muted)',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 17l5-5-5-5M21 12H9M12 19H5a2 2 0 01-2-2V7a2 2 0 012-2h7" />
        </svg>
        Sign out
      </button>
    </nav>
  );
}
