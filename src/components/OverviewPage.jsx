import { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api';

function OverviewPage({ state, user, onNav, onToast, onRefresh, onWithdraw, onContribute, onEditKitty }) {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    summary: { totalRaised: 0, totalContributors: 0, totalKitties: 0, netAvailable: 0 },
    categories: { contributions: 0, chama: 0, events: 0 },
    kitties: [],
    chamas: [],
    events: [],
    transactions: []
  });

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getSummary();
      setDashboardData(data);
      onToast("Dashboard Updated", "Latest data loaded");
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      onToast("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
    onRefresh();
  };

  if (loading) {
    return (
      <div className="home-scroll">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem' }}>🔄</div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { summary, categories, kitties, chamas, events, transactions } = dashboardData;

  return (
    <div className="home-scroll">
      <div className="greet-row">
        <div>
          <div className="greet-time">{getGreeting()}</div>
          <div className="greet-name">Welcome, <span>{user.name.split(" ")[0]}</span></div>
        </div>
        <button className="refresh-pill" onClick={handleRefresh} title="Refresh">
          <span style={{ display: "flex" }}>{Icons.refresh}</span>
        </button>
      </div>

      {/* Hero Card - Now Dynamic */}
      <div className="hero-card">
        <div className="hero-orb o1" /><div className="hero-orb o2" /><div className="hero-orb o3" />
        <div className="hero-inner">
          <div className="hero-top">
            <div>
              <div className="hero-lbl">Total Raised (All Categories)</div>
              <div className="hero-amount">KES {fmt(summary.totalRaised)}</div>
            </div>
            <div className="hero-avatar">{user.initials}</div>
          </div>
          <div className="hero-divider" />

          {/* Category breakdown - Dynamic */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
            {[
              ["🎯", "Contributions", categories.contributions, "rgba(255,255,255,0.18)"],
              ["🤝", "Chama Kitties", categories.chama, "rgba(255,255,255,0.18)"],
              ["🎟️", "Events", categories.events, "rgba(255,255,255,0.18)"],
            ].map(([emoji, label, val, bg]) => (
              <div key={label} style={{ background: bg, borderRadius: 10, padding: "0.45rem 0.6rem" }}>
                <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.65)", fontWeight: 600, marginBottom: 2 }}>
                  {emoji} {label}
                </div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#fff", fontFamily: "var(--mono)", letterSpacing: "-0.02em" }}>
                  KES {fmt(val)}
                </div>
              </div>
            ))}
          </div>

          <div className="hero-divider" />
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-val">{summary.totalKitties}</div>
              <div className="hero-stat-lbl">Kitties</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-val">{summary.totalContributors}</div>
              <div className="hero-stat-lbl">Contributors</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-val">KES {fmt(summary.netAvailable)}</div>
              <div className="hero-stat-lbl">Net Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* My Kitties - Now Dynamic */}
      <div className="sec-hdr">
        <span className="sec-title">My Kitties</span>
        <button className="sec-link" onClick={() => onNav("kitties")}>See all →</button>
      </div>
      <div className="kitty-scroll">
        {kitties.length === 0 ? (
          <div className="kitty-card" style={{ minWidth: 240, textAlign: "center", padding: "1.5rem", color: "var(--text3)" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🐾</div>
            <div style={{ fontSize: "0.8rem" }}>No kitties yet</div>
          </div>
        ) : kitties.slice(0, 5).map(k => (
          <div key={k.id} className="kitty-card" onClick={() => onNav(`kitty/${k.id}`)} style={{ cursor: "pointer" }}>
            <div className="kitty-tag tag-active">Active</div>
            <div className="kitty-name">{k.name}</div>
            <div className="kitty-amount">KES {fmt(k.raised)}</div>
            <div className="kitty-goal">of KES {fmt(k.goal)} goal</div>
            <div className="prog-track">
              <div className="prog-fill" style={{ width: `${Math.min(100, k.percentage)}%` }} />
            </div>
            <div className="kitty-meta">
              <span>{k.contributorCount || 0} supporters</span>
              <span className="kitty-pct">{Math.round(k.percentage)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Activity - Now Dynamic */}
      <div className="sec-hdr">
        <span className="sec-title">Live Activity</span>
        <button className="sec-link" onClick={loadDashboardData}>↻ Refresh</button>
      </div>
      <div className="feed-card">
        {transactions.length === 0 ? (
          <div className="feed-empty">Activity will appear here</div>
        ) : transactions.map(t => (
          <div key={t.id} className="feed-item">
            <div className="feed-av">{(t.name || "AN").slice(0, 2).toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="feed-name">{t.name || "Anonymous"}</div>
              <div className="feed-detail">{t.type} · {t.kitty}{t.phone ? ` · ${maskPhone(t.phone)}` : ""}</div>
            </div>
            <div className="feed-amt" style={{ color: t.type === "Contribution" ? "var(--emerald)" : "var(--amber)" }}>
              {t.type === "Contribution" ? "+" : "-"}KES {fmt(t.gross)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}