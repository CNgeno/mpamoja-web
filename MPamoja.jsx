import React from "react";
// mpamoja.jsx - add this import
import { kittyApi, authApi, publicApi, withdrawalApi, tokenStore } from './src/api/client';
import { useState, useEffect, useRef, useCallback } from "react";
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const BASE = '';
// ─── CSS-in-JS styles injected once ───
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
:root{
  --ink:#0D0F14;--ink2:#1A1D26;--ink3:#252833;
  --surface:#FFFFFF;--surface2:#F5F6FA;--surface3:#ECEEF5;
  --border:#E2E4EE;--border2:rgba(0,0,0,0.06);
  --text:#0D0F14;--text2:#4B5066;--text3:#8C90A6;
  --brand:#4F46E5;--brand-light:#EEF0FF;--brand-mid:#818CF8;
  --emerald:#10B981;--emerald-light:#ECFDF5;
  --amber:#F59E0B;--amber-light:#FFFBEB;
  --rose:#F43F5E;--rose-light:#FFF1F3;
  --violet:#7C3AED;--violet-light:#F5F3FF;
  --sky:#0EA5E9;--sky-light:#F0F9FF;
  --grad:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);
  --grad2:linear-gradient(135deg,#10B981 0%,#059669 100%);
  --grad3:linear-gradient(135deg,#F59E0B 0%,#D97706 100%);
  --grad-chama:linear-gradient(135deg,#7C3AED 0%,#EC4899 100%);
  --grad-events:linear-gradient(135deg,#0EA5E9 0%,#6366F1 100%);
  --shadow-sm:0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04);
  --shadow:0 4px 16px rgba(0,0,0,0.08),0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg:0 20px 60px rgba(0,0,0,0.12),0 8px 16px rgba(0,0,0,0.06);
  --shadow-brand:0 8px 32px rgba(79,70,229,0.28);
  --radius:20px;--radius-sm:12px;--radius-xs:8px;
  --font:'Sora',system-ui,sans-serif;--mono:'DM Mono',monospace;
  --nav-h:72px;--header-h:60px;
  --orb-clearance:calc(var(--nav-h) + 88px); /* nav + orb height + breathing room */
}
html{font-size:16px}
body{font-family:var(--font);background:var(--surface2);color:var(--text);min-height:100vh;overflow-x:hidden}

/* AUTH */
.auth-bg{
  flex:1;display:flex;align-items:center;justify-content:center;
  min-height:100vh;padding:1.5rem;
  background:linear-gradient(160deg,#F0F1FF 0%,#F5F6FA 40%,#EFF8F4 100%);
  position:relative;overflow:hidden;
}
.auth-blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:0.45;pointer-events:none}
.auth-blob.b1{width:300px;height:300px;background:#C7D2FE;top:-80px;left:-60px}
.auth-blob.b2{width:250px;height:250px;background:#A7F3D0;bottom:-60px;right:-40px}
.auth-blob.b3{width:180px;height:180px;background:#FDE68A;bottom:100px;left:30px;opacity:0.3}
.auth-card{
  background:var(--surface);border-radius:28px;padding:2rem 1.75rem;
  width:100%;max-width:420px;position:relative;z-index:1;
  box-shadow:var(--shadow-lg);border:1px solid rgba(255,255,255,0.8);
}
.auth-logo{display:flex;align-items:center;gap:0.9rem;margin-bottom:1.75rem;justify-content:center}
.logo-icon{
  width:48px;height:48px;background:var(--grad);border-radius:16px;
  display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-brand);flex-shrink:0;
}
.logo-text{font-weight:800;font-size:1.5rem;letter-spacing:-0.03em;color:var(--text)}
.logo-text span{color:var(--brand)}
.logo-sub{font-size:0.6rem;font-weight:600;letter-spacing:0.12em;color:var(--text3);text-transform:uppercase;margin-top:1px}
.auth-welcome{font-size:1.25rem;font-weight:700;margin-bottom:0.3rem;letter-spacing:-0.02em}
.auth-sub{font-size:0.82rem;color:var(--text2);margin-bottom:1.5rem}
.auth-tabs{display:flex;background:var(--surface2);border-radius:60px;padding:4px;margin-bottom:1.5rem;border:1px solid var(--border)}
.auth-tab{flex:1;padding:0.55rem;border:none;border-radius:60px;font-family:var(--font);font-weight:600;font-size:0.82rem;cursor:pointer;background:transparent;color:var(--text3);transition:all 0.22s}
.auth-tab.active{background:var(--surface);color:var(--brand);box-shadow:var(--shadow-sm)}
.field{margin-bottom:1.1rem}
.field label{display:block;font-size:0.72rem;font-weight:600;color:var(--text2);margin-bottom:0.4rem;letter-spacing:0.01em}
.field input,.field select{width:100%;background:var(--surface2);border:1.5px solid var(--border);border-radius:var(--radius-sm);padding:0.72rem 0.9rem;color:var(--text);font-family:var(--font);font-size:0.88rem;outline:none;transition:border-color 0.18s,box-shadow 0.18s}
.field input:focus,.field select:focus{border-color:var(--brand);box-shadow:0 0 0 3px rgba(79,70,229,0.1)}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
.auth-btn{width:100%;padding:0.82rem;background:var(--grad);border:none;border-radius:60px;font-family:var(--font);font-weight:700;font-size:0.9rem;color:#fff;cursor:pointer;transition:all 0.2s;margin-top:0.3rem;box-shadow:var(--shadow-brand);letter-spacing:-0.01em}
.auth-btn:hover{transform:translateY(-1px);box-shadow:0 12px 40px rgba(79,70,229,0.36)}
.demo-hint{text-align:center;margin-top:1rem;font-size:0.73rem;color:var(--text3);background:var(--surface2);border-radius:var(--radius-xs);padding:0.6rem;border:1px solid var(--border)}
.demo-hint strong{color:var(--brand)}
.auth-msg{font-size:0.78rem;margin-bottom:1rem;padding:0.65rem 0.9rem;border-radius:var(--radius-xs);background:var(--rose-light);color:var(--rose);border:1px solid rgba(244,63,94,0.2)}

/* SHELL */
.dash{background:var(--surface2);min-height:100vh}
.mob-header{
  position:fixed;top:0;left:0;right:0;height:var(--header-h);
  background:rgba(255,255,255,0.97);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border2);z-index:500;
  display:flex;align-items:center;padding:0 0.75rem;gap:0.5rem;
}
.mh-left{display:flex;align-items:center;gap:0.5rem;flex-shrink:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mh-logo{width:36px;height:36px;border-radius:11px;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.12)}
.mh-logo img,.mh-logo svg{width:100%;height:100%;object-fit:contain}
.mh-brand{font-weight:800;font-size:0.95rem;letter-spacing:-0.03em;color:var(--text);white-space:nowrap}
.mh-brand span{color:var(--brand)}
.mh-center{flex:1;overflow:hidden;margin:0 0.4rem;position:relative}
.mh-center::before,.mh-center::after{content:"";position:absolute;top:0;bottom:0;width:20px;z-index:1;pointer-events:none}
.mh-center::before{left:0;background:linear-gradient(to right,rgba(255,255,255,0.97),transparent)}
.mh-center::after{right:0;background:linear-gradient(to left,rgba(255,255,255,0.97),transparent)}
.marquee-track{display:flex;align-items:center;white-space:nowrap;animation:marqueeScroll 18s linear infinite}
.marquee-track:hover{animation-play-state:paused}
.marquee-inner{display:flex;align-items:center;gap:0;padding-right:0}
.marquee-item{display:inline-flex;align-items:center;gap:0.5rem;padding:0 1.2rem}
.marquee-text{font-size:0.7rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.marquee-dot{width:4px;height:4px;border-radius:50%;background:var(--brand-mid);flex-shrink:0;opacity:0.6}
.marquee-star{font-size:0.65rem;opacity:0.5}
.mh-right{display:flex;align-items:center;gap:0.4rem;flex-shrink:0}
.mh-notif{width:34px;height:34px;border-radius:50%;background:var(--brand-light);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative}
.notif-dot{position:absolute;top:6px;right:6px;width:7px;height:7px;background:var(--rose);border-radius:50%;border:2px solid var(--surface)}
.mh-avatar{width:34px;height:34px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;color:#fff;cursor:pointer;border:2px solid var(--brand-light)}
.main-content{padding-top:var(--header-h);padding-bottom:var(--orb-clearance);min-height:100vh}
@keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* BOTTOM NAV */
@keyframes bnPop{0%{transform:scale(0.8) translateY(4px)}60%{transform:scale(1.12) translateY(-2px)}100%{transform:scale(1) translateY(0)}}
.bottom-nav{
  position:fixed;bottom:0;left:0;right:0;height:var(--nav-h);
  background:#fff;
  border-top:2px solid var(--border);
  display:flex;align-items:center;padding:0 0.25rem;z-index:500;
  box-shadow:0 -4px 24px rgba(0,0,0,0.1);
}
.bn-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:none;background:transparent;cursor:pointer;padding:0.5rem 0;transition:all 0.18s;font-family:var(--font);position:relative}
.bn-icon{width:42px;height:36px;border-radius:13px;display:flex;align-items:center;justify-content:center;transition:all 0.22s}
.bn-icon svg{width:22px;height:22px;fill:none;stroke:#9CA3AF;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;transition:all 0.22s}
.bn-label{font-size:0.62rem;font-weight:700;color:#9CA3AF;transition:all 0.22s;letter-spacing:0.01em}

.bn-item.active .bn-icon{background:var(--brand-light);animation:bnPop 0.32s cubic-bezier(0.34,1.56,0.64,1)}
.bn-item.active .bn-icon svg{stroke:var(--brand);stroke-width:2.4}
.bn-item.active .bn-label{color:var(--brand);font-weight:800}

.bn-item.active-chama .bn-icon{background:var(--violet-light);animation:bnPop 0.32s cubic-bezier(0.34,1.56,0.64,1)}
.bn-item.active-chama .bn-icon svg{stroke:var(--violet);stroke-width:2.4}
.bn-item.active-chama .bn-label{color:var(--violet);font-weight:800}

.bn-item.active-events .bn-icon{background:var(--sky-light);animation:bnPop 0.32s cubic-bezier(0.34,1.56,0.64,1)}
.bn-item.active-events .bn-icon svg{stroke:var(--sky);stroke-width:2.4}
.bn-item.active-events .bn-label{color:var(--sky);font-weight:800}

.bn-item:not(.active):not(.active-chama):not(.active-events):hover .bn-icon svg{stroke:#6B7280}
.bn-item:not(.active):not(.active-chama):not(.active-events):hover .bn-label{color:#6B7280}

.bn-fab{width:52px;height:52px;background:var(--grad);border-radius:16px;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-brand);margin-top:-8px;border:none;cursor:pointer;flex-shrink:0;transition:all 0.2s}
.bn-fab svg{width:22px;height:22px;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.bn-fab:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(79,70,229,0.4)}

/* ══════════════════════════════════════════
   PORTAL ORB — morphing home navigator
   ══════════════════════════════════════════ */
@keyframes orbFloat{
  0%,100%{transform:translateY(0px) rotate(0deg)}
  33%{transform:translateY(-6px) rotate(2deg)}
  66%{transform:translateY(3px) rotate(-1.5deg)}
}
@keyframes auroraShift{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@keyframes ringPulse{
  0%{transform:translate(-50%,-50%) scale(1);opacity:0.7}
  100%{transform:translate(-50%,-50%) scale(2.4);opacity:0}
}
@keyframes heroFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(10px, -15px) scale(1.05); }
  66% { transform: translate(-5px, 10px) scale(0.95); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
@keyframes ringPulse2{
  0%{transform:translate(-50%,-50%) scale(1);opacity:0.5}
  100%{transform:translate(-50%,-50%) scale(2.0);opacity:0}
}
@keyframes orbEntrance{
  0%{opacity:0;transform:scale(0) rotate(-180deg)}
  60%{transform:scale(1.15) rotate(8deg)}
  80%{transform:scale(0.94) rotate(-3deg)}
  100%{opacity:1;transform:scale(1) rotate(0deg)}
}
@keyframes orbExit{
  0%{opacity:1;transform:scale(1)}
  100%{opacity:0;transform:scale(0) rotate(90deg)}
}
@keyframes labelOrbit{
  0%{transform:translateX(-50%) translateY(0px)}
  50%{transform:translateX(-50%) translateY(-3px)}
  100%{transform:translateX(-50%) translateY(0px)}
}
@keyframes warpRipple{
  0%{transform:translate(-50%,-50%) scale(0);opacity:1;border-width:3px}
  100%{transform:translate(-50%,-50%) scale(5);opacity:0;border-width:1px}
}
@keyframes iconSpin{
  0%{transform:rotate(0deg) scale(1)}
  50%{transform:rotate(-20deg) scale(1.2)}
  100%{transform:rotate(0deg) scale(1)}
}
@keyframes glowBreath{
  0%,100%{filter:blur(14px);opacity:0.5}
  50%{filter:blur(22px);opacity:0.85}
}
@keyframes particleFly{
  0%{transform:translate(0,0) scale(1);opacity:1}
  100%{transform:translate(var(--px),var(--py)) scale(0);opacity:0}
}

/* The orb container — fixed floating bottom-right */
.portal-orb-wrap{
  position:fixed;
  bottom:calc(var(--nav-h) + 16px);
  right:16px;
  z-index:600;
  animation:orbEntrance 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards;
}
.portal-orb-wrap.exiting{
  animation:orbExit 0.35s ease-in forwards;
}

/* Glow halo behind orb */
.portal-glow{
  position:absolute;
  width:56px;height:56px;
  top:50%;left:50%;
  transform:translate(-50%,-50%);
  border-radius:50%;
  background:linear-gradient(135deg,#4F46E5,#7C3AED,#EC4899,#10B981);
  background-size:300% 300%;
  animation:auroraShift 3s ease infinite,glowBreath 2.5s ease-in-out infinite;
  pointer-events:none;
}

/* Pulse rings */
.portal-ring{
  position:absolute;
  width:56px;height:56px;
  top:50%;left:50%;
  border-radius:50%;
  border:2px solid rgba(79,70,229,0.6);
  animation:ringPulse 2.2s ease-out infinite;
  pointer-events:none;
}
.portal-ring2{
  position:absolute;
  width:56px;height:56px;
  top:50%;left:50%;
  border-radius:50%;
  border:2px solid rgba(124,58,237,0.45);
  animation:ringPulse2 2.2s ease-out 0.7s infinite;
  pointer-events:none;
}

/* The actual tappable orb */
.portal-orb{
  position:relative;
  width:56px;height:56px;
  border-radius:50%;
  border:none;cursor:pointer;
  background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 45%,#EC4899 100%);
  background-size:200% 200%;
  animation:auroraShift 3s ease infinite, orbFloat 4s ease-in-out infinite;
  box-shadow:
    0 8px 32px rgba(79,70,229,0.55),
    0 2px 8px rgba(0,0,0,0.2),
    inset 0 1px 0 rgba(255,255,255,0.3);
  display:flex;align-items:center;justify-content:center;
  transition:transform 0.15s,box-shadow 0.15s;
  overflow:visible;
}
.portal-orb::before{
  content:'';
  position:absolute;inset:3px;
  border-radius:50%;
  background:linear-gradient(135deg,rgba(255,255,255,0.25) 0%,transparent 60%);
  pointer-events:none;
}
.portal-orb:active{
  transform:scale(0.88)!important;
  box-shadow:0 4px 16px rgba(79,70,229,0.4);
}
.portal-orb:hover{
  box-shadow:
    0 12px 48px rgba(79,70,229,0.7),
    0 4px 12px rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.35);
}
.portal-orb:hover .portal-orb-icon{animation:iconSpin 0.5s ease}
.portal-orb-icon{
  width:22px;height:22px;
  fill:none;stroke:#fff;stroke-width:2.1;
  stroke-linecap:round;stroke-linejoin:round;
  filter:drop-shadow(0 1px 3px rgba(0,0,0,0.3));
  position:relative;z-index:1;
}

/* Warp ripple — injected on click via state */
.portal-warp-ripple{
  position:absolute;
  width:56px;height:56px;
  top:50%;left:50%;
  border-radius:50%;
  border:3px solid rgba(255,255,255,0.9);
  animation:warpRipple 0.55s ease-out forwards;
  pointer-events:none;
}

/* Floating label beneath orb */
.portal-label{
  position:absolute;
  bottom:-28px;
  left:50%;
  transform:translateX(-50%);
  white-space:nowrap;
  background:rgba(13,15,20,0.82);
  color:#fff;
  font-size:0.58rem;
  font-weight:700;
  letter-spacing:0.08em;
  text-transform:uppercase;
  padding:3px 9px;
  border-radius:60px;
  backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,0.12);
  animation:labelOrbit 3s ease-in-out infinite;
  pointer-events:none;
  box-shadow:0 2px 8px rgba(0,0,0,0.25);
}

/* Particle burst container */
.portal-particles{
  position:absolute;
  width:0;height:0;
  top:50%;left:50%;
  pointer-events:none;
}
.portal-particle{
  position:absolute;
  width:5px;height:5px;
  border-radius:50%;
  background:var(--c,#fff);
  animation:particleFly 0.5s ease-out forwards;
}

/* ── Report Preview Modal ── */
@keyframes reportSlideUp{from{opacity:0;transform:translateY(40px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
.report-modal-overlay{position:fixed;inset:0;background:rgba(10,15,30,0.75);backdrop-filter:blur(6px);z-index:800;display:flex;flex-direction:column;align-items:stretch}
.report-modal-sheet{background:#fff;border-radius:24px 24px 0 0;display:flex;flex-direction:column;flex:1;margin-top:40px;overflow:hidden;animation:reportSlideUp 0.35s cubic-bezier(0.34,1.3,0.64,1)}
.report-modal-bar{display:flex;align-items:center;gap:0.75rem;padding:0.85rem 1rem 0.7rem;border-bottom:1.5px solid var(--border);flex-shrink:0;background:#fff}
.report-modal-title{flex:1;font-size:0.82rem;font-weight:800;color:var(--text);letter-spacing:-0.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.report-modal-close{width:32px;height:32px;border-radius:50%;border:1.5px solid var(--border);background:var(--surface2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:var(--text2);flex-shrink:0;font-family:var(--font)}
.report-modal-iframe{flex:1;border:none;width:100%;background:#f9fafb}
.report-modal-actions{display:flex;gap:0.5rem;padding:0.75rem 1rem;border-top:1.5px solid var(--border);background:#fff;flex-shrink:0}
.rma-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:1.5px solid var(--border);border-radius:14px;padding:0.6rem 0.4rem;cursor:pointer;background:var(--surface2);font-family:var(--font);transition:all 0.18s}
.rma-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.08)}
.rma-btn-icon{font-size:1.15rem;line-height:1}
.rma-btn-label{font-size:0.6rem;font-weight:700;color:var(--text2);letter-spacing:0.02em;text-transform:uppercase}
.rma-btn.primary{background:var(--grad);border-color:transparent}
.rma-btn.primary .rma-btn-label{color:rgba(255,255,255,0.85)}
.rma-excel-wrap{flex:1;overflow:auto;background:#f9fafb;padding:1rem}
.rma-excel-table{width:100%;border-collapse:collapse;font-size:12px;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.07)}
.rma-excel-table th{background:#217346;color:#fff;padding:8px 10px;text-align:left;font-weight:700;font-size:11px;letter-spacing:0.03em}
.rma-excel-table td{padding:6px 10px;border-bottom:1px solid #e5e7eb;color:#374151}
.rma-excel-table tr:nth-child(even) td{background:#f0faf4}
.rma-excel-table tr:hover td{background:#d1fae5}

/* HOME */
.home-scroll{padding:1rem 1rem 0.5rem;padding-bottom:var(--orb-clearance)}
.greet-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.1rem}
.greet-time{font-size:0.75rem;font-weight:600;color:var(--text3);letter-spacing:0.02em}
.greet-name{font-size:1.35rem;font-weight:800;letter-spacing:-0.03em;line-height:1.15;margin-top:2px}
.greet-name span{color:var(--brand)}
.refresh-pill{width:36px;height:36px;background:var(--surface);border-radius:50%;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-sm)}
.refresh-pill svg{width:16px;height:16px;stroke:var(--text2);fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;transition:transform 0.4s}
.refresh-pill:hover svg{transform:rotate(180deg)}
.hero-card{background:var(--grad);border-radius:24px;padding:1.4rem 1.4rem 1.2rem;margin-bottom:1rem;position:relative;overflow:hidden;box-shadow:var(--shadow-brand)}
.hero-orb{position:absolute;border-radius:50%;background:rgba(255,255,255,0.07)}
.hero-orb.o1{width:180px;height:180px;top:-60px;right:-40px}
.hero-orb.o2{width:100px;height:100px;bottom:-30px;left:20px}
.hero-orb.o3{width:60px;height:60px;top:20px;left:60px;background:rgba(255,255,255,0.05)}
.hero-inner{position:relative;z-index:1}
.hero-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.1rem}
.hero-lbl{font-size:0.7rem;font-weight:600;color:rgba(255,255,255,0.65);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px}
.hero-amount{font-size:2rem;font-weight:800;color:#fff;letter-spacing:-0.04em;line-height:1;font-family:var(--mono)}
.hero-avatar{width:44px;height:44px;background:rgba(255,255,255,0.15);border-radius:14px;display:flex;align-items:center;justify-content:center;border:1.5px solid rgba(255,255,255,0.25);font-weight:800;font-size:0.85rem;color:#fff;backdrop-filter:blur(4px);flex-shrink:0}
.hero-divider{height:1px;background:rgba(255,255,255,0.15);margin-bottom:1rem}
.hero-stats{display:flex;gap:0}
.hero-stat{flex:1;text-align:center}
.hero-stat+.hero-stat{border-left:1px solid rgba(255,255,255,0.15)}
.hero-stat-val{font-size:1rem;font-weight:700;color:#fff;letter-spacing:-0.02em}
.hero-stat-lbl{font-size:0.62rem;font-weight:600;color:rgba(255,255,255,0.6);margin-top:2px}
.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;margin-top:0.2rem}
.sec-title{font-size:0.9rem;font-weight:700;letter-spacing:-0.01em}
.sec-link{font-size:0.75rem;font-weight:600;color:var(--brand);border:none;background:transparent;cursor:pointer;font-family:var(--font)}
.kitty-scroll{display:flex;gap:0.75rem;overflow-x:auto;padding:0 1rem 0.75rem;margin:0 -1rem;scrollbar-width:none}
.kitty-scroll::-webkit-scrollbar{display:none}
.kitty-card{min-width:240px;background:var(--surface);border-radius:20px;padding:1.1rem;border:1.5px solid var(--border);box-shadow:var(--shadow-sm);flex-shrink:0;transition:all 0.2s;cursor:pointer}
.kitty-card:hover{transform:translateY(-2px);box-shadow:var(--shadow);border-color:var(--brand-mid)}
.kitty-tag{display:inline-flex;align-items:center;gap:4px;font-size:0.62rem;font-weight:700;padding:3px 8px;border-radius:60px;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:0.55rem}
.tag-active{background:var(--emerald-light);color:var(--emerald)}
.tag-active::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--emerald);display:inline-block}
.kitty-name{font-size:0.88rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:0.3rem;line-height:1.3}
.kitty-amount{font-size:1.2rem;font-weight:800;color:var(--brand);letter-spacing:-0.03em;font-family:var(--mono)}
.kitty-goal{font-size:0.68rem;color:var(--text3);margin-bottom:0.6rem}
.prog-track{height:5px;background:var(--surface3);border-radius:10px;overflow:hidden;margin-bottom:0.4rem}
.prog-fill{height:100%;border-radius:10px;background:var(--grad);transition:width 0.6s ease}
.kitty-meta{display:flex;justify-content:space-between;font-size:0.68rem;color:var(--text3)}
.kitty-pct{font-weight:700;color:var(--brand)}
.services-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.6rem;margin-bottom:1rem}
.svc-btn{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:0.9rem 0.4rem 0.7rem;display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;font-family:var(--font);transition:all 0.18s;box-shadow:var(--shadow-sm)}
.svc-btn:hover{transform:translateY(-2px);box-shadow:var(--shadow);border-color:var(--brand-mid)}
.svc-btn:active{transform:scale(0.97)}
.svc-icon{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center}
.svc-icon svg{width:20px;height:20px;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.svc-lbl{font-size:0.6rem;font-weight:700;color:var(--text2);letter-spacing:0.01em}
.svc-i-brand{background:var(--brand-light)}.svc-i-brand svg{stroke:var(--brand)}
.svc-i-green{background:var(--emerald-light)}.svc-i-green svg{stroke:var(--emerald)}
.svc-i-amber{background:var(--amber-light)}.svc-i-amber svg{stroke:var(--amber)}
.svc-i-rose{background:var(--rose-light)}.svc-i-rose svg{stroke:var(--rose)}
.svc-i-violet{background:var(--violet-light)}.svc-i-violet svg{stroke:var(--violet)}
.svc-i-sky{background:var(--sky-light)}.svc-i-sky svg{stroke:var(--sky)}
.feed-card{background:var(--surface);border-radius:20px;border:1.5px solid var(--border);overflow:hidden;box-shadow:var(--shadow-sm)}
.feed-item{display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;border-bottom:1px solid var(--border2)}
.feed-item:last-child{border-bottom:none}
.feed-av{width:36px;height:36px;border-radius:50%;background:var(--brand-light);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.72rem;color:var(--brand);flex-shrink:0}
.feed-name{font-size:0.82rem;font-weight:600;letter-spacing:-0.01em}
.feed-detail{font-size:0.68rem;color:var(--text3);margin-top:1px}
.feed-amt{font-size:0.85rem;font-weight:700;color:var(--emerald);font-family:var(--mono)}
.feed-empty{text-align:center;padding:2rem 1rem;color:var(--text3);font-size:0.8rem}

/* PAGE WRAP */
.page-wrap{padding:1rem;padding-bottom:var(--orb-clearance)}
.page-hero{background:var(--surface);border-radius:20px;padding:1.2rem;margin-bottom:1rem;border:1.5px solid var(--border);box-shadow:var(--shadow-sm);display:flex;align-items:center;justify-content:space-between}
.ph-title{font-size:1.1rem;font-weight:800;letter-spacing:-0.03em}
.ph-sub{font-size:0.72rem;color:var(--text3);margin-top:2px}
.ph-badge{font-size:1.5rem;font-weight:800;color:var(--brand);font-family:var(--mono);background:var(--brand-light);border-radius:14px;padding:0.4rem 0.9rem;letter-spacing:-0.04em}
.ph-badge-violet{color:var(--violet);background:var(--violet-light)}
.ph-badge-sky{color:var(--sky);background:var(--sky-light)}
.kitty-list-card{background:var(--surface);border-radius:20px;border:1.5px solid var(--border);padding:1.1rem;margin-bottom:0.75rem;box-shadow:var(--shadow-sm);transition:all 0.2s}
.kitty-list-card:hover{border-color:var(--brand-mid);box-shadow:var(--shadow)}
.klc-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem}
.klc-name{font-size:0.9rem;font-weight:700;letter-spacing:-0.01em;flex:1;margin-right:0.5rem;line-height:1.3}
.klc-amount{font-size:1rem;font-weight:800;color:var(--brand);font-family:var(--mono);letter-spacing:-0.03em}
.klc-meta{display:flex;gap:0.75rem;font-size:0.68rem;color:var(--text3);margin-bottom:0.65rem}
.klc-actions{display:flex;gap:0.5rem;margin-top:0.7rem;flex-wrap:wrap}
.btn{border:none;border-radius:60px;font-family:var(--font);font-weight:600;font-size:0.75rem;cursor:pointer;transition:all 0.18s;display:inline-flex;align-items:center;gap:4px}
.btn-sm{padding:0.35rem 0.85rem}
.btn-brand{background:var(--brand);color:#fff;box-shadow:0 4px 12px rgba(79,70,229,0.25)}
.btn-brand:hover{box-shadow:0 6px 20px rgba(79,70,229,0.35);transform:translateY(-1px)}
.btn-ghost{background:var(--surface2);color:var(--text2);border:1.5px solid var(--border)}
.btn-ghost:hover{border-color:var(--brand-mid);color:var(--brand)}
.btn-green{background:var(--emerald-light);color:var(--emerald)}
.btn-green:hover{background:var(--emerald);color:#fff}
.btn-violet{background:var(--violet-light);color:var(--violet)}
.btn-violet:hover{background:var(--violet);color:#fff}
.btn-sky{background:var(--sky-light);color:var(--sky)}
.btn-sky:hover{background:var(--sky);color:#fff}
.btn-amber{background:var(--amber-light);color:var(--amber)}
.new-kitty-btn{width:100%;padding:0.85rem;background:var(--grad);color:#fff;border:none;border-radius:16px;font-family:var(--font);font-weight:700;font-size:0.88rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;box-shadow:var(--shadow-brand);transition:all 0.2s;margin-bottom:1rem}
.new-kitty-btn:hover{transform:translateY(-1px);box-shadow:0 12px 40px rgba(79,70,229,0.36)}
.new-chama-btn{width:100%;padding:0.85rem;background:var(--grad-chama);color:#fff;border:none;border-radius:16px;font-family:var(--font);font-weight:700;font-size:0.88rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;box-shadow:0 8px 32px rgba(124,58,237,0.28);transition:all 0.2s;margin-bottom:1rem}
.new-chama-btn:hover{transform:translateY(-1px);box-shadow:0 12px 40px rgba(124,58,237,0.36)}
.new-event-btn{width:100%;padding:0.85rem;background:var(--grad-events);color:#fff;border:none;border-radius:16px;font-family:var(--font);font-weight:700;font-size:0.88rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;box-shadow:0 8px 32px rgba(14,165,233,0.28);transition:all 0.2s;margin-bottom:1rem}
.new-event-btn:hover{transform:translateY(-1px);box-shadow:0 12px 40px rgba(14,165,233,0.36)}
.empty-state{text-align:center;padding:3rem 1.5rem;background:var(--surface);border-radius:20px;border:1.5px dashed var(--border)}
.empty-icon-wrap{width:72px;height:72px;background:var(--brand-light);border-radius:20px;margin:0 auto 1rem;display:flex;align-items:center;justify-content:center}
.empty-icon-wrap svg{width:32px;height:32px;stroke:var(--brand);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.empty-icon-wrap.violet{background:var(--violet-light)}.empty-icon-wrap.violet svg{stroke:var(--violet)}
.empty-icon-wrap.sky{background:var(--sky-light)}.empty-icon-wrap.sky svg{stroke:var(--sky)}
.empty-title{font-size:1rem;font-weight:700;margin-bottom:0.35rem;letter-spacing:-0.02em}
.empty-sub{font-size:0.78rem;color:var(--text3);line-height:1.5;margin-bottom:1.25rem}

/* CHAMA CARDS */
.chama-card{background:var(--surface);border-radius:20px;border:1.5px solid var(--border);padding:1.1rem;margin-bottom:0.75rem;box-shadow:var(--shadow-sm);transition:all 0.2s}
.chama-card:hover{border-color:#a78bfa;box-shadow:var(--shadow)}
.chama-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem}
.chama-name{font-size:0.9rem;font-weight:700;letter-spacing:-0.01em;flex:1;margin-right:0.5rem}
.chama-badge{font-size:0.62rem;font-weight:700;padding:3px 8px;border-radius:60px;background:var(--violet-light);color:var(--violet);letter-spacing:0.04em;text-transform:uppercase}
.chama-meta{display:flex;gap:0.75rem;font-size:0.68rem;color:var(--text3);margin-bottom:0.65rem}
.chama-pool{font-size:1rem;font-weight:800;color:var(--violet);font-family:var(--mono);letter-spacing:-0.03em}

/* EVENT CARDS */
.event-card{background:var(--surface);border-radius:20px;border:1.5px solid var(--border);padding:1.1rem;margin-bottom:0.75rem;box-shadow:var(--shadow-sm);transition:all 0.2s;display:flex;gap:0.9rem;align-items:flex-start}
.event-card:hover{border-color:#7dd3fc;box-shadow:var(--shadow)}
.event-date-box{background:var(--sky-light);border-radius:14px;padding:0.6rem 0.75rem;text-align:center;flex-shrink:0;min-width:52px;border:1.5px solid rgba(14,165,233,0.15)}
.event-date-day{font-size:1.3rem;font-weight:800;color:var(--sky);font-family:var(--mono);line-height:1}
.event-date-mon{font-size:0.6rem;font-weight:700;color:var(--sky);text-transform:uppercase;letter-spacing:0.06em}
.event-info{flex:1;min-width:0}
.event-name{font-size:0.9rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:0.3rem}
.event-meta{font-size:0.68rem;color:var(--text3);margin-bottom:0.5rem;line-height:1.4}
.event-pill{display:inline-flex;align-items:center;gap:4px;font-size:0.62rem;font-weight:700;padding:3px 8px;border-radius:60px;background:var(--sky-light);color:var(--sky);letter-spacing:0.04em;text-transform:uppercase}

/* CONTRIBUTE */
.contrib-wrap{padding:1rem}
.steps-indicator{display:flex;gap:0.4rem;margin-bottom:1.25rem}
.step-dot{height:4px;border-radius:4px;flex:1;background:var(--surface3);transition:all 0.3s}
.step-dot.active{background:var(--brand)}
.contrib-card{background:var(--surface);border-radius:20px;border:1.5px solid var(--border);padding:1.25rem;box-shadow:var(--shadow-sm)}
.cc-title{font-size:1rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:1.1rem}
.amount-display{background:var(--brand-light);border-radius:16px;padding:1rem;text-align:center;margin-bottom:1.1rem;border:1.5px solid rgba(79,70,229,0.12)}
.amount-display-lbl{font-size:0.65rem;font-weight:600;color:var(--brand);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px}
.amount-display-val{font-size:2rem;font-weight:800;color:var(--brand);font-family:var(--mono);letter-spacing:-0.04em}
.pay-methods{display:grid;grid-template-columns:repeat(3,1fr);gap:0.6rem;margin-bottom:1rem}
.pay-method{border:2px solid var(--border);border-radius:14px;padding:0.85rem;text-align:center;cursor:pointer;transition:all 0.2s;background:var(--surface2)}
.pay-method.active{border-color:var(--brand);background:var(--brand-light)}
.pay-method-icon{font-size:1.4rem;margin-bottom:4px}
.pay-method-name{font-size:0.75rem;font-weight:700;color:var(--text2)}
.pay-method.active .pay-method-name{color:var(--brand)}
.pay-method.active-airtel{border-color:#e4000f;background:#fff5f5}
.pay-method.active-airtel .pay-method-name{color:#e4000f}
.anon-check-row{display:flex;align-items:flex-start;gap:0.65rem;background:var(--surface2);border:1.5px solid var(--border);border-radius:12px;padding:0.75rem 0.85rem;margin-bottom:1rem;cursor:pointer;transition:border-color 0.18s}
.anon-check-row:hover{border-color:var(--brand-mid)}
.anon-checkbox{width:20px;height:20px;border-radius:6px;border:2px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;transition:all 0.18s}
.anon-checkbox.checked{background:var(--brand);border-color:var(--brand)}
.anon-checkbox.checked::after{content:"✓";color:#fff;font-size:0.7rem;font-weight:800}
.anon-label{font-size:0.8rem;font-weight:600;color:var(--text)}
.anon-sub{font-size:0.68rem;color:var(--text3);margin-top:2px;line-height:1.4}
.summary-box{background:var(--surface2);border-radius:14px;padding:1rem;border:1.5px solid var(--border);margin-bottom:1rem}
.summary-row{display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0;font-size:0.82rem}
.summary-row+.summary-row{border-top:1px solid var(--border)}
.summary-row.total{font-weight:700;font-size:0.9rem;color:var(--brand)}
.confirm-btn{width:100%;padding:0.9rem;background:var(--grad);color:#fff;border:none;border-radius:60px;font-family:var(--font);font-weight:700;font-size:0.9rem;cursor:pointer;box-shadow:var(--shadow-brand);transition:all 0.2s}
.confirm-btn:hover{transform:translateY(-1px);box-shadow:0 12px 40px rgba(79,70,229,0.36)}
.back-btn{width:100%;padding:0.75rem;background:transparent;color:var(--text2);border:1.5px solid var(--border);border-radius:60px;font-family:var(--font);font-weight:600;font-size:0.85rem;cursor:pointer;margin-top:0.6rem;transition:all 0.2s}
.back-btn:hover{border-color:var(--brand);color:var(--brand)}
.mpesa-sim{margin-top:1rem;background:var(--surface2);border-radius:16px;padding:1.1rem;border:1.5px solid var(--border);text-align:center}
.mpesa-sim-logo{display:inline-flex;align-items:center;gap:6px;background:#4caf50;color:#fff;font-weight:800;font-size:0.78rem;padding:4px 12px;border-radius:6px;margin-bottom:0.75rem}
.mpesa-msg{font-size:0.78rem;color:var(--text2);line-height:1.5}
.mpesa-pin-row{display:flex;gap:0.5rem;justify-content:center;margin:0.75rem 0}
.pin-box{width:44px;height:44px;background:var(--surface);border:2px solid var(--border);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:700;transition:all 0.2s}
.pin-box.filled{border-color:var(--brand);background:var(--brand-light);color:var(--brand)}
.keypad-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-top:0.75rem}
.key-btn{background:var(--surface);border:1.5px solid var(--border);border-radius:12px;padding:0.75rem;text-align:center;cursor:pointer;font-size:1rem;font-weight:700;font-family:var(--font);color:var(--text);transition:all 0.1s}
.key-btn:active{transform:scale(0.94);background:var(--brand-light);border-color:var(--brand)}

/* WITHDRAW */
.withdraw-wrap{padding:1rem;padding-bottom:var(--orb-clearance)}
.fee-banner{background:linear-gradient(135deg,#FFFBEB,#FEF3C7);border:1.5px solid #FDE68A;border-radius:16px;padding:1rem;margin-bottom:1rem}
.fee-banner-title{font-size:0.75rem;font-weight:700;color:var(--amber);margin-bottom:0.5rem;display:flex;align-items:center;gap:5px}
.fee-row{display:flex;justify-content:space-between;font-size:0.75rem;padding:2px 0;color:var(--text2)}
.fee-row strong{color:var(--amber)}
.wd-kitty-card{background:var(--surface);border-radius:20px;border:1.5px solid var(--border);padding:1.1rem;margin-bottom:0.75rem;box-shadow:var(--shadow-sm);transition:all 0.2s}
.wd-kitty-card:hover{border-color:var(--emerald);box-shadow:var(--shadow)}
.wkc-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.6rem}
.wkc-name{font-size:0.88rem;font-weight:700;letter-spacing:-0.01em}
.wkc-avail{font-size:1.1rem;font-weight:800;color:var(--emerald);font-family:var(--mono);letter-spacing:-0.03em}
.wkc-fee{font-size:0.68rem;color:var(--amber);margin-top:2px}
.wkc-btn{background:var(--grad2);color:#fff;border:none;border-radius:60px;font-family:var(--font);font-weight:700;font-size:0.78rem;padding:0.45rem 1.1rem;cursor:pointer;box-shadow:0 4px 12px rgba(16,185,129,0.25);transition:all 0.18s;margin-top:0.75rem}
.wkc-btn:hover{box-shadow:0 8px 24px rgba(16,185,129,0.35);transform:translateY(-1px)}
.wd-history-title{font-size:0.9rem;font-weight:700;margin:1rem 0 0.6rem;letter-spacing:-0.01em}
.wd-hist-item{background:var(--surface);border-radius:14px;padding:0.85rem 1rem;margin-bottom:0.5rem;border:1.5px solid var(--border);display:flex;align-items:center;gap:0.75rem}
.wd-hist-icon{width:38px;height:38px;border-radius:12px;background:var(--emerald-light);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.wd-hist-icon svg{width:18px;height:18px;stroke:var(--emerald);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.wd-hist-name{font-size:0.8rem;font-weight:600;letter-spacing:-0.01em}
.wd-hist-date{font-size:0.65rem;color:var(--text3)}
.wd-hist-amt{text-align:right}
.wd-hist-net{font-size:0.88rem;font-weight:700;color:var(--emerald);font-family:var(--mono)}
.wd-hist-fee{font-size:0.65rem;color:var(--text3)}
.wd-hist-pill{font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:60px;background:var(--emerald-light);color:var(--emerald);text-transform:uppercase;letter-spacing:0.04em;display:inline-block;margin-top:2px}

/* WHATSAPP */
.wa-wrap{padding:1rem;padding-bottom:var(--orb-clearance)}
.wa-form-card{background:var(--surface);border-radius:20px;border:1.5px solid var(--border);padding:1.25rem;margin-bottom:1rem;box-shadow:var(--shadow-sm)}
.wa-preview{background:#ECE5DD;border-radius:20px;overflow:hidden;border:1.5px solid var(--border);margin-bottom:1rem}
.wa-preview-bar{background:#128C7E;padding:0.75rem 1rem;display:flex;align-items:center;gap:0.6rem}
.wa-preview-bar-title{color:#fff;font-weight:700;font-size:0.85rem}
.wa-messages{padding:0.75rem;min-height:200px;display:flex;flex-direction:column;gap:0.5rem;max-height:260px;overflow-y:auto}
.wa-msg{max-width:82%;padding:0.55rem 0.75rem;border-radius:16px;font-size:0.76rem;line-height:1.4}
.wa-msg.in{background:#fff;align-self:flex-start;border-radius:2px 16px 16px 16px;box-shadow:var(--shadow-sm)}
.wa-msg.out{background:#DCF8C6;align-self:flex-end;border-radius:16px 16px 2px 16px;box-shadow:var(--shadow-sm)}
.wa-msg-time{font-size:0.55rem;color:#8696a0;margin-top:3px;text-align:right}
.wa-input-bar{background:#F0F2F5;padding:0.5rem 0.75rem;display:flex;gap:0.5rem;align-items:center}
.wa-input{flex:1;background:#fff;border:none;border-radius:20px;padding:0.5rem 0.8rem;font-family:var(--font);font-size:0.8rem;outline:none;color:var(--text)}
.wa-send{width:36px;height:36px;background:#128C7E;border:none;border-radius:50%;color:#fff;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center}

/* TRANSACTIONS */
.tx-wrap{padding:1rem;padding-bottom:var(--orb-clearance)}
.tx-stats{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-bottom:1rem}
.tx-stat-card{background:var(--surface);border-radius:16px;padding:1rem;border:1.5px solid var(--border);box-shadow:var(--shadow-sm)}
.tx-stat-lbl{font-size:0.65rem;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px}
.tx-stat-val{font-size:1.1rem;font-weight:800;letter-spacing:-0.03em;font-family:var(--mono)}
.tx-filter-row{display:flex;gap:0.4rem;margin-bottom:0.75rem;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
.tx-filter-row::-webkit-scrollbar{display:none}
.tx-filter-pill{padding:0.35rem 0.85rem;border-radius:60px;font-size:0.72rem;font-weight:600;white-space:nowrap;cursor:pointer;border:1.5px solid var(--border);background:var(--surface);color:var(--text3);font-family:var(--font);transition:all 0.18s}
.tx-filter-pill.active{background:var(--brand);color:#fff;border-color:var(--brand)}
.tx-search{width:100%;background:var(--surface);border:1.5px solid var(--border);border-radius:60px;padding:0.55rem 1rem;font-family:var(--font);font-size:0.82rem;color:var(--text);outline:none;margin-bottom:0.75rem}
.tx-search:focus{border-color:var(--brand)}
.tx-item{background:var(--surface);border-radius:16px;padding:0.9rem;margin-bottom:0.5rem;border:1.5px solid var(--border);display:flex;align-items:center;gap:0.75rem;box-shadow:var(--shadow-sm)}
.tx-av{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;flex-shrink:0}
.tx-av-contrib{background:var(--brand-light);color:var(--brand)}
.tx-av-wd{background:var(--amber-light);color:var(--amber)}
.tx-item-name{font-size:0.82rem;font-weight:600;letter-spacing:-0.01em}
.tx-item-ref{font-size:0.65rem;color:var(--text3);font-family:var(--mono)}
.tx-item-kitty{font-size:0.65rem;color:var(--text3);margin-top:1px}
.tx-item-amount{text-align:right;flex-shrink:0}
.tx-item-gross{font-size:0.9rem;font-weight:700;font-family:var(--mono);letter-spacing:-0.02em}
.tx-item-fee{font-size:0.62rem;color:var(--rose);margin-top:1px}
.tx-pill{font-size:0.6rem;font-weight:700;padding:2px 7px;border-radius:60px;text-transform:uppercase;letter-spacing:0.04em;display:inline-block;margin-top:2px}
.pill-contrib{background:var(--brand-light);color:var(--brand)}
.pill-wd{background:var(--amber-light);color:var(--amber)}
.pill-sent{background:var(--emerald-light);color:var(--emerald)}
.tx-export-btn{width:100%;padding:0.8rem;background:var(--surface);color:var(--brand);border:2px solid var(--brand-mid);border-radius:16px;font-family:var(--font);font-weight:700;font-size:0.85rem;cursor:pointer;transition:all 0.2s;margin-top:0.75rem;display:flex;align-items:center;justify-content:center;gap:0.5rem}
.tx-export-btn:hover{background:var(--brand-light)}

/* SETTINGS */
.settings-wrap{padding:1rem;padding-bottom:var(--orb-clearance)}
.settings-card{background:var(--surface);border-radius:20px;border:1.5px solid var(--border);padding:1.25rem;margin-bottom:1rem;box-shadow:var(--shadow-sm)}
.sc-title{font-size:0.9rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:1rem}
.profile-avatar-row{display:flex;align-items:center;gap:1rem;margin-bottom:1.1rem;padding-bottom:1rem;border-bottom:1px solid var(--border2)}
.profile-av{width:56px;height:56px;border-radius:18px;background:var(--grad);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;color:#fff;flex-shrink:0}
.profile-av-name{font-size:1rem;font-weight:700;letter-spacing:-0.02em}
.profile-av-role{font-size:0.72rem;color:var(--text3)}
.logout-btn{width:100%;padding:0.8rem;background:var(--rose-light);color:var(--rose);border:1.5px solid rgba(244,63,94,0.2);border-radius:16px;font-family:var(--font);font-weight:700;font-size:0.85rem;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:0.5rem}
.logout-btn:hover{background:var(--rose);color:#fff}

/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(13,15,20,0.6);backdrop-filter:blur(12px);z-index:1000;display:flex;align-items:flex-end;justify-content:center;padding:1rem;animation:fadeIn 0.2s ease}
.modal-sheet{background:var(--surface);border-radius:28px 28px 20px 20px;width:100%;max-width:480px;padding:1.5rem;border:1.5px solid var(--border);position:relative;max-height:88vh;overflow-y:auto;animation:slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)}
.modal-handle{width:36px;height:4px;background:var(--border);border-radius:4px;margin:0 auto 1.25rem;display:block}
.modal-close-btn{position:absolute;top:1.1rem;right:1.1rem;width:30px;height:30px;background:var(--surface2);border:1.5px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.8rem;color:var(--text3)}
.modal-title{font-size:1.05rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:1.1rem}

/* KITTY DETAIL */
.kd-hero{background:var(--grad);border-radius:18px;padding:1.2rem;margin-bottom:1rem;position:relative;overflow:hidden}
.kd-hero-orb{position:absolute;border-radius:50%;background:rgba(255,255,255,0.08)}
.kd-hero-orb.o1{width:120px;height:120px;top:-40px;right:-30px}
.kd-hero-orb.o2{width:70px;height:70px;bottom:-20px;left:20px}
.kd-hero-inner{position:relative;z-index:1}
.kd-hero-lbl{font-size:0.65rem;font-weight:600;color:rgba(255,255,255,0.65);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:3px}
.kd-hero-amount{font-size:1.9rem;font-weight:800;color:#fff;letter-spacing:-0.04em;font-family:var(--mono);line-height:1}
.kd-hero-goal{font-size:0.72rem;color:rgba(255,255,255,0.65);margin-top:4px}
.kd-stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:1rem}
.kd-stat{background:var(--surface2);border-radius:14px;padding:0.75rem 0.5rem;text-align:center;border:1.5px solid var(--border)}
.kd-stat-val{font-size:1rem;font-weight:800;color:var(--brand);font-family:var(--mono);letter-spacing:-0.02em}
.kd-stat-lbl{font-size:0.6rem;font-weight:600;color:var(--text3);margin-top:2px}
.kd-section-title{font-size:0.78rem;font-weight:700;color:var(--text2);margin:0.85rem 0 0.5rem;letter-spacing:0.01em;text-transform:uppercase}
.kd-fee-box{background:var(--amber-light);border:1.5px solid #FDE68A;border-radius:12px;padding:0.75rem 0.9rem;font-size:0.78rem;color:var(--amber);display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}
.kd-fee-box strong{font-weight:700}
.kd-actions{display:flex;gap:0.6rem;margin-top:0.5rem}
.kd-actions .confirm-btn{flex:1;padding:0.75rem}

/* WITHDRAW FLOW */
.wd-confirm-box{background:var(--surface2);border-radius:16px;padding:1rem;border:1.5px solid var(--border);margin-bottom:1rem}
.wd-confirm-row{display:flex;justify-content:space-between;font-size:0.82rem;padding:0.35rem 0}
.wd-confirm-row+.wd-confirm-row{border-top:1px solid var(--border2)}
.wd-confirm-row.net{font-weight:800;color:var(--emerald);font-size:0.9rem;border-top:2px solid var(--border)!important;padding-top:0.55rem;margin-top:0.2rem}

/* CHAMA DETAIL */
.chd-header{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--border2)}
.chd-icon{width:52px;height:52px;border-radius:16px;background:var(--grad-chama);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.chd-icon svg{width:24px;height:24px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.chd-name{font-size:1rem;font-weight:800;letter-spacing:-0.02em}
.chd-badge{font-size:0.62rem;font-weight:700;padding:3px 8px;border-radius:60px;background:var(--violet-light);color:var(--violet);letter-spacing:0.04em;text-transform:uppercase;margin-top:3px;display:inline-block}
.chd-pool-card{background:var(--grad-chama);border-radius:16px;padding:1rem 1.2rem;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center}
.chd-pool-lbl{font-size:0.65rem;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:0.06em;text-transform:uppercase}
.chd-pool-val{font-size:1.7rem;font-weight:800;color:#fff;font-family:var(--mono);letter-spacing:-0.04em}
.chd-pool-sub{font-size:0.68rem;color:rgba(255,255,255,0.65);margin-top:2px}
.chd-stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:1rem}
.chd-stat{background:var(--surface2);border-radius:12px;padding:0.7rem 0.85rem;border:1.5px solid var(--border)}
.chd-stat-lbl{font-size:0.62rem;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.04em}
.chd-stat-val{font-size:0.95rem;font-weight:700;color:var(--violet);font-family:var(--mono);margin-top:2px}
.chd-member-row{display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0;border-bottom:1px solid var(--border2)}
.chd-member-row:last-child{border-bottom:none}
.chd-member-av{width:32px;height:32px;border-radius:50%;background:var(--violet-light);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.68rem;color:var(--violet);flex-shrink:0}
.chd-member-name{font-size:0.8rem;font-weight:600;flex:1}
.chd-member-amt{font-size:0.75rem;font-weight:700;color:var(--violet);font-family:var(--mono)}
/* Stats card hover glow */
.stat-glow {
  animation: none;
}

.stat-card:hover .stat-glow {
  opacity: 1;
}

@keyframes statPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
/* TOAST */
.toast{position:fixed;bottom:calc(var(--nav-h) + 12px);left:1rem;right:1rem;background:var(--ink);color:#fff;border-radius:16px;padding:0.85rem 1.1rem;z-index:9999;max-width:400px;margin:0 auto;box-shadow:var(--shadow-lg);animation:slideUp 0.25s ease}
.toast-title{font-weight:700;font-size:0.85rem;margin-bottom:2px}
.toast-body{font-size:0.75rem;color:rgba(255,255,255,0.65)}
.hidden{display:none!important}
.text-brand{color:var(--brand)}.text-green{color:var(--emerald)}.text-amber{color:var(--amber)}.text-rose{color:var(--rose)}.text-muted{color:var(--text3)}
.fw7{font-weight:700}.fw8{font-weight:800}.mono{font-family:var(--mono)}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:380px){.hero-amount{font-size:1.65rem}.services-grid{gap:0.45rem}.svc-icon{width:32px;height:32px}.svc-lbl{font-size:0.56rem}}

/* SHARE KITTY */
.share-link-box{background:var(--surface2);border:1.5px solid var(--border);border-radius:14px;padding:0.75rem 1rem;display:flex;align-items:center;gap:0.6rem;margin-bottom:1.1rem;cursor:pointer;transition:border-color 0.18s}
.share-link-box:hover{border-color:var(--brand)}
.share-link-url{font-size:0.75rem;font-family:var(--mono);color:var(--brand);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.share-link-copy{background:var(--brand);color:#fff;border:none;border-radius:8px;padding:0.3rem 0.7rem;font-size:0.68rem;font-weight:700;font-family:var(--font);cursor:pointer;flex-shrink:0;transition:all 0.18s}
.share-link-copy:hover{background:#3730a3}
.share-channels{display:grid;grid-template-columns:1fr 1fr;gap:0.55rem;margin-bottom:1.1rem}
.share-ch{display:flex;align-items:center;gap:0.6rem;padding:0.7rem 0.85rem;border-radius:14px;border:1.5px solid var(--border);background:var(--surface);cursor:pointer;transition:all 0.18s;font-family:var(--font)}
.share-ch:hover{transform:translateY(-1px);box-shadow:var(--shadow-sm)}
.share-ch-icon{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
.share-ch-label{font-size:0.78rem;font-weight:600;color:var(--text)}
.share-ch.wa .share-ch-icon{background:#dcf8c6}
.share-ch.tg .share-ch-icon{background:#d0eeff}
.share-ch.em .share-ch-icon{background:#fff0f6}
.share-ch.sms .share-ch-icon{background:#ecfdf5}
.share-ch.fb .share-ch-icon{background:#e8eeff}
.share-ch.tw .share-ch-icon{background:#e7f6ff}
.share-ch.link .share-ch-icon{background:var(--brand-light)}
.share-ch.more .share-ch-icon{background:var(--surface3)}
.share-kitty-preview{background:linear-gradient(135deg,#4F46E5,#7C3AED);border-radius:16px;padding:1rem 1.1rem;margin-bottom:1rem;position:relative;overflow:hidden}
.skp-orb{position:absolute;border-radius:50%;background:rgba(255,255,255,0.07);width:100px;height:100px;top:-30px;right:-20px;pointer-events:none}
.skp-label{font-size:0.6rem;font-weight:700;color:rgba(255,255,255,0.65);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:3px}
.skp-name{font-size:1rem;font-weight:800;color:#fff;letter-spacing:-0.02em;margin-bottom:2px}
.skp-sub{font-size:0.72rem;color:rgba(255,255,255,0.7)}
.skp-prog{height:4px;background:rgba(255,255,255,0.2);border-radius:4px;margin-top:0.65rem;overflow:hidden}
.skp-prog-fill{height:100%;background:rgba(255,255,255,0.75);border-radius:4px}
.share-copied-badge{display:inline-flex;align-items:center;gap:4px;background:var(--emerald-light);color:var(--emerald);font-size:0.72rem;font-weight:700;padding:0.3rem 0.75rem;border-radius:60px;border:1px solid rgba(16,185,129,0.2);margin-bottom:0.75rem;animation:fadeIn 0.2s ease}

/* PUBLIC CONTRIBUTE PAGE (no-login) */
.pub-bg{min-height:100vh;background:linear-gradient(160deg,#F0F1FF 0%,#F5F6FA 40%,#EFF8F4 100%);padding:1.5rem 1rem;display:flex;flex-direction:column;align-items:center}
.pub-logo-row{display:flex;align-items:center;gap:0.6rem;margin-bottom:1.5rem}
.pub-brand{font-weight:800;font-size:1.1rem;letter-spacing:-0.03em;color:var(--text)}
.pub-brand span{color:var(--brand)}
.pub-card{background:var(--surface);border-radius:24px;width:100%;max-width:440px;padding:1.5rem;box-shadow:var(--shadow-lg);border:1px solid rgba(255,255,255,0.8)}
.pub-kitty-hero{background:var(--grad);border-radius:16px;padding:1.1rem;margin-bottom:1.1rem;position:relative;overflow:hidden}
.pub-kitty-orb{position:absolute;border-radius:50%;background:rgba(255,255,255,0.07);width:100px;height:100px;top:-30px;right:-20px}
.pub-kitty-name{font-size:1.1rem;font-weight:800;color:#fff;letter-spacing:-0.02em;margin-bottom:3px}
.pub-kitty-sub{font-size:0.72rem;color:rgba(255,255,255,0.72)}
.pub-kitty-prog{height:5px;background:rgba(255,255,255,0.2);border-radius:5px;margin-top:0.75rem;overflow:hidden}
.pub-kitty-fill{height:100%;background:#fff;border-radius:5px;transition:width 0.6s ease}
.pub-kitty-stats{display:flex;gap:0;margin-top:0.65rem}
.pub-stat{flex:1;text-align:center}
.pub-stat+.pub-stat{border-left:1px solid rgba(255,255,255,0.2)}
.pub-stat-val{font-size:0.95rem;font-weight:800;color:#fff;font-family:var(--mono);letter-spacing:-0.02em}
.pub-stat-lbl{font-size:0.58rem;font-weight:600;color:rgba(255,255,255,0.65);margin-top:1px}
.pub-not-found{text-align:center;padding:3rem 1rem}
.pub-not-found-icon{font-size:3rem;margin-bottom:0.75rem}
.pub-not-found-title{font-size:1rem;font-weight:700;margin-bottom:0.4rem}
.pub-not-found-sub{font-size:0.82rem;color:var(--text3);line-height:1.5}

/* MEDIA UPLOAD */
.media-upload-zone{
  border:2px dashed var(--border);border-radius:16px;padding:1.4rem 1rem;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:0.5rem;cursor:pointer;transition:all 0.2s;background:var(--surface2);
  text-align:center;position:relative;overflow:hidden;
}
.media-upload-zone:hover{border-color:var(--brand);background:var(--brand-light)}
.media-upload-zone.has-file{border-style:solid;border-color:rgba(79,70,229,0.3);background:var(--brand-light)}
.media-upload-zone.image-zone:hover{border-color:var(--emerald);background:var(--emerald-light)}
.media-upload-zone.image-zone.has-file{border-color:rgba(16,185,129,0.35);background:var(--emerald-light)}
.media-upload-icon{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;margin-bottom:2px;flex-shrink:0}
.media-upload-title{font-size:0.8rem;font-weight:700;color:var(--text);letter-spacing:-0.01em}
.media-upload-sub{font-size:0.65rem;color:var(--text3);line-height:1.4}
.media-preview-img{
  width:100%;border-radius:14px;object-fit:cover;max-height:180px;
  border:2px solid rgba(16,185,129,0.25);box-shadow:0 4px 20px rgba(0,0,0,0.08);
  display:block;
}
.media-preview-banner{
  width:100%;border-radius:14px;object-fit:cover;max-height:130px;
  border:2px solid rgba(79,70,229,0.25);box-shadow:0 4px 20px rgba(0,0,0,0.08);
  display:block;
}
.media-remove-btn{
  position:absolute;top:8px;right:8px;width:26px;height:26px;border-radius:50%;
  background:rgba(244,63,94,0.9);border:none;cursor:pointer;color:#fff;
  font-size:0.7rem;display:flex;align-items:center;justify-content:center;
  font-weight:800;box-shadow:0 2px 8px rgba(0,0,0,0.18);transition:all 0.18s;
}
.media-remove-btn:hover{background:var(--rose);transform:scale(1.1)}
.media-doc-preview{
  display:flex;align-items:center;gap:0.65rem;background:var(--surface);
  border:1.5px solid rgba(79,70,229,0.2);border-radius:12px;padding:0.7rem 0.85rem;
}
.media-doc-icon{width:38px;height:38px;border-radius:10px;background:var(--brand-light);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
.media-doc-name{font-size:0.78rem;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}
.media-doc-size{font-size:0.62rem;color:var(--text3);margin-top:1px}
.media-tabs{display:flex;gap:0.4rem;margin-bottom:0.75rem}
.media-tab{flex:1;padding:0.5rem;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);font-family:var(--font);font-size:0.7rem;font-weight:700;color:var(--text3);cursor:pointer;transition:all 0.18s;text-align:center}
.media-tab.active{border-color:var(--brand);background:var(--brand-light);color:var(--brand)}
.kd-media-banner{width:100%;border-radius:16px;object-fit:cover;max-height:160px;display:block;margin-bottom:1rem;box-shadow:var(--shadow)}
.kd-media-portrait{width:100%;max-width:180px;border-radius:16px;object-fit:cover;max-height:220px;display:block;margin:0 auto 1rem;box-shadow:var(--shadow)}
.kd-media-doc{display:flex;align-items:center;gap:0.65rem;background:var(--brand-light);border:1.5px solid rgba(79,70,229,0.2);border-radius:14px;padding:0.85rem 1rem;margin-bottom:1rem;cursor:pointer}
.kd-description-box{background:var(--surface2);border:1.5px solid var(--border);border-radius:14px;padding:0.85rem 1rem;margin-bottom:1rem}
.kd-desc-label{font-size:0.62rem;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.4rem}
.kd-desc-text{font-size:0.82rem;color:var(--text2);line-height:1.6}

/* NOTIFICATIONS PANEL */
.notif-panel{position:fixed;top:0;right:0;bottom:0;width:100%;max-width:400px;background:var(--surface);z-index:900;box-shadow:-8px 0 40px rgba(0,0,0,0.15);display:flex;flex-direction:column;animation:slideInRight 0.28s cubic-bezier(0.34,1.56,0.64,1)}
.notif-panel-backdrop{position:fixed;inset:0;background:rgba(13,15,20,0.5);backdrop-filter:blur(6px);z-index:899;animation:fadeIn 0.2s ease}
@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
.notif-header{padding:1.2rem 1rem 1rem;border-bottom:1px solid var(--border2);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.notif-header-title{font-size:1rem;font-weight:800;letter-spacing:-0.02em}
.notif-close{width:32px;height:32px;background:var(--surface2);border:1.5px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.8rem;color:var(--text3);border:none}
.notif-body{flex:1;overflow-y:auto;padding:0.75rem}
.notif-item{display:flex;align-items:flex-start;gap:0.75rem;padding:0.75rem;border-radius:14px;margin-bottom:0.5rem;background:var(--surface2);border:1.5px solid var(--border);transition:all 0.18s;cursor:default}
.notif-item.unread{background:var(--brand-light);border-color:rgba(79,70,229,0.2)}
.notif-icon{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
.notif-content{flex:1;min-width:0}
.notif-title{font-size:0.82rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:2px}
.notif-body-text{font-size:0.72rem;color:var(--text2);line-height:1.4}
.notif-time{font-size:0.62rem;color:var(--text3);margin-top:3px;font-weight:600}
.notif-badge{position:absolute;top:6px;right:6px;min-width:16px;height:16px;background:var(--rose);border-radius:8px;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-weight:800;color:#fff;padding:0 3px}
.notif-mark-all{font-size:0.72rem;font-weight:600;color:var(--brand);background:none;border:none;cursor:pointer;font-family:var(--font);padding:0}

/* MEMBERS MODAL */
.member-item{display:flex;align-items:center;gap:0.65rem;padding:0.65rem 0.75rem;border-radius:12px;background:var(--surface2);border:1.5px solid var(--border);margin-bottom:0.5rem;transition:all 0.18s}
.member-av{width:36px;height:36px;border-radius:50%;background:var(--violet-light);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.72rem;color:var(--violet);flex-shrink:0}
.member-name{font-size:0.82rem;font-weight:600;letter-spacing:-0.01em}
.member-phone{font-size:0.65rem;color:var(--text3)}
.member-remove{background:var(--rose-light);color:var(--rose);border:none;border-radius:8px;padding:4px 10px;font-size:0.65rem;font-weight:700;cursor:pointer;font-family:var(--font);margin-left:auto;flex-shrink:0;transition:all 0.18s}
.member-remove:hover{background:var(--rose);color:#fff}

/* EVENT STATUS PILL */
.event-pill-active{background:var(--emerald-light);color:var(--emerald)}
.event-pill-disabled{background:var(--surface3);color:var(--text3)}
.btn-rose{background:var(--rose-light);color:var(--rose)}
.btn-rose:hover{background:var(--rose);color:#fff}
`;



// ─── Helpers ───
const fmt = (n) => (n || 0).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const calcFee = (amount) => amount <= 100000 ? { fee: Math.round(amount * 0.022), pct: "2.2" } : { fee: 2400, pct: (2400 / amount * 100).toFixed(2) };
const calcChamaFee = (amount) => amount <= 50000 ? { fee: Math.round(amount * 0.018), pct: "1.8", flatRate: false } : { fee: 1000, pct: (1000 / amount * 100).toFixed(2), flatRate: true };
const calcEventFee = (amount) => { const fee = Math.round(amount * 0.035); return { fee, pct: "3.5" }; };
// Routes to the correct fee function based on the kitty's assigned fee category.
// Pass an explicit `amount` to override kitty.raised (e.g. for partial withdrawals).
const getKittyFee = (kitty, amount) => {
  const amt = (amount !== undefined) ? amount : (kitty.raised || 0);
  const fc = kitty.feeCategory || "contributions";
  if (fc === "chama") { const r = calcChamaFee(amt); return { fee: r.fee, pct: r.pct }; }
  if (fc === "events") return calcEventFee(amt);
  return calcFee(amt); // default: contributions kitty
};
const KITTY_CATEGORY_LABELS = { contributions: "Contributions", chama: "Chama", events: "Events" };
const kittyCategory = (k) => KITTY_CATEGORY_LABELS[k?.feeCategory] || KITTY_CATEGORY_LABELS[k?.category] || "Contributions";
const getGreeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning ☀️" : h < 17 ? "Good afternoon 🌤️" : "Good evening 🌙"; };
const maskPhone = (p) => {
  const s = String(p || "").replace(/\D/g,"");
  if (!s || s.length < 7) return s || "—";
  return s.slice(0,4) + "*".repeat(Math.max(0, s.length-5)) + s.slice(-1);
};

// ─── Default data ───
const DEFAULT_STATE = {
  kitties: [
    // ── Contributions Kitties ──
    { id: 1, name: "Mama Sarah's Hospital Bill", raised: 1874000, goal: 2500000, contributors: 8, created: "2026-01-15", createdBy: "demo@mpamoja.co.ke", payChannel: "Paybill", paybill: "4990390", accountNo: "1001", mobile: "", feeCategory: "contributions" },
    { id: 2, name: "Kamau Family House Fire Relief", raised: 935000, goal: 1500000, contributors: 10, created: "2026-02-10", createdBy: "demo@mpamoja.co.ke", payChannel: "Mobile", paybill: "", accountNo: "", mobile: "0722334455", feeCategory: "contributions" },
    { id: 3, name: "Brian's University Fees 2026", raised: 542000, goal: 800000, contributors: 7, created: "2026-03-05", createdBy: "demo@mpamoja.co.ke", payChannel: "Paybill", paybill: "4990390", accountNo: "1003", mobile: "", feeCategory: "contributions" },
    // ── Chama Kitties ──
    { id: 4, name: "Chama Monthly – April", raised: 1346000, goal: 2000000, contributors: 9, created: "2026-01-01", createdBy: "demo@mpamoja.co.ke", payChannel: "Paybill", paybill: "4990390", accountNo: "1002", mobile: "", feeCategory: "chama" },
    { id: 5, name: "Umoja Sacco – Q1 Savings", raised: 780000, goal: 1200000, contributors: 6, created: "2026-02-01", createdBy: "demo@mpamoja.co.ke", payChannel: "Paybill", paybill: "4990390", accountNo: "1004", mobile: "", feeCategory: "chama" },
    { id: 6, name: "Eastlands Investment Pool", raised: 2115000, goal: 3000000, contributors: 10, created: "2025-12-01", createdBy: "demo@mpamoja.co.ke", payChannel: "Paybill", paybill: "4990390", accountNo: "1005", mobile: "", feeCategory: "chama" },
    // ── Events Kitties ──
    { id: 7, name: "Annual Harambee Dinner 2026", raised: 1630000, goal: 2000000, contributors: 8, created: "2026-03-01", createdBy: "demo@mpamoja.co.ke", payChannel: "Paybill", paybill: "4990390", accountNo: "1006", mobile: "", feeCategory: "events" },
    { id: 8, name: "Wanjiku's Wedding Fund", raised: 1435000, goal: 1500000, contributors: 9, created: "2026-02-20", createdBy: "demo@mpamoja.co.ke", payChannel: "Mobile", paybill: "", accountNo: "", mobile: "0712345678", feeCategory: "events" },
    { id: 9, name: "Youth Empowerment Summit", raised: 478000, goal: 1000000, contributors: 7, created: "2026-04-01", createdBy: "demo@mpamoja.co.ke", payChannel: "Mobile", paybill: "", accountNo: "", mobile: "0733445566", feeCategory: "events" },
  ],
  chamas: [
    { id: 1, name: "Nairobi Women Entrepreneurs", members: 24, pool: 145000, cycle: "Monthly", nextMeeting: "Apr 30", createdBy: "demo@mpamoja.co.ke", contributionAmount: 5000, penaltyType: "percentage", penaltyValue: 5, penaltyPerDay: true,
      memberList: [
        { id: 1, name: "Jane Wambua",   phone: "0712345671", joined: "Jan 2024" },
        { id: 2, name: "Mary Achieng",  phone: "0722987654", joined: "Jan 2024" },
        { id: 3, name: "Grace Muthoni", phone: "0733112233", joined: "Feb 2024" },
        { id: 4, name: "Esther Kamau",  phone: "0711223344", joined: "Feb 2024" },
      ]
    },
    { id: 2, name: "Eastlands Investment Club", members: 15, pool: 89500, cycle: "Weekly", nextMeeting: "Apr 26", createdBy: "demo@mpamoja.co.ke", contributionAmount: 2000, penaltyType: "fixed", penaltyValue: 200, penaltyPerDay: false,
      memberList: [
        { id: 1, name: "Peter Odhiambo", phone: "0722112233", joined: "Mar 2024" },
        { id: 2, name: "James Kariuki",  phone: "0733445566", joined: "Mar 2024" },
        { id: 3, name: "David Mutua",    phone: "0712998877", joined: "Apr 2024" },
      ]
    }
  ],
  events: [
    { id: 1, name: "Annual Harambee Dinner 2026", date: "15", month: "May", location: "Serena Hotel, Nairobi", attendees: 120, target: 200, createdBy: "demo@mpamoja.co.ke", status: "active", description: "Annual fundraising dinner for community development projects." },
    { id: 2, name: "Youth Empowerment Workshop",  date: "03", month: "Jun", location: "KICC, Nairobi",         attendees: 54,  target: 100, createdBy: "demo@mpamoja.co.ke", status: "active", description: "Skills and entrepreneurship training for the youth." }
  ],
  transactions: [
    // ── Mama Sarah's Hospital Bill (id:1, 8 contributors) ──
    { ref: "TRX001", name: "Jane Wambua",     phone: "0712345671", kitty: "Mama Sarah's Hospital Bill",      gross: 250000, fee: 0, net: 250000, type: "Contribution", status: "sent", time: "10 Jan",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX002", name: "Peter Odhiambo",  phone: "0722987654", kitty: "Mama Sarah's Hospital Bill",      gross: 300000, fee: 0, net: 300000, type: "Contribution", status: "sent", time: "11 Jan",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX003", name: "Grace Muthoni",   phone: "0733112233", kitty: "Mama Sarah's Hospital Bill",      gross: 200000, fee: 0, net: 200000, type: "Contribution", status: "sent", time: "12 Jan",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX004", name: "Esther Kamau",    phone: "0711223344", kitty: "Mama Sarah's Hospital Bill",      gross: 150000, fee: 0, net: 150000, type: "Contribution", status: "sent", time: "13 Jan",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX005", name: "James Kariuki",   phone: "0733445566", kitty: "Mama Sarah's Hospital Bill",      gross: 224000, fee: 0, net: 224000, type: "Contribution", status: "sent", time: "14 Jan",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX006", name: "David Mutua",     phone: "0712998877", kitty: "Mama Sarah's Hospital Bill",      gross: 280000, fee: 0, net: 280000, type: "Contribution", status: "sent", time: "15 Jan",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX007", name: "Ann Njeri",       phone: "0700112233", kitty: "Mama Sarah's Hospital Bill",      gross: 180000, fee: 0, net: 180000, type: "Contribution", status: "sent", time: "16 Jan",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX008", name: "Samuel Otieno",   phone: "0722334455", kitty: "Mama Sarah's Hospital Bill",      gross: 290000, fee: 0, net: 290000, type: "Contribution", status: "sent", time: "17 Jan",  ownerEmail: "demo@mpamoja.co.ke" },
    // ── Kamau Family House Fire Relief (id:2, 10 contributors) ──
    { ref: "TRX009", name: "Lucy Akinyi",     phone: "0733556677", kitty: "Kamau Family House Fire Relief",  gross: 100000, fee: 0, net: 100000, type: "Contribution", status: "sent", time: "12 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX010", name: "Moses Waweru",    phone: "0722667788", kitty: "Kamau Family House Fire Relief",  gross: 85000,  fee: 0, net: 8500,  type: "Contribution", status: "sent", time: "12 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX011", name: "Faith Chebet",    phone: "0711778899", kitty: "Kamau Family House Fire Relief",  gross: 120000, fee: 0, net: 120000, type: "Contribution", status: "sent", time: "13 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX012", name: "Kevin Mwangi",    phone: "0700889900", kitty: "Kamau Family House Fire Relief",  gross: 75000,  fee: 0, net: 7500,  type: "Contribution", status: "sent", time: "13 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX013", name: "Patricia Otieno", phone: "0733990011", kitty: "Kamau Family House Fire Relief",  gross: 90000,  fee: 0, net: 9000,  type: "Contribution", status: "sent", time: "14 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX014", name: "Brian Korir",     phone: "0722001122", kitty: "Kamau Family House Fire Relief",  gross: 110000, fee: 0, net: 110000, type: "Contribution", status: "sent", time: "14 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX015", name: "Carolyne Nyambura", phone: "0711223300", kitty: "Kamau Family House Fire Relief", gross: 80000, fee: 0, net: 80000, type: "Contribution", status: "sent", time: "15 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX016", name: "Eric Oloo",       phone: "0700334411", kitty: "Kamau Family House Fire Relief",  gross: 95000,  fee: 0, net: 9500,  type: "Contribution", status: "sent", time: "15 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX017", name: "Miriam Wanjiku",  phone: "0733445522", kitty: "Kamau Family House Fire Relief",  gross: 100000, fee: 0, net: 100000, type: "Contribution", status: "sent", time: "16 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX018", name: "Tony Mwenda",     phone: "0722556633", kitty: "Kamau Family House Fire Relief",  gross: 80000,  fee: 0, net: 8000,  type: "Contribution", status: "sent", time: "16 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    // ── Brian's University Fees 2026 (id:3, 7 contributors) ──
    { ref: "TRX019", name: "Rose Wanjiku",    phone: "0711667788", kitty: "Brian's University Fees 2026",    gross: 80000,  fee: 0, net: 80000,  type: "Contribution", status: "sent", time: "06 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX020", name: "Joseph Kamau",    phone: "0700778899", kitty: "Brian's University Fees 2026",    gross: 75000,  fee: 0, net: 75000,  type: "Contribution", status: "sent", time: "07 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX021", name: "Lilian Adhiambo", phone: "0733889900", kitty: "Brian's University Fees 2026",    gross: 100000, fee: 0, net: 100000, type: "Contribution", status: "sent", time: "07 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX022", name: "Daniel Kipchoge", phone: "0722990011", kitty: "Brian's University Fees 2026",    gross: 72000,  fee: 0, net: 72000,  type: "Contribution", status: "sent", time: "08 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX023", name: "Susan Mwangi",    phone: "0711001122", kitty: "Brian's University Fees 2026",    gross: 85000,  fee: 0, net: 85000,  type: "Contribution", status: "sent", time: "08 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX024", name: "Alex Ochieng",    phone: "0700112244", kitty: "Brian's University Fees 2026",    gross: 65000,  fee: 0, net: 65000,  type: "Contribution", status: "sent", time: "09 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX025", name: "Hellen Cherop",   phone: "0733223355", kitty: "Brian's University Fees 2026",    gross: 65000,  fee: 0, net: 65000,  type: "Contribution", status: "sent", time: "09 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    // ── Chama Monthly – April (id:4, 9 contributors) ──
    { ref: "TRX026", name: "Jane Wambua",     phone: "0712345671", kitty: "Chama Monthly – April",           gross: 150000, fee: 0, net: 150000, type: "Contribution", status: "sent", time: "01 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX027", name: "Mary Achieng",    phone: "0722987654", kitty: "Chama Monthly – April",           gross: 150000, fee: 0, net: 150000, type: "Contribution", status: "sent", time: "01 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX028", name: "Grace Muthoni",   phone: "0733112233", kitty: "Chama Monthly – April",           gross: 150000, fee: 0, net: 150000, type: "Contribution", status: "sent", time: "02 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX029", name: "Esther Kamau",    phone: "0711223344", kitty: "Chama Monthly – April",           gross: 150000, fee: 0, net: 150000, type: "Contribution", status: "sent", time: "02 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX030", name: "Peter Odhiambo",  phone: "0722112233", kitty: "Chama Monthly – April",           gross: 150000, fee: 0, net: 150000, type: "Contribution", status: "sent", time: "03 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX031", name: "James Kariuki",   phone: "0733445566", kitty: "Chama Monthly – April",           gross: 146000, fee: 0, net: 146000, type: "Contribution", status: "sent", time: "03 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX032", name: "David Mutua",     phone: "0712998877", kitty: "Chama Monthly – April",           gross: 150000, fee: 0, net: 150000, type: "Contribution", status: "sent", time: "04 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX033", name: "Ann Njeri",       phone: "0700112233", kitty: "Chama Monthly – April",           gross: 150000, fee: 0, net: 150000, type: "Contribution", status: "sent", time: "04 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX034", name: "Samuel Otieno",   phone: "0722334455", kitty: "Chama Monthly – April",           gross: 150000, fee: 0, net: 150000, type: "Contribution", status: "sent", time: "05 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    // ── Umoja Sacco – Q1 Savings (id:5, 6 contributors) ──
    { ref: "TRX035", name: "Lucy Akinyi",     phone: "0733556677", kitty: "Umoja Sacco – Q1 Savings",        gross: 130000, fee: 0, net: 130000, type: "Contribution", status: "sent", time: "05 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX036", name: "Moses Waweru",    phone: "0722667788", kitty: "Umoja Sacco – Q1 Savings",        gross: 130000, fee: 0, net: 130000, type: "Contribution", status: "sent", time: "05 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX037", name: "Faith Chebet",    phone: "0711778899", kitty: "Umoja Sacco – Q1 Savings",        gross: 130000, fee: 0, net: 130000, type: "Contribution", status: "sent", time: "06 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX038", name: "Kevin Mwangi",    phone: "0700889900", kitty: "Umoja Sacco – Q1 Savings",        gross: 130000, fee: 0, net: 130000, type: "Contribution", status: "sent", time: "06 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX039", name: "Patricia Otieno", phone: "0733990011", kitty: "Umoja Sacco – Q1 Savings",        gross: 130000, fee: 0, net: 130000, type: "Contribution", status: "sent", time: "07 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX040", name: "Brian Korir",     phone: "0722001122", kitty: "Umoja Sacco – Q1 Savings",        gross: 130000, fee: 0, net: 130000, type: "Contribution", status: "sent", time: "07 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    // ── Eastlands Investment Pool (id:6, 10 contributors) ──
    { ref: "TRX041", name: "Carolyne Nyambura", phone: "0711223300", kitty: "Eastlands Investment Pool",     gross: 220000, fee: 0, net: 220000, type: "Contribution", status: "sent", time: "03 Dec",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX042", name: "Eric Oloo",       phone: "0700334411", kitty: "Eastlands Investment Pool",       gross: 200000, fee: 0, net: 200000, type: "Contribution", status: "sent", time: "03 Dec",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX043", name: "Miriam Wanjiku",  phone: "0733445522", kitty: "Eastlands Investment Pool",       gross: 220000, fee: 0, net: 220000, type: "Contribution", status: "sent", time: "04 Dec",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX044", name: "Tony Mwenda",     phone: "0722556633", kitty: "Eastlands Investment Pool",       gross: 210000, fee: 0, net: 210000, type: "Contribution", status: "sent", time: "04 Dec",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX045", name: "Rose Wanjiku",    phone: "0711667788", kitty: "Eastlands Investment Pool",       gross: 200000, fee: 0, net: 200000, type: "Contribution", status: "sent", time: "05 Dec",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX046", name: "Joseph Kamau",    phone: "0700778899", kitty: "Eastlands Investment Pool",       gross: 220000, fee: 0, net: 220000, type: "Contribution", status: "sent", time: "05 Dec",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX047", name: "Lilian Adhiambo", phone: "0733889900", kitty: "Eastlands Investment Pool",       gross: 210000, fee: 0, net: 210000, type: "Contribution", status: "sent", time: "06 Dec",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX048", name: "Daniel Kipchoge", phone: "0722990011", kitty: "Eastlands Investment Pool",       gross: 215000, fee: 0, net: 215000, type: "Contribution", status: "sent", time: "06 Dec",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX049", name: "Susan Mwangi",    phone: "0711001122", kitty: "Eastlands Investment Pool",       gross: 215000, fee: 0, net: 215000, type: "Contribution", status: "sent", time: "07 Dec",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX050", name: "Alex Ochieng",    phone: "0700112244", kitty: "Eastlands Investment Pool",       gross: 205000, fee: 0, net: 205000, type: "Contribution", status: "sent", time: "07 Dec",  ownerEmail: "demo@mpamoja.co.ke" },
    // ── Annual Harambee Dinner 2026 (id:7, 8 contributors) ──
    { ref: "TRX051", name: "Hellen Cherop",   phone: "0733223355", kitty: "Annual Harambee Dinner 2026",     gross: 200000, fee: 0, net: 200000, type: "Contribution", status: "sent", time: "05 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX052", name: "Jane Wambua",     phone: "0712345671", kitty: "Annual Harambee Dinner 2026",     gross: 250000, fee: 0, net: 250000, type: "Contribution", status: "sent", time: "06 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX053", name: "Peter Odhiambo",  phone: "0722112233", kitty: "Annual Harambee Dinner 2026",     gross: 180000, fee: 0, net: 180000, type: "Contribution", status: "sent", time: "06 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX054", name: "Grace Muthoni",   phone: "0733112233", kitty: "Annual Harambee Dinner 2026",     gross: 220000, fee: 0, net: 220000, type: "Contribution", status: "sent", time: "07 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX055", name: "Moses Waweru",    phone: "0722667788", kitty: "Annual Harambee Dinner 2026",     gross: 150000, fee: 0, net: 150000, type: "Contribution", status: "sent", time: "07 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX056", name: "Faith Chebet",    phone: "0711778899", kitty: "Annual Harambee Dinner 2026",     gross: 200000, fee: 0, net: 200000, type: "Contribution", status: "sent", time: "08 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX057", name: "Kevin Mwangi",    phone: "0700889900", kitty: "Annual Harambee Dinner 2026",     gross: 230000, fee: 0, net: 230000, type: "Contribution", status: "sent", time: "08 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX058", name: "Patricia Otieno", phone: "0733990011", kitty: "Annual Harambee Dinner 2026",     gross: 200000, fee: 0, net: 200000, type: "Contribution", status: "sent", time: "09 Mar",  ownerEmail: "demo@mpamoja.co.ke" },
    // ── Wanjiku's Wedding Fund (id:8, 9 contributors) ──
    { ref: "TRX059", name: "Brian Korir",     phone: "0722001122", kitty: "Wanjiku's Wedding Fund",          gross: 159000, fee: 0, net: 159000, type: "Contribution", status: "sent", time: "22 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX060", name: "Carolyne Nyambura", phone: "0711223300", kitty: "Wanjiku's Wedding Fund",        gross: 160000, fee: 0, net: 160000, type: "Contribution", status: "sent", time: "22 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX061", name: "Eric Oloo",       phone: "0700334411", kitty: "Wanjiku's Wedding Fund",          gross: 158000, fee: 0, net: 158000, type: "Contribution", status: "sent", time: "23 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX062", name: "Miriam Wanjiku",  phone: "0733445522", kitty: "Wanjiku's Wedding Fund",          gross: 160000, fee: 0, net: 160000, type: "Contribution", status: "sent", time: "23 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX063", name: "Tony Mwenda",     phone: "0722556633", kitty: "Wanjiku's Wedding Fund",          gross: 160000, fee: 0, net: 160000, type: "Contribution", status: "sent", time: "24 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX064", name: "Rose Wanjiku",    phone: "0711667788", kitty: "Wanjiku's Wedding Fund",          gross: 160000, fee: 0, net: 160000, type: "Contribution", status: "sent", time: "24 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX065", name: "Joseph Kamau",    phone: "0700778899", kitty: "Wanjiku's Wedding Fund",          gross: 158000, fee: 0, net: 158000, type: "Contribution", status: "sent", time: "25 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX066", name: "Lilian Adhiambo", phone: "0733889900", kitty: "Wanjiku's Wedding Fund",          gross: 160000, fee: 0, net: 160000, type: "Contribution", status: "sent", time: "25 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX067", name: "Daniel Kipchoge", phone: "0722990011", kitty: "Wanjiku's Wedding Fund",          gross: 160000, fee: 0, net: 160000, type: "Contribution", status: "sent", time: "26 Feb",  ownerEmail: "demo@mpamoja.co.ke" },
    // ── Youth Empowerment Summit (id:9, 7 contributors) ──
    { ref: "TRX068", name: "Susan Mwangi",    phone: "0711001122", kitty: "Youth Empowerment Summit",        gross: 70000,  fee: 0, net: 70000,  type: "Contribution", status: "sent", time: "02 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX069", name: "Alex Ochieng",    phone: "0700112244", kitty: "Youth Empowerment Summit",        gross: 68000,  fee: 0, net: 68000,  type: "Contribution", status: "sent", time: "02 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX070", name: "Hellen Cherop",   phone: "0733223355", kitty: "Youth Empowerment Summit",        gross: 70000,  fee: 0, net: 70000,  type: "Contribution", status: "sent", time: "03 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX071", name: "Ann Njeri",       phone: "0700112233", kitty: "Youth Empowerment Summit",        gross: 65000,  fee: 0, net: 65000,  type: "Contribution", status: "sent", time: "03 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX072", name: "Samuel Otieno",   phone: "0722334455", kitty: "Youth Empowerment Summit",        gross: 70000,  fee: 0, net: 70000,  type: "Contribution", status: "sent", time: "04 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX073", name: "Lucy Akinyi",     phone: "0733556677", kitty: "Youth Empowerment Summit",        gross: 68000,  fee: 0, net: 68000,  type: "Contribution", status: "sent", time: "04 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    { ref: "TRX074", name: "Moses Waweru",    phone: "0722667788", kitty: "Youth Empowerment Summit",        gross: 67000,  fee: 0, net: 67000,  type: "Contribution", status: "sent", time: "05 Apr",  ownerEmail: "demo@mpamoja.co.ke" },
    // ── Withdrawal ──
    { ref: "WD001",  name: "Demo User",       phone: "",           kitty: "Harambee 2025",                   gross: 50000, fee: 1100, net: 48900, type: "Withdrawal", status: "sent", time: "12 Apr", ownerEmail: "demo@mpamoja.co.ke" },
  ],
  withdrawals: [
    { date: "12 Apr 2025", kitty: "Harambee 2025", gross: 50000, fee: 1100, net: 48900, pct: "2.2", status: "sent", ownerEmail: "demo@mpamoja.co.ke" }
  ],
  users: [
    { email: "demo@mpamoja.co.ke", phone: "0712345678", pass: "demo1234", name: "Demo User", initials: "DU", role: "Campaign Creator" }
  ]
};

// ─── Company Logo SVG ───
function MPamojaLogo({ size = 36 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 88" width={size} height={size}>
      <defs>
        <linearGradient id="mpl-gl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1B5E20"/>
          <stop offset="100%" stopColor="#43A047"/>
        </linearGradient>
        <linearGradient id="mpl-gr" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#26C6DA"/>
          <stop offset="100%" stopColor="#1565C0"/>
        </linearGradient>
        <linearGradient id="mpl-hr" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4DD0E1"/>
          <stop offset="100%" stopColor="#26C6DA"/>
        </linearGradient>
      </defs>
      <circle cx="22" cy="11" r="10" fill="#2E7D32"/>
      <circle cx="58" cy="11" r="10" fill="url(#mpl-hr)"/>
      <path d="M15,20 C10,20 6,23 6,28 L6,76 C6,82 10,86 15,86 C20,86 24,82 24,76 L24,52 C30,60 36,66 40,70 L40,55 C36,50 30,42 24,33 L24,28 C24,23 20,20 15,20 Z" fill="url(#mpl-gl)"/>
      <path d="M65,20 C70,20 74,23 74,28 L74,76 C74,82 70,86 65,86 C60,86 56,82 56,76 L56,52 C50,60 44,66 40,70 L40,55 C44,50 50,42 56,33 L56,28 C56,23 60,20 65,20 Z" fill="url(#mpl-gr)"/>
    </svg>
  );
}

// SVG Icons
const Icons = {
  logo: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  home: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  kitties: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  chama: <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  events: <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  profile: <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>,
  plus: <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  bell: <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  refresh: <svg viewBox="0 0 24 24"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  dollar: <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  transfer: <svg viewBox="0 0 24 24"><polyline points="17 11 21 7 17 3"/><line x1="21" y1="7" x2="9" y2="7"/><polyline points="7 21 3 17 7 13"/><line x1="15" y1="17" x2="3" y2="17"/></svg>,
  whatsapp: <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,
  file: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  newkitty: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  logout: <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  download: <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  info: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  settings: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>,
  send: <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  users: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  mappin: <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
};

// ─── Toast ───
function Toast({ msg, onDone }) {
  useEffect(() => { if (msg) { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); } }, [msg]);
  if (!msg) return null;
  return (
    <div className="toast" onClick={onDone} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:"0.75rem"}}>
      <div style={{flex:1,minWidth:0}}>
        <div className="toast-title">{msg.title}</div>
        <div className="toast-body">{msg.body}</div>
      </div>
      <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.8)",flexShrink:0}}>✕</div>
    </div>
  );
}

// ─── Modal ───
function Modal({ open, onClose, children, hideClose }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !hideClose && onClose()}>
      <div className="modal-sheet">
        <span className="modal-handle" />
        {!hideClose && <button className="modal-close-btn" onClick={onClose}>✕</button>}
        {children}
      </div>
    </div>
  );
}

// ─── Category-aware media config ───
const CATEGORY_MEDIA_CONFIG = {
  Medical:   { imageLabel:"Patient / Subject Photo",  imageHint:"Upload a photo of the person receiving care",         imageEmoji:"🏥", docLabel:"Medical Document",       docHint:"Diagnosis, bill or treatment plan (PDF/image)",  docEmoji:"📋", bannerLabel:null,          mediaStyle:"portrait" },
  Wedding:   { imageLabel:"Couple Photo",             imageHint:"A photo of the couple",                               imageEmoji:"💍", docLabel:"Invitation / Programme", docHint:"Wedding invitation or programme (PDF)",          docEmoji:"💌", bannerLabel:"Wedding Banner", mediaStyle:"portrait" },
  Education: { imageLabel:"Student / Beneficiary Photo", imageHint:"Photo of the student being supported",            imageEmoji:"🎓", docLabel:"Admission / Results",    docHint:"Admission letter or academic results (PDF)",     docEmoji:"📄", bannerLabel:null,          mediaStyle:"portrait" },
  Business:  { imageLabel:"Business / Product Photo", imageHint:"Show your product, premises or team",                imageEmoji:"💼", docLabel:"Business Plan / Proposal",docHint:"Business plan, proposal or registration (PDF)",  docEmoji:"📊", bannerLabel:"Business Banner",mediaStyle:"landscape" },
  Chama:     { imageLabel:"Group / Team Photo",       imageHint:"Upload a group photo of your chama",                  imageEmoji:"🤝", docLabel:"Chama Constitution",     docHint:"Chama constitution or registration document",    docEmoji:"📜", bannerLabel:"Group Banner", mediaStyle:"landscape" },
  Emergency: { imageLabel:"Situation Photo",          imageHint:"Photo showing the emergency or affected person",     imageEmoji:"🚨", docLabel:"Supporting Document",    docHint:"Police report, fire assessment or letter (PDF)", docEmoji:"🗂️", bannerLabel:null,          mediaStyle:"portrait" },
  Funeral:   { imageLabel:"Deceased Photo",           imageHint:"A memorial portrait of the departed",                imageEmoji:"🕊️", docLabel:"Death Certificate / Notice",docHint:"Death notice, obituary or certificate (PDF)",   docEmoji:"📋", bannerLabel:"Memorial Banner",mediaStyle:"portrait" },
  Other:     { imageLabel:"Campaign Photo",           imageHint:"Upload a photo that represents your cause",          imageEmoji:"✨", docLabel:"Supporting Document",    docHint:"Any relevant supporting document (PDF/image)",   docEmoji:"📎", bannerLabel:"Campaign Banner",mediaStyle:"landscape" },
};

// ─── Reusable media upload component for kitties ───
// FileZone: label-based file input — label click natively opens picker even in sandboxed iframes
let _fzSeq = 0;
function FileZone({ accept, onFile, className, style, children }) {
  const id = useRef("fz-" + (++_fzSeq)).current;
  return (
    <label
      htmlFor={id}
      className={className}
      style={{...style, cursor:"pointer", display: style && style.display ? style.display : "flex"}}
    >
      <input
        id={id}
        type="file"
        accept={accept}
        style={{display:"none"}}
        onChange={e => { if (e.target.files[0]) { onFile(e.target.files[0]); e.target.value = ""; } }}
      />
      {children}
    </label>
  );
}

function KittyMediaUpload({ category, mediaImage, setMediaImage, mediaDoc, setMediaDoc, mediaBanner, setMediaBanner }) {
  const cfg = CATEGORY_MEDIA_CONFIG[category] || CATEGORY_MEDIA_CONFIG.Other;
  const [activeTab, setActiveTab] = useState("image");

  const readFile = (file, setter) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setter({ dataUrl: e.target.result, name: file.name, size: file.size, type: file.type });
    reader.readAsDataURL(file);
  };

  const fmtSize = (bytes) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  const isImg   = (f) => f && f.type && f.type.startsWith("image/");

  const tabs = [
    { key: "image",  label: `📸 ${cfg.imageEmoji} Photo` },
    { key: "doc",    label: `📎 ${cfg.docEmoji} Document` },
    ...(cfg.bannerLabel ? [{ key: "banner", label: `🖼️ Banner` }] : []),
  ];

  const zoneBase = {
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    gap:"0.45rem", cursor:"pointer", borderRadius:16, padding:"1.4rem 1rem",
    textAlign:"center", transition:"all 0.2s",
  };

  return (
    <div style={{marginBottom:"1.1rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.65rem"}}>
        <span style={{fontSize:"1rem"}}>📁</span>
        <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--brand)",letterSpacing:"0.01em"}}>Media & Documents</div>
        <span style={{fontSize:"0.65rem",color:"var(--text3)",fontWeight:500,marginLeft:"auto"}}>optional</span>
      </div>

      {/* Tabs */}
      <div className="media-tabs">
        {tabs.map(t => (
          <button type="button" key={t.key} className={`media-tab${activeTab === t.key ? " active" : ""}`}
            onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Photo tab ── */}
      {activeTab === "image" && (
        <>
          {mediaImage ? (
            <div style={{position:"relative"}}>
              <img src={mediaImage.dataUrl} alt="preview"
                style={{width:"100%",maxHeight: cfg.mediaStyle === "portrait" ? 200 : 140,objectFit:"cover",borderRadius:14,display:"block",border:"2px solid rgba(16,185,129,0.25)",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}} />
              <button type="button" className="media-remove-btn" onClick={() => setMediaImage(null)}>✕</button>
              <div style={{marginTop:"0.5rem",fontSize:"0.68rem",color:"var(--text3)",textAlign:"center"}}>{mediaImage.name} · {fmtSize(mediaImage.size)}</div>
              <FileZone accept="image/*" onFile={f => readFile(f, setMediaImage)}
                style={{marginTop:"0.4rem",textAlign:"center",fontSize:"0.68rem",fontWeight:700,color:"var(--brand)",textDecoration:"underline",borderRadius:8,padding:"0.2rem 0"}}>
                Replace photo
              </FileZone>
            </div>
          ) : (
            <FileZone accept="image/*" onFile={f => readFile(f, setMediaImage)}
              className="media-upload-zone image-zone" style={zoneBase}>
              <div className="media-upload-icon" style={{background:"var(--emerald-light)"}}>{cfg.imageEmoji}</div>
              <div className="media-upload-title">{cfg.imageLabel}</div>
              <div className="media-upload-sub">{cfg.imageHint}<br/>JPG, PNG, WEBP · max 10MB</div>
              <div style={{marginTop:"0.25rem",fontSize:"0.7rem",fontWeight:700,color:"var(--emerald)",background:"var(--emerald-light)",borderRadius:60,padding:"3px 14px",border:"1.5px solid rgba(16,185,129,0.3)"}}>
                Tap to upload
              </div>
            </FileZone>
          )}
        </>
      )}

      {/* ── Document tab ── */}
      {activeTab === "doc" && (
        <>
          {mediaDoc ? (
            <div>
              {isImg(mediaDoc) ? (
                <div style={{position:"relative"}}>
                  <img src={mediaDoc.dataUrl} alt="doc preview"
                    style={{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:14,display:"block",border:"2px solid rgba(79,70,229,0.2)"}} />
                  <button type="button" className="media-remove-btn" onClick={() => setMediaDoc(null)}>✕</button>
                </div>
              ) : (
                <div className="media-doc-preview">
                  <div className="media-doc-icon">{cfg.docEmoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="media-doc-name">{mediaDoc.name}</div>
                    <div className="media-doc-size">{fmtSize(mediaDoc.size)}</div>
                  </div>
                  <div style={{fontSize:"0.65rem",fontWeight:700,color:"var(--emerald)",background:"var(--emerald-light)",borderRadius:6,padding:"2px 7px"}}>✓ Saved</div>
                </div>
              )}
              <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
                <FileZone accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onFile={f => readFile(f, setMediaDoc)}
                  style={{flex:1,textAlign:"center",fontSize:"0.68rem",fontWeight:700,color:"var(--brand)",textDecoration:"underline",borderRadius:8,padding:"0.3rem 0",cursor:"pointer"}}>
                  Replace file
                </FileZone>
                <button type="button" onClick={() => setMediaDoc(null)}
                  style={{flex:1,background:"var(--rose-light)",color:"var(--rose)",border:"none",borderRadius:8,padding:"0.3rem 0",fontSize:"0.68rem",fontWeight:700,cursor:"pointer",fontFamily:"var(--font)"}}>
                  ✕ Remove
                </button>
              </div>
            </div>
          ) : (
            <FileZone accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onFile={f => readFile(f, setMediaDoc)}
              className="media-upload-zone" style={zoneBase}>
              <div className="media-upload-icon" style={{background:"var(--brand-light)"}}>{cfg.docEmoji}</div>
              <div className="media-upload-title">{cfg.docLabel}</div>
              <div className="media-upload-sub">{cfg.docHint}<br/>PDF, DOC, JPG · max 20MB</div>
              <div style={{marginTop:"0.25rem",fontSize:"0.7rem",fontWeight:700,color:"var(--brand)",background:"var(--brand-light)",borderRadius:60,padding:"3px 14px",border:"1.5px solid rgba(79,70,229,0.25)"}}>
                Tap to upload
              </div>
            </FileZone>
          )}
        </>
      )}

      {/* ── Banner tab ── */}
      {activeTab === "banner" && cfg.bannerLabel && (
        <>
          {mediaBanner ? (
            <div style={{position:"relative"}}>
              <img src={mediaBanner.dataUrl} alt="banner"
                style={{width:"100%",maxHeight:130,objectFit:"cover",borderRadius:14,display:"block",border:"2px solid rgba(124,58,237,0.25)"}} />
              <button type="button" className="media-remove-btn" onClick={() => setMediaBanner(null)}>✕</button>
              <div style={{marginTop:"0.5rem",fontSize:"0.68rem",color:"var(--text3)",textAlign:"center"}}>{mediaBanner.name} · {fmtSize(mediaBanner.size)}</div>
              <FileZone accept="image/*" onFile={f => readFile(f, setMediaBanner)}
                style={{marginTop:"0.4rem",textAlign:"center",fontSize:"0.68rem",fontWeight:700,color:"var(--violet)",textDecoration:"underline",borderRadius:8,padding:"0.2rem 0"}}>
                Replace banner
              </FileZone>
            </div>
          ) : (
            <FileZone accept="image/*" onFile={f => readFile(f, setMediaBanner)}
              className="media-upload-zone" style={zoneBase}>
              <div className="media-upload-icon" style={{background:"var(--violet-light)"}}>🖼️</div>
              <div className="media-upload-title">{cfg.bannerLabel}</div>
              <div className="media-upload-sub">Wide banner image for your campaign page<br/>JPG, PNG · Recommended 1200×400px</div>
              <div style={{marginTop:"0.25rem",fontSize:"0.7rem",fontWeight:700,color:"var(--violet)",background:"var(--violet-light)",borderRadius:60,padding:"3px 14px",border:"1.5px solid rgba(124,58,237,0.25)"}}>
                Tap to upload
              </div>
            </FileZone>
          )}
        </>
      )}

      {/* Summary pills */}
      {(mediaImage || mediaDoc || mediaBanner) && (
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginTop:"0.65rem"}}>
          {mediaImage  && <span style={{display:"inline-flex",alignItems:"center",gap:4,background:"var(--emerald-light)",color:"var(--emerald)",fontSize:"0.62rem",fontWeight:700,borderRadius:60,padding:"3px 10px",border:"1px solid rgba(16,185,129,0.2)"}}>{cfg.imageEmoji} Photo ✓</span>}
          {mediaDoc    && <span style={{display:"inline-flex",alignItems:"center",gap:4,background:"var(--brand-light)",color:"var(--brand)",fontSize:"0.62rem",fontWeight:700,borderRadius:60,padding:"3px 10px",border:"1px solid rgba(79,70,229,0.2)"}}>{cfg.docEmoji} Doc ✓</span>}
          {mediaBanner && <span style={{display:"inline-flex",alignItems:"center",gap:4,background:"var(--violet-light)",color:"var(--violet)",fontSize:"0.62rem",fontWeight:700,borderRadius:60,padding:"3px 10px",border:"1px solid rgba(124,58,237,0.2)"}}>🖼️ Banner ✓</span>}
        </div>
      )}
    </div>
  );
}

// ─── New Kitty Form (3-step wizard) ───
function NewKittyForm({ onSubmit, onClose }) {
  // ── All hooks at the top level (React rules) ──
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    goal: "",
    feeCategory: "contributions",
    description: "",
    isPrivate: true,
    payChannel: "Mobile",
    mobile: "",
    paybill: "",
    accountNo: "",
    tillNo: "",
    bankName: "",
    bankAccount: "",
    endDate: "",
    endTime: ""
  });
  const [errors, setErrors] = useState({ name: false, goal: false });
  const [mediaImage, setMediaImage] = useState(null);
  const [mediaDoc, setMediaDoc] = useState(null);
  const [mediaBanner, setMediaBanner] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const platformCategories = [
    { value: "contributions", label: "Contributions", emoji: "🎯", color: "var(--brand)", bg: "var(--brand-light)", border: "rgba(79,70,229,0.3)" },
    { value: "chama", label: "Chama", emoji: "🤝", color: "var(--violet)", bg: "var(--violet-light)", border: "rgba(124,58,237,0.3)" },
    { value: "events", label: "Events", emoji: "🎟️", color: "var(--sky)", bg: "var(--sky-light)", border: "rgba(14,165,233,0.3)" },
  ];

  // ── Step indicator ──
  const renderStepBar = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: "1.5rem" }}>
      {[{ n: 1, label: "Kitty" }, { n: 2, label: "Financial" }, { n: 3, label: "Complete" }].map(({ n, label }, i, arr) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "0.82rem",
              transition: "all 0.3s",
              background: step > n ? "var(--brand)" : step === n ? "var(--brand)" : "var(--surface3)",
              color: step >= n ? "#fff" : "var(--text3)",
              boxShadow: step === n ? "var(--shadow-brand)" : "none",
              border: step > n ? "none" : step === n ? "none" : "2px solid var(--border)"
            }}>
              {step > n ? "✓" : n}
            </div>
            <span style={{
              fontSize: "0.62rem",
              fontWeight: 700,
              color: step >= n ? "var(--brand)" : "var(--text3)",
              letterSpacing: "0.02em"
            }}>
              {label}
            </span>
          </div>
          {i < arr.length - 1 && (
            <div style={{
              width: 64,
              height: 2,
              background: step > n ? "var(--brand)" : "var(--border)",
              margin: "0 4px",
              marginBottom: 18,
              borderRadius: 2,
              transition: "background 0.3s"
            }} />
          )}
        </div>
      ))}
    </div>
  );

  // ── Step 1: Kitty Details ──
  const renderStep1 = () => {
    const validateAndProceed = () => {
      const newErrors = {
        name: !form.name || form.name.trim() === "",
        goal: !form.goal || Number(form.goal) <= 0
      };

      setErrors(newErrors);

      if (!newErrors.name && !newErrors.goal) {
        setStep(2);
      } else {
        setTimeout(() => {
          const errorFields = document.querySelectorAll('.field-error');
          if (errorFields.length > 0) {
            errorFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            const firstInput = errorFields[0].querySelector('input, textarea');
            if (firstInput) firstInput.focus();
          }
        }, 100);
      }
    };

    return (
      <>
        {renderStepBar()}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 2 }}>Kitty Details</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>Tell us what you're raising funds for</div>
        </div>

        {/* Campaign Name */}
        <div className="field field-error">
          <label>Campaign Name <span style={{ color: "var(--rose)" }}>*</span></label>
          <input
            placeholder="e.g. Mama's Hospital Bill"
            value={form.name}
            onChange={e => {
              set("name", e.target.value);
              if (errors.name) setErrors({ ...errors, name: false });
            }}
            style={{
              borderColor: errors.name ? "var(--rose)" : undefined,
              background: errors.name ? "var(--rose-light)" : undefined
            }}
          />
          {errors.name && (
            <div style={{ marginTop: "0.3rem", fontSize: "0.72rem", color: "var(--rose)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>⚠️</span> Please enter a campaign name
            </div>
          )}
        </div>

        {/* Platform Category */}
        <div className="field field-error">
          <label>Platform Category <span style={{ color: "var(--rose)" }}>*</span></label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginTop: "0.25rem" }}>
            {platformCategories.map(opt => (
              <button
                key={opt.value}
                onClick={() => set("feeCategory", opt.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.7rem 0.9rem",
                  border: `2px solid ${form.feeCategory === opt.value ? opt.border : "var(--border)"}`,
                  borderRadius: 14,
                  background: form.feeCategory === opt.value ? opt.bg : "var(--surface2)",
                  cursor: "pointer",
                  fontFamily: "var(--font)",
                  textAlign: "left",
                  transition: "all 0.18s",
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  background: form.feeCategory === opt.value ? opt.color : "var(--surface3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  flexShrink: 0,
                  transition: "background 0.18s",
                }}>
                  {opt.emoji}
                </div>
                <div style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: form.feeCategory === opt.value ? opt.color : "var(--text)",
                  letterSpacing: "-0.01em"
                }}>
                  {opt.label}
                </div>
                {form.feeCategory === opt.value && (
                  <div style={{
                    marginLeft: "auto",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: opt.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Goal Amount */}
        <div className="field field-error">
          <label>Goal Amount (KES) <span style={{ color: "var(--rose)" }}>*</span></label>
          <input
            type="number"
            placeholder="e.g. 100000"
            value={form.goal}
            onChange={e => {
              set("goal", e.target.value);
              if (errors.goal) setErrors({ ...errors, goal: false });
            }}
            style={{
              borderColor: errors.goal ? "var(--rose)" : undefined,
              background: errors.goal ? "var(--rose-light)" : undefined
            }}
          />
          {errors.goal && (
            <div style={{ marginTop: "0.3rem", fontSize: "0.72rem", color: "var(--rose)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>⚠️</span> Please enter a valid goal amount (minimum KES 100)
            </div>
          )}
          <div style={{
            marginTop: "0.5rem",
            background: "linear-gradient(135deg, #EEF0FF 0%, #F5F3FF 100%)",
            border: "1.5px dashed rgba(79,70,229,0.25)",
            borderRadius: 10,
            padding: "0.6rem 0.75rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem"
          }}>
            <span style={{ fontSize: "1rem", lineHeight: 1.2, flexShrink: 0 }}>🚀</span>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--brand)", letterSpacing: "0.02em", marginBottom: 2 }}>
                Your goal, your rules
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text2)", lineHeight: 1.5 }}>
                This is just a <strong>milestone, not a ceiling</strong> — contributions can flow in beyond your goal. You can raise or lower this anytime while your kitty is live.
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="field">
          <label>Description <span style={{ fontWeight: 400, color: "var(--text3)" }}>(optional)</span></label>
          <textarea
            placeholder="Share your story — why are you raising funds? Help contributors understand your cause..."
            value={form.description}
            onChange={e => set("description", e.target.value)}
            style={{
              width: "100%",
              background: "var(--surface2)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "0.72rem 0.9rem",
              color: "var(--text)",
              fontFamily: "var(--font)",
              fontSize: "0.88rem",
              outline: "none",
              resize: "none",
              minHeight: 80,
              lineHeight: 1.5,
              transition: "border-color 0.18s"
            }}
            onFocus={e => e.target.style.borderColor = "var(--brand)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Media Upload */}
        <div style={{
          background: "linear-gradient(135deg, #F5F6FA, #EEF0FF)",
          border: "1.5px solid rgba(79,70,229,0.12)",
          borderRadius: 14,
          padding: "0.9rem 1rem",
          marginBottom: "1.1rem"
        }}>
          <KittyMediaUpload
            uid="new-kitty"
            category={form.feeCategory}
            mediaImage={mediaImage}
            setMediaImage={setMediaImage}
            mediaDoc={mediaDoc}
            setMediaDoc={setMediaDoc}
            mediaBanner={mediaBanner}
            setMediaBanner={setMediaBanner}
          />
        </div>

        {/* Privacy Toggle */}
        <div
          onClick={() => set("isPrivate", !form.isPrivate)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "var(--surface2)",
            border: `1.5px solid ${form.isPrivate ? "var(--brand)" : "var(--border)"}`,
            borderRadius: 12,
            padding: "0.75rem 0.9rem",
            cursor: "pointer",
            marginBottom: "1.1rem",
            transition: "all 0.18s"
          }}
        >
          <div style={{
            width: 40,
            height: 22,
            borderRadius: 60,
            background: form.isPrivate ? "var(--brand)" : "var(--surface3)",
            position: "relative",
            transition: "background 0.2s",
            flexShrink: 0,
            border: "1.5px solid",
            borderColor: form.isPrivate ? "var(--brand)" : "var(--border)"
          }}>
            <div style={{
              position: "absolute",
              top: 1,
              left: form.isPrivate ? 18 : 1,
              width: 16,
              height: 16,
              background: "#fff",
              borderRadius: "50%",
              transition: "left 0.2s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
            }} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text)" }}>
              {form.isPrivate ? "🔒 Private Kitty" : "🌍 Public Kitty"}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text3)", marginTop: 1 }}>
              {form.isPrivate ? "Only people with the link can contribute" : "Visible to all M-Pamoja members"}
            </div>
          </div>
        </div>

        <button className="confirm-btn" onClick={validateAndProceed}>
          Continue → Financial Details
        </button>
        <button className="back-btn" onClick={onClose}>Cancel</button>
      </>
    );
  };

  // ── Step 2: Financial Details ──
  const renderStep2 = () => {
    const channels = ["Mobile", "Paybill", "Till", "Bank"];

    const validateAndSubmit = () => {
      const needsChannel = (form.payChannel === "Mobile" && !form.mobile) ||
        (form.payChannel === "Paybill" && (!form.paybill || !form.accountNo)) ||
        (form.payChannel === "Till" && !form.tillNo) ||
        (form.payChannel === "Bank" && (!form.bankName || !form.bankAccount));

      if (needsChannel) {
        // Find the first empty field and focus it
        setTimeout(() => {
          const emptyFields = document.querySelectorAll('.field-required input, .field-required select');
          for (const field of emptyFields) {
            if (!field.value) {
              field.focus();
              field.scrollIntoView({ behavior: 'smooth', block: 'center' });
              break;
            }
          }
        }, 100);
        return;
      }
      setStep(3);
    };

    return (
      <>
        {renderStepBar()}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 2 }}>Financial Details</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>Where should contributions be sent?</div>
        </div>

        {/* Payment Channel */}
        <div style={{ marginBottom: "1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text2)", letterSpacing: "0.01em" }}>
              Beneficiary payment channel
            </label>
            <span title="Where contributors' funds will land" style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: "1.5px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.65rem",
              color: "var(--text3)",
              cursor: "help",
              flexShrink: 0
            }}>
              ⓘ
            </span>
          </div>
          <div style={{
            display: "flex",
            background: "var(--surface3)",
            borderRadius: 60,
            padding: 4,
            gap: 2,
            border: "1px solid var(--border)"
          }}>
            {channels.map(ch => (
              <button
                key={ch}
                onClick={() => set("payChannel", ch)}
                style={{
                  flex: 1,
                  padding: "0.5rem 0.25rem",
                  border: "none",
                  borderRadius: 60,
                  fontFamily: "var(--font)",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  letterSpacing: "0.01em",
                  background: form.payChannel === ch ? "var(--surface)" : "transparent",
                  color: form.payChannel === ch ? "var(--brand)" : "var(--text3)",
                  boxShadow: form.payChannel === ch ? "var(--shadow-sm)" : "none"
                }}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile */}
        {form.payChannel === "Mobile" && (
          <div className="field field-required">
            <label>M-Pesa Phone Number <span style={{ color: "var(--rose)" }}>*</span></label>
            <input
              placeholder="e.g. 0712 345 678"
              value={form.mobile}
              onChange={e => set("mobile", e.target.value)}
            />
            <div style={{ marginTop: "0.4rem", fontSize: "0.68rem", color: "var(--text3)", display: "flex", alignItems: "center", gap: 4 }}>
              <span>📱</span> Contributions go directly to this M-Pesa number
            </div>
          </div>
        )}

        {/* Paybill */}
        {form.payChannel === "Paybill" && (
          <>
            <div className="field field-required">
              <label>Mpesa PayBill <span style={{ color: "var(--rose)" }}>*</span></label>
              <input
                placeholder="PayBill number"
                value={form.paybill}
                onChange={e => set("paybill", e.target.value)}
              />
            </div>
            <div className="field field-required">
              <label>Account number <span style={{ color: "var(--rose)" }}>*</span></label>
              <input
                placeholder="Account number"
                value={form.accountNo}
                onChange={e => set("accountNo", e.target.value)}
              />
            </div>
          </>
        )}

        {/* Till */}
        {form.payChannel === "Till" && (
          <div className="field field-required">
            <label>M-Pesa Till Number <span style={{ color: "var(--rose)" }}>*</span></label>
            <input
              placeholder="e.g. 123456"
              value={form.tillNo}
              onChange={e => set("tillNo", e.target.value)}
            />
            <div style={{ marginTop: "0.4rem", fontSize: "0.68rem", color: "var(--text3)" }}>
              🏪 Funds sent directly to this till number
            </div>
          </div>
        )}

        {/* Bank */}
        {form.payChannel === "Bank" && (
          <>
            <div className="field field-required">
              <label>Bank Name <span style={{ color: "var(--rose)" }}>*</span></label>
              <select
                value={form.bankName}
                onChange={e => set("bankName", e.target.value)}
              >
                <option value="">Select bank</option>
                {["KCB Bank", "Equity Bank", "Co-operative Bank", "NCBA Bank", "Absa Bank", "Standard Chartered", "DTB Bank", "Family Bank", "I&M Bank", "Other"].map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="field field-required">
              <label>Account Number <span style={{ color: "var(--rose)" }}>*</span></label>
              <input
                placeholder="e.g. 1234567890"
                value={form.bankAccount}
                onChange={e => set("bankAccount", e.target.value)}
              />
            </div>
          </>
        )}

        {/* End Date */}
        <div style={{ marginBottom: "1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text2)", letterSpacing: "0.01em" }}>
              Expected contribution end date
            </label>
            <span title="Kitty stays open until you close it — this is just a target date" style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: "1.5px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.65rem",
              color: "var(--text3)",
              cursor: "help",
              flexShrink: 0
            }}>
              ⓘ
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <input
              type="date"
              value={form.endDate}
              onChange={e => set("endDate", e.target.value)}
              style={{
                width: "100%",
                background: "var(--surface2)",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "0.72rem 0.9rem",
                color: form.endDate ? "var(--text)" : "var(--text3)",
                fontFamily: "var(--font)",
                fontSize: "0.82rem",
                outline: "none",
                transition: "border-color 0.18s"
              }}
              onFocus={e => e.target.style.borderColor = "var(--brand)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <input
              type="time"
              value={form.endTime}
              onChange={e => set("endTime", e.target.value)}
              style={{
                width: "100%",
                background: "var(--surface2)",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "0.72rem 0.9rem",
                color: form.endTime ? "var(--text)" : "var(--text3)",
                fontFamily: "var(--font)",
                fontSize: "0.82rem",
                outline: "none",
                transition: "border-color 0.18s"
              }}
              onFocus={e => e.target.style.borderColor = "var(--brand)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>
          <div style={{ marginTop: "0.4rem", fontSize: "0.68rem", color: "var(--text3)", lineHeight: 1.4 }}>
            ⏰ Your kitty stays open until you manually close it — this date is just a milestone reminder.
          </div>
        </div>

        {/* Summary Preview */}
        <div style={{
          background: "linear-gradient(135deg, #F5F3FF, #EEF0FF)",
          border: "1.5px solid rgba(79,70,229,0.15)",
          borderRadius: 14,
          padding: "0.9rem 1rem",
          marginBottom: "1.1rem"
        }}>
          <div style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--brand)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "0.5rem"
          }}>
            Kitty Preview
          </div>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>
            {form.name || "Unnamed Kitty"}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text3)", marginBottom: "0.4rem" }}>
            {platformCategories.find(c => c.value === form.feeCategory)?.emoji}
            {platformCategories.find(c => c.value === form.feeCategory)?.label} ·
            {form.isPrivate ? "🔒 Private" : "🌍 Public"}
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--brand)", fontFamily: "var(--mono)" }}>
            KES {Number(form.goal || 0).toLocaleString()}
          </div>
        </div>

        <button className="confirm-btn" onClick={validateAndSubmit}>
          Submit →
        </button>
        <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
      </>
    );
  };

  // ── Step 3: Complete ──
  const renderStep3 = () => {
    const handleLaunch = async () => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        const formData = { ...form, mediaImage, mediaDoc, mediaBanner };
        console.log('🚀 Launching kitty with data:', formData);
        await onSubmit(formData);
      } catch (error) {
        console.error('❌ Error launching kitty:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <>
        {renderStepBar()}

        {/* Success Animation */}
        <div style={{ textAlign: "center", padding: "1rem 0 0.5rem" }}>
          <div style={{
            width: 72,
            height: 72,
            background: "linear-gradient(135deg, #10B981, #059669)",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
            fontSize: "2rem"
          }}>
            🎉
          </div>
          <div style={{
            fontSize: "1.15rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 6,
            color: "var(--text)"
          }}>
            You're all set!
          </div>
          <div style={{
            fontSize: "0.8rem",
            color: "var(--text3)",
            lineHeight: 1.6,
            marginBottom: "1.5rem"
          }}>
            Review your kitty details below, then launch it to start collecting contributions.
          </div>
        </div>

        {/* Final Summary Card */}
        <div style={{
          background: "var(--surface2)",
          border: "1.5px solid var(--border)",
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: "1.1rem"
        }}>
          <div style={{
            background: "var(--grad)",
            padding: "0.9rem 1rem"
          }}>
            <div style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 3
            }}>
              Campaign
            </div>
            <div style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em"
            }}>
              {form.name || "Unnamed Kitty"}
            </div>
            <div style={{
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.75)",
              marginTop: 2
            }}>
              {platformCategories.find(c => c.value === form.feeCategory)?.emoji}
              {platformCategories.find(c => c.value === form.feeCategory)?.label}
            </div>
          </div>

          {[
            ["Goal Amount", `KES ${Number(form.goal).toLocaleString()}`],
            [
              "Payment Channel",
              form.payChannel === "Mobile" ? `📱 ${form.mobile}` :
                form.payChannel === "Paybill" ? `🏢 ${form.paybill} · Acc ${form.accountNo}` :
                  form.payChannel === "Till" ? `🏪 ${form.tillNo}` :
                    form.payChannel === "Bank" ? `🏦 ${form.bankName}` :
                      form.payChannel || "Not set"
            ],
            ["Visibility", form.isPrivate ? "🔒 Private — invite only" : "🌍 Public"],
            ...(form.endDate ? [["End Date", form.endDate + (form.endTime ? ` · ${form.endTime}` : "")]] : [])
          ].filter(([key]) => key).map(([key, value]) => (
            <div key={key} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.65rem 1rem",
              borderBottom: "1px solid var(--border)"
            }}>
              <span style={{
                fontSize: "0.72rem",
                color: "var(--text3)",
                fontWeight: 600
              }}>
                {key}
              </span>
              <span style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "var(--text)",
                textAlign: "right",
                maxWidth: "55%",
                wordBreak: "break-word"
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Media Summary */}
        {(mediaImage || mediaDoc || mediaBanner) && (
          <div style={{
            background: "var(--surface2)",
            border: "1.5px solid var(--border)",
            borderRadius: 12,
            padding: "0.7rem 1rem",
            marginBottom: "1.1rem"
          }}>
            <div style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "var(--text3)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.4rem"
            }}>
              📎 Media Attached
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {mediaImage && (
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "var(--emerald-light)",
                  color: "var(--emerald)",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  borderRadius: 60,
                  padding: "3px 10px",
                  border: "1px solid rgba(16,185,129,0.2)"
                }}>
                  📸 Photo
                </span>
              )}
              {mediaDoc && (
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "var(--brand-light)",
                  color: "var(--brand)",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  borderRadius: 60,
                  padding: "3px 10px",
                  border: "1px solid rgba(79,70,229,0.2)"
                }}>
                  📄 Document
                </span>
              )}
              {mediaBanner && (
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "var(--violet-light)",
                  color: "var(--violet)",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  borderRadius: 60,
                  padding: "3px 10px",
                  border: "1px solid rgba(124,58,237,0.2)"
                }}>
                  🖼️ Banner
                </span>
              )}
            </div>
          </div>
        )}

        {/* Ready Message */}
        <div style={{
          background: "var(--emerald-light)",
          border: "1.5px solid rgba(16, 185, 129, 0.2)",
          borderRadius: 12,
          padding: "0.7rem 0.9rem",
          display: "flex",
          gap: "0.5rem",
          alignItems: "flex-start",
          marginBottom: "1.1rem"
        }}>
          <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>✅</span>
          <div style={{ fontSize: "0.7rem", color: "#065F46", lineHeight: 1.5 }}>
            <strong>Your kitty is ready to go live.</strong> Once launched, you'll get a shareable link to send to family & friends.
          </div>
        </div>

        {/* Action Buttons */}
        <button
          className="confirm-btn"
          onClick={handleLaunch}
          disabled={isSubmitting}
          style={{
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer"
          }}
        >
          {isSubmitting ? "🚀 Launching..." : "🚀 Launch Kitty"}
        </button>

        <button
          className="back-btn"
          onClick={() => setStep(2)}
          disabled={isSubmitting}
          style={{
            opacity: isSubmitting ? 0.5 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer"
          }}
        >
          ← Back to Financial
        </button>
      </>
    );
  };

  // ── Main Render ──
  return (
    <>
      <div className="modal-title">Create a Kitty</div>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </>
  );
}

// ─── New Chama Form ───
function NewChamaForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({ name: "", members: "", cycle: "Monthly", contribution: "", penaltyType: "fixed", penaltyValue: "", penaltyFrequency: "daily" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [mediaImage,  setMediaImage]  = useState(null);
  const [mediaDoc,    setMediaDoc]    = useState(null);
  const [mediaBanner, setMediaBanner] = useState(null);
  return (
    <>
      <div className="modal-title">Create New Chama</div>
      <div className="field"><label>Chama Name</label><input placeholder="e.g. Nairobi Women's Chama" value={form.name} onChange={e => set("name", e.target.value)} /></div>
      <div className="field"><label>Contribution Cycle</label>
        <select value={form.cycle} onChange={e => set("cycle", e.target.value)}>
          {["Weekly","Bi-Weekly","Monthly","Quarterly"].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="g2">
        <div className="field"><label>Max Members</label><input type="number" placeholder="e.g. 20" value={form.members} onChange={e => set("members", e.target.value)} /></div>
        <div className="field"><label>Contribution (KES)</label><input type="number" placeholder="e.g. 5000" value={form.contribution} onChange={e => set("contribution", e.target.value)} /></div>
      </div>

      {/* ── Late Contribution Penalty ── */}
      <div style={{background:"linear-gradient(135deg,#F5F3FF,#EEF0FF)",border:"1.5px solid rgba(124,58,237,0.18)",borderRadius:14,padding:"0.9rem 1rem",marginBottom:"1.1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.75rem"}}>
          <span style={{fontSize:"1rem"}}>⚠️</span>
          <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--violet)",letterSpacing:"0.01em"}}>Late Contribution Penalty</div>
        </div>

        <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.75rem"}}>
          {[["fixed","Fixed (KES)"],["percentage","Percentage (%)"]].map(([val,lbl]) => (
            <button key={val} onClick={() => set("penaltyType", val)} style={{
              flex:1,padding:"0.5rem",border:`2px solid ${form.penaltyType===val?"var(--violet)":"var(--border)"}`,
              borderRadius:10,background:form.penaltyType===val?"var(--violet-light)":"var(--surface)",
              color:form.penaltyType===val?"var(--violet)":"var(--text3)",fontWeight:700,fontSize:"0.72rem",
              cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.18s"
            }}>{lbl}</button>
          ))}
        </div>

        <div className="field" style={{marginBottom:"0.65rem"}}>
          <label style={{fontSize:"0.7rem",color:"var(--violet)"}}>{form.penaltyType === "fixed" ? "Penalty Amount (KES)" : "Penalty Rate (%)"}</label>
          <input type="number" placeholder={form.penaltyType === "fixed" ? "e.g. 200" : "e.g. 5"} min="0"
            value={form.penaltyValue} onChange={e => set("penaltyValue", e.target.value)}
            style={{borderColor: form.penaltyValue ? "var(--violet)" : undefined}} />
        </div>

        <div className="field" style={{marginBottom:"0.65rem"}}>
          <label style={{fontSize:"0.7rem",color:"var(--violet)"}}>Penalty Frequency</label>
          <select value={form.penaltyFrequency} onChange={e => set("penaltyFrequency", e.target.value)}
            style={{borderColor:"rgba(124,58,237,0.35)",color:"var(--violet)",fontWeight:600}}>
            <option value="daily">Daily — charged per day overdue</option>
            <option value="weekly">Weekly — charged per week overdue</option>
            <option value="monthly">Monthly — charged once per month late</option>
          </select>
        </div>

        {form.penaltyValue > 0 && (
          <div style={{marginTop:"0.6rem",background:"var(--surface)",borderRadius:10,padding:"0.55rem 0.75rem",border:"1px solid rgba(124,58,237,0.12)",fontSize:"0.7rem",color:"var(--text2)",lineHeight:1.5}}>
            📌 <strong style={{color:"var(--violet)"}}>Example:</strong>{" "}
            {form.penaltyFrequency === "daily" && `3 days late → ${form.penaltyType==="fixed" ? `KES ${fmt((Number(form.penaltyValue)||0)*3)} penalty` : `${(Number(form.penaltyValue)||0)*3}% of contribution`}`}
            {form.penaltyFrequency === "weekly" && `2 weeks late → ${form.penaltyType==="fixed" ? `KES ${fmt((Number(form.penaltyValue)||0)*2)} penalty` : `${(Number(form.penaltyValue)||0)*2}% of contribution`}`}
            {form.penaltyFrequency === "monthly" && `1 month late → ${form.penaltyType==="fixed" ? `KES ${fmt(Number(form.penaltyValue)||0)} penalty` : `${Number(form.penaltyValue)||0}% of contribution`}`}
          </div>
        )}
      </div>

      <div style={{background:"linear-gradient(135deg,#F5F3FF,#EEF0FF)",border:"1.5px solid rgba(124,58,237,0.15)",borderRadius:14,padding:"0.9rem 1rem",marginBottom:"1.1rem"}}>
        <KittyMediaUpload
          category="Chama"
          mediaImage={mediaImage} setMediaImage={setMediaImage}
          mediaDoc={mediaDoc}    setMediaDoc={setMediaDoc}
          mediaBanner={mediaBanner} setMediaBanner={setMediaBanner}
        />
      </div>

      <button className="confirm-btn" style={{background:"var(--grad-chama)",boxShadow:"0 8px 32px rgba(124,58,237,0.28)"}} onClick={() => { if (!form.name || !form.contribution) return; onSubmit({ ...form, mediaImage, mediaDoc, mediaBanner }); }}>Create Chama →</button>
      <button className="back-btn" onClick={onClose}>Cancel</button>
    </>
  );
}

// ─── New Event Form ───
function NewEventForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({ name: "", date: "", month: "Jan", location: "", target: "", description: "" });
  const [mediaImage,  setMediaImage]  = useState(null);
  const [mediaBanner, setMediaBanner] = useState(null);
  const [mediaDoc,    setMediaDoc]    = useState(null);
  const [mediaErr,    setMediaErr]    = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const readFile = (file, setter) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setter({ dataUrl: e.target.result, name: file.name, size: file.size, type: file.type });
    reader.readAsDataURL(file);
  };
  const fmtSize = (bytes) => bytes < 1024*1024 ? `${(bytes/1024).toFixed(0)} KB` : `${(bytes/1024/1024).toFixed(1)} MB`;
  const isImg   = (f) => f && f.type && f.type.startsWith("image/");
  const hasMedia = mediaImage || mediaBanner || mediaDoc;

  const zoneBase = {
    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
    gap:"0.4rem",cursor:"pointer",borderRadius:14,padding:"1.1rem 0.75rem",textAlign:"center",transition:"all 0.2s",
  };

  return (
    <>
      <div className="modal-title">Create New Event</div>
      <div className="field"><label>Event Name <span style={{color:"var(--rose)"}}>*</span></label>
        <input placeholder="e.g. Annual Harambee Dinner" value={form.name} onChange={e => set("name", e.target.value)} />
      </div>
      <div className="g2">
        <div className="field"><label>Day <span style={{color:"var(--rose)"}}>*</span></label>
          <input type="number" min="1" max="31" placeholder="15" value={form.date} onChange={e => set("date", e.target.value.padStart(2,"0"))} />
        </div>
        <div className="field"><label>Month</label>
          <select value={form.month} onChange={e => set("month", e.target.value)}>
            {months.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="field"><label>Venue / Location</label>
        <input placeholder="e.g. Serena Hotel, Nairobi" value={form.location} onChange={e => set("location", e.target.value)} />
      </div>
      <div className="field"><label>Target Attendees</label>
        <input type="number" placeholder="e.g. 200" value={form.target} onChange={e => set("target", e.target.value)} />
      </div>
      <div className="field"><label>Description <span style={{fontWeight:400,color:"var(--text3)"}}>(optional)</span></label>
        <textarea placeholder="What is this event about? Who should attend?" value={form.description}
          onChange={e => set("description", e.target.value)}
          style={{width:"100%",background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"0.72rem 0.9rem",color:"var(--text)",fontFamily:"var(--font)",fontSize:"0.88rem",outline:"none",resize:"none",minHeight:68,lineHeight:1.5,transition:"border-color 0.18s"}}
          onFocus={e=>e.target.style.borderColor="var(--sky)"} onBlur={e=>e.target.style.borderColor="var(--border)"} />
      </div>

      {/* ── Media Upload (mandatory — at least one) ── */}
      <div style={{background:"linear-gradient(135deg,#F0F9FF,#EEF0FF)",border:`1.5px solid ${mediaErr?"var(--rose)":hasMedia?"rgba(14,165,233,0.3)":"rgba(14,165,233,0.18)"}`,borderRadius:14,padding:"0.9rem 1rem",marginBottom:"1.1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.55rem"}}>
          <span style={{fontSize:"1rem"}}>📁</span>
          <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--sky)"}}>Event Media</div>
          <span style={{fontSize:"0.65rem",fontWeight:700,color:mediaErr?"var(--rose)":"var(--rose)",background:"var(--rose-light)",borderRadius:20,padding:"1px 7px",marginLeft:"auto"}}>
            {hasMedia ? "✓ Added" : "Required *"}
          </span>
        </div>
        {mediaErr && !hasMedia && (
          <div style={{fontSize:"0.7rem",color:"var(--rose)",fontWeight:600,marginBottom:"0.5rem",background:"var(--rose-light)",borderRadius:8,padding:"0.4rem 0.7rem"}}>
            ⚠️ Please upload at least one image, banner, or document.
          </div>
        )}

        {/* Image / Banner zone */}
        {!mediaBanner && !mediaImage && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.5rem"}}>
            <FileZone accept="image/*" onFile={f => { readFile(f, setMediaImage); setMediaErr(false); }}
              className="media-upload-zone image-zone" style={zoneBase}>
              <div className="media-upload-icon" style={{background:"var(--sky-light)",width:38,height:38,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>📸</div>
              <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--sky)"}}>Event Photo</div>
              <div style={{fontSize:"0.6rem",color:"var(--text3)"}}>JPG, PNG · max 10MB</div>
            </FileZone>
            <FileZone accept="image/*" onFile={f => { readFile(f, setMediaBanner); setMediaErr(false); }}
              className="media-upload-zone image-zone" style={zoneBase}>
              <div className="media-upload-icon" style={{background:"var(--violet-light)",width:38,height:38,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>🖼️</div>
              <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--violet)"}}>Event Banner</div>
              <div style={{fontSize:"0.6rem",color:"var(--text3)"}}>Wide format recommended</div>
            </FileZone>
          </div>
        )}
        {mediaImage && (
          <div style={{position:"relative",marginBottom:"0.5rem"}}>
            <img src={mediaImage.dataUrl} alt="preview" style={{width:"100%",maxHeight:130,objectFit:"cover",borderRadius:10,display:"block",border:"2px solid rgba(14,165,233,0.25)"}} />
            <button className="media-remove-btn" onClick={()=>setMediaImage(null)}>✕</button>
            <div style={{marginTop:"0.3rem",fontSize:"0.65rem",color:"var(--text3)",textAlign:"center"}}>📸 {mediaImage.name} · {fmtSize(mediaImage.size)}</div>
          </div>
        )}
        {mediaBanner && (
          <div style={{position:"relative",marginBottom:"0.5rem"}}>
            <img src={mediaBanner.dataUrl} alt="banner" style={{width:"100%",maxHeight:120,objectFit:"cover",borderRadius:10,display:"block",border:"2px solid rgba(124,58,237,0.25)"}} />
            <button className="media-remove-btn" onClick={()=>setMediaBanner(null)}>✕</button>
            <div style={{marginTop:"0.3rem",fontSize:"0.65rem",color:"var(--text3)",textAlign:"center"}}>🖼️ {mediaBanner.name} · {fmtSize(mediaBanner.size)}</div>
          </div>
        )}

        {/* Doc zone */}
        {!mediaDoc ? (
          <FileZone accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,image/*,application/pdf"
            onFile={f => { readFile(f, setMediaDoc); setMediaErr(false); }}
            className="media-upload-zone" style={{...zoneBase,padding:"0.65rem",flexDirection:"row",gap:"0.6rem",justifyContent:"flex-start",background:"var(--surface)",border:"1.5px dashed var(--border)",borderRadius:10}}>
            <div style={{width:32,height:32,borderRadius:10,background:"var(--brand-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>📎</div>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--brand)"}}>Upload Programme / Flyer</div>
              <div style={{fontSize:"0.62rem",color:"var(--text3)"}}>PDF, DOC, JPG · max 20MB</div>
            </div>
          </FileZone>
        ) : (
          <div className="media-doc-preview" style={{marginTop:"0.4rem"}}>
            <div className="media-doc-icon">📎</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="media-doc-name">{mediaDoc.name}</div>
              <div className="media-doc-size">{fmtSize(mediaDoc.size)}</div>
            </div>
            <button onClick={()=>setMediaDoc(null)} style={{background:"var(--rose-light)",color:"var(--rose)",border:"none",borderRadius:6,padding:"3px 9px",fontSize:"0.65rem",fontWeight:700,cursor:"pointer",fontFamily:"var(--font)"}}>Remove</button>
          </div>
        )}
      </div>

      <button className="confirm-btn" style={{background:"var(--grad-events)",boxShadow:"0 8px 32px rgba(14,165,233,0.28)"}} onClick={() => {
        if (!form.name || !form.date) return;
        if (!hasMedia) { setMediaErr(true); return; }
        onSubmit({ ...form, mediaImage, mediaBanner, mediaDoc });
      }}>Create Event →</button>
      <button className="back-btn" onClick={onClose}>Cancel</button>
    </>
  );
}

// ─── Auth Screen ───
function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [msg, setMsg] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState({ email: "demo@mpamoja.co.ke", pass: "demo1234" });
  const [signup, setSignup] = useState({ fn: "", ln: "", em: "", ph: "", pw: "", role: "Campaign Creator" });

  // ✅ Define BASE here (or use from props/context)
  const BASE = ''; // Empty for proxy, or 'http://localhost:5215' for direct

  const handleLoginChange = (e) => {
    setLogin(l => ({ ...l, [e.target.name]: e.target.value }));
    setMsg(""); // Clear error message when user types
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 9 && cleaned.length <= 12;
  };

  const doLogin = async () => {
  try {
    const response = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPhone: login.email,
        password: login.pass
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      setMsg(data.error || "Login failed. Please try again.");
      return;
    }

    // ✅ LOG THE TOKEN
    console.log('🔑 Token from login response:', data.token);
    console.log('📦 Full response:', data);

    const user = {
      email: data.user?.email || data.email,
      name: data.user?.fullName || data.name,
      phoneNumber: data.user?.phoneNumber || data.phone || "",
      initials: (data.user?.fullName || data.name).split(" ").map(n => n[0]).join(""),
      role: data.user?.role || "Campaign Creator",
      pass: login.pass,
      token: data.token
    };

    // ✅ VERIFY TOKEN IS SAVED
    localStorage.setItem('mpamoja_user', JSON.stringify(user));
    localStorage.setItem('mpamoja_token', user.token);
    
    console.log('✅ Token saved to localStorage');
    console.log('🔑 Verifying localStorage token:', localStorage.getItem('mpamoja_token'));

    onLogin(user);
  } catch (error) {
    console.error('Login error:', error);
    setMsg("Network error. Please check your connection.");
  }
};

  const doSignup = async () => {
    if (!signup.fn || !signup.ln || !signup.em || !signup.ph || !signup.pw) {
      setMsg("Please fill all fields.");
      return;
    }
    if (signup.pw.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }

    if (!validatePhone(signup.ph)) {
      setMsg("Please enter a valid phone number (9-12 digits).");
      return;
    }

    try {
      const response = await fetch(`${BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: signup.fn + " " + signup.ln,
          phone: signup.ph,
          email: signup.em,
          password: signup.pw
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setMsg(data.error || "Registration failed. Please try again.");
        return;
      }

      setPendingPhone(signup.ph);
      setShowOtp(true);
      setMsg("Verification code sent to your phone. Please enter it below.");
      setSignup(s => ({ ...s, em: signup.em, pw: signup.pw }));
      
    } catch (error) {
      console.error("Registration error:", error);
      setMsg("Network error. Please check your connection.");
    }
  };

  const confirmOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setMsg("Please enter the 6-digit OTP code.");
      return;
    }

    try {
      const response = await fetch(`${BASE}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: pendingPhone,
          code: otpCode
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setMsg(data.error || "OTP verification failed. Please try again.");
        return;
      }

      const user = {
        email: data.user?.email || signup.em,
        name: data.user?.fullName || "User",
        phoneNumber: data.user?.phoneNumber || signup.ph || "",
        initials: (data.user?.fullName || "User").split(" ").map(n => n[0]).join(""),
        role: data.user?.role || "Campaign Creator",
        pass: signup.pw,
        token: data.token
      };
      
      console.log('✅ User created from verify:', user);
      
      // Store in localStorage
      localStorage.setItem('mpamoja_user', JSON.stringify(user));
      localStorage.setItem('mpamoja_token', user.token);
      
      onLogin(user);
      
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      setMsg("Network error. Please check your connection.");
    }
  };

  const resendOtp = async () => {
    try {
      const response = await fetch(`${BASE}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: pendingPhone
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setMsg(data.error || "Failed to resend code. Please try again.");
        return;
      }
      
      setMsg("New verification code sent to your phone.");
      setOtpCode(""); // Clear old code
    } catch (error) {
      console.error("Resend OTP error:", error);
      setMsg("Network error. Please check your connection.");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-blob b1" />
      <div className="auth-blob b2" />
      <div className="auth-blob b3" />
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{width:48,height:48,borderRadius:14,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 12px rgba(0,0,0,0.13)"}}><MPamojaLogo size={48} /></div>
          <div>
            <div className="mh-brand" style={{fontSize:"1.45rem",letterSpacing:"-0.03em"}}>M-<span>Pamoja</span></div>
            <div className="logo-sub">Community Finance</div>
          </div>
        </div>
        <div className="auth-welcome">Welcome back 👋</div>
        <div className="auth-sub">Sign in to your M-Pamoja account</div>
        <div className="auth-tabs">
          <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => { setTab("login"); setMsg(""); setShowOtp(false); }}>Log in</button>
          <button className={`auth-tab${tab === "signup" ? " active" : ""}`} onClick={() => { setTab("signup"); setMsg(""); setShowOtp(false); }}>Sign up</button>
        </div>
        {msg && <div className="auth-msg">{msg}</div>}
        {/* ── LOGIN TAB ── */}
        {tab === "login" && !showOtp ? (
          <>
            <div className="field">
              <label>Email or Phone</label>
              <input 
                type="text" 
                name="email"  // ← Add name attribute
                value={login.email} 
                onChange={handleLoginChange}  // ← Use the handler
                onKeyDown={e => e.key === "Enter" && doLogin()} 
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                name="pass"  // ← Add name attribute
                value={login.pass} 
                onChange={handleLoginChange}  // ← Use the handler
                onKeyDown={e => e.key === "Enter" && doLogin()} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text3)",
                  fontSize: "0.75rem",
                  marginTop: "0.3rem"
                }}
              >
                {showPassword ? "🙈 Hide" : "👁️ Show"}
              </button>
            </div>
            <button className="auth-btn" onClick={doLogin} disabled={loading}>
              {loading ? "Loading..." : "Sign in →"}
            </button>
            <div className="demo-hint">
              Demo: <strong>demo@mpamoja.co.ke</strong> / <strong>demo1234</strong>
            </div>
          </>
        ) : null}

        {/* ── SIGNUP TAB ── */}
        {tab === "signup" && !showOtp ? (
          <>
            <div className="g2">
              <div className="field"><label>First name</label><input placeholder="Jane" value={signup.fn} onChange={e => setSignup(s => ({ ...s, fn: e.target.value }))} /></div>
              <div className="field"><label>Last name</label><input placeholder="Wambua" value={signup.ln} onChange={e => setSignup(s => ({ ...s, ln: e.target.value }))} /></div>
            </div>
            <div className="field"><label>Email</label><input placeholder="jane@example.com" value={signup.em} onChange={e => setSignup(s => ({ ...s, em: e.target.value }))} /></div>
            <div className="field"><label>Phone Number</label><input placeholder="0712345678" type="tel" value={signup.ph} onChange={e => setSignup(s => ({ ...s, ph: e.target.value }))} /></div>
            <div className="field"><label>Password</label><input type="password" placeholder="min 6 characters" value={signup.pw} onChange={e => setSignup(s => ({ ...s, pw: e.target.value }))} /></div>
            <div className="field"><label>Account type</label>
              <select value={signup.role} onChange={e => setSignup(s => ({ ...s, role: e.target.value }))}>
                <option>Campaign Creator</option><option>Contributor</option><option>Chama Admin</option>
              </select>
            </div>
            <button className="auth-btn" onClick={doSignup}>Create account →</button>
          </>
        ) : null}

        {/* ── OTP VERIFICATION TAB ── */}
        {showOtp ? (
          <>
            <div className="auth-welcome">Verify Your Phone</div>
            <div className="auth-sub">Enter the 6-digit code sent to {pendingPhone}</div>
            <div className="field">
              <label>OTP Code</label>
              <input 
                type="text" 
                placeholder="Enter 6-digit code" 
                maxLength="6"
                value={otpCode} 
                onChange={e => setOtpCode(e.target.value)} 
                onKeyDown={e => e.key === "Enter" && confirmOtp()}
                style={{textAlign:"center", fontSize:"1.2rem", letterSpacing:"0.3rem"}}
              />
            </div>
            <button className="auth-btn" onClick={confirmOtp}>Verify →</button>

            <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <button 
                onClick={resendOtp}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--brand)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "var(--font)"
                }}
              >
                Resend code
              </button>
            </div>
            
            <button className="back-btn" onClick={() => { setShowOtp(false); setMsg(""); setOtpCode(""); }}>← Back</button>
          </>
        ) : null}
      </div>
    </div>
  );
}

// ─── New Item Picker Modal ───
function NewItemPicker({ onClose, onNav }) {
  const options = [
    {
      key: "kitties",
      emoji: "🐾",
      label: "Kitty",
      sub: "Start a contribution campaign",
      grad: "var(--grad)",
      bg: "var(--brand-light)",
      border: "rgba(79,70,229,0.2)",
      color: "var(--brand)",
    },
    {
      key: "chama",
      emoji: "🏠",
      label: "Chama",
      sub: "Create a savings group",
      grad: "var(--grad-chama)",
      bg: "var(--violet-light)",
      border: "rgba(124,58,237,0.2)",
      color: "var(--violet)",
    },
    {
      key: "events",
      emoji: "🎊",
      label: "Event",
      sub: "Organise an event and start ticket sales",
      grad: "var(--grad-events)",
      bg: "var(--sky-light)",
      border: "rgba(14,165,233,0.2)",
      color: "var(--sky)",
    },
  ];
  return (
    <div>
      <div className="modal-title" style={{textAlign:"center",marginBottom:"0.25rem"}}>What would you like to create?</div>
      <div style={{fontSize:"0.78rem",color:"var(--text3)",textAlign:"center",marginBottom:"1.25rem"}}>Choose a type to get started</div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        {options.map(opt => (
          <button key={opt.key} onClick={() => { onClose(); onNav(opt.key); }}
            style={{
              display:"flex",alignItems:"center",gap:"1rem",
              background:opt.bg,border:`1.5px solid ${opt.border}`,
              borderRadius:18,padding:"1rem 1.1rem",cursor:"pointer",
              textAlign:"left",transition:"all 0.18s",fontFamily:"var(--font)",
            }}
            onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
          >
            <div style={{
              width:50,height:50,borderRadius:15,
              background:opt.grad,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:"1.5rem",flexShrink:0,
              boxShadow:`0 6px 20px ${opt.border}`,
            }}>{opt.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:"0.95rem",fontWeight:800,color:opt.color,letterSpacing:"-0.02em",marginBottom:2}}>{opt.label}</div>
              <div style={{fontSize:"0.73rem",color:"var(--text2)",lineHeight:1.4}}>{opt.sub}</div>
            </div>
            <div style={{fontSize:"1.1rem",color:opt.color,opacity:0.6}}>›</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Overview Page ───

// ─── Kitty Contributors Report Modal ───
function KittyContributorsReport({ kitty, transactions, onBack }) {
  const contribs = transactions.filter(t => t.kitty === kitty.name && t.type === "Contribution");
  const withdrawals = transactions.filter(t => t.kitty === kitty.name && t.type === "Withdrawal");
  const totalRaised = contribs.reduce((s, t) => s + (t.gross || 0), 0);
  const { fee, pct: fp } = getKittyFee(kitty);
  const net = (kitty.raised || 0) - fee;
  const pct = Math.round(((kitty.raised || 0) / (kitty.goal || 1)) * 100);
  const over = (kitty.raised || 0) - kitty.goal;
  const catColors = { Medical:"var(--rose)", Wedding:"var(--violet)", Education:"var(--sky)", Business:"var(--amber)", Chama:"var(--emerald)", Emergency:"var(--rose)", Funeral:"var(--text2)", Other:"var(--brand)" };
  const catColor = catColors[kitty.category] || "var(--brand)";

  const byName = {};
  contribs.forEach(t => {
    const key = t.name || "Anonymous";
    if (!byName[key]) byName[key] = { name: key, phone: t.phone || "", total: 0, count: 0, latest: t.time };
    byName[key].total += (t.gross || 0);
    byName[key].count += 1;
    byName[key].latest = t.time;
  });
  const leaderboard = Object.values(byName).sort((a, b) => b.total - a.total);
  const topAmount = leaderboard[0]?.total || 1;

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"1rem"}}>
        <button onClick={onBack} style={{width:32,height:32,border:"1.5px solid var(--border)",borderRadius:9,background:"var(--surface2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:"0.95rem",fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{kitty.name}</div>
          <div style={{fontSize:"0.62rem",color:"var(--text3)",marginTop:1}}>{ kittyCategory(kitty) } · Created {kitty.created}</div>
        </div>
        <span style={{fontSize:"0.58rem",fontWeight:700,color:catColor,background:`${catColor}18`,borderRadius:20,padding:"3px 8px",textTransform:"uppercase",letterSpacing:"0.04em",flexShrink:0}}>{kittyCategory(kitty)}</span>
      </div>

      {/* Hero */}
      <div style={{background:"var(--grad)",borderRadius:18,padding:"1.1rem 1.2rem",marginBottom:"1rem",position:"relative",overflow:"hidden",boxShadow:"var(--shadow-brand)"}}>
        <div style={{position:"absolute",width:130,height:130,borderRadius:"50%",background:"rgba(255,255,255,0.07)",top:-35,right:-25}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:"0.6rem",fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2}}>Total Raised</div>
          <div style={{fontSize:"1.8rem",fontWeight:800,color:"#fff",letterSpacing:"-0.04em",fontFamily:"var(--mono)"}}>KES {fmt(kitty.raised||0)}</div>
          <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.7)",marginBottom:"0.75rem"}}>of KES {fmt(kitty.goal)} goal</div>
          <div style={{height:6,background:"rgba(255,255,255,0.2)",borderRadius:6,overflow:"hidden",marginBottom:"0.4rem"}}>
            <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:"rgba(255,255,255,0.85)",borderRadius:6}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.63rem",color:"rgba(255,255,255,0.75)"}}>
            <span style={{fontWeight:700}}>{pct}% funded</span>
            {over >= 0
              ? <span style={{fontWeight:700,color:"rgba(255,255,255,0.95)"}}>🎯 KES {fmt(over)} over target</span>
              : <span>KES {fmt(kitty.goal-(kitty.raised||0))} to go</span>
            }
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.5rem",marginBottom:"1rem"}}>
        {[
          ["👥 "+contribs.length,       "Total Contributions", "var(--brand)"],
          ["KES "+fmt(net),              "Net Payout",          "var(--emerald)"],
          [leaderboard.length+" people", "Unique Contributors", "var(--violet)"],
          [fp+"% · KES "+fmt(fee),       "Platform Fee",        "var(--amber)"],
        ].map(([v,l,c])=>(
          <div key={l} style={{background:"var(--surface2)",borderRadius:12,padding:"0.7rem 0.75rem",border:"1.5px solid var(--border)"}}>
            <div style={{fontSize:"0.82rem",fontWeight:800,color:c,fontFamily:"var(--mono)",letterSpacing:"-0.02em"}}>{v}</div>
            <div style={{fontSize:"0.58rem",fontWeight:600,color:"var(--text3)",marginTop:2,textTransform:"uppercase",letterSpacing:"0.04em"}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Target status */}
      <div style={{
        background:pct>=100?"var(--emerald-light)":pct>=75?"var(--amber-light)":"var(--brand-light)",
        border:`1.5px solid ${pct>=100?"rgba(16,185,129,0.3)":pct>=75?"rgba(245,158,11,0.3)":"rgba(79,70,229,0.2)"}`,
        borderRadius:14,padding:"0.85rem 1rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:"0.75rem"
      }}>
        <div style={{fontSize:"1.8rem",lineHeight:1}}>{pct>=100?"🏆":pct>=75?"🔥":pct>=25?"⚡":"🌱"}</div>
        <div>
          <div style={{fontSize:"0.82rem",fontWeight:800,color:pct>=100?"var(--emerald)":pct>=75?"var(--amber)":"var(--brand)",letterSpacing:"-0.01em"}}>
            {pct>=100?"Goal Reached!":pct>=75?"Almost There":pct>=25?"In Progress":"Just Getting Started"}
          </div>
          <div style={{fontSize:"0.68rem",color:"var(--text2)",marginTop:2,lineHeight:1.4}}>
            {pct>=100
              ? `Exceeded target by KES ${fmt(over)} — amazing community effort!`
              : `KES ${fmt(kitty.goal-(kitty.raised||0))} still needed to hit the KES ${fmt(kitty.goal)} goal`
            }
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.6rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span>👑 Contributor Leaderboard</span>
        <span style={{fontSize:"0.62rem",fontWeight:600,color:"var(--text3)"}}>{leaderboard.length} people</span>
      </div>

      {leaderboard.length === 0 ? (
        <div style={{textAlign:"center",padding:"2rem 1rem",background:"var(--surface2)",borderRadius:14,border:"1.5px dashed var(--border)"}}>
          <div style={{fontSize:"1.8rem",marginBottom:"0.4rem"}}>🤝</div>
          <div style={{fontSize:"0.82rem",fontWeight:600,color:"var(--text3)"}}>No contributions yet</div>
          <div style={{fontSize:"0.7rem",color:"var(--text3)",marginTop:"0.25rem"}}>Share your kitty link to start receiving support</div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
          {leaderboard.map((c, i) => {
            const barW = Math.round((c.total / topAmount) * 100);
            const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":null;
            const shareOfTotal = totalRaised > 0 ? Math.round((c.total/totalRaised)*100) : 0;
            return (
              <div key={c.name} style={{background:"var(--surface)",borderRadius:14,padding:"0.8rem 0.9rem",border:"1.5px solid var(--border)",boxShadow:"var(--shadow-sm)"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.5rem"}}>
                  <div style={{width:36,height:36,borderRadius:"50%",
                    background:i===0?"linear-gradient(135deg,#F59E0B,#D97706)":i===1?"linear-gradient(135deg,#94A3B8,#64748B)":i===2?"linear-gradient(135deg,#CD7F32,#A0522D)":"var(--brand-light)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:i<3?"1rem":"0.7rem",fontWeight:800,color:i<3?"#fff":"var(--brand)",flexShrink:0}}>
                    {medal||(c.name==="Anonymous"?"👤":(c.name||"?").slice(0,2).toUpperCase())}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:"0.4rem"}}>
                      <span style={{fontSize:"0.82rem",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</span>
                      {c.count>1&&<span style={{fontSize:"0.58rem",fontWeight:700,background:"var(--brand-light)",color:"var(--brand)",borderRadius:20,padding:"1px 6px",flexShrink:0}}>{c.count}×</span>}
                    </div>
                    {c.phone&&<div style={{fontSize:"0.62rem",color:"var(--text3)",marginTop:1}}>{maskPhone(c.phone)}</div>}
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:"0.9rem",fontWeight:800,color:"var(--emerald)",fontFamily:"var(--mono)"}}>KES {fmt(c.total)}</div>
                    <div style={{fontSize:"0.6rem",color:"var(--text3)"}}>{shareOfTotal}% of total</div>
                  </div>
                </div>
                <div style={{height:4,background:"var(--surface3)",borderRadius:10,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${barW}%`,background:i===0?"var(--grad3)":"var(--grad)",borderRadius:10,transition:"width 0.6s ease"}}/>
                </div>
                <div style={{fontSize:"0.6rem",color:"var(--text3)",marginTop:3,textAlign:"right"}}>Last: {c.latest}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Withdrawals */}
      {withdrawals.length > 0 && (<>
        <div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--text2)",margin:"1rem 0 0.6rem",display:"flex",alignItems:"center",gap:"0.4rem"}}>
          <span>💸 Withdrawals</span>
          <span style={{fontSize:"0.62rem",color:"var(--text3)",fontWeight:600}}>({withdrawals.length})</span>
        </div>
        {withdrawals.map((t,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:"0.6rem",background:"var(--surface)",borderRadius:12,padding:"0.7rem 0.85rem",border:"1.5px solid var(--border)",marginBottom:"0.4rem",boxShadow:"var(--shadow-sm)"}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:"var(--rose-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.85rem",flexShrink:0}}>↑</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:"0.78rem",fontWeight:700}}>{t.name}</div>
              <div style={{fontSize:"0.62rem",color:"var(--text3)",marginTop:1}}>{t.ref} · {t.time}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"0.85rem",fontWeight:800,color:"var(--rose)",fontFamily:"var(--mono)"}}>KES {fmt(t.gross)}</div>
              <div style={{fontSize:"0.6rem",color:"var(--text3)"}}>Net KES {fmt(t.net)}</div>
            </div>
          </div>
        ))}
      </>)}
    </div>
  );
}

// ─── Reports Modal — kitty picker ───
function ReportsModal({ kitties, transactions, onClose }) {
  const [selected, setSelected] = useState(null);
  const [collapsed, setCollapsed] = useState({});

  const toggle = (key) => setCollapsed(c => ({ ...c, [key]: !c[key] }));

  if (selected) {
    return <KittyContributorsReport kitty={selected} transactions={transactions} onBack={() => setSelected(null)} />;
  }

  const groups = [
    { key: "contributions", label: "Contributions", emoji: "🎯", color: "var(--brand)",  bg: "var(--brand-light)",  border: "rgba(79,70,229,0.25)"  },
    { key: "chama",         label: "Chama",         emoji: "🤝", color: "var(--violet)", bg: "var(--violet-light)", border: "rgba(124,58,237,0.25)" },
    { key: "events",        label: "Events",        emoji: "🎟️", color: "var(--sky)",    bg: "var(--sky-light)",    border: "rgba(14,165,233,0.25)" },
  ];

  const KittyCard = ({ k, color }) => {
    const pct = Math.round(((k.raised||0)/(k.goal||1))*100);
    const contribCount = transactions.filter(t => t.kitty === k.name && t.type === "Contribution").length;
    const { fee } = getKittyFee(k);
    const statusColor = pct>=100?"var(--emerald)":pct>=75?"var(--amber)":"var(--brand)";
    const statusLabel = pct>=100?"🏆 Goal Reached":pct>=75?"🔥 Almost There":pct>=25?"⚡ In Progress":"🌱 Starting";
    return (
      <div onClick={() => setSelected(k)}
        style={{background:"var(--surface)",borderRadius:14,padding:"0.9rem 1rem",border:"1.5px solid var(--border)",
          boxShadow:"var(--shadow-sm)",cursor:"pointer",transition:"all 0.18s"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=color;e.currentTarget.style.transform="translateY(-1px)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="translateY(0)";}}
      >
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.45rem"}}>
          <div style={{flex:1,marginRight:"0.5rem"}}>
            <div style={{fontSize:"0.6rem",fontWeight:700,color:statusColor,marginBottom:3}}>{statusLabel}</div>
            <div style={{fontSize:"0.85rem",fontWeight:700,letterSpacing:"-0.01em",lineHeight:1.3}}>{k.name}</div>
            <div style={{fontSize:"0.6rem",color:"var(--text3)",marginTop:2}}>Created {k.created}</div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:"0.95rem",fontWeight:800,color,fontFamily:"var(--mono)"}}>KES {fmt(k.raised||0)}</div>
            <div style={{fontSize:"0.58rem",color:"var(--text3)"}}>of KES {fmt(k.goal)}</div>
          </div>
        </div>
        <div style={{height:5,background:"var(--surface3)",borderRadius:10,overflow:"hidden",marginBottom:"0.4rem"}}>
          <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:color,borderRadius:10,transition:"width 0.6s"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.62rem"}}>
          <div style={{display:"flex",gap:"0.6rem",color:"var(--text3)"}}>
            <span>👥 {contribCount}</span>
            <span>💸 Fee KES {fmt(fee)}</span>
            <span style={{fontWeight:700,color}}>{pct}%</span>
          </div>
          <span style={{fontWeight:700,color,fontSize:"0.65rem"}}>View Report →</span>
        </div>
      </div>
    );
  };

  const hasAny = kitties.length > 0;

  return (
    <div>
      <div className="modal-title">📊 Reports</div>
      <div style={{fontSize:"0.72rem",color:"var(--text3)",marginBottom:"1rem",lineHeight:1.5}}>
        Select a kitty to view its full contributor breakdown, target and payout details.
      </div>
      {!hasAny ? (
        <div style={{textAlign:"center",padding:"2.5rem 1rem",color:"var(--text3)"}}>
          <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>🐾</div>
          <div style={{fontSize:"0.85rem",fontWeight:600}}>No kitties yet</div>
          <div style={{fontSize:"0.72rem",marginTop:"0.3rem"}}>Create a kitty to start generating reports</div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>
          {groups.map(g => {
            const items = kitties.filter(k => (k.feeCategory||"contributions") === g.key);
            if (items.length === 0) return null;
            const isOpen = !collapsed[g.key];
            return (
              <div key={g.key} style={{borderRadius:14,border:`1.5px solid ${g.border}`,overflow:"hidden"}}>
                {/* Collapsible header */}
                <button onClick={() => toggle(g.key)} style={{
                  width:"100%",display:"flex",alignItems:"center",gap:8,
                  padding:"0.7rem 0.9rem",
                  background: isOpen ? g.bg : "var(--surface2)",
                  border:"none",cursor:"pointer",fontFamily:"var(--font)",
                  transition:"background 0.18s",
                }}>
                  <div style={{width:28,height:28,borderRadius:9,background: isOpen ? g.color : "var(--surface3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",flexShrink:0,transition:"background 0.18s"}}>{g.emoji}</div>
                  <div style={{fontSize:"0.72rem",fontWeight:800,color: isOpen ? g.color : "var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em",flex:1,textAlign:"left"}}>{g.label}</div>
                  <div style={{fontSize:"0.6rem",fontWeight:700,color: isOpen ? g.color : "var(--text3)",background: isOpen ? `${g.color}18` : "var(--surface3)",borderRadius:20,padding:"2px 8px",flexShrink:0}}>{items.length}</div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isOpen ? g.color : "var(--text3)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{flexShrink:0,transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",transition:"transform 0.22s"}}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {/* Collapsible body */}
                {isOpen && (
                  <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",padding:"0.6rem 0.7rem 0.7rem"}}>
                    {items.map(k => <KittyCard key={k.id} k={k} color={g.color} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Kitties Status Modal ───
function KittiesStatusModal({ kitties, onClose, onViewKitty }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | funded | empty

  const filtered = kitties.filter(k => {
    const pct = Math.round(((k.raised||0)/(k.goal||1))*100);
    const matchSearch = !search || k.name.toLowerCase().includes(search.toLowerCase()) || kittyCategory(k).toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "funded")  return pct >= 100;
    if (filter === "active")  return pct > 0 && pct < 100;
    if (filter === "empty")   return pct === 0;
    return true;
  });

  const totalRaised = kitties.reduce((s,k)=>s+(k.raised||0),0);
  const totalGoal   = kitties.reduce((s,k)=>s+(k.goal||0),0);
  const totalCtrib  = kitties.reduce((s,k)=>s+(k.contributors||0),0);
  const overallPct  = totalGoal > 0 ? Math.round((totalRaised/totalGoal)*100) : 0;

  const getCatColor = (k) => { const fc = k.feeCategory||"contributions"; if(fc==="chama") return "var(--violet)"; if(fc==="events") return "var(--sky)"; return "var(--brand)"; };

  const statusBadge = (pct) => {
    if (pct >= 100) return { label:"Goal Reached 🎯", bg:"var(--emerald-light)", color:"var(--emerald)" };
    if (pct >= 75)  return { label:"Almost There 🔥", bg:"var(--amber-light)",   color:"var(--amber)"   };
    if (pct >= 25)  return { label:"In Progress ⚡",   bg:"var(--brand-light)",   color:"var(--brand)"   };
    if (pct > 0)    return { label:"Just Started 🌱",  bg:"var(--sky-light)",     color:"var(--sky)"     };
    return            { label:"No Funds Yet",           bg:"var(--surface3)",      color:"var(--text3)"   };
  };

  return (
    <div>
      <div className="modal-title">My Kitties Status</div>

      {/* Summary strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.5rem",marginBottom:"1.1rem"}}>
        {[
          ["KES "+fmt(totalRaised), "Total Raised", "var(--brand)"],
          [totalCtrib,              "Supporters",   "var(--violet)"],
          [overallPct+"%",          "Overall",      overallPct>=100?"var(--emerald)":"var(--brand)"],
        ].map(([v,l,c]) => (
          <div key={l} style={{background:"var(--surface2)",borderRadius:12,padding:"0.7rem 0.5rem",textAlign:"center",border:"1.5px solid var(--border)"}}>
            <div style={{fontSize:"0.88rem",fontWeight:800,color:c,fontFamily:"var(--mono)",letterSpacing:"-0.02em"}}>{v}</div>
            <div style={{fontSize:"0.58rem",fontWeight:600,color:"var(--text3)",marginTop:2,textTransform:"uppercase",letterSpacing:"0.04em"}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div style={{marginBottom:"1rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",color:"var(--text3)",marginBottom:"0.3rem"}}>
          <span style={{fontWeight:600}}>Portfolio Progress</span>
          <span>KES {fmt(totalRaised)} of KES {fmt(totalGoal)}</span>
        </div>
        <div style={{height:7,background:"var(--surface3)",borderRadius:10,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${Math.min(100,overallPct)}%`,background:"var(--grad)",borderRadius:10,transition:"width 0.6s ease"}}/>
        </div>
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:"0.65rem"}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search kitties…"
          style={{width:"100%",background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:10,padding:"0.5rem 0.75rem 0.5rem 2rem",fontSize:"0.78rem",fontFamily:"var(--font)",color:"var(--text)",outline:"none"}} />
      </div>

      {/* Filter pills */}
      <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.9rem",flexWrap:"wrap"}}>
        {[["all","All"],["active","In Progress"],["funded","Goal Reached"],["empty","No Funds"]].map(([v,l]) => (
          <button key={v} onClick={()=>setFilter(v)}
            style={{padding:"0.3rem 0.75rem",borderRadius:60,fontSize:"0.68rem",fontWeight:700,border:`1.5px solid ${filter===v?"var(--brand)":"var(--border)"}`,
              background:filter===v?"var(--brand)":"var(--surface)",color:filter===v?"#fff":"var(--text3)",
              cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.18s",whiteSpace:"nowrap"}}>
            {l}
          </button>
        ))}
      </div>

      {/* Kitty list */}
      {kitties.length === 0 ? (
        <div style={{textAlign:"center",padding:"2.5rem 1rem",color:"var(--text3)"}}>
          <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>🐾</div>
          <div style={{fontSize:"0.85rem",fontWeight:600}}>No kitties yet</div>
          <div style={{fontSize:"0.72rem",marginTop:"0.3rem"}}>Create your first kitty to get started</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:"center",padding:"1.5rem 1rem",color:"var(--text3)",fontSize:"0.78rem"}}>No kitties match your filter</div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
          {filtered.map(k => {
            const pct = Math.round(((k.raised||0)/(k.goal||1))*100);
            const { fee, pct: fp } = getKittyFee(k);
            const net = (k.raised||0) - fee;
            const status = statusBadge(pct);
            const catColor = getCatColor(k);
            return (
              <div key={k.id}
                onClick={() => { onClose(); onViewKitty(k); }}
                style={{background:"var(--surface)",borderRadius:16,padding:"1rem",border:"1.5px solid var(--border)",
                  boxShadow:"var(--shadow-sm)",cursor:"pointer",transition:"all 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--brand-mid)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}
              >
                {/* Header row */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.5rem"}}>
                  <div style={{flex:1,marginRight:"0.5rem"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.25rem"}}>
                      <span style={{fontSize:"0.58rem",fontWeight:700,color:catColor,background:`${catColor}18`,borderRadius:20,padding:"2px 7px",textTransform:"uppercase",letterSpacing:"0.04em"}}>
                          {kittyCategory(k)}
                        </span>
                      <span style={{fontSize:"0.6rem",fontWeight:700,background:status.bg,color:status.color,borderRadius:20,padding:"2px 8px"}}>
                        {status.label}
                      </span>
                    </div>
                    <div style={{fontSize:"0.88rem",fontWeight:700,letterSpacing:"-0.01em",lineHeight:1.3}}>{k.name}</div>
                    <div style={{fontSize:"0.62rem",color:"var(--text3)",marginTop:2}}>Created {k.created} · {k.isPrivate?"🔒 Private":"🌍 Public"}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:"1rem",fontWeight:800,color:catColor,fontFamily:"var(--mono)",letterSpacing:"-0.03em"}}>KES {fmt(k.raised||0)}</div>
                    <div style={{fontSize:"0.6rem",color:"var(--text3)"}}>of KES {fmt(k.goal)}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{height:5,background:"var(--surface3)",borderRadius:10,overflow:"hidden",marginBottom:"0.35rem"}}>
                  <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:pct>=100?"var(--grad2)":"var(--grad)",borderRadius:10,transition:"width 0.6s ease"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.63rem",marginBottom:"0.6rem"}}>
                  <span style={{color:pct>=100?"var(--emerald)":"var(--brand)",fontWeight:700}}>{pct}% funded</span>
                  {(k.raised||0) >= k.goal
                    ? <span style={{color:"var(--emerald)",fontWeight:700}}>🎯 KES {fmt((k.raised||0)-k.goal)} over target</span>
                    : <span style={{color:"var(--text3)"}}>KES {fmt(k.goal-(k.raised||0))} to go</span>
                  }
                </div>

                {/* Stats row */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.4rem"}}>
                  {[
                    ["👥 "+( k.contributors||0), "Supporters"],
                    ["KES "+fmt(net),             "Net Payout"],
                    [fp+"% fee",                  "KES "+fmt(fee)],
                  ].map(([v,l])=>(
                    <div key={l} style={{background:"var(--surface2)",borderRadius:8,padding:"0.4rem 0.3rem",textAlign:"center",border:"1px solid var(--border2)"}}>
                      <div style={{fontSize:"0.68rem",fontWeight:700,color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{v}</div>
                      <div style={{fontSize:"0.55rem",color:"var(--text3)",marginTop:1}}>{l}</div>
                    </div>
                  ))}
                </div>

                <div style={{marginTop:"0.55rem",fontSize:"0.62rem",fontWeight:600,color:"var(--brand)",textAlign:"right",letterSpacing:"0.01em"}}>
                  Tap for full details →
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OverviewPage({ state, user, onNav, onToast, onRefresh, onWithdraw, onContribute, onEditKitty, signalRConnected = false }) {
  // ── State ──
  const [pickerOpen, setPickerOpen] = useState(false);
  const [viewKitty, setViewKitty] = useState(null);
  const [withdrawKitty, setWithdrawKitty] = useState(null);
  const [kittiesStatusOpen, setKittiesStatusOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const navigateTo = (page, data = null) => {
    if (data) {
      // Store data in sessionStorage or state management
      sessionStorage.setItem('navData', JSON.stringify(data));
    }
    onNav(page);
  };
  
  // ── NEW: State for API data ──
  const [loading, setLoading] = useState(true);
  const [apiKitties, setApiKitties] = useState([]);
  const [apiChamas, setApiChamas] = useState([]);
  const [apiTransactions, setApiTransactions] = useState([]);
  const [apiSummary, setApiSummary] = useState({
    totalRaised: 0,
    totalContributors: 0,
    totalKitties: 0,
    netAvailable: 0,
    contributions: 0,
    chama: 0,
    events: 0
  });

  // ── NEW: Fetch kitties from API ──
  const fetchKitties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('mpamoja_token');
      
      if (!token) {
        console.warn('No token found, using local state');
        setLoading(false);
        return;
      }

      // Fetch kitties
      const kittiesResponse = await fetch('/api/kitties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!kittiesResponse.ok) {
        throw new Error('Failed to fetch kitties');
      }

      const kittiesData = await kittiesResponse.json();
      console.log('✅ Kitties from API:', kittiesData);
      setApiKitties(kittiesData);

      // Fetch chamas
      try {
        const chamasResponse = await fetch('/api/chamas', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (chamasResponse.ok) {
          const chamasData = await chamasResponse.json();
          setApiChamas(chamasData);
        }
      } catch (e) {
        console.warn('Could not fetch chamas:', e);
      }

      // Fetch recent transactions
      try {
        const txsResponse = await fetch('/api/transactions/recent', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (txsResponse.ok) {
    const txsData = await txsResponse.json();
    console.log('✅ Transactions from API:', txsData);
    
    // ⭐ Map API transactions to match your frontend format
    const mappedTransactions = txsData.map(t => ({
      ref: t.refId || t.ref,
      name: t.name || "Anonymous",
      phone: t.phone || "",
      kitty: t.kitty || "",
      kittyId: t.kittyId,
      gross: t.gross,
      fee: t.fee || 0,
      net: t.net || t.gross,
      type: t.type || "Contribution",
      status: t.status || "Confirmed",
      time: t.time || "Just now",
      ownerEmail: user.email,
      receipt: t.receipt
    }));
    
    setApiTransactions(mappedTransactions);
    
    // ⭐ Also update the global state
    setState(prev => ({
      ...prev,
      transactions: mappedTransactions
    }));
  }
      } catch (e) {
        console.warn('Could not fetch transactions:', e);
      }

      // Calculate summary from kitties
      const totalRaised = kittiesData.reduce((sum, k) => sum + (k.raised || 0), 0);
      const totalContributors = kittiesData.reduce((sum, k) => sum + (k.contributorCount || 0), 0);
      
      // Category breakdown
      const contributions = kittiesData
        .filter(k => k.category === 'Contributions')
        .reduce((sum, k) => sum + (k.raised || 0), 0);
      const chamaTotal = kittiesData
        .filter(k => k.category === 'Chama')
        .reduce((sum, k) => sum + (k.raised || 0), 0);
      const eventsTotal = kittiesData
        .filter(k => k.category === 'Events')
        .reduce((sum, k) => sum + (k.raised || 0), 0);

      setApiSummary({
        totalRaised,
        totalContributors,
        totalKitties: kittiesData.length,
        netAvailable: totalRaised, // Simplified
        contributions,
        chama: chamaTotal,
        events: eventsTotal
      });

    } catch (error) {
      console.error('❌ Error fetching data:', error);
      onToast("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // ── NEW: Load data on mount ──
  useEffect(() => {
    fetchKitties();
  }, []);

  // ── NEW: Use API data instead of state ──
  const kitties = apiKitties.length > 0 ? apiKitties : state.kitties.filter(k => k.createdBy === user.email);
  const chamaGroups = apiChamas.length > 0 ? apiChamas : state.chamas.filter(c => c.createdBy === user.email);

  // ── Category breakdown from API data ──
  const contribKitties = kitties.filter(k => {
  const cat = k.category || k.feeCategory || "contributions";
  return cat === "contributions" || cat === "Contributions";
});
  const chamaKitties = kitties.filter(k => k.feeCategory === "chama" || k.category === "Chama");
  const eventKitties = kitties.filter(k => k.feeCategory === "events" || k.category === "Events");

  // ── Totals ──
  const contribTotal = contribKitties.reduce((s, k) => s + (k.raised || 0), 0);
  const chamaKittyTotal = chamaKitties.reduce((s, k) => s + (k.raised || 0), 0);
  const chamaPoolTotal = chamaGroups.reduce((s, c) => s + (c.pool || 0), 0);
  const eventTotal = eventKitties.reduce((s, k) => s + (k.raised || 0), 0);
  const total = contribTotal + chamaKittyTotal + chamaPoolTotal + eventTotal;
  const contributors = kitties.reduce((s, k) => s + (k.contributorCount || k.contributors || 0), 0);
  
  // ── Withdrawals ──
  const withdrawals = state.withdrawals
    .filter(w => w.ownerEmail === user.email)
    .reduce((s, w) => s + (w.gross || 0), 0);
  const netAvailable = total - withdrawals;

  // ── Recent transactions ──
  const txs = apiTransactions.length > 0 
    ? apiTransactions 
    : state.transactions.filter(t => t.ownerEmail === user.email).slice(0, 5);

  // ── Refresh handler ──
  const handleRefresh = () => {
    fetchKitties();
    onRefresh();
    onToast("Refreshed", "Data updated");
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="home-scroll">
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔄</div>
          <div style={{ color: "var(--text3)" }}>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // ── Render ──
  return (
    <div className="home-scroll">
      {/* Greeting */}
      <div className="greet-row">
        <div>
          <div className="greet-time">{getGreeting()}</div>
          <div className="greet-name">Welcome, <span>{user.name?.split(" ")[0] || "User"}</span></div>
        </div>
        <button className="refresh-pill" onClick={handleRefresh} title="Refresh">
          <span style={{ display: "flex" }}>{Icons.refresh}</span>
        </button>
      </div>

      {/* Hero Card - Premium Version */}
{/* Hero Card - Premium Version with Clickable Stats */}
<div className="hero-card" style={{
  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
  borderRadius: 24,
  padding: '1.8rem 1.8rem 1.5rem',
  marginBottom: '1.5rem',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(79, 70, 229, 0.35), 0 8px 24px rgba(79, 70, 229, 0.15)',
}}>
  {/* Animated background orbs */}
  <div style={{
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    top: -120,
    right: -80,
    pointerEvents: 'none',
    animation: 'heroFloat 8s ease-in-out infinite',
  }} />
  <div style={{
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.04)',
    bottom: -60,
    left: -40,
    pointerEvents: 'none',
    animation: 'heroFloat 10s ease-in-out infinite reverse',
  }} />
  <div style={{
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.03)',
    top: 40,
    left: '40%',
    pointerEvents: 'none',
    animation: 'heroFloat 12s ease-in-out infinite 2s',
  }} />

  <div style={{ position: 'relative', zIndex: 1 }}>
    {/* Top row */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1.5rem',
    }}>
      <div>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '0.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#34D399',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          Live Overview
        </div>
        <div style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          fontFamily: 'var(--mono)',
          textShadow: '0 2px 20px rgba(0,0,0,0.1)',
        }}>
          KES {fmt(total)}
        </div>
        <div style={{
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.6)',
          marginTop: '0.2rem',
          fontWeight: 500,
        }}>
          Total raised across all categories
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        {/* Connection Status */}
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: signalRConnected ? '#34D399' : '#F59E0B',
          display: 'inline-block',
          animation: signalRConnected ? 'pulse-dot 2s ease-in-out infinite' : 'none',
          boxShadow: signalRConnected ? '0 0 12px rgba(52, 211, 153, 0.5)' : '0 0 12px rgba(245, 158, 11, 0.5)',
        }} />
        <div className="hero-avatar" style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          background: 'rgba(255,255,255,0.15)',
          border: '2px solid rgba(255,255,255,0.25)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '0.9rem',
          color: '#fff',
          flexShrink: 0,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          cursor: 'pointer',
        }} onClick={() => onNav('settings')}>
          {user.initials || "U"}
        </div>
      </div>
    </div>

    <div style={{
      height: 1,
      background: 'linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
      marginBottom: '1.2rem',
    }} />

    {/* Category breakdown - Premium grid with clickable cards */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '0.6rem',
      marginBottom: '1.2rem',
    }}>
      {[
        { emoji: "🎯", label: "Contributions", value: contribTotal, page: "kitties", filter: "contributions" },
        { emoji: "🤝", label: "Chama Kitties", value: chamaKittyTotal, page: "chama", filter: "kitties" },
        { emoji: "🏦", label: "Chama Pools", value: chamaPoolTotal, page: "chama", filter: "pools" },
        { emoji: "🎟️", label: "Events", value: eventTotal, page: "events", filter: "all" },
      ].map((item, index) => {
        const colors = [
          { bg: 'rgba(99, 102, 241, 0.2)', border: 'rgba(99, 102, 241, 0.3)', hover: 'rgba(99, 102, 241, 0.35)' },
          { bg: 'rgba(139, 92, 246, 0.2)', border: 'rgba(139, 92, 246, 0.3)', hover: 'rgba(139, 92, 246, 0.35)' },
          { bg: 'rgba(236, 72, 153, 0.2)', border: 'rgba(236, 72, 153, 0.3)', hover: 'rgba(236, 72, 153, 0.35)' },
          { bg: 'rgba(52, 211, 153, 0.2)', border: 'rgba(52, 211, 153, 0.3)', hover: 'rgba(52, 211, 153, 0.35)' },
        ];
        const color = colors[index % colors.length];
        
        return (
          <div
            key={item.label}
            onClick={() => {
              // Store filter info if needed
              if (item.filter) {
                sessionStorage.setItem('navFilter', item.filter);
              }
              onNav(item.page);
            }}
            style={{
              background: color.bg,
              border: `1px solid ${color.border}`,
              borderRadius: 12,
              padding: '0.6rem 0.5rem',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.25s ease',
              cursor: 'pointer',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = color.hover;
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = color.bg;
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = color.border;
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginBottom: '0.2rem',
            }}>
              <span style={{ fontSize: '0.75rem' }}>{item.emoji}</span>
              <span style={{
                fontSize: '0.55rem',
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                {item.label}
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.5rem',
                color: 'rgba(255,255,255,0.3)',
              }}>→</span>
            </div>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: 800,
              color: '#fff',
              fontFamily: 'var(--mono)',
              letterSpacing: '-0.02em',
              textShadow: '0 1px 8px rgba(0,0,0,0.1)',
            }}>
              KES {fmt(item.value)}
            </div>
          </div>
        );
      })}
    </div>

    <div style={{
      height: 1,
      background: 'linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
      marginBottom: '1.2rem',
    }} />

    {/* Stats - Premium with clickable cards */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.6rem',
    }}>
      {[
        { 
          icon: '📊', 
          label: 'Kitties', 
          value: kitties.length + chamaGroups.length,
          page: 'kitties',
          description: 'View all kitties'
        },
        { 
          icon: '👥', 
          label: 'Contributors', 
          value: contributors,
          page: 'transactions',
          description: 'View all contributors'
        },
        { 
          icon: '💰', 
          label: 'Net Available', 
          value: `KES ${fmt(netAvailable)}`,
          page: 'withdraw',
          description: 'Withdraw funds'
        },
      ].map((stat) => (
        <div
          key={stat.label}
          onClick={() => onNav(stat.page)}
          style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: '0.6rem 0.4rem',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          {/* Subtle hover glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }} className="stat-glow" />
          
          <div style={{
            fontSize: '0.7rem',
            marginBottom: '0.15rem',
          }}>
            {stat.icon}
          </div>
          <div style={{
            fontSize: '1rem',
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'var(--mono)',
            letterSpacing: '-0.02em',
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: '0.58rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.5)',
            marginTop: '0.1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {stat.label}
          </div>
          <div style={{
            fontSize: '0.5rem',
            color: 'rgba(255,255,255,0.3)',
            marginTop: '0.15rem',
            letterSpacing: '0.04em',
          }}>
            {stat.description}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
      {/* My Kitties */}
      <div className="sec-hdr">
        <span className="sec-title">My Kitties</span>
        <button className="sec-link" onClick={() => setKittiesStatusOpen(true)}>See all →</button>
      </div>
      <div className="kitty-scroll">
        {kitties.length === 0 ? (
          <div className="kitty-card" style={{ minWidth: 240, textAlign: "center", padding: "1.5rem", color: "var(--text3)" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🐾</div>
            <div style={{ fontSize: "0.8rem" }}>No kitties yet</div>
            <button className="btn btn-brand btn-sm" style={{ marginTop: "0.5rem" }} onClick={() => setPickerOpen(true)}>
              Create one →
            </button>
          </div>
        ) : (
          kitties.map(k => {
            const raised = k.raisedCents ? k.raisedCents / 100 : (k.raised || 0);
            const goal = k.goalCents ? k.goalCents / 100 : (k.goal || 1);
            const contributors = k.contributorCount || k.contributors || 0;
            const pct = Math.round((raised / goal) * 100);
            
            return (
              <div key={k.id} className="kitty-card" onClick={() => setViewKitty(k)} style={{ cursor: "pointer" }}>
                <div className="kitty-tag tag-active">Active</div>
                <div className="kitty-name">{k.name}</div>
                <div className="kitty-amount">KES {fmt(raised)}</div>
                <div className="kitty-goal">of KES {fmt(goal)} goal</div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
                <div className="kitty-meta">
                  <span>{contributors} supporters</span>
                  <span className="kitty-pct">{pct}%</span>
                </div>
                <div style={{ marginTop: "0.5rem", fontSize: "0.65rem", fontWeight: 600, color: "var(--brand)", letterSpacing: "0.02em" }}>
                  Tap for details →
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Services */}
      <div className="sec-hdr"><span className="sec-title">Services</span></div>
      <div className="services-grid">
        <button className="svc-btn" onClick={() => onNav("contribute")}>
          <div className="svc-icon svc-i-brand">{Icons.dollar}</div>
          <span className="svc-lbl">Contribute</span>
        </button>
        <button className="svc-btn" onClick={() => onNav("withdraw")}>
          <div className="svc-icon svc-i-green">{Icons.transfer}</div>
          <span className="svc-lbl">Withdraw</span>
        </button>
        <button className="svc-btn" onClick={() => onNav("whatsapp")}>
          <div className="svc-icon svc-i-green" style={{ background: "#ECFDF5" }}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "none", stroke: "#25D366", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
          </div>
          <span className="svc-lbl">WhatsApp</span>
        </button>
        <button className="svc-btn" onClick={() => onNav("transactions")}>
          <div className="svc-icon svc-i-amber">{Icons.file}</div>
          <span className="svc-lbl">Transactions</span>
        </button>
        <button className="svc-btn" onClick={() => setPickerOpen(true)}>
          <div className="svc-icon svc-i-brand">{Icons.newkitty}</div>
          <span className="svc-lbl">New Kitty</span>
        </button>
        <button className="svc-btn" onClick={() => setKittiesStatusOpen(true)}>
          <div className="svc-icon" style={{ background: "var(--emerald-light)" }}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "none", stroke: "var(--emerald)", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              <line x1="6" y1="8" x2="6" y2="12"/><line x1="10" y1="10" x2="10" y2="12"/><line x1="14" y1="7" x2="14" y2="12"/><line x1="18" y1="9" x2="18" y2="12"/>
            </svg>
          </div>
          <span className="svc-lbl">My Kitties</span>
        </button>
        <button className="svc-btn" onClick={() => setReportsOpen(true)}>
          <div className="svc-icon svc-i-rose">
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "none", stroke: "var(--rose)", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <span className="svc-lbl">Reports</span>
        </button>
        <button className="svc-btn" onClick={() => onNav("chama")}>
          <div className="svc-icon svc-i-violet">{Icons.chama}</div>
          <span className="svc-lbl">Chama</span>
        </button>
        <button className="svc-btn" onClick={() => onNav("events")}>
          <div className="svc-icon svc-i-sky">{Icons.events}</div>
          <span className="svc-lbl">Events</span>
        </button>
        <button className="svc-btn" onClick={() => onNav("settings")}>
          <div className="svc-icon" style={{ background: "var(--surface3)" }}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "none", stroke: "var(--text2)", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
              <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
            </svg>
          </div>
          <span className="svc-lbl">Settings</span>
        </button>
      </div>

      {/* Live Activity */}
      <div className="sec-hdr">
        <span className="sec-title">Live Activity</span>
        <button className="sec-link" onClick={handleRefresh}>↻ Refresh</button>
      </div>
      <div className="feed-card">
        {txs.length === 0 ? (
          <div className="feed-empty">Activity will appear here</div>
        ) : (
          txs.map(t => {
            const amount = t.grossCents ? t.grossCents / 100 : (t.gross || 0);
            const name = t.name || t.contributorName || "Anonymous";
            const kittyName = t.kitty || t.kittyName || "";
            const type = t.type || "Contribution";
            
            return (
              <div key={t.id || t.ref} className="feed-item">
                <div className="feed-av">{(name || "AN").slice(0, 2).toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="feed-name">{name}</div>
                  <div className="feed-detail">{type} · {kittyName}{t.phone ? ` · ${maskPhone(t.phone)}` : ""}</div>
                </div>
                <div className="feed-amt" style={{ color: type === "Contribution" ? "var(--emerald)" : "var(--amber)" }}>
                  {type === "Contribution" ? "+" : "-"}KES {fmt(amount)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Modals ── */}
      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)}>
        <NewItemPicker onClose={() => setPickerOpen(false)} onNav={(key) => { setPickerOpen(false); onNav(key); }} />
      </Modal>

      <Modal open={!!viewKitty} onClose={() => setViewKitty(null)} hideClose>
        {viewKitty && (
          <KittyDetailModal
            kitty={viewKitty}
            user={user}
            transactions={state.transactions}
            onClose={() => setViewKitty(null)}
            onWithdraw={onWithdraw}
            onContribute={onContribute}
            onEditKitty={onEditKitty}
            onToast={onToast}
          />
        )}
      </Modal>

      <Modal open={!!withdrawKitty} onClose={() => setWithdrawKitty(null)}>
        {withdrawKitty && (
          <KittyWithdrawModal
            kitty={withdrawKitty}
            user={user}
            onClose={() => setWithdrawKitty(null)}
            onConfirm={(k, net, fee, phone, partial) => {
              onWithdraw(k.id, net, fee, phone, partial);
              onToast("Withdrawal Sent! 💸", `KES ${fmt(net)} is on its way`);
            }}
          />
        )}
      </Modal>

      <Modal open={kittiesStatusOpen} onClose={() => setKittiesStatusOpen(false)}>
        <KittiesStatusModal
          kitties={kitties}
          onClose={() => setKittiesStatusOpen(false)}
          onViewKitty={(k) => {
            setKittiesStatusOpen(false);
            setViewKitty(k);
          }}
        />
      </Modal>

      <Modal open={reportsOpen} onClose={() => setReportsOpen(false)}>
        <ReportsModal
          kitties={kitties}
          transactions={state.transactions.filter(t => t.ownerEmail === user.email)}
          onClose={() => setReportsOpen(false)}
        />
      </Modal>
    </div>
  );
}

// ─── Kitty Detail Modal ───
function KittyDetailModal({ kitty: initialKitty, user, transactions, state, onClose, onWithdraw, onContribute, onEditKitty, onToast }) {
  const [view, setView] = useState("detail");
  const [subPage, setSubPage] = useState(null);
  const [kitty, setKitty] = useState(initialKitty);
  const [kittyTransactions, setKittyTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const back = () => {
    if (subPage) {
      setSubPage(null);
    } else {
      setView("detail");
    }
  };

  // ⭐ FIX: Fetch transactions from the correct endpoint
  useEffect(() => {
    const fetchKittyTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('mpamoja_token');
        if (!token) {
          console.warn('⚠️ No token found');
          return;
        }
        
        // ⭐ FIX: Use the correct endpoint from your backend
        const response = await fetch(`${BASE}/api/transactions/kitty/${kitty.id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Kitty transactions:', data);
          setKittyTransactions(data);
        } else if (response.status === 401) {
          console.error('❌ Unauthorized - token expired');
          // Optionally redirect to login
        } else {
          console.error('❌ Failed to fetch transactions:', response.status);
          const errorText = await response.text();
          console.error('Error response:', errorText);
        }
      } catch (error) {
        console.error('❌ Error fetching kitty transactions:', error);
        onToast && onToast('Error', 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchKittyTransactions();
  }, [kitty.id, onToast]);

  // ─── Helper: Get transactions for this kitty ───
  const getKittyTransactions = (type) => {
    // ⭐ FIX: Use fetched kittyTransactions first
    let allTransactions = kittyTransactions.length > 0 
      ? kittyTransactions 
      : (state?.transactions || transactions || []);
    
    // If we have kittyTransactions, filter them directly
    if (kittyTransactions.length > 0) {
      const filtered = type 
        ? allTransactions.filter(t => t.type === type)
        : allTransactions;
      console.log(`📊 Found ${filtered.length} ${type || 'all'} transactions from API`);
      return filtered;
    }
    
    // Fallback: filter by kitty ID or name
    return allTransactions.filter(t => {
      if (type && t.type !== type) return false;
      
      if (t.kittyId && (t.kittyId === kitty.id || String(t.kittyId) === String(kitty.id))) {
        return true;
      }
      
      if (t.kitty && t.kitty.toLowerCase() === kitty.name.toLowerCase()) {
        return true;
      }
      
      return false;
    });
  };

  // ─── Sub-Page: Supporters ───
  if (subPage === 'supporters') {
    // ⭐ Use the helper function
    let supporters = getKittyTransactions('Contribution');
    
    console.log('📊 Supporters found:', supporters.length);
    console.log('📊 Kitty ID:', kitty.id);
    console.log('📊 Kitty Name:', kitty.name);
    
    // Calculate totals
    let totalRaised = supporters.reduce((sum, t) => sum + (t.gross || 0), 0);
    let displaySupporters = supporters;
    let displayCount = supporters.length;
    
    // Fallback: Use kitty data if no transactions found
    if (displaySupporters.length === 0 && kitty.contributors > 0) {
      displayCount = kitty.contributors || 0;
      totalRaised = kitty.raised || 0;
      
      // Try to get all contributions as fallback
      const allTransactions = state?.transactions || transactions || [];
      const allContributions = allTransactions.filter(t => t.type === "Contribution");
      if (allContributions.length > 0) {
        displaySupporters = allContributions;
        displayCount = allContributions.length;
        totalRaised = allContributions.reduce((sum, t) => sum + (t.gross || 0), 0);
      }
    }
    
    console.log('📊 Display supporters:', displaySupporters.length);
    console.log('📊 Display count:', displayCount);
    console.log('📊 Total raised:', totalRaised);
    
    // ⭐ Show loading state
    if (loading) {
      return (
        <div className="page-wrap" style={{ paddingBottom: '2rem', paddingTop: '1rem', textAlign: 'center' }}>
          <div style={{ padding: '3rem 1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text2)' }}>Loading supporters...</div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="page-wrap" style={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setSubPage(null)} style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1.5px solid var(--border)',
            background: 'var(--surface)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>👥 Supporters</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>{kitty.name} · {displayCount} contributors</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand)' }}>KES {fmt(totalRaised)}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '1.2rem' }}>
          {[
            { label: 'Total Contributors', value: displayCount, icon: '👥' },
            { label: 'Total Raised', value: `KES ${fmt(totalRaised)}`, icon: '💰' },
            { label: 'Average Contribution', value: displayCount > 0 ? `KES ${fmt(totalRaised / displayCount)}` : 'KES 0', icon: '📊' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'var(--surface2)', borderRadius: 12, padding: '0.75rem', border: '1.5px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', marginBottom: '0.15rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand)', fontFamily: 'var(--mono)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {displaySupporters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text3)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤝</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No supporters yet</div>
            <div style={{ fontSize: '0.72rem', marginTop: '0.3rem' }}>Share your kitty to start receiving support</div>
            {kitty.contributors > 0 && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--brand)', background: 'var(--brand-light)', padding: '0.5rem', borderRadius: 8 }}>
                ℹ️ {kitty.contributors} contribution(s) recorded for this kitty
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {displaySupporters.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'var(--surface)', borderRadius: 14, padding: '0.8rem 1rem',
                border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-mid)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: i < 3 ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'var(--brand-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 800, color: i < 3 ? '#fff' : 'var(--brand)',
                  flexShrink: 0
                }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (t.name || '?')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                    {t.name || 'Anonymous'}
                    {t.phone && <span style={{ fontSize: '0.6rem', color: 'var(--text3)', marginLeft: '0.4rem', fontWeight: 400 }}>{maskPhone(t.phone)}</span>}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text3)', marginTop: 2 }}>
                    {t.time || 'Just now'} · Ref: {t.refId || t.receipt || 'N/A'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--emerald)', fontFamily: 'var(--mono)' }}>KES {fmt(t.gross || 0)}</div>
                  {t.fee > 0 && <div style={{ fontSize: '0.55rem', color: 'var(--text3)' }}>Fee: KES {fmt(t.fee)}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="back-btn" style={{ marginTop: '1.5rem' }} onClick={() => setSubPage(null)}>← Back to Kitty</button>
      </div>
    );
  }

  // ─── Sub-Page: Funding Progress ───
  if (subPage === 'funding') {
    const pct = Math.round(((kitty.raised || 0) / (kitty.goal || 1)) * 100);
    const remaining = Math.max(0, kitty.goal - (kitty.raised || 0));
    const { fee, pct: fp } = getKittyFee(kitty);
    
    const milestones = [
      { label: '25%', value: 25, achieved: pct >= 25 },
      { label: '50%', value: 50, achieved: pct >= 50 },
      { label: '75%', value: 75, achieved: pct >= 75 },
      { label: '100%', value: 100, achieved: pct >= 100 },
    ];

    return (
      <div className="page-wrap" style={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setSubPage(null)} style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1.5px solid var(--border)',
            background: 'var(--surface)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>📈 Funding Progress</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>{kitty.name} · {pct}% funded</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '1rem', fontWeight: 800, color: pct >= 100 ? 'var(--emerald)' : 'var(--brand)' }}>{pct}%</div>
        </div>

        <div style={{
          background: 'var(--grad)', borderRadius: 20, padding: '1.5rem',
          marginBottom: '1.2rem', color: '#fff', position: 'relative', overflow: 'hidden',
          boxShadow: 'var(--shadow-brand)'
        }}>
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -60, right: -40 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Status</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '0.2rem' }}>{pct >= 100 ? '🎯 Goal Reached!' : `${pct}% Funded`}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.2rem' }}>KES {fmt(kitty.raised || 0)} raised of KES {fmt(kitty.goal)}</div>
            
            <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 6, marginTop: '0.75rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: 'rgba(255,255,255,0.9)', borderRadius: 6, transition: 'width 0.8s ease' }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>KES {fmt(kitty.raised || 0)}</div>
                <div style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Raised</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: remaining > 0 ? undefined : '#34D399' }}>
                  {remaining > 0 ? `KES ${fmt(remaining)}` : '✅ Complete'}
                </div>
                <div style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Remaining</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{kitty.contributors || 0}</div>
                <div style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Supporters</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🎯</span> Milestones
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
            {milestones.map((m, i) => (
              <div key={i} style={{
                background: m.achieved ? 'var(--emerald-light)' : 'var(--surface2)',
                border: `2px solid ${m.achieved ? 'var(--emerald)' : 'var(--border)'}`,
                borderRadius: 10, padding: '0.5rem', textAlign: 'center', transition: 'all 0.3s'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: m.achieved ? 'var(--emerald)' : 'var(--text3)' }}>
                  {m.achieved ? '✅' : '⏳'} {m.label}
                </div>
                <div style={{ fontSize: '0.6rem', color: m.achieved ? 'var(--emerald)' : 'var(--text3)', marginTop: '0.15rem' }}>
                  {m.achieved ? 'Achieved!' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--surface2)', borderRadius: 14, padding: '1rem',
          border: '1.5px solid var(--border)', marginBottom: '1.2rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)', marginBottom: '0.6rem' }}>💸 Fee Breakdown</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text3)' }}>Platform Fee ({fp}%)</span>
            <span style={{ fontWeight: 700, color: 'var(--amber)' }}>KES {fmt(fee)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.8rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text3)' }}>Net Payout</span>
            <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>KES {fmt(Math.max(0, (kitty.raised || 0) - fee))}</span>
          </div>
        </div>

        <div style={{
          background: 'var(--surface2)', borderRadius: 14, padding: '1rem',
          border: '1.5px solid var(--border)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)', marginBottom: '0.6rem' }}>📅 Campaign Timeline</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '0.3rem 0', color: 'var(--text3)' }}>
            <span>Created</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{kitty.created}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '0.3rem 0', color: 'var(--text3)', borderTop: '1px solid var(--border)' }}>
            <span>Status</span>
            <span style={{ fontWeight: 600, color: pct >= 100 ? 'var(--emerald)' : 'var(--brand)' }}>
              {pct >= 100 ? '✅ Completed' : '🟢 Active'}
            </span>
          </div>
          {kitty.deadline && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '0.3rem 0', color: 'var(--text3)', borderTop: '1px solid var(--border)' }}>
              <span>Deadline</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{kitty.deadline}</span>
            </div>
          )}
        </div>
        <button className="back-btn" style={{ marginTop: '1.5rem' }} onClick={() => setSubPage(null)}>← Back to Kitty</button>
      </div>
    );
  }

  // ─── Sub-Page: Withdrawals ───
  if (subPage === 'withdrawals') {
    // Use the helper function to get withdrawals
    let withdrawals = getKittyTransactions('Withdrawal');
    
    // If no withdrawals found, try matching by name directly
    if (withdrawals.length === 0) {
      const allTransactions = state?.transactions || transactions || [];
      withdrawals = allTransactions.filter(t => 
        t.type === "Withdrawal" && 
        t.kitty && t.kitty.toLowerCase() === kitty.name.toLowerCase()
      );
    }
    
    const totalWithdrawn = withdrawals.reduce((sum, t) => sum + (t.gross || 0), 0);
    const totalFees = withdrawals.reduce((sum, t) => sum + (t.fee || 0), 0);
    const available = Math.max(0, (kitty.raised || 0) - totalWithdrawn);

    // ⭐ Show loading state
    if (loading) {
      return (
        <div className="page-wrap" style={{ paddingBottom: '2rem', paddingTop: '1rem', textAlign: 'center' }}>
          <div style={{ padding: '3rem 1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text2)' }}>Loading withdrawals...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="page-wrap" style={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setSubPage(null)} style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1.5px solid var(--border)',
            background: 'var(--surface)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>💸 Withdrawals</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>{kitty.name} · {withdrawals.length} withdrawals</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 700, color: 'var(--amber)' }}>Available: KES {fmt(available)}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '1.2rem' }}>
          {[
            { label: 'Total Withdrawn', value: `KES ${fmt(totalWithdrawn)}`, icon: '💸', color: 'var(--amber)' },
            { label: 'Total Fees', value: `KES ${fmt(totalFees)}`, icon: '📊', color: 'var(--rose)' },
            { label: 'Available Balance', value: `KES ${fmt(available)}`, icon: '💰', color: available > 0 ? 'var(--emerald)' : 'var(--text3)' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'var(--surface2)', borderRadius: 12, padding: '0.75rem', border: '1.5px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', marginBottom: '0.15rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: stat.color, fontFamily: 'var(--mono)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {withdrawals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text3)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏦</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No withdrawals yet</div>
            <div style={{ fontSize: '0.72rem', marginTop: '0.3rem' }}>Withdraw funds when you're ready</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {withdrawals.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'var(--surface)', borderRadius: 14, padding: '0.8rem 1rem',
                border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--rose-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  💸
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{t.name || 'Admin'}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text3)', marginTop: 2 }}>
                    {t.time || 'Just now'} · Ref: {t.refId || t.receipt || 'N/A'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--rose)', fontFamily: 'var(--mono)' }}>-KES {fmt(t.gross || 0)}</div>
                  {t.fee > 0 && <div style={{ fontSize: '0.55rem', color: 'var(--text3)' }}>Fee: KES {fmt(t.fee)}</div>}
                  <div style={{ fontSize: '0.55rem', color: 'var(--emerald)', fontWeight: 600 }}>Net: KES {fmt(t.net || 0)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="back-btn" style={{ marginTop: '1.5rem' }} onClick={() => setSubPage(null)}>← Back to Kitty</button>
      </div>
    );
  }

  // ─── Sub-Page: Funding Progress ───
  if (subPage === 'funding') {
    const pct = Math.round(((kitty.raised || 0) / (kitty.goal || 1)) * 100);
    const remaining = Math.max(0, kitty.goal - (kitty.raised || 0));
    const { fee, pct: fp } = getKittyFee(kitty);
    
    const milestones = [
      { label: '25%', value: 25, achieved: pct >= 25 },
      { label: '50%', value: 50, achieved: pct >= 50 },
      { label: '75%', value: 75, achieved: pct >= 75 },
      { label: '100%', value: 100, achieved: pct >= 100 },
    ];

    return (
      <div className="page-wrap" style={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setSubPage(null)} style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1.5px solid var(--border)',
            background: 'var(--surface)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>📈 Funding Progress</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>{kitty.name} · {pct}% funded</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '1rem', fontWeight: 800, color: pct >= 100 ? 'var(--emerald)' : 'var(--brand)' }}>{pct}%</div>
        </div>

        <div style={{
          background: 'var(--grad)', borderRadius: 20, padding: '1.5rem',
          marginBottom: '1.2rem', color: '#fff', position: 'relative', overflow: 'hidden',
          boxShadow: 'var(--shadow-brand)'
        }}>
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -60, right: -40 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Status</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '0.2rem' }}>{pct >= 100 ? '🎯 Goal Reached!' : `${pct}% Funded`}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.2rem' }}>KES {fmt(kitty.raised || 0)} raised of KES {fmt(kitty.goal)}</div>
            
            <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 6, marginTop: '0.75rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: 'rgba(255,255,255,0.9)', borderRadius: 6, transition: 'width 0.8s ease' }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>KES {fmt(kitty.raised || 0)}</div>
                <div style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Raised</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: remaining > 0 ? undefined : '#34D399' }}>
                  {remaining > 0 ? `KES ${fmt(remaining)}` : '✅ Complete'}
                </div>
                <div style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Remaining</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{kitty.contributors || 0}</div>
                <div style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Supporters</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🎯</span> Milestones
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
            {milestones.map((m, i) => (
              <div key={i} style={{
                background: m.achieved ? 'var(--emerald-light)' : 'var(--surface2)',
                border: `2px solid ${m.achieved ? 'var(--emerald)' : 'var(--border)'}`,
                borderRadius: 10, padding: '0.5rem', textAlign: 'center', transition: 'all 0.3s'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: m.achieved ? 'var(--emerald)' : 'var(--text3)' }}>
                  {m.achieved ? '✅' : '⏳'} {m.label}
                </div>
                <div style={{ fontSize: '0.6rem', color: m.achieved ? 'var(--emerald)' : 'var(--text3)', marginTop: '0.15rem' }}>
                  {m.achieved ? 'Achieved!' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--surface2)', borderRadius: 14, padding: '1rem',
          border: '1.5px solid var(--border)', marginBottom: '1.2rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)', marginBottom: '0.6rem' }}>💸 Fee Breakdown</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text3)' }}>Platform Fee ({fp}%)</span>
            <span style={{ fontWeight: 700, color: 'var(--amber)' }}>KES {fmt(fee)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.8rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text3)' }}>Net Payout</span>
            <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>KES {fmt(Math.max(0, (kitty.raised || 0) - fee))}</span>
          </div>
        </div>

        <div style={{
          background: 'var(--surface2)', borderRadius: 14, padding: '1rem',
          border: '1.5px solid var(--border)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)', marginBottom: '0.6rem' }}>📅 Campaign Timeline</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '0.3rem 0', color: 'var(--text3)' }}>
            <span>Created</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{kitty.created}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '0.3rem 0', color: 'var(--text3)', borderTop: '1px solid var(--border)' }}>
            <span>Status</span>
            <span style={{ fontWeight: 600, color: pct >= 100 ? 'var(--emerald)' : 'var(--brand)' }}>
              {pct >= 100 ? '✅ Completed' : '🟢 Active'}
            </span>
          </div>
          {kitty.deadline && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '0.3rem 0', color: 'var(--text3)', borderTop: '1px solid var(--border)' }}>
              <span>Deadline</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{kitty.deadline}</span>
            </div>
          )}
        </div>
        <button className="back-btn" style={{ marginTop: '1.5rem' }} onClick={() => setSubPage(null)}>← Back to Kitty</button>
      </div>
    );
  }

  // ─── Sub-Page: Withdrawals ───
  if (subPage === 'withdrawals') {
    // Use the helper function to get withdrawals
    let withdrawals = getKittyTransactions('Withdrawal');
    
    // If no withdrawals found, try matching by name directly
    if (withdrawals.length === 0) {
      const allTransactions = state?.transactions || transactions || [];
      withdrawals = allTransactions.filter(t => 
        t.type === "Withdrawal" && 
        t.kitty && t.kitty.toLowerCase() === kitty.name.toLowerCase()
      );
    }
    
    const totalWithdrawn = withdrawals.reduce((sum, t) => sum + (t.gross || 0), 0);
    const totalFees = withdrawals.reduce((sum, t) => sum + (t.fee || 0), 0);
    const available = Math.max(0, (kitty.raised || 0) - totalWithdrawn);

    return (
      <div className="page-wrap" style={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setSubPage(null)} style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1.5px solid var(--border)',
            background: 'var(--surface)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>💸 Withdrawals</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>{kitty.name} · {withdrawals.length} withdrawals</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 700, color: 'var(--amber)' }}>Available: KES {fmt(available)}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '1.2rem' }}>
          {[
            { label: 'Total Withdrawn', value: `KES ${fmt(totalWithdrawn)}`, icon: '💸', color: 'var(--amber)' },
            { label: 'Total Fees', value: `KES ${fmt(totalFees)}`, icon: '📊', color: 'var(--rose)' },
            { label: 'Available Balance', value: `KES ${fmt(available)}`, icon: '💰', color: available > 0 ? 'var(--emerald)' : 'var(--text3)' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'var(--surface2)', borderRadius: 12, padding: '0.75rem', border: '1.5px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', marginBottom: '0.15rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: stat.color, fontFamily: 'var(--mono)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {withdrawals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text3)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏦</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No withdrawals yet</div>
            <div style={{ fontSize: '0.72rem', marginTop: '0.3rem' }}>Withdraw funds when you're ready</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {withdrawals.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'var(--surface)', borderRadius: 14, padding: '0.8rem 1rem',
                border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--rose-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  💸
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{t.name || 'Admin'}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text3)', marginTop: 2 }}>{t.time || 'Just now'} · Ref: {t.ref || 'N/A'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--rose)', fontFamily: 'var(--mono)' }}>-KES {fmt(t.gross || 0)}</div>
                  {t.fee > 0 && <div style={{ fontSize: '0.55rem', color: 'var(--text3)' }}>Fee: KES {fmt(t.fee)}</div>}
                  <div style={{ fontSize: '0.55rem', color: 'var(--emerald)', fontWeight: 600 }}>Net: KES {fmt(t.net || 0)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="back-btn" style={{ marginTop: '1.5rem' }} onClick={() => setSubPage(null)}>← Back to Kitty</button>
      </div>
    );
  }

  // ─── Main Detail View ───
  const pct = Math.round(((kitty.raised || 0) / (kitty.goal || 1)) * 100);
  const { fee, pct: fp } = getKittyFee(kitty);
  const cfg = CATEGORY_MEDIA_CONFIG[kitty.category] || CATEGORY_MEDIA_CONFIG.Other;
  const fc = kitty.feeCategory || "contributions";
  const catColor = fc === "chama" ? "var(--violet)" : fc === "events" ? "var(--sky)" : "var(--brand)";

  const withdrawals = getKittyTransactions('Withdrawal');
  const totalWithdrawn = withdrawals.reduce((sum, t) => sum + (t.gross || 0), 0);
  const available = Math.max(0, (kitty.raised || 0) - totalWithdrawn);

  return (
    <div>
      {/* ── Sub-view Modals ── */}
      <Modal open={view === "contribute"} onClose={back}>
        <KittyContributeModal kitty={kitty} user={user} onClose={back} onContribute={(id,amt,name,phone) => { onContribute && onContribute(id,amt,name,phone); onToast && onToast("Contributed! 🎉",`KES ${fmt(amt)} added`); back(); }} />
      </Modal>
      <Modal open={view === "withdraw"} onClose={back}>
        <KittyWithdrawModal kitty={kitty} user={user} onClose={back} onConfirm={(k,net,f,phone,partial) => { onWithdraw && onWithdraw(k.id,net,f,phone,partial); onToast && onToast("Withdrawal Sent! 💸",`KES ${fmt(net)} is on its way`); back(); }} />
      </Modal>
      <Modal open={view === "edit"} onClose={back}>
        <EditKittyForm kitty={kitty} onClose={back} onSubmit={(updates) => { setKitty(k => ({...k,...updates})); onEditKitty && onEditKitty(kitty.id, updates); back(); onToast && onToast("Kitty Updated ✅",`"${updates.name}" saved`); }} />
      </Modal>
      <Modal open={view === "report"} onClose={back}>
        <KittyContributorsReport kitty={kitty} transactions={transactions||[]} user={user} onBack={back} onWithdraw={() => { back(); setTimeout(() => setView("withdraw"), 80); }} onContribute={() => { back(); setTimeout(() => setView("contribute"), 80); }} onShare={() => { back(); setTimeout(() => setView("share"), 80); }} onToast={onToast} />
      </Modal>
      <Modal open={view === "share"} onClose={back}>
        <ShareKittyModal kitty={kitty} onClose={back} onOpenContribute={() => { back(); setTimeout(() => setView("contribute"), 80); }} />
      </Modal>

      {/* ── Detail view ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"}}>
        <div className="modal-title" style={{margin:0}}>{kitty.name}</div>
        <button onClick={onClose} style={{width:30,height:30,border:"1.5px solid var(--border)",borderRadius:"50%",background:"var(--surface2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"0.8rem",color:"var(--text2)"}}>✕</button>
      </div>

      {kitty.mediaBanner && <img src={kitty.mediaBanner.dataUrl} alt="banner" className="kd-media-banner" />}
      {kitty.mediaImage && cfg.mediaStyle === "portrait" && (
        <div style={{display:"flex",gap:"0.85rem",marginBottom:"1rem",alignItems:"flex-start"}}>
          <img src={kitty.mediaImage.dataUrl} alt="campaign" className="kd-media-portrait" style={{width:110,height:130,objectFit:"cover",borderRadius:14,flexShrink:0,boxShadow:"var(--shadow)"}} />
          {kitty.description && (
            <div style={{flex:1}}>
              <div style={{fontSize:"0.62rem",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.35rem"}}>About this campaign</div>
              <div style={{fontSize:"0.8rem",color:"var(--text2)",lineHeight:1.65}}>{kitty.description}</div>
            </div>
          )}
        </div>
      )}
      {kitty.mediaImage && cfg.mediaStyle === "landscape" && <img src={kitty.mediaImage.dataUrl} alt="campaign" className="kd-media-banner" style={{marginBottom:"1rem"}} />}
      {kitty.description && !(kitty.mediaImage && cfg.mediaStyle === "portrait") && (
        <div className="kd-description-box">
          <div className="kd-desc-label">About this campaign</div>
          <div className="kd-desc-text">{kitty.description}</div>
        </div>
      )}
      {kitty.mediaDoc && (
        <div className="kd-media-doc" onClick={() => { try { const w = window.open(); w.document.write(`<img src="${kitty.mediaDoc.dataUrl}" style="max-width:100%">`); } catch(e){} }}>
          <div style={{width:40,height:40,borderRadius:11,background:"var(--brand-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>{cfg.docEmoji}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--brand)"}}>{cfg.docLabel}</div>
            <div style={{fontSize:"0.65rem",color:"var(--text3)",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{kitty.mediaDoc.name}</div>
          </div>
          <div style={{fontSize:"0.65rem",fontWeight:700,color:"var(--brand)",opacity:0.7}}>View ›</div>
        </div>
      )}

      <div className="kd-hero">
        <div className="kd-hero-orb o1"/><div className="kd-hero-orb o2"/>
        <div className="kd-hero-inner">
          <div className="kd-hero-lbl">Total Raised</div>
          <div className="kd-hero-amount">KES {fmt(kitty.raised || 0)}</div>
          <div className="kd-hero-goal">of KES {fmt(kitty.goal)} goal · {pct}% funded</div>
          <div style={{marginTop:"0.75rem"}}>
            <div style={{height:6,background:"rgba(255,255,255,0.2)",borderRadius:10,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:"rgba(255,255,255,0.85)",borderRadius:10,transition:"width 0.6s"}}/>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Enhanced Clickable Stats Row ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {/* Supporters - Clickable */}
        <div 
          onClick={() => setSubPage('supporters')}
          style={{
            background: 'var(--surface2)',
            borderRadius: 14,
            padding: '0.75rem 0.5rem',
            textAlign: 'center',
            border: '1.5px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--brand)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '0.65rem', marginBottom: '0.2rem' }}>👥</div>
          <div className="kd-stat-val" style={{ fontSize: '1rem' }}>
            {kitty.contributors || 0}
          </div>
          <div className="kd-stat-lbl" style={{ fontSize: '0.55rem' }}>Supporters</div>
          <div style={{ fontSize: '0.5rem', color: 'var(--brand)', marginTop: '0.2rem', opacity: 0.6 }}>View all →</div>
        </div>

        {/* Funding Progress - Clickable */}
        <div 
          onClick={() => setSubPage('funding')}
          style={{
            background: 'var(--surface2)',
            borderRadius: 14,
            padding: '0.75rem 0.5rem',
            textAlign: 'center',
            border: '1.5px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--brand)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '0.65rem', marginBottom: '0.2rem' }}>📈</div>
          <div className="kd-stat-val" style={{ fontSize: '1rem', color: pct >= 100 ? 'var(--emerald)' : 'var(--brand)' }}>
            {pct}%
          </div>
          <div className="kd-stat-lbl" style={{ fontSize: '0.55rem' }}>Funded</div>
          <div style={{ fontSize: '0.5rem', color: 'var(--brand)', marginTop: '0.2rem', opacity: 0.6 }}>View details →</div>
        </div>

        {/* Amount Left / Available - Clickable */}
        <div 
          onClick={() => setSubPage('withdrawals')}
          style={{
            background: 'var(--surface2)',
            borderRadius: 14,
            padding: '0.75rem 0.5rem',
            textAlign: 'center',
            border: '1.5px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--brand)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '0.65rem', marginBottom: '0.2rem' }}>💰</div>
          <div className="kd-stat-val" style={{ fontSize: '0.8rem', color: (kitty.raised||0) >= kitty.goal ? 'var(--emerald)' : 'var(--text)' }}>
            {(kitty.raised||0) >= kitty.goal 
              ? `+KES ${fmt((kitty.raised||0)-kitty.goal)}`
              : `KES ${fmt(kitty.goal-(kitty.raised||0))}`
            }
          </div>
          <div className="kd-stat-lbl" style={{ fontSize: '0.55rem' }}>
            {(kitty.raised||0) >= kitty.goal ? 'Over Target 🎯' : 'To Go'}
          </div>
          <div style={{ fontSize: '0.5rem', color: 'var(--brand)', marginTop: '0.2rem', opacity: 0.6 }}>View withdrawals →</div>
        </div>
      </div>

      <div style={{background:"var(--surface2)",borderRadius:14,padding:"0.85rem",border:"1.5px solid var(--border)",marginBottom:"0.75rem"}}>
        <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:"0.5rem"}}>Campaign Info</div>
        {[["Name", kitty.name],["Category", kittyCategory(kitty)],["Created", kitty.created],["Status","Active 🟢"]].map(([l,v]) => (
          <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",padding:"0.3rem 0",borderTop:"1px solid var(--border2)"}}>
            <span style={{color:"var(--text3)"}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
          </div>
        ))}
      </div>

      <div className="kd-fee-box">
        <span>Platform fee ({fp}%)</span>
        <strong>KES {fmt(fee)}</strong>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.5rem"}}>
        <button className="confirm-btn" style={{padding:"0.7rem",background:"var(--grad)",boxShadow:"0 6px 18px rgba(79,70,229,0.25)",margin:0}} onClick={() => setView("contribute")}>💰 Contribute</button>
        <button className="confirm-btn" style={{padding:"0.7rem",background:"var(--grad2)",boxShadow:"0 6px 18px rgba(16,185,129,0.25)",margin:0}} onClick={() => setView("withdraw")}>💸 Withdraw</button>
        <button className="confirm-btn" style={{padding:"0.7rem",background:"linear-gradient(135deg,#4F46E5,#0EA5E9)",boxShadow:"0 6px 18px rgba(14,165,233,0.25)",margin:0}} onClick={() => setView("report")}>📊 Report</button>
        <button className="confirm-btn" style={{padding:"0.7rem",background:"linear-gradient(135deg,#7C3AED,#EC4899)",boxShadow:"0 6px 18px rgba(124,58,237,0.25)",margin:0}} onClick={() => setView("share")}>🔗 Share</button>
      </div>
      <button className="back-btn" style={{marginTop:0,width:"100%"}} onClick={() => setView("edit")}>✏️ Edit Kitty</button>
      <button className="back-btn" style={{marginTop:"0.4rem",width:"100%"}} onClick={onClose}>Close</button>
    </div>
  );
}

function KittySupportersPage({ kitty, transactions, onBack }) {
  // ── Robust filtering for supporters ──
  const supporters = React.useMemo(() => {
    if (!transactions || transactions.length === 0) {
      console.log('⚠️ No transactions available');
      return [];
    }
    
    console.log('🔍 Looking for supporters for kitty:', kitty.name);
    console.log('📊 Total transactions:', transactions.length);
    
    // First try: Exact match by kitty name
    let matched = transactions.filter(t => {
      if (t.type !== "Contribution") return false;
      
      // Try exact match
      if (t.kitty && t.kitty.toLowerCase() === kitty.name.toLowerCase()) {
        return true;
      }
      
      // Try ID match
      if (t.kittyId && (t.kittyId === kitty.id || String(t.kittyId) === String(kitty.id))) {
        return true;
      }
      
      return false;
    });
    
    console.log(`📊 Exact matches: ${matched.length}`);
    
    // Second try: Partial match if no exact matches
    if (matched.length === 0) {
      console.log('🔄 No exact matches, trying partial match...');
      
      matched = transactions.filter(t => {
        if (t.type !== "Contribution") return false;
        
        if (!t.kitty) return false;
        
        const kittyNameLower = kitty.name.toLowerCase();
        const transactionKittyLower = t.kitty.toLowerCase();
        
        // Check if kitty name contains transaction kitty or vice versa
        return transactionKittyLower.includes(kittyNameLower) || 
               kittyNameLower.includes(transactionKittyLower);
      });
      
      console.log(`📊 Partial matches: ${matched.length}`);
    }
    
    // Third try: Check if the transaction has the kitty ID stored
    if (matched.length === 0) {
      console.log('🔄 Trying to find by kitty ID in transaction data...');
      
      matched = transactions.filter(t => {
        if (t.type !== "Contribution") return false;
        
        // Check if the transaction has a kittyId that matches
        return t.kittyId === kitty.id || 
               t.kitty_id === kitty.id || 
               String(t.kittyId) === String(kitty.id) ||
               String(t.kitty_id) === String(kitty.id);
      });
      
      console.log(`📊 ID matches: ${matched.length}`);
    }
    
    return matched;
  }, [transactions, kitty]);
  
  const totalRaised = supporters.reduce((sum, t) => sum + (t.gross || 0), 0);
  const supporterCount = supporters.length > 0 ? supporters.length : (kitty.contributors || 0);
  
  return (
    <div className="page-wrap" style={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10,
          border: '1.5px solid var(--border)',
          background: 'var(--surface)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            👥 Supporters
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>
            {kitty.name} · {supporterCount} contributors
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand)' }}>
          KES {fmt(totalRaised)}
        </div>
      </div>

      {/* Stats summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.6rem',
        marginBottom: '1.2rem'
      }}>
        {[
          { label: 'Total Contributors', value: supporterCount, icon: '👥' },
          { label: 'Total Raised', value: `KES ${fmt(totalRaised)}`, icon: '💰' },
          { label: 'Average Contribution', value: supporterCount > 0 ? `KES ${fmt(totalRaised / supporterCount)}` : 'KES 0', icon: '📊' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'var(--surface2)',
            borderRadius: 12,
            padding: '0.75rem',
            border: '1.5px solid var(--border)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', marginBottom: '0.15rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand)', fontFamily: 'var(--mono)' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Supporters list */}
      {supporters.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text3)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤝</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No supporters yet</div>
          <div style={{ fontSize: '0.72rem', marginTop: '0.3rem' }}>Share your kitty to start receiving support</div>
          {kitty.contributors > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--brand)', background: 'var(--brand-light)', padding: '0.5rem', borderRadius: 8 }}>
              ℹ️ {kitty.contributors} contribution(s) found in kitty data
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {supporters.map((t, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--surface)',
              borderRadius: 14,
              padding: '0.8rem 1rem',
              border: '1.5px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-mid)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: i < 3 ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'var(--brand-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: i < 3 ? '#fff' : 'var(--brand)',
                flexShrink: 0
              }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (t.name || '?')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                  {t.name || 'Anonymous'}
                  {t.phone && <span style={{ fontSize: '0.6rem', color: 'var(--text3)', marginLeft: '0.4rem', fontWeight: 400 }}>{maskPhone(t.phone)}</span>}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text3)', marginTop: 2 }}>
                  {t.time || 'Just now'} · Ref: {t.ref || 'N/A'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--emerald)', fontFamily: 'var(--mono)' }}>
                  KES {fmt(t.gross || 0)}
                </div>
                {t.fee > 0 && <div style={{ fontSize: '0.55rem', color: 'var(--text3)' }}>Fee: KES {fmt(t.fee)}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button className="back-btn" style={{ marginTop: '1.5rem' }} onClick={onBack}>← Back to Kitty</button>
    </div>
  );
}

function KittyFundingPage({ kitty, onBack }) {
  const pct = Math.round(((kitty.raised || 0) / (kitty.goal || 1)) * 100);
  const remaining = Math.max(0, kitty.goal - (kitty.raised || 0));
  const over = (kitty.raised || 0) - kitty.goal;
  const { fee, pct: fp } = getKittyFee(kitty);
  
  // Generate milestone data
  const milestones = [
    { label: '25%', value: 25, achieved: pct >= 25 },
    { label: '50%', value: 50, achieved: pct >= 50 },
    { label: '75%', value: 75, achieved: pct >= 75 },
    { label: '100%', value: 100, achieved: pct >= 100 },
  ];

  return (
    <div className="page-wrap" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10,
          border: '1.5px solid var(--border)',
          background: 'var(--surface)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            📈 Funding Progress
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>
            {kitty.name} · {pct}% funded
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '1rem', fontWeight: 800, color: pct >= 100 ? 'var(--emerald)' : 'var(--brand)' }}>
          {pct}%
        </div>
      </div>

      {/* Main progress card */}
      <div style={{
        background: 'var(--grad)',
        borderRadius: 20,
        padding: '1.5rem',
        marginBottom: '1.2rem',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-brand)'
      }}>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -60, right: -40 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Current Status
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '0.2rem' }}>
            {pct >= 100 ? '🎯 Goal Reached!' : `${pct}% Funded`}
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.2rem' }}>
            KES {fmt(kitty.raised || 0)} raised of KES {fmt(kitty.goal)}
          </div>
          
          {/* Progress bar */}
          <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 6, marginTop: '0.75rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: 'rgba(255,255,255,0.9)', borderRadius: 6, transition: 'width 0.8s ease' }} />
          </div>
          
          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>KES {fmt(kitty.raised || 0)}</div>
              <div style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Raised</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: remaining > 0 ? undefined : '#34D399' }}>
                {remaining > 0 ? `KES ${fmt(remaining)}` : '✅ Complete'}
              </div>
              <div style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Remaining</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{kitty.contributors || 0}</div>
              <div style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Supporters</div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>🎯</span> Milestones
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
          {milestones.map((m, i) => (
            <div key={i} style={{
              background: m.achieved ? 'var(--emerald-light)' : 'var(--surface2)',
              border: `2px solid ${m.achieved ? 'var(--emerald)' : 'var(--border)'}`,
              borderRadius: 10,
              padding: '0.5rem',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: m.achieved ? 'var(--emerald)' : 'var(--text3)'
              }}>
                {m.achieved ? '✅' : '⏳'} {m.label}
              </div>
              <div style={{
                fontSize: '0.6rem',
                color: m.achieved ? 'var(--emerald)' : 'var(--text3)',
                marginTop: '0.15rem'
              }}>
                {m.achieved ? 'Achieved!' : 'Pending'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fee breakdown */}
      <div style={{
        background: 'var(--surface2)',
        borderRadius: 14,
        padding: '1rem',
        border: '1.5px solid var(--border)',
        marginBottom: '1.2rem'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)', marginBottom: '0.6rem' }}>
          💸 Fee Breakdown
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text3)' }}>Platform Fee ({fp}%)</span>
          <span style={{ fontWeight: 700, color: 'var(--amber)' }}>KES {fmt(fee)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.8rem', borderTop: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text3)' }}>Net Payout</span>
          <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>KES {fmt(Math.max(0, (kitty.raised || 0) - fee))}</span>
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        background: 'var(--surface2)',
        borderRadius: 14,
        padding: '1rem',
        border: '1.5px solid var(--border)'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)', marginBottom: '0.6rem' }}>
          📅 Campaign Timeline
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '0.3rem 0', color: 'var(--text3)' }}>
          <span>Created</span>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{kitty.created}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '0.3rem 0', color: 'var(--text3)', borderTop: '1px solid var(--border)' }}>
          <span>Status</span>
          <span style={{ fontWeight: 600, color: pct >= 100 ? 'var(--emerald)' : 'var(--brand)' }}>
            {pct >= 100 ? '✅ Completed' : '🟢 Active'}
          </span>
        </div>
        {kitty.deadline && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '0.3rem 0', color: 'var(--text3)', borderTop: '1px solid var(--border)' }}>
            <span>Deadline</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{kitty.deadline}</span>
          </div>
        )}
      </div>

      <button className="back-btn" style={{ marginTop: '1.5rem' }} onClick={onBack}>← Back to Kitty</button>
    </div>
  );
}

function KittyWithdrawalsPage({ kitty, transactions, onBack }) {
  const withdrawals = transactions.filter(t => t.kitty === kitty.name && t.type === "Withdrawal");
  const totalWithdrawn = withdrawals.reduce((sum, t) => sum + (t.gross || 0), 0);
  const totalFees = withdrawals.reduce((sum, t) => sum + (t.fee || 0), 0);
  const available = Math.max(0, (kitty.raised || 0) - totalWithdrawn);

  return (
    <div className="page-wrap" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10,
          border: '1.5px solid var(--border)',
          background: 'var(--surface)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            💸 Withdrawals
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>
            {kitty.name} · {withdrawals.length} withdrawals
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 700, color: 'var(--amber)' }}>
          Available: KES {fmt(available)}
        </div>
      </div>

      {/* Summary stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.6rem',
        marginBottom: '1.2rem'
      }}>
        {[
          { label: 'Total Withdrawn', value: `KES ${fmt(totalWithdrawn)}`, icon: '💸', color: 'var(--amber)' },
          { label: 'Total Fees', value: `KES ${fmt(totalFees)}`, icon: '📊', color: 'var(--rose)' },
          { label: 'Available Balance', value: `KES ${fmt(available)}`, icon: '💰', color: available > 0 ? 'var(--emerald)' : 'var(--text3)' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'var(--surface2)',
            borderRadius: 12,
            padding: '0.75rem',
            border: '1.5px solid var(--border)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', marginBottom: '0.15rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: stat.color, fontFamily: 'var(--mono)' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Withdrawals list */}
      {withdrawals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text3)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏦</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No withdrawals yet</div>
          <div style={{ fontSize: '0.72rem', marginTop: '0.3rem' }}>Withdraw funds when you're ready</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {withdrawals.map((t, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--surface)',
              borderRadius: 14,
              padding: '0.8rem 1rem',
              border: '1.5px solid var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--rose-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                flexShrink: 0
              }}>
                💸
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                  {t.name || 'Admin'}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text3)', marginTop: 2 }}>
                  {t.time || 'Just now'} · Ref: {t.ref || 'N/A'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--rose)', fontFamily: 'var(--mono)' }}>
                  -KES {fmt(t.gross || 0)}
                </div>
                {t.fee > 0 && <div style={{ fontSize: '0.55rem', color: 'var(--text3)' }}>Fee: KES {fmt(t.fee)}</div>}
                <div style={{ fontSize: '0.55rem', color: 'var(--emerald)', fontWeight: 600 }}>Net: KES {fmt(t.net || 0)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button className="back-btn" style={{ marginTop: '1.5rem' }} onClick={onBack}>← Back to Kitty</button>
    </div>
  );
}

// ─── Kitty Withdraw Modal (partial + password auth) ───
function KittyWithdrawModal({ kitty, user, onClose, onConfirm }) {
  const available = kitty.raised || 0;
  const [step, setStep] = useState(1); // 1=amount+method, 2=auth, 3=pin, 4=done
  const [withdrawAmt, setWithdrawAmt] = useState(String(available));
  const [method, setMethod] = useState("mpesa");
  // M-Pesa / Airtel
  const [phone, setPhone] = useState("0712345678");
  // Paybill
  const [paybillNo, setPaybillNo] = useState("");
  const [paybillAcc, setPaybillAcc] = useState("");
  // Till
  const [tillNo, setTillNo] = useState("");
  // Bank
  const [bankName, setBankName] = useState("");
  const [bankAcc, setBankAcc] = useState("");
  // Auth
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pin, setPin] = useState("");
  const [confirmed, setConfirmed] = useState({ gross: available, fee: 0, net: available });

  const parsedAmt = Math.min(Math.max(parseFloat(withdrawAmt) || 0, 0), available);
  const liveCalc = getKittyFee(kitty, parsedAmt);
  const liveFee = liveCalc.fee;
  const liveFp  = liveCalc.pct;
  const liveNet = parsedAmt - liveFee;

  const needsPin = method === "mpesa" || method === "airtel";

  const methodLabel = { mpesa:"M-Pesa", airtel:"Airtel Money", paybill:"Paybill", till:"Till Number", bank:"Bank Transfer" }[method] || method;
  const methodIcon  = { mpesa:"📱", airtel:"🔴", paybill:"🏢", till:"🏪", bank:"🏦" }[method];

  const getDestination = () => {
    if (method === "mpesa" || method === "airtel") return maskPhone(phone);
    if (method === "paybill") return `${paybillNo} · Acc ${paybillAcc}`;
    if (method === "till") return `Till ${tillNo}`;
    if (method === "bank") return `${bankName} · ${bankAcc}`;
    return "";
  };

  const validateStep1 = () => {
    if (parsedAmt < 1) return false;
    if (method === "mpesa" || method === "airtel") return phone.replace(/\D/g,"").length >= 9;
    if (method === "paybill") return paybillNo.trim() && paybillAcc.trim();
    if (method === "till") return tillNo.trim();
    if (method === "bank") return bankName.trim() && bankAcc.trim();
    return true;
  };

  const handleContinue = () => {
    if (!validateStep1()) return;
    setConfirmed({ gross: parsedAmt, fee: liveFee, net: liveNet });
    setStep(2);
  };

  const handleAuthSubmit = () => {
    const matchDb   = DEFAULT_STATE.users.find(u => u.email === user.email && u.pass === password);
    const matchUser = user.pass === password;
    if (!matchDb && !matchUser) { setPwError("Incorrect password. Please try again."); return; }
    setPwError("");
    if (needsPin) { setStep(3); }
    else {
      onConfirm(kitty, confirmed.net, confirmed.fee, getDestination(), confirmed.gross);
      setStep(4);
    }
  };

  const handleKey = (k) => {
    if (k === "del") { setPin(p => p.slice(0,-1)); return; }
    if (pin.length >= 4) return;
    const np = pin + k; setPin(np);
    if (np.length === 4) {
      setTimeout(() => {
        setPin("");
        onConfirm(kitty, confirmed.net, confirmed.fee, getDestination(), confirmed.gross);
        setStep(4);
      }, 400);
    }
  };

  // Withdrawal method options
  const methods = [
    { key:"mpesa",   icon:"📱", label:"M-Pesa",       color:"#10B981", bg:"var(--emerald-light)" },
    { key:"airtel",  icon:"🔴", label:"Airtel Money",  color:"#e4000f", bg:"#fff5f5" },
    { key:"paybill", icon:"🏢", label:"Paybill",       color:"var(--brand)", bg:"var(--brand-light)" },
    { key:"till",    icon:"🏪", label:"Till No.",      color:"var(--violet)", bg:"var(--violet-light)" },
    { key:"bank",    icon:"🏦", label:"Bank",          color:"var(--sky)", bg:"var(--sky-light)" },
  ];

  return (
    <div>
      {step !== 4 && (
        <div>
          <div className="modal-title">{kitty.name}</div>
          <div style={{fontSize:"0.72rem",fontWeight:600,color:"var(--text3)",marginTop:"-0.7rem",marginBottom:"1rem",letterSpacing:"0.01em"}}>Withdraw Funds</div>
        </div>
      )}

      {/* ── Step 1: Amount + Method ── */}
      {step === 1 && (
        <>
          <div style={{background:"var(--emerald-light)",borderRadius:14,padding:"0.85rem",marginBottom:"1rem",border:"1.5px solid rgba(16,185,129,0.2)"}}>
            <div style={{fontSize:"0.65rem",fontWeight:600,color:"var(--emerald)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>Available Balance</div>
            <div style={{fontSize:"1.3rem",fontWeight:800,color:"var(--emerald)",fontFamily:"var(--mono)",letterSpacing:"-0.03em"}}>KES {fmt(available)}</div>
          </div>

          <div className="field">
            <label>Withdrawal Amount (KES)</label>
            <input type="number" min="1" max={available} placeholder={`Max KES ${fmt(available)}`}
              value={withdrawAmt} onChange={e => setWithdrawAmt(e.target.value)} />
          </div>
          <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.9rem"}}>
            {[25,50,75,100].map(p => (
              <button key={p} className="btn btn-ghost btn-sm" style={{flex:1}}
                onClick={() => setWithdrawAmt(String(Math.floor(available * p / 100)))}>
                {p}%
              </button>
            ))}
          </div>

          <div className="wd-confirm-box" style={{marginBottom:"1rem"}}>
            {[["Withdraw",`KES ${fmt(parsedAmt)}`],[`Platform fee (${liveFp}%)`,`− KES ${fmt(liveFee)}`]].map(([l,v]) => (
              <div key={l} className="wd-confirm-row"><span style={{color:"var(--text3)"}}>{l}</span><span>{v}</span></div>
            ))}
            <div className="wd-confirm-row net"><span>You receive</span><span>KES {fmt(liveNet)}</span></div>
          </div>

          {/* Method selector */}
          <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.5rem",letterSpacing:"0.01em"}}>Withdrawal Method</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"0.4rem",marginBottom:"1rem"}}>
            {methods.map(m => (
              <button key={m.key} onClick={() => setMethod(m.key)} style={{
                border:`2px solid ${method===m.key?m.color:"var(--border)"}`,
                borderRadius:12,padding:"0.55rem 0.2rem",
                background:method===m.key?m.bg:"var(--surface2)",
                cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                transition:"all 0.18s",fontFamily:"var(--font)"
              }}>
                <span style={{fontSize:"1.1rem"}}>{m.icon}</span>
                <span style={{fontSize:"0.55rem",fontWeight:700,color:method===m.key?m.color:"var(--text3)",letterSpacing:"0.01em",textAlign:"center",lineHeight:1.2}}>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Dynamic fields per method */}
          {(method === "mpesa") && (
            <div className="field">
              <label>M-Pesa Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0712 345 678" />
              <div style={{marginTop:"0.3rem",fontSize:"0.68rem",color:"var(--emerald)",fontWeight:600}}>📱 Funds sent instantly via Safaricom M-Pesa</div>
            </div>
          )}
          {(method === "airtel") && (
            <div className="field">
              <label>Airtel Money Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0733 123 456" />
              <div style={{marginTop:"0.3rem",fontSize:"0.68rem",color:"#e4000f",fontWeight:600}}>🔴 Funds sent via Airtel Money</div>
            </div>
          )}
          {method === "paybill" && (
            <>
              <div className="field">
                <label>Business / Paybill Number</label>
                <input type="tel" value={paybillNo} onChange={e => setPaybillNo(e.target.value)} placeholder="e.g. 522533" />
              </div>
              <div className="field">
                <label>Account Number</label>
                <input value={paybillAcc} onChange={e => setPaybillAcc(e.target.value)} placeholder="e.g. your phone or reference" />
              </div>
              <div style={{marginBottom:"0.9rem",fontSize:"0.68rem",color:"var(--brand)",fontWeight:600,background:"var(--brand-light)",borderRadius:10,padding:"0.55rem 0.75rem"}}>🏢 Funds sent to specified Paybill & account number</div>
            </>
          )}
          {method === "till" && (
            <>
              <div className="field">
                <label>Till Number</label>
                <input type="tel" value={tillNo} onChange={e => setTillNo(e.target.value)} placeholder="e.g. 123456" />
              </div>
              <div style={{marginBottom:"0.9rem",fontSize:"0.68rem",color:"var(--violet)",fontWeight:600,background:"var(--violet-light)",borderRadius:10,padding:"0.55rem 0.75rem"}}>🏪 Funds sent directly to this till number</div>
            </>
          )}
          {method === "bank" && (
            <>
              <div className="field">
                <label>Bank Name</label>
                <input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. Equity Bank" />
              </div>
              <div className="field">
                <label>Account Number</label>
                <input value={bankAcc} onChange={e => setBankAcc(e.target.value)} placeholder="e.g. 0123456789012" />
              </div>
              <div style={{marginBottom:"0.9rem",fontSize:"0.68rem",color:"var(--sky)",fontWeight:600,background:"var(--sky-light)",borderRadius:10,padding:"0.55rem 0.75rem"}}>🏦 Bank transfer — processed within 1–2 business days</div>
            </>
          )}

          <button className="confirm-btn" style={{background:"var(--grad2)",boxShadow:"0 8px 24px rgba(16,185,129,0.25)"}}
            onClick={handleContinue}>Continue →</button>
          <button className="back-btn" onClick={onClose}>Cancel</button>
        </>
      )}

      {/* ── Step 2: Password Authorization ── */}
      {step === 2 && (
        <>
          <div style={{textAlign:"center",marginBottom:"1rem"}}>
            <div style={{fontSize:"2.2rem",marginBottom:"0.4rem"}}>🔐</div>
            <div style={{fontSize:"0.9rem",fontWeight:700,marginBottom:"0.3rem"}}>Authorization Required</div>
            <div style={{fontSize:"0.78rem",color:"var(--text2)",lineHeight:1.5}}>
              Authorize a withdrawal of <strong>KES {fmt(confirmed.gross)}</strong> via {methodIcon} {methodLabel}
            </div>
          </div>

          {/* Summary of destination */}
          <div style={{background:"var(--surface2)",borderRadius:12,padding:"0.75rem 0.9rem",marginBottom:"1rem",border:"1.5px solid var(--border)",fontSize:"0.78rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{color:"var(--text3)"}}>Method</span><span style={{fontWeight:700}}>{methodIcon} {methodLabel}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{color:"var(--text3)"}}>Destination</span><span style={{fontWeight:600,fontFamily:"var(--mono)",fontSize:"0.75rem"}}>{getDestination()}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid var(--border)",paddingTop:6,marginTop:2}}>
              <span style={{color:"var(--text3)"}}>You receive</span><span style={{fontWeight:800,color:"var(--emerald)"}}>KES {fmt(confirmed.net)}</span>
            </div>
          </div>

          {pwError && <div className="auth-msg" style={{marginBottom:"0.75rem"}}>{pwError}</div>}
          <div className="field">
            <label>Your Account Password</label>
            <input type="password" placeholder="Enter your login password" value={password}
              onChange={e => { setPassword(e.target.value); setPwError(""); }}
              onKeyDown={e => e.key === "Enter" && handleAuthSubmit()} />
          </div>
          <div style={{background:"var(--amber-light)",border:"1.5px solid #FDE68A",borderRadius:12,padding:"0.65rem 0.85rem",fontSize:"0.72rem",color:"var(--amber)",marginBottom:"1rem"}}>
            🔒 Only the kitty creator can authorize withdrawals.
          </div>
          <button className="confirm-btn" style={{background:"var(--grad2)",boxShadow:"0 8px 24px rgba(16,185,129,0.25)"}}
            onClick={handleAuthSubmit}>{needsPin ? "Authorize →" : "Confirm Withdrawal →"}</button>
          <button className="back-btn" onClick={() => { setStep(1); setPassword(""); setPwError(""); }}>← Back</button>
        </>
      )}

      {/* ── Step 3: PIN (M-Pesa / Airtel only) ── */}
      {/* {step === 3 && (
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{methodIcon}</div>
          <div style={{fontSize:"0.85rem",color:"var(--text2)",marginBottom:"1rem",lineHeight:1.5}}>
            Enter {methodLabel} PIN to send <strong>KES {fmt(confirmed.net)}</strong> to {maskPhone(phone)}
          </div>
          <div className="mpesa-pin-row">
            {[0,1,2,3].map(i => (
              <div key={i} className={`pin-box${pin.length > i ? " filled" : ""}`}
                style={method==="airtel"&&pin.length>i?{borderColor:"#e4000f",background:"#fff5f5",color:"#e4000f"}:{}}>
                {pin.length > i ? "★" : "●"}
              </div>
            ))}
          </div>
          <div className="keypad-grid">
            {["1","2","3","4","5","6","7","8","9","*","0","del"].map(k => (
              <button key={k} className="key-btn" onClick={() => handleKey(k)}>{k === "del" ? "⌫" : k}</button>
            ))}
          </div>
          <button className="back-btn" style={{marginTop:"0.75rem"}} onClick={() => { setStep(2); setPin(""); }}>← Back</button>
        </div>
      )} */}

      {/* ── Step 4: Done ── */}
      {step === 4 && (
        <div style={{textAlign:"center",padding:"1rem 0"}}>
          <div style={{fontSize:"3rem",marginBottom:"0.75rem"}}>🎉</div>
          <div style={{fontSize:"1.1rem",fontWeight:800,marginBottom:"0.4rem",letterSpacing:"-0.02em"}}>Withdrawal Sent!</div>
          <div style={{fontSize:"0.82rem",color:"var(--text2)",marginBottom:"1rem",lineHeight:1.5}}>
            <strong>KES {fmt(confirmed.net)}</strong> is on its way via {methodIcon} {methodLabel}.
          </div>
          <div style={{background:"var(--emerald-light)",border:"1.5px solid rgba(16,185,129,0.2)",borderRadius:12,padding:"0.85rem",marginBottom:"1.5rem",fontSize:"0.75rem",color:"#065F46",lineHeight:1.6,textAlign:"left"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span>Method</span><strong>{methodIcon} {methodLabel}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span>Destination</span><strong style={{fontFamily:"var(--mono)",fontSize:"0.72rem"}}>{getDestination()}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid rgba(16,185,129,0.2)",paddingTop:6}}><span>Amount</span><strong>KES {fmt(confirmed.net)}</strong></div>
            {method === "bank" && <div style={{marginTop:6,fontSize:"0.68rem",color:"#047857"}}>⏱ Bank transfers typically arrive within 1–2 business days.</div>}
          </div>
          <button className="confirm-btn" style={{background:"var(--grad2)",boxShadow:"0 8px 24px rgba(16,185,129,0.25)"}} onClick={onClose}>Done ✓</button>
        </div>
      )}
    </div>
  );
}

// ─── Kitty Contribute Modal ───
// ─── Kitty Contribute Modal ───
function KittyContributeModal({ kitty, user, onClose, onContribute }) {
  // ── State ──
  const [step, setStep] = useState(1); // 1=details, 2=payment, 3=processing, 4=done, 5=error
  const [amount, setAmount] = useState("");
  const [contribName, setContribName] = useState(user.name);
  const [anonymous, setAnonymous] = useState(false);
  const [method, setMethod] = useState("mpesa");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [paymentReceipt, setPaymentReceipt] = useState("");
  const [pollingAttempts, setPollingAttempts] = useState(0);
  
  const displayName = anonymous ? "Anonymous" : (contribName.trim() || user.name);
  const parsedAmt = parseFloat(amount) || 0;
  const isAirtel = method === "airtel";
  const MAX_WAIT_TIME = 60; // 60 seconds timeout
  const MAX_POLL_ATTEMPTS = 60; // 60 attempts (1 per second)

  // ── Timer for processing screen ──
  useEffect(() => {
    let timer;
    if (step === 3) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

//   // ── Handle contribution ──
//   const handleContribute = async () => {
//   if (isProcessing) return;
  
//   // Validate phone number
//   if ((method === "mpesa" || method === "airtel") && phone.replace(/\D/g, "").length < 9) {
//     setErrorMessage("Please enter a valid phone number");
//     setTimeout(() => setErrorMessage(""), 3000);
//     return;
//   }

//   setIsProcessing(true);
//   setErrorMessage("");
//   setElapsedTime(0);
//   setPollingAttempts(0);
//   setPaymentReceipt("");
//   setStep(3); // Show processing screen
  
//   try {
//     // ✅ Call the parent's onContribute and wait for the result
//     const result = await onContribute(kitty.id, parsedAmt, displayName, phone);
    
//     console.log('📦 Contribution result:', result);
    
//     // ✅ Check if result exists and is confirmed
//     if (result && result.confirmed === true) {
//       setPaymentReceipt(result.receipt || "");
//       setStep(4); // Show success
//     } else if (result && result.error) {
//       // ✅ Handle error from the result
//       setErrorMessage(result.error || "Payment failed. Please try again.");
//       setStep(5);
//       setTimeout(() => {
//         setStep(2);
//         setIsProcessing(false);
//         setErrorMessage("");
//       }, 3000);
//     } else {
//       // ✅ Handle unexpected result
//       setErrorMessage("Payment failed. Please try again.");
//       setStep(5);
//       setTimeout(() => {
//         setStep(2);
//         setIsProcessing(false);
//         setErrorMessage("");
//       }, 3000);
//     }
//   } catch (error) {
//     // ✅ Handle errors thrown by onContribute
//     console.error('Contribution error:', error);
//     setErrorMessage(error?.error || error?.message || "Payment failed. Please try again.");
//     setStep(5);
//     setTimeout(() => {
//       setStep(2);
//       setIsProcessing(false);
//       setErrorMessage("");
//     }, 3000);
//   }
// };

// In KittyContributeModal.js - update the handleContribute function

const handleContribute = async () => {
  if (isProcessing) return;
  
  // Validate phone number
  if ((method === "mpesa" || method === "airtel") && phone.replace(/\D/g, "").length < 9) {
    setErrorMessage("Please enter a valid phone number");
    setTimeout(() => setErrorMessage(""), 3000);
    return;
  }

  setIsProcessing(true);
  setErrorMessage("");
  setElapsedTime(0);
  setPollingAttempts(0);
  setPaymentReceipt("");
  setStep(3); // Show processing screen
  
  try {
    // Call the parent's onContribute
    const result = await onContribute(kitty.id, parsedAmt, displayName, phone);
    
    console.log('📦 Contribution result:', result);
    
    // ⭐ Check if result exists and is confirmed
    if (result && result.confirmed === true) {
      setPaymentReceipt(result.receipt || "");
      setStep(4); // Show success immediately
    } else if (result && result.error) {
      setErrorMessage(result.error || "Payment failed. Please try again.");
      setStep(5);
      setTimeout(() => {
        setStep(2);
        setIsProcessing(false);
        setErrorMessage("");
      }, 3000);
    } else {
      // Handle unexpected result
      setErrorMessage("Payment failed. Please try again.");
      setStep(5);
      setTimeout(() => {
        setStep(2);
        setIsProcessing(false);
        setErrorMessage("");
      }, 3000);
    }
  } catch (error) {
    console.error('Contribution error:', error);
    setErrorMessage(error?.error || error?.message || "Payment failed. Please try again.");
    setStep(5);
    setTimeout(() => {
      setStep(2);
      setIsProcessing(false);
      setErrorMessage("");
    }, 3000);
  }
};

  // ── Format time ──
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  // ── Get status icon and color ──
  const getStatusDisplay = () => {
    const timeLeft = Math.max(0, MAX_WAIT_TIME - elapsedTime);
    const progress = Math.min(100, (elapsedTime / MAX_WAIT_TIME) * 100);
    
    if (errorMessage) {
      return {
        icon: "❌",
        title: "Payment Failed",
        color: "var(--rose)",
        message: errorMessage
      };
    }
    
    return {
      icon: "📲",
      title: "Check Your Phone!",
      color: "var(--brand)",
      message: `${isAirtel ? "Airtel Money" : "M-Pesa"} prompt sent to ${phone}`,
      subMessage: "Enter your PIN on your phone to complete the payment.",
      timeLeft,
      progress
    };
  };

  const status = getStatusDisplay();

  // ── Render ──
  return (
    <div>
      <div className="modal-title">{step !== 4 ? "Contribute to Kitty" : ""}</div>

      {/* ── Step 1: Details ── */}
      {step === 1 && (
        <>
          <div style={{background:"var(--brand-light)",borderRadius:14,padding:"0.85rem",marginBottom:"1rem",border:"1.5px solid rgba(79,70,229,0.15)"}}>
            <div style={{fontSize:"0.65rem",fontWeight:600,color:"var(--brand)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>Contributing to</div>
            <div style={{fontSize:"1rem",fontWeight:800,color:"var(--brand)",letterSpacing:"-0.02em"}}>{kitty.name}</div>
            <div style={{fontSize:"0.72rem",color:"var(--text2)",marginTop:2}}>KES {fmt(kitty.raised || 0)} raised of KES {fmt(kitty.goal)}</div>
          </div>
          
          <div className="field">
            <label>Your Name</label>
            <input 
              placeholder="Enter your name" 
              value={contribName} 
              onChange={e => setContribName(e.target.value)} 
              disabled={anonymous} 
              style={{opacity: anonymous ? 0.45 : 1}} 
            />
          </div>
          
          <div className="anon-check-row" onClick={() => setAnonymous(a => !a)}>
            <div className={`anon-checkbox${anonymous ? " checked" : ""}`} />
            <div>
              <div className="anon-label">Contribute anonymously</div>
              <div className="anon-sub">Your name will show as "Anonymous".</div>
            </div>
          </div>
          
          <div className="field">
            <label>Amount (KES) <span style={{color:"var(--rose)"}}>*</span></label>
            <input 
              type="number" 
              placeholder="Enter amount" 
              min="10" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
            />
            {parsedAmt > 0 && (
              <div style={{marginTop:"0.3rem",fontSize:"0.68rem",color:"var(--text3)"}}>
                You're about to contribute <strong style={{color:"var(--brand)"}}>KES {fmt(parsedAmt)}</strong>
              </div>
            )}
          </div>
          
          <div className="amount-display">
            <div className="amount-display-lbl">You're contributing</div>
            <div className="amount-display-val">KES {fmt(parsedAmt)}</div>
          </div>
          
          <button 
            className="confirm-btn" 
            onClick={() => {
              if (parsedAmt < 10) {
                setErrorMessage("Minimum contribution is KES 10");
                setTimeout(() => setErrorMessage(""), 2000);
                return;
              }
              if (!anonymous && !contribName.trim()) {
                setErrorMessage("Please enter your name or contribute anonymously");
                setTimeout(() => setErrorMessage(""), 2000);
                return;
              }
              setErrorMessage("");
              setStep(2);
            }}
          >
            Continue →
          </button>
          <button className="back-btn" onClick={onClose}>Cancel</button>
          {errorMessage && (
            <div style={{marginTop:"0.5rem",fontSize:"0.72rem",color:"var(--rose)",textAlign:"center"}}>
              ⚠️ {errorMessage}
            </div>
          )}
        </>
      )}

      {/* ── Step 2: Payment Method ── */}
      {step === 2 && (
        <>
          <div style={{marginBottom:"0.75rem"}}>
            <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.5rem",letterSpacing:"0.01em"}}>
              Payment Method <span style={{color:"var(--rose)"}}>*</span>
            </div>
            <div className="pay-methods">
              <div className={`pay-method${method === "mpesa" ? " active" : ""}`} onClick={() => { setMethod("mpesa"); setPhone(""); setErrorMessage(""); }}>
                <div className="pay-method-icon">📱</div><div className="pay-method-name">M-Pesa</div>
              </div>
              <div className={`pay-method${method === "airtel" ? " active-airtel" : ""}`} onClick={() => { setMethod("airtel"); setPhone(""); setErrorMessage(""); }}>
                <div className="pay-method-icon">🔴</div><div className="pay-method-name" style={method==="airtel"?{color:"#e4000f"}:{}}>Airtel</div>
              </div>
              <div className={`pay-method${method === "bank" ? " active" : ""}`} onClick={() => { setMethod("bank"); setPhone(""); setErrorMessage(""); }}>
                <div className="pay-method-icon">🏦</div><div className="pay-method-name">Bank</div>
              </div>
            </div>
          </div>

          {(method === "mpesa" || method === "airtel") && (
            <div className="field">
              <label>{method === "mpesa" ? "M-Pesa" : "Airtel Money"} Number <span style={{color:"var(--rose)"}}>*</span></label>
              <input 
                value={phone} 
                onChange={e => {
                  setPhone(e.target.value);
                  setErrorMessage("");
                }} 
                placeholder="e.g. 0712345678" 
                type="tel"
                disabled={isProcessing}
              />
              <div style={{marginTop:"0.3rem",fontSize:"0.65rem",color:"var(--text3)"}}>
                📱 You'll receive an STK prompt on this number
              </div>
            </div>
          )}

          {method === "bank" && (
            <div style={{background:"var(--surface2)",borderRadius:12,padding:"0.85rem",border:"1.5px solid var(--border)",fontSize:"0.8rem",color:"var(--text2)",lineHeight:1.5,marginBottom:"1rem"}}>
              🏦 Bank transfer instructions will be sent after confirming.
            </div>
          )}
          
          {/* Payment summary */}
          <div style={{background:"var(--surface2)",borderRadius:12,padding:"0.75rem",marginBottom:"1rem",border:"1px solid var(--border)"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.78rem",padding:"0.3rem 0"}}>
              <span style={{color:"var(--text3)"}}>Amount</span>
              <span style={{fontWeight:700}}>KES {fmt(parsedAmt)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.78rem",padding:"0.3rem 0"}}>
              <span style={{color:"var(--text3)"}}>Method</span>
              <span style={{fontWeight:700}}>{method === "mpesa" ? "M-Pesa" : method === "airtel" ? "Airtel Money" : "Bank Transfer"}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.78rem",padding:"0.3rem 0",borderTop:"1px solid var(--border)",marginTop:"0.3rem",paddingTop:"0.3rem"}}>
              <span style={{color:"var(--text3)"}}>Contributing as</span>
              <span style={{fontWeight:700}}>{displayName}</span>
            </div>
          </div>

          {errorMessage && (
            <div style={{
              background: "var(--rose-light)",
              border: "1px solid rgba(244,63,94,0.2)",
              borderRadius: 8,
              padding: "0.5rem 0.75rem",
              marginBottom: "0.75rem",
              fontSize: "0.78rem",
              color: "var(--rose)"
            }}>
              ⚠️ {errorMessage}
            </div>
          )}

          <button 
            className="confirm-btn" 
            onClick={handleContribute}
            disabled={isProcessing}
            style={{opacity: isProcessing ? 0.7 : 1}}
          >
            {isProcessing ? "Processing..." : "Confirm Payment →"}
          </button>
          <button className="back-btn" onClick={() => { setStep(1); setErrorMessage(""); }}>← Back</button>
        </>
      )}

      {/* ── Step 3: Processing / Check Phone ── */}
      {step === 3 && (
        <div style={{textAlign:"center", padding:"1rem 0"}}>
          <div style={{fontSize:"3rem", marginBottom:"0.75rem"}}>📲</div>
          <div style={{fontSize:"1.1rem", fontWeight:800, marginBottom:"0.4rem", color:"var(--text)"}}>
            Check Your Phone!
          </div>
          
          <div style={{fontSize:"0.82rem", color:"var(--text2)", marginBottom:"0.5rem", lineHeight:1.6}}>
            {isAirtel ? "Airtel Money" : "M-Pesa"} prompt sent to <strong style={{color:"var(--brand)"}}>{phone}</strong>
          </div>
          
          <div style={{fontSize:"0.7rem", color:"var(--text3)", marginBottom:"1rem"}}>
            Enter your PIN on your phone to complete the payment.
          </div>
          
          {/* Progress bar */}
          <div style={{marginBottom:"0.75rem", maxWidth:"300px", margin:"0 auto 0.75rem"}}>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:"0.6rem", color:"var(--text3)", marginBottom:"0.2rem"}}>
              <span>Processing</span>
              <span>{formatTime(elapsedTime)} / {MAX_WAIT_TIME}s</span>
            </div>
            <div style={{
              height: 4,
              background: "var(--surface3)",
              borderRadius: 4,
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                width: `${Math.min(100, (elapsedTime / MAX_WAIT_TIME) * 100)}%`,
                background: elapsedTime > MAX_WAIT_TIME * 0.8 ? "var(--amber)" : "var(--brand)",
                borderRadius: 4,
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>
          
          {/* Spinner */}
          <div style={{display:"flex", justifyContent:"center", marginBottom:"1rem"}}>
            <div style={{
              width: 40,
              height: 40,
              border: "3px solid var(--surface3)",
              borderTop: "3px solid var(--brand)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
          </div>

          <p style={{fontSize:"0.7rem", color:"var(--text3)"}}>
            Waiting for confirmation {pollingAttempts > 0 && `(attempt ${pollingAttempts})`}
          </p>
          
          <button 
            className="back-btn" 
            style={{marginTop:"0.75rem"}} 
            onClick={() => { 
              setStep(2); 
              setIsProcessing(false);
              setErrorMessage("");
              setElapsedTime(0);
            }}
          >
            Cancel Payment
          </button>
        </div>
      )}

      {/* ── Step 4: Success ── */}
      {step === 4 && (
        <div style={{textAlign:"center", padding:"1rem 0"}}>
          <div style={{fontSize:"3rem", marginBottom:"0.75rem", animation: "bounce 0.5s ease"}}>🎉</div>
          <div style={{fontSize:"1.1rem", fontWeight:800, marginBottom:"0.4rem", letterSpacing:"-0.02em", color:"var(--emerald)"}}>
            Contribution Successful!
          </div>
          <div style={{fontSize:"0.82rem", color:"var(--text2)", marginBottom:"0.5rem", lineHeight:1.6}}>
            <strong>KES {fmt(parsedAmt)}</strong> contributed to <strong>{kitty.name}</strong>
          </div>
          <div style={{fontSize:"0.7rem", color:"var(--text3)", marginBottom:"0.75rem"}}>
            {anonymous ? "Anonymous" : `as ${displayName}`}
            {paymentReceipt && (
              <div style={{marginTop:"0.3rem", fontSize:"0.65rem", color:"var(--text3)"}}>
                Receipt: {paymentReceipt}
              </div>
            )}
          </div>
          <div style={{
            background: "var(--emerald-light)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 8,
            padding: "0.5rem 0.75rem",
            marginBottom: "1.25rem",
            fontSize: "0.72rem",
            color: "var(--emerald)"
          }}>
            ✅ Payment confirmed and recorded
          </div>
          <button className="confirm-btn" onClick={onClose}>Done ✓</button>
        </div>
      )}

      {/* ── Step 5: Error ── */}
      {step === 5 && (
        <div style={{textAlign:"center", padding:"1rem 0"}}>
          <div style={{fontSize:"3rem", marginBottom:"0.75rem"}}>❌</div>
          <div style={{fontSize:"1.1rem", fontWeight:800, marginBottom:"0.4rem", color:"var(--rose)"}}>
            Payment Failed
          </div>
          <div style={{fontSize:"0.82rem", color:"var(--text2)", marginBottom:"0.75rem", lineHeight:1.6}}>
            {errorMessage || "There was an issue processing your payment. Please try again."}
          </div>
          <div style={{
            background: "var(--rose-light)",
            border: "1px solid rgba(244,63,94,0.2)",
            borderRadius: 8,
            padding: "0.5rem 0.75rem",
            marginBottom: "1rem",
            fontSize: "0.72rem",
            color: "var(--rose)"
          }}>
            ⚠️ No money has been deducted from your account
          </div>
          <button className="confirm-btn" style={{background:"var(--grad)"}} onClick={() => { setStep(2); setIsProcessing(false); setErrorMessage(""); }}>
            Try Again
          </button>
          <button className="back-btn" onClick={onClose}>Cancel</button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Chama Detail Modal ───
function ChamaDetailModal({ chama, onClose, onContribute, onWithdraw }) {
  const [lateDays, setLateDays] = useState("");
  const [baseContrib, setBaseContrib] = useState("");
  const realMembers = (chama.memberList || []);
  // Fallback display if no real memberList — show estimated rows
  const members = realMembers.length > 0 ? realMembers.map(m => ({
    name: m.name, initials: (m.name||"?").slice(0,2).toUpperCase(),
    paid: chama.contributionAmount || Math.round(chama.pool / (chama.members||1))
  })) : [
    { name: "Jane Wambua", initials: "JW", paid: chama.pool > 0 ? Math.round(chama.pool / (chama.members||1) * 1.2) : 0 },
    { name: "Peter Odhiambo", initials: "PO", paid: chama.pool > 0 ? Math.round(chama.pool / (chama.members||1) * 0.9) : 0 },
    { name: "Amina Mohamed", initials: "AM", paid: chama.pool > 0 ? Math.round(chama.pool / (chama.members||1) * 1.1) : 0 },
    { name: "David Kamau", initials: "DK", paid: chama.pool > 0 ? Math.round(chama.pool / (chama.members||1) * 0.8) : 0 },
  ];

  const calcPenalty = () => {
    const days = parseInt(lateDays) || 0;
    const contrib = parseFloat(baseContrib) || 0;
    if (!chama.penaltyValue || days <= 0) return null;
    let pen = 0;
    const freq = chama.penaltyFrequency || (chama.penaltyPerDay ? "daily" : "monthly");
    const multiplies = freq === "daily" || freq === "weekly";
    if (chama.penaltyType === "fixed") {
      pen = multiplies ? chama.penaltyValue * days : chama.penaltyValue;
    } else {
      const rate = chama.penaltyValue / 100;
      pen = multiplies ? contrib * rate * days : contrib * rate;
    }
    return pen;
  };
  const penaltyAmt = calcPenalty();

  return (
    <div>
      <div className="chd-header">
        <div className="chd-icon">{Icons.chama}</div>
        <div>
          <div className="chd-name">{chama.name}</div>
          <div className="chd-badge">{chama.cycle}</div>
        </div>
      </div>
      <div className="chd-pool-card">
        <div>
          <div className="chd-pool-lbl">Pool Balance</div>
          <div className="chd-pool-val">KES {fmt(chama.pool)}</div>
          <div className="chd-pool-sub">{chama.members} active members</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.65)",marginBottom:3}}>Avg. per member</div>
          <div style={{fontSize:"1rem",fontWeight:800,color:"#fff",fontFamily:"var(--mono)"}}>{chama.members ? `KES ${fmt(Math.round(chama.pool/chama.members))}` : "—"}</div>
        </div>
      </div>
      <div className="chd-stats-grid">
        {[["Members",chama.members||0],["Cycle",chama.cycle],["Next Meeting",chama.nextMeeting],["Status","Active 🟢"]].map(([l,v]) => (
          <div key={l} className="chd-stat"><div className="chd-stat-lbl">{l}</div><div className="chd-stat-val" style={{color:"var(--violet)"}}>{v}</div></div>
        ))}
      </div>

      {/* Penalty Policy */}
      {chama.penaltyValue > 0 && (
        <div style={{background:"#FFF7ED",border:"1.5px solid rgba(245,158,11,0.25)",borderRadius:12,padding:"0.85rem",marginBottom:"1rem"}}>
          <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--amber)",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:"0.5rem"}}>⚠️ Late Penalty Policy</div>
          <div style={{fontSize:"0.78rem",color:"var(--text2)",lineHeight:1.5,marginBottom:"0.65rem"}}>
            {chama.penaltyType === "fixed"
              ? `KES ${fmt(chama.penaltyValue)} per ${chama.penaltyFrequency || (chama.penaltyPerDay ? "day" : "occurrence")} late`
              : `${chama.penaltyValue}% of contribution per ${chama.penaltyFrequency || (chama.penaltyPerDay ? "day" : "occurrence")} late`}
          </div>

          {/* Penalty Calculator */}
          <div style={{background:"var(--surface)",borderRadius:10,padding:"0.75rem",border:"1px solid var(--border)"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.5rem",letterSpacing:"0.01em"}}>🧮 Penalty Calculator</div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"0.4rem"}}>
              <input type="number" min="1"
                placeholder={`How many ${chama.penaltyFrequency === "weekly" ? "weeks" : chama.penaltyFrequency === "monthly" ? "months" : "days"} late?`}
                value={lateDays} onChange={e => setLateDays(e.target.value)}
                style={{width:"100%",boxSizing:"border-box",border:"1.5px solid var(--border)",borderRadius:8,padding:"0.45rem 0.6rem",fontSize:"0.78rem",fontFamily:"var(--font)",background:"var(--surface2)",color:"var(--text)",outline:"none"}} />
              {chama.penaltyType === "percentage" && (
                <input type="number" min="0"
                  placeholder="Contribution amount (KES)"
                  value={baseContrib} onChange={e => setBaseContrib(e.target.value)}
                  style={{width:"100%",boxSizing:"border-box",border:"1.5px solid var(--border)",borderRadius:8,padding:"0.45rem 0.6rem",fontSize:"0.78rem",fontFamily:"var(--font)",background:"var(--surface2)",color:"var(--text)",outline:"none"}} />
              )}
            </div>
            {penaltyAmt !== null && (
              <div style={{background:"var(--amber-light)",borderRadius:8,padding:"0.5rem 0.7rem",fontSize:"0.78rem",fontWeight:700,color:"var(--amber)"}}>
                Penalty: KES {fmt(penaltyAmt.toFixed(2))}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:"0.5rem"}}>Recent Contributors</div>
      <div style={{background:"var(--surface2)",borderRadius:14,padding:"0.5rem 0.75rem",border:"1.5px solid var(--border)",marginBottom:"1rem"}}>
        {members.slice(0,4).map((m,i) => (
          <div key={i} className="chd-member-row">
            <div className="chd-member-av">{m.initials}</div>
            <div className="chd-member-name">{m.name}</div>
            <div className="chd-member-amt">KES {fmt(m.paid)}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:"0.6rem"}}>
        <button className="back-btn" style={{marginTop:0,flex:1}} onClick={onClose}>Close</button>
        {onWithdraw && (
          <button className="confirm-btn" style={{flex:1,padding:"0.75rem",background:"linear-gradient(135deg,#10B981,#059669)",boxShadow:"0 8px 24px rgba(16,185,129,0.28)"}} onClick={() => { onClose(); onWithdraw(chama); }}>
            💸 Withdraw
          </button>
        )}
        <button className="confirm-btn" style={{flex:1,padding:"0.75rem",background:"var(--grad-chama)",boxShadow:"0 8px 24px rgba(124,58,237,0.28)"}} onClick={() => { onClose(); onContribute(chama); }}>
          Contribute →
        </button>
      </div>
    </div>
  );
}

// ─── Chama Contribute Modal ───
function ChamaContributeModal({ chama, onClose, onConfirm }) {
  const hasPenalty = chama.penaltyValue > 0;

  // Penalty fields (only relevant when chama has a penalty policy)
  const [isLate, setIsLate] = useState(false);
  const [lateDays, setLateDays] = useState("");
  const [baseAmount, setBaseAmount] = useState("");

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("0712345678");
  const [pin, setPin] = useState("");
  const [done, setDone] = useState(false);

  // ── Penalty calculation ──
  const parsedBase = parseFloat(baseAmount) || 0;
  const parsedDays = parseInt(lateDays) || 0;

  const calcPenalty = () => {
    if (!hasPenalty || !isLate || parsedBase <= 0) return 0;
    const freq = chama.penaltyFrequency || (chama.penaltyPerDay ? "daily" : "monthly");
    const multiplies = freq === "daily" || freq === "weekly";
    const units = multiplies ? Math.max(1, parsedDays) : 1;
    if (chama.penaltyType === "fixed") {
      return chama.penaltyValue * units;
    } else {
      return parsedBase * (chama.penaltyValue / 100) * units;
    }
  };

  const penaltyAmt = calcPenalty();
  const totalAmount = parsedBase + penaltyAmt;

  // ── Success screen ──
  if (done) return (
    <div style={{textAlign:"center",padding:"1rem 0"}}>
      <div style={{fontSize:"3rem",marginBottom:"0.75rem"}}>🏠</div>
      <div style={{fontSize:"1.1rem",fontWeight:800,marginBottom:"0.4rem",letterSpacing:"-0.02em"}}>Contribution Sent!</div>
      <div style={{fontSize:"0.82rem",color:"var(--text2)",marginBottom:"0.75rem"}}>
        KES {fmt(parsedBase)} added to <strong>{chama.name}</strong>.
      </div>
      {penaltyAmt > 0 && (
        <div style={{background:"var(--amber-light)",border:"1.5px solid rgba(245,158,11,0.2)",borderRadius:10,padding:"0.6rem 0.85rem",marginBottom:"0.75rem",fontSize:"0.78rem",color:"var(--amber)",fontWeight:600}}>
          ⚠️ Includes KES {fmt(penaltyAmt)} late penalty ({chama.penaltyPerDay ? `${parsedDays} day${parsedDays!==1?"s":""} × ` : ""}{chama.penaltyType==="fixed"?`KES ${fmt(chama.penaltyValue)}`:`${chama.penaltyValue}%`})
        </div>
      )}
      <div style={{background:"var(--emerald-light)",border:"1.5px solid rgba(16,185,129,0.15)",borderRadius:10,padding:"0.6rem 0.85rem",marginBottom:"1.25rem",fontSize:"0.78rem",color:"#065F46"}}>
        ✅ Total paid: <strong>KES {fmt(totalAmount)}</strong>
      </div>
      <button className="confirm-btn" style={{background:"var(--grad-chama)",boxShadow:"0 8px 24px rgba(124,58,237,0.28)"}} onClick={onClose}>Done ✓</button>
    </div>
  );

  return (
    <div>
      <div className="modal-title">Contribute to {chama.name}</div>

      {step === 1 && (
        <>
          {/* Pool balance pill */}
          <div style={{background:"var(--violet-light)",borderRadius:14,padding:"0.85rem",marginBottom:"1rem",border:"1.5px solid rgba(124,58,237,0.15)"}}>
            <div style={{fontSize:"0.65rem",fontWeight:600,color:"var(--violet)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>Pool Balance</div>
            <div style={{fontSize:"1.3rem",fontWeight:800,color:"var(--violet)",fontFamily:"var(--mono)",letterSpacing:"-0.03em"}}>KES {fmt(chama.pool)}</div>
          </div>

          {/* Base contribution amount */}
          <div className="field">
            <label>Contribution Amount (KES)</label>
            <input type="number" placeholder="Enter your contribution" min="10"
              value={baseAmount} onChange={e => setBaseAmount(e.target.value)} />
          </div>

          {/* ── Late penalty section (only when chama has penalty configured) ── */}
          {hasPenalty && (
            <div style={{marginBottom:"1rem"}}>
              {/* Toggle: are you paying late? */}
              <div onClick={() => { setIsLate(l => !l); setLateDays(""); }}
                style={{display:"flex",alignItems:"flex-start",gap:"0.65rem",background:isLate?"#FFF7ED":"var(--surface2)",
                  border:`1.5px solid ${isLate?"rgba(245,158,11,0.4)":"var(--border)"}`,borderRadius:12,
                  padding:"0.75rem 0.85rem",cursor:"pointer",transition:"all 0.18s",marginBottom:"0.6rem"}}>
                <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${isLate?"var(--amber)":"var(--border)"}`,
                  background:isLate?"var(--amber)":"var(--surface)",display:"flex",alignItems:"center",
                  justifyContent:"center",flexShrink:0,marginTop:1,transition:"all 0.18s"}}>
                  {isLate && <span style={{color:"#fff",fontSize:"0.7rem",fontWeight:800}}>✓</span>}
                </div>
                <div>
                  <div style={{fontSize:"0.8rem",fontWeight:700,color:isLate?"var(--amber)":"var(--text)"}}>I'm paying late</div>
                  <div style={{fontSize:"0.67rem",color:"var(--text3)",marginTop:2,lineHeight:1.4}}>
                    Penalty: {chama.penaltyType==="fixed"
                      ? `KES ${fmt(chama.penaltyValue)}${chama.penaltyPerDay?" per day late":" flat fee"}`
                      : `${chama.penaltyValue}% of contribution${chama.penaltyPerDay?" per day late":" (one-time)"}`}
                  </div>
                </div>
              </div>

              {/* Days late input (shown when late & per-day penalty) */}
              {isLate && chama.penaltyPerDay && (
                <div className="field" style={{marginBottom:"0.6rem"}}>
                  <label style={{color:"var(--amber)"}}>Number of days late</label>
                  <input type="number" min="1" placeholder="e.g. 3"
                    value={lateDays} onChange={e => setLateDays(e.target.value)}
                    style={{borderColor:"rgba(245,158,11,0.5)"}} />
                </div>
              )}

              {/* Live penalty breakdown */}
              {isLate && parsedBase > 0 && (penaltyAmt > 0 || !chama.penaltyPerDay || parsedDays > 0) && (
                <div style={{background:"#FFF7ED",border:"1.5px solid rgba(245,158,11,0.25)",borderRadius:12,padding:"0.75rem 0.9rem"}}>
                  <div style={{fontSize:"0.68rem",fontWeight:700,color:"var(--amber)",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:"0.5rem"}}>⚠️ Penalty Breakdown</div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.78rem",color:"var(--text2)",padding:"0.25rem 0"}}>
                    <span>Contribution</span><span style={{fontWeight:700}}>KES {fmt(parsedBase)}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.78rem",color:"var(--amber)",padding:"0.25rem 0",borderTop:"1px solid rgba(245,158,11,0.15)"}}>
                    <span>
                      Late penalty
                      {chama.penaltyPerDay && parsedDays > 0 ? ` (${parsedDays} day${parsedDays!==1?"s":""} × ${chama.penaltyType==="fixed"?`KES ${fmt(chama.penaltyValue)}`:`${chama.penaltyValue}%`})` : ""}
                    </span>
                    <span style={{fontWeight:700}}>+ KES {fmt(penaltyAmt)}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.88rem",color:"var(--violet)",fontWeight:800,padding:"0.4rem 0 0",borderTop:"2px solid rgba(245,158,11,0.2)",marginTop:"0.25rem"}}>
                    <span>Total to pay</span>
                    <span style={{fontFamily:"var(--mono)"}}>KES {fmt(totalAmount)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Total display (always visible once base amount is entered) */}
          {parsedBase > 0 && (
            <div style={{background:"var(--violet-light)",border:"1.5px solid rgba(124,58,237,0.15)",borderRadius:14,padding:"1rem",textAlign:"center",marginBottom:"1rem"}}>
              <div style={{fontSize:"0.65rem",fontWeight:600,color:"var(--violet)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>
                {penaltyAmt > 0 ? "Total (incl. penalty)" : "You're contributing"}
              </div>
              <div style={{fontSize:"2rem",fontWeight:800,color:"var(--violet)",fontFamily:"var(--mono)",letterSpacing:"-0.04em"}}>
                KES {fmt(totalAmount)}
              </div>
              {penaltyAmt > 0 && (
                <div style={{fontSize:"0.68rem",color:"var(--amber)",marginTop:4,fontWeight:600}}>
                  KES {fmt(parsedBase)} contribution + KES {fmt(penaltyAmt)} penalty
                </div>
              )}
            </div>
          )}

          <div className="field"><label>M-Pesa Number</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} />
          </div>

          <button className="confirm-btn" style={{background:"var(--grad-chama)",boxShadow:"0 8px 24px rgba(124,58,237,0.28)"}}
            onClick={() => {
              if (parsedBase < 10) return;
              if (isLate && chama.penaltyPerDay && parsedDays < 1) return;
              setStep(2);
            }}>Review →</button>
          <button className="back-btn" onClick={onClose}>Cancel</button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="wd-confirm-box">
            {[
              ["Chama", chama.name],
              ["Contribution", `KES ${fmt(parsedBase)}`],
              ...(penaltyAmt > 0 ? [["Late Penalty", `+ KES ${fmt(penaltyAmt)}`]] : []),
              ["M-Pesa", phone]
            ].map(([l,v]) => (
              <div key={l} className="wd-confirm-row">
                <span style={{color: l==="Late Penalty" ? "var(--amber)" : "var(--text3)"}}>{l}</span>
                <span style={{color: l==="Late Penalty" ? "var(--amber)" : undefined, fontWeight: l==="Late Penalty" ? 700 : undefined}}>{v}</span>
              </div>
            ))}
            <div className="wd-confirm-row net" style={{color:"var(--violet)"}}>
              <span>Total</span><span>KES {fmt(totalAmount)}</span>
            </div>
          </div>

          {penaltyAmt > 0 && (
            <div style={{background:"#FFF7ED",border:"1.5px solid rgba(245,158,11,0.2)",borderRadius:10,padding:"0.6rem 0.85rem",marginBottom:"0.75rem",fontSize:"0.72rem",color:"var(--amber)",lineHeight:1.5}}>
              ⚠️ This includes a <strong>KES {fmt(penaltyAmt)}</strong> late penalty
              {chama.penaltyPerDay && parsedDays > 0 ? ` for ${parsedDays} day${parsedDays!==1?"s":""} overdue` : ""}.
            </div>
          )}

          <div style={{textAlign:"center",marginBottom:"0.5rem"}}>
            <div style={{fontSize:"2rem",marginBottom:"0.4rem"}}>📲</div>
            <div style={{fontSize:"0.82rem",color:"var(--text2)",marginBottom:"0.75rem"}}>Enter M-Pesa PIN to confirm</div>
            <div className="mpesa-pin-row">
              {[0,1,2,3].map(i => <div key={i} className={`pin-box${pin.length>i?" filled":""}`}
                style={pin.length>i?{borderColor:"var(--violet)",background:"var(--violet-light)",color:"var(--violet)"}:{}}>
                {pin.length>i?"★":"●"}
              </div>)}
            </div>
            <div className="keypad-grid">
              {["1","2","3","4","5","6","7","8","9","*","0","del"].map(k => (
                <button key={k} className="key-btn" onClick={() => {
                  if (k === "del") { setPin(p => p.slice(0,-1)); return; }
                  if (pin.length < 4) {
                    const np = pin + k;
                    setPin(np);
                    if (np.length === 4) {
                      setTimeout(() => { setPin(""); setDone(true); onConfirm(chama.id, parsedBase); }, 500);
                    }
                  }
                }}>{k === "del" ? "⌫" : k}</button>
              ))}
            </div>
          </div>
          <button className="back-btn" onClick={() => { setStep(1); setPin(""); }}>← Back</button>
        </>
      )}
    </div>
  );
}

// ─── Chama Withdraw Modal ───
function ChamaWithdrawModal({ chama, user, onClose, onConfirm }) {
  const available = chama.pool || 0;
  const [step, setStep] = useState(1);
  const [withdrawAmt, setWithdrawAmt] = useState(String(available));
  const [method, setMethod] = useState("mpesa");
  const [phone, setPhone] = useState("0712345678");
  const [paybillNo, setPaybillNo] = useState("");
  const [paybillAcc, setPaybillAcc] = useState("");
  const [tillNo, setTillNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAcc, setBankAcc] = useState("");
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pin, setPin] = useState("");
  const [confirmed, setConfirmed] = useState({ gross: available, fee: 0, net: available });

  const parsedAmt = Math.min(Math.max(parseFloat(withdrawAmt) || 0, 0), available);
  const liveCalc  = calcChamaFee(parsedAmt);
  const liveFee   = liveCalc.fee;
  const liveFp    = liveCalc.pct;
  const liveNet   = parsedAmt - liveFee;
  const flatRate  = liveCalc.flatRate;

  const needsPin = method === "mpesa" || method === "airtel";
  const methodLabel = { mpesa:"M-Pesa", airtel:"Airtel Money", paybill:"Paybill", till:"Till Number", bank:"Bank Transfer" }[method] || method;
  const methodIcon  = { mpesa:"📱", airtel:"🔴", paybill:"🏢", till:"🏪", bank:"🏦" }[method];

  const getDestination = () => {
    if (method === "mpesa" || method === "airtel") return maskPhone(phone);
    if (method === "paybill") return `${paybillNo} · Acc ${paybillAcc}`;
    if (method === "till") return `Till ${tillNo}`;
    if (method === "bank") return `${bankName} · ${bankAcc}`;
    return "";
  };

  const validateStep1 = () => {
    if (parsedAmt < 1) return false;
    if (method === "mpesa" || method === "airtel") return phone.replace(/\D/g,"").length >= 9;
    if (method === "paybill") return paybillNo.trim() && paybillAcc.trim();
    if (method === "till") return tillNo.trim();
    if (method === "bank") return bankName.trim() && bankAcc.trim();
    return true;
  };

  const handleContinue = () => {
    if (!validateStep1()) return;
    setConfirmed({ gross: parsedAmt, fee: liveFee, net: liveNet });
    setStep(2);
  };

  const handleAuthSubmit = () => {
    const matchDb   = DEFAULT_STATE.users.find(u => u.email === user.email && u.pass === password);
    const matchUser = user.pass === password;
    if (!matchDb && !matchUser) { setPwError("Incorrect password. Please try again."); return; }
    setPwError("");
    if (needsPin) { setStep(3); }
    else { onConfirm(chama, confirmed.net, confirmed.fee, getDestination(), confirmed.gross); setStep(4); }
  };

  const handleKey = (k) => {
    if (k === "del") { setPin(p => p.slice(0,-1)); return; }
    if (pin.length >= 4) return;
    const np = pin + k; setPin(np);
    if (np.length === 4) {
      setTimeout(() => {
        setPin("");
        onConfirm(chama, confirmed.net, confirmed.fee, getDestination(), confirmed.gross);
        setStep(4);
      }, 400);
    }
  };

  const methods = [
    { key:"mpesa",   icon:"📱", label:"M-Pesa",      color:"#10B981", bg:"var(--emerald-light)" },
    { key:"airtel",  icon:"🔴", label:"Airtel Money", color:"#e4000f", bg:"#fff5f5" },
    { key:"paybill", icon:"🏢", label:"Paybill",      color:"var(--brand)", bg:"var(--brand-light)" },
    { key:"till",    icon:"🏪", label:"Till No.",     color:"var(--violet)", bg:"var(--violet-light)" },
    { key:"bank",    icon:"🏦", label:"Bank",         color:"var(--sky)", bg:"var(--sky-light)" },
  ];

  return (
    <div>
      {step !== 4 && (
        <div>
          <div className="modal-title">{chama.name}</div>
          <div style={{fontSize:"0.72rem",fontWeight:600,color:"var(--text3)",marginTop:"-0.7rem",marginBottom:"1rem",letterSpacing:"0.01em"}}>Withdraw Chama Funds</div>
        </div>
      )}

      {/* ── Step 1: Amount + Method ── */}
      {step === 1 && (
        <>
          <div style={{background:"var(--emerald-light)",borderRadius:14,padding:"0.85rem",marginBottom:"0.75rem",border:"1.5px solid rgba(16,185,129,0.2)"}}>
            <div style={{fontSize:"0.65rem",fontWeight:600,color:"var(--emerald)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>Chama Pool Balance</div>
            <div style={{fontSize:"1.3rem",fontWeight:800,color:"var(--emerald)",fontFamily:"var(--mono)",letterSpacing:"-0.03em"}}>KES {fmt(available)}</div>
          </div>

          {/* Fee info banner */}
          <div style={{background:"var(--brand-light)",borderRadius:10,padding:"0.55rem 0.75rem",marginBottom:"0.85rem",fontSize:"0.68rem",color:"var(--brand)",fontWeight:600,border:"1px solid rgba(79,70,229,0.15)"}}>
            💡 Platform fee: <strong>1.8%</strong> for withdrawals up to KES 50,000 · <strong>KES 1,000 flat</strong> above that
          </div>

          <div className="field">
            <label>Withdrawal Amount (KES)</label>
            <input type="number" min="1" max={available} placeholder={`Max KES ${fmt(available)}`}
              value={withdrawAmt} onChange={e => setWithdrawAmt(e.target.value)} />
          </div>
          <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.9rem"}}>
            {[25,50,75,100].map(p => (
              <button key={p} className="btn btn-ghost btn-sm" style={{flex:1}}
                onClick={() => setWithdrawAmt(String(Math.floor(available * p / 100)))}>
                {p}%
              </button>
            ))}
          </div>

          <div className="wd-confirm-box" style={{marginBottom:"1rem"}}>
            {[
              ["Withdraw", `KES ${fmt(parsedAmt)}`],
              [flatRate ? "Platform fee (flat rate)" : `Platform fee (${liveFp}%)`, `− KES ${fmt(liveFee)}`],
            ].map(([l,v]) => (
              <div key={l} className="wd-confirm-row"><span style={{color:"var(--text3)"}}>{l}</span><span>{v}</span></div>
            ))}
            <div className="wd-confirm-row net"><span>You receive</span><span>KES {fmt(liveNet)}</span></div>
          </div>

          <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.5rem",letterSpacing:"0.01em"}}>Withdrawal Method</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"0.4rem",marginBottom:"1rem"}}>
            {methods.map(m => (
              <button key={m.key} onClick={() => setMethod(m.key)} style={{
                border:`2px solid ${method===m.key?m.color:"var(--border)"}`,
                borderRadius:12,padding:"0.55rem 0.2rem",
                background:method===m.key?m.bg:"var(--surface2)",
                cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                transition:"all 0.18s",fontFamily:"var(--font)"
              }}>
                <span style={{fontSize:"1.1rem"}}>{m.icon}</span>
                <span style={{fontSize:"0.55rem",fontWeight:700,color:method===m.key?m.color:"var(--text3)",letterSpacing:"0.01em",textAlign:"center",lineHeight:1.2}}>{m.label}</span>
              </button>
            ))}
          </div>

          {(method === "mpesa") && (
            <div className="field">
              <label>M-Pesa Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0712 345 678" />
              <div style={{marginTop:"0.3rem",fontSize:"0.68rem",color:"var(--emerald)",fontWeight:600}}>📱 Funds sent instantly via Safaricom M-Pesa</div>
            </div>
          )}
          {(method === "airtel") && (
            <div className="field">
              <label>Airtel Money Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0733 123 456" />
              <div style={{marginTop:"0.3rem",fontSize:"0.68rem",color:"#e4000f",fontWeight:600}}>🔴 Funds sent via Airtel Money</div>
            </div>
          )}
          {method === "paybill" && (
            <>
              <div className="field"><label>Business / Paybill Number</label><input type="tel" value={paybillNo} onChange={e => setPaybillNo(e.target.value)} placeholder="e.g. 522533" /></div>
              <div className="field"><label>Account Number</label><input value={paybillAcc} onChange={e => setPaybillAcc(e.target.value)} placeholder="e.g. your phone or reference" /></div>
              <div style={{marginBottom:"0.9rem",fontSize:"0.68rem",color:"var(--brand)",fontWeight:600,background:"var(--brand-light)",borderRadius:10,padding:"0.55rem 0.75rem"}}>🏢 Funds sent to specified Paybill & account number</div>
            </>
          )}
          {method === "till" && (
            <>
              <div className="field"><label>Till Number</label><input type="tel" value={tillNo} onChange={e => setTillNo(e.target.value)} placeholder="e.g. 123456" /></div>
              <div style={{marginBottom:"0.9rem",fontSize:"0.68rem",color:"var(--violet)",fontWeight:600,background:"var(--violet-light)",borderRadius:10,padding:"0.55rem 0.75rem"}}>🏪 Funds sent directly to this till number</div>
            </>
          )}
          {method === "bank" && (
            <>
              <div className="field"><label>Bank Name</label><input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. Equity Bank" /></div>
              <div className="field"><label>Account Number</label><input value={bankAcc} onChange={e => setBankAcc(e.target.value)} placeholder="e.g. 0123456789012" /></div>
              <div style={{marginBottom:"0.9rem",fontSize:"0.68rem",color:"var(--sky)",fontWeight:600,background:"var(--sky-light)",borderRadius:10,padding:"0.55rem 0.75rem"}}>🏦 Bank transfer — processed within 1–2 business days</div>
            </>
          )}

          <button className="confirm-btn" style={{background:"linear-gradient(135deg,#10B981,#059669)",boxShadow:"0 8px 24px rgba(16,185,129,0.25)"}}
            onClick={handleContinue} disabled={parsedAmt < 1}>Continue →</button>
          <button className="back-btn" onClick={onClose}>Cancel</button>
        </>
      )}

      {/* ── Step 2: Password Auth ── */}
      {step === 2 && (
        <>
          <div style={{textAlign:"center",marginBottom:"1rem"}}>
            <div style={{fontSize:"2.2rem",marginBottom:"0.4rem"}}>🔐</div>
            <div style={{fontSize:"0.9rem",fontWeight:700,marginBottom:"0.3rem"}}>Authorization Required</div>
            <div style={{fontSize:"0.78rem",color:"var(--text2)",lineHeight:1.5}}>
              Authorize withdrawal of <strong>KES {fmt(confirmed.gross)}</strong> via {methodIcon} {methodLabel}
            </div>
          </div>
          <div style={{background:"var(--surface2)",borderRadius:12,padding:"0.75rem 0.9rem",marginBottom:"1rem",border:"1.5px solid var(--border)",fontSize:"0.78rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:"var(--text3)"}}>Method</span><span style={{fontWeight:700}}>{methodIcon} {methodLabel}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:"var(--text3)"}}>Destination</span><span style={{fontWeight:600,fontFamily:"var(--mono)",fontSize:"0.75rem"}}>{getDestination()}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid var(--border)",paddingTop:6,marginTop:2}}><span style={{color:"var(--text3)"}}>You receive</span><span style={{fontWeight:800,color:"var(--emerald)"}}>KES {fmt(confirmed.net)}</span></div>
          </div>
          {pwError && <div className="auth-msg" style={{marginBottom:"0.75rem"}}>{pwError}</div>}
          <div className="field">
            <label>Your Account Password</label>
            <input type="password" placeholder="Enter your login password" value={password}
              onChange={e => { setPassword(e.target.value); setPwError(""); }}
              onKeyDown={e => e.key === "Enter" && handleAuthSubmit()} />
          </div>
          <div style={{background:"var(--amber-light)",border:"1.5px solid #FDE68A",borderRadius:12,padding:"0.65rem 0.85rem",fontSize:"0.72rem",color:"var(--amber)",marginBottom:"1rem"}}>
            🔒 Only the chama admin can authorize withdrawals.
          </div>
          <button className="confirm-btn" style={{background:"linear-gradient(135deg,#10B981,#059669)",boxShadow:"0 8px 24px rgba(16,185,129,0.25)"}}
            onClick={handleAuthSubmit}>{needsPin ? "Authorize →" : "Confirm Withdrawal →"}</button>
          <button className="back-btn" onClick={() => { setStep(1); setPassword(""); setPwError(""); }}>← Back</button>
        </>
      )}

      {/* ── Step 3: PIN ── */}
      {step === 3 && (
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{methodIcon}</div>
          <div style={{fontSize:"0.85rem",color:"var(--text2)",marginBottom:"1rem",lineHeight:1.5}}>
            Enter {methodLabel} PIN to send <strong>KES {fmt(confirmed.net)}</strong> to {maskPhone(phone)}
          </div>
          <div className="mpesa-pin-row">
            {[0,1,2,3].map(i => (
              <div key={i} className={`pin-box${pin.length > i ? " filled" : ""}`}
                style={method==="airtel"&&pin.length>i?{borderColor:"#e4000f",background:"#fff5f5",color:"#e4000f"}:{}}>
                {pin.length > i ? "★" : "●"}
              </div>
            ))}
          </div>
          <div className="keypad-grid">
            {["1","2","3","4","5","6","7","8","9","*","0","del"].map(k => (
              <button key={k} className="key-btn" onClick={() => handleKey(k)}>{k === "del" ? "⌫" : k}</button>
            ))}
          </div>
          <button className="back-btn" style={{marginTop:"0.75rem"}} onClick={() => { setStep(2); setPin(""); }}>← Back</button>
        </div>
      )}

      {/* ── Step 4: Done ── */}
      {step === 4 && (
        <div style={{textAlign:"center",padding:"1rem 0"}}>
          <div style={{fontSize:"3rem",marginBottom:"0.75rem"}}>🎉</div>
          <div style={{fontSize:"1.1rem",fontWeight:800,marginBottom:"0.4rem",letterSpacing:"-0.02em"}}>Withdrawal Sent!</div>
          <div style={{fontSize:"0.82rem",color:"var(--text2)",marginBottom:"1rem",lineHeight:1.5}}>
            <strong>KES {fmt(confirmed.net)}</strong> is on its way via {methodIcon} {methodLabel}.
          </div>
          <div style={{background:"var(--emerald-light)",border:"1.5px solid rgba(16,185,129,0.2)",borderRadius:12,padding:"0.85rem",marginBottom:"1.5rem",fontSize:"0.75rem",color:"#065F46",lineHeight:1.6,textAlign:"left"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span>Method</span><strong>{methodIcon} {methodLabel}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span>Destination</span><strong style={{fontFamily:"var(--mono)",fontSize:"0.72rem"}}>{getDestination()}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid rgba(16,185,129,0.2)",paddingTop:6}}><span>Amount</span><strong>KES {fmt(confirmed.net)}</strong></div>
            {method === "bank" && <div style={{marginTop:6,fontSize:"0.68rem",color:"#047857"}}>⏱ Bank transfers typically arrive within 1–2 business days.</div>}
          </div>
          <button className="confirm-btn" style={{background:"linear-gradient(135deg,#10B981,#059669)",boxShadow:"0 8px 24px rgba(16,185,129,0.25)"}} onClick={onClose}>Done ✓</button>
        </div>
      )}
    </div>
  );
}

// ─── Edit Kitty Form ───
function EditKittyForm({ kitty, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: kitty.name,
    goal: kitty.goal,
    description: kitty.description || "",
    feeCategory: kitty.feeCategory || "contributions",
  });
  const [mediaImage,  setMediaImage]  = useState(kitty.mediaImage  || null);
  const [mediaDoc,    setMediaDoc]    = useState(kitty.mediaDoc    || null);
  const [mediaBanner, setMediaBanner] = useState(kitty.mediaBanner || null);

  const platformCategories = [
    { value: "contributions", label: "Contributions", emoji: "🎯", color: "var(--brand)",  bg: "var(--brand-light)",  border: "rgba(79,70,229,0.3)" },
    { value: "chama",         label: "Chama",               emoji: "🤝", color: "var(--violet)", bg: "var(--violet-light)", border: "rgba(124,58,237,0.3)" },
    { value: "events",        label: "Events",              emoji: "🎟️", color: "var(--sky)",    bg: "var(--sky-light)",    border: "rgba(14,165,233,0.3)" },
  ];

  return (
    <div>
      <div className="cc-title" style={{marginBottom:"1rem"}}>Edit Kitty</div>
      <div className="field">
        <label>Kitty Name</label>
        <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Wedding Fund" />
      </div>
      <div className="field">
        <label>Goal Amount (KES)</label>
        <input type="number" value={form.goal} onChange={e => setForm(f => ({...f, goal: e.target.value}))} placeholder="e.g. 50000" min="100" />
      </div>
      <div className="field">
        <label>Description <span style={{fontWeight:400,color:"var(--text3)"}}>(optional)</span></label>
        <textarea
          placeholder="Share your story — why are you raising funds?"
          value={form.description}
          onChange={e => setForm(f => ({...f, description: e.target.value}))}
          style={{width:"100%",background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"0.72rem 0.9rem",color:"var(--text)",fontFamily:"var(--font)",fontSize:"0.88rem",outline:"none",resize:"none",minHeight:72,lineHeight:1.5,transition:"border-color 0.18s"}}
          onFocus={e=>e.target.style.borderColor="var(--brand)"} onBlur={e=>e.target.style.borderColor="var(--border)"}
        />
      </div>

      {/* ── Platform Category ── */}
      <div style={{marginBottom:"1.1rem"}}>
        <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.5rem",letterSpacing:"0.01em"}}>
          PLATFORM CATEGORY
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.45rem"}}>
          {platformCategories.map(opt => (
            <button key={opt.value} onClick={() => setForm(f => ({...f, feeCategory: opt.value}))}
              style={{
                display:"flex",alignItems:"center",gap:"0.75rem",
                padding:"0.7rem 0.9rem",
                border:`2px solid ${form.feeCategory===opt.value ? opt.border : "var(--border)"}`,
                borderRadius:14,
                background: form.feeCategory===opt.value ? opt.bg : "var(--surface2)",
                cursor:"pointer",fontFamily:"var(--font)",textAlign:"left",
                transition:"all 0.18s",
              }}>
              <div style={{
                width:36,height:36,borderRadius:11,
                background: form.feeCategory===opt.value ? opt.color : "var(--surface3)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"1rem",flexShrink:0,transition:"background 0.18s",
              }}>{opt.emoji}</div>
              <div style={{fontSize:"0.82rem",fontWeight:700,color: form.feeCategory===opt.value ? opt.color : "var(--text)",letterSpacing:"-0.01em"}}>{opt.label}</div>
              {form.feeCategory===opt.value && (
                <div style={{marginLeft:"auto",width:20,height:20,borderRadius:"50%",background:opt.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Media */}
      <div style={{background:"linear-gradient(135deg,#F5F6FA,#EEF0FF)",border:"1.5px solid rgba(79,70,229,0.12)",borderRadius:14,padding:"0.9rem 1rem",marginBottom:"1.1rem"}}>
        <KittyMediaUpload
          uid="edit-kitty"
          category={kitty.category || "Other"}
          mediaImage={mediaImage} setMediaImage={setMediaImage}
          mediaDoc={mediaDoc}    setMediaDoc={setMediaDoc}
          mediaBanner={mediaBanner} setMediaBanner={setMediaBanner}
        />
      </div>

      <button className="confirm-btn" onClick={() => {
        if (!form.name.trim()) return;
        if (Number(form.goal) < 100) return;
        onSubmit({ name: form.name.trim(), goal: Number(form.goal), description: form.description.trim(), feeCategory: form.feeCategory, mediaImage, mediaDoc, mediaBanner });
      }}>Save Changes →</button>
      <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
        <button className="back-btn" style={{flex:1,marginTop:0}} onClick={onClose}>Cancel</button>
        <button className="back-btn" style={{flex:1,marginTop:0,background:"var(--surface3)",fontWeight:700}} onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

// ─── Edit Chama Form ───
function EditChamaForm({ chama, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: chama.name,
    cycle: chama.cycle || "Monthly",
    members: chama.members || "",
    contributionAmount: chama.contributionAmount || "",
    penaltyType: chama.penaltyType || "fixed",
    penaltyValue: chama.penaltyValue || "",
    penaltyPerDay: chama.penaltyPerDay || false
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [mediaImage,  setMediaImage]  = useState(chama.mediaImage  || null);
  const [mediaDoc,    setMediaDoc]    = useState(chama.mediaDoc    || null);
  const [mediaBanner, setMediaBanner] = useState(chama.mediaBanner || null);

  const amountChanged = Number(form.contributionAmount) !== Number(chama.contributionAmount || 0) && form.contributionAmount !== "";

  return (
    <div>
      <div className="cc-title" style={{marginBottom:"1rem"}}>Edit Chama</div>
      <div className="field"><label>Chama Name</label>
        <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Chama name" />
      </div>
      <div className="g2">
        <div className="field"><label>Contribution Cycle</label>
          <select value={form.cycle} onChange={e => set("cycle", e.target.value)}>
            {["Weekly","Bi-Weekly","Monthly","Quarterly"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field"><label>Max Members</label>
          <input type="number" min="1" value={form.members} onChange={e => set("members", e.target.value)} placeholder="e.g. 20" />
        </div>
      </div>

      {/* ── Contribution Amount per Member ── */}
      <div style={{background:"linear-gradient(135deg,#ECFDF5,#F0FDF4)",border:"1.5px solid rgba(16,185,129,0.2)",borderRadius:14,padding:"0.9rem 1rem",marginBottom:"1.1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.6rem"}}>
          <span style={{fontSize:"1rem"}}>💰</span>
          <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--emerald)",letterSpacing:"0.01em"}}>Contribution per Member</div>
        </div>

        <div className="field" style={{marginBottom: amountChanged ? "0.6rem" : 0}}>
          <label style={{fontSize:"0.7rem",color:"var(--emerald)"}}>
            Amount (KES) · Current: {chama.contributionAmount ? `KES ${fmt(chama.contributionAmount)}` : "Not set"}
          </label>
          <input type="number" min="0" placeholder="e.g. 5000"
            value={form.contributionAmount}
            onChange={e => set("contributionAmount", e.target.value)}
            style={{borderColor: amountChanged ? "var(--emerald)" : undefined}} />
        </div>

        {/* Notice — only shown when amount has been changed */}
        {amountChanged && (
          <div style={{display:"flex",alignItems:"flex-start",gap:"0.5rem",background:"var(--emerald-light)",border:"1.5px solid rgba(16,185,129,0.25)",borderRadius:10,padding:"0.65rem 0.75rem"}}>
            <span style={{fontSize:"1rem",flexShrink:0,lineHeight:1.3}}>📅</span>
            <div>
              <div style={{fontSize:"0.73rem",fontWeight:700,color:"#065F46",marginBottom:2}}>Takes effect next contribution cycle</div>
              <div style={{fontSize:"0.67rem",color:"#047857",lineHeight:1.5}}>
                This change will <strong>not affect any past contributions</strong>. The new amount of <strong>KES {fmt(Number(form.contributionAmount))}</strong> will apply from the next {form.cycle.toLowerCase()} cycle onwards.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Late Contribution Penalty ── */}
      <div style={{background:"linear-gradient(135deg,#F5F3FF,#EEF0FF)",border:"1.5px solid rgba(124,58,237,0.18)",borderRadius:14,padding:"0.9rem 1rem",marginBottom:"1.1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.75rem"}}>
          <span style={{fontSize:"1rem"}}>⚠️</span>
          <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--violet)",letterSpacing:"0.01em"}}>Late Contribution Penalty</div>
        </div>

        <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.75rem"}}>
          {[["fixed","Fixed (KES)"],["percentage","Percentage (%)"]].map(([val,lbl]) => (
            <button key={val} onClick={() => set("penaltyType", val)} style={{
              flex:1,padding:"0.5rem",border:`2px solid ${form.penaltyType===val?"var(--violet)":"var(--border)"}`,
              borderRadius:10,background:form.penaltyType===val?"var(--violet-light)":"var(--surface)",
              color:form.penaltyType===val?"var(--violet)":"var(--text3)",fontWeight:700,fontSize:"0.72rem",
              cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.18s"
            }}>{lbl}</button>
          ))}
        </div>

        <div className="field" style={{marginBottom:"0.65rem"}}>
          <label style={{fontSize:"0.7rem",color:"var(--violet)"}}>{form.penaltyType === "fixed" ? "Penalty Amount (KES)" : "Penalty Rate (%)"}</label>
          <input type="number" placeholder={form.penaltyType === "fixed" ? "e.g. 200" : "e.g. 5"} min="0"
            value={form.penaltyValue} onChange={e => set("penaltyValue", e.target.value)}
            style={{borderColor: form.penaltyValue ? "var(--violet)" : undefined}} />
        </div>

        <div onClick={() => set("penaltyPerDay", !form.penaltyPerDay)} style={{display:"flex",alignItems:"flex-start",gap:"0.65rem",background:"var(--surface)",border:`1.5px solid ${form.penaltyPerDay?"var(--violet)":"var(--border)"}`,borderRadius:10,padding:"0.65rem 0.75rem",cursor:"pointer",transition:"all 0.18s"}}>
          <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${form.penaltyPerDay?"var(--violet)":"var(--border)"}`,background:form.penaltyPerDay?"var(--violet)":"var(--surface)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all 0.18s"}}>
            {form.penaltyPerDay && <span style={{color:"#fff",fontSize:"0.7rem",fontWeight:800}}>✓</span>}
          </div>
          <div>
            <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--text)"}}>Charge per day late</div>
            <div style={{fontSize:"0.67rem",color:"var(--text3)",marginTop:2,lineHeight:1.4}}>
              {form.penaltyPerDay ? "Penalty × number of days overdue" : "One-time flat penalty regardless of delay length"}
            </div>
          </div>
        </div>

        {Number(form.penaltyValue) > 0 && (
          <div style={{marginTop:"0.6rem",background:"var(--surface)",borderRadius:10,padding:"0.55rem 0.75rem",border:"1px solid rgba(124,58,237,0.12)",fontSize:"0.7rem",color:"var(--text2)",lineHeight:1.5}}>
            📌 <strong style={{color:"var(--violet)"}}>Example:</strong> Member is 5 days late →{" "}
            {form.penaltyPerDay
              ? (form.penaltyType==="fixed" ? `KES ${fmt((Number(form.penaltyValue)||0)*5)} penalty` : `${(Number(form.penaltyValue)||0)*5}% of contribution`)
              : (form.penaltyType==="fixed" ? `KES ${fmt(Number(form.penaltyValue)||0)} flat penalty` : `${Number(form.penaltyValue)||0}% of contribution (one-time)`)}
          </div>
        )}
      </div>

      <div style={{background:"linear-gradient(135deg,#F5F3FF,#EEF0FF)",border:"1.5px solid rgba(124,58,237,0.15)",borderRadius:14,padding:"0.9rem 1rem",marginBottom:"1.1rem"}}>
        <KittyMediaUpload
          category="Chama"
          mediaImage={mediaImage} setMediaImage={setMediaImage}
          mediaDoc={mediaDoc}    setMediaDoc={setMediaDoc}
          mediaBanner={mediaBanner} setMediaBanner={setMediaBanner}
        />
      </div>

      <button className="confirm-btn" style={{background:"var(--grad-chama)",boxShadow:"0 8px 24px rgba(124,58,237,0.28)"}} onClick={() => {
        if (!form.name.trim()) return;
        onSubmit({
          name: form.name.trim(),
          cycle: form.cycle,
          members: Number(form.members) || chama.members,
          contributionAmount: Number(form.contributionAmount) || chama.contributionAmount || 0,
          penaltyType: form.penaltyType,
          penaltyValue: Number(form.penaltyValue) || 0,
          penaltyPerDay: form.penaltyPerDay,
          mediaImage, mediaDoc, mediaBanner
        });
      }}>Save Changes →</button>
      <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
        <button className="back-btn" style={{flex:1,marginTop:0}} onClick={onClose}>Cancel</button>
        <button className="back-btn" style={{flex:1,marginTop:0,background:"var(--surface3)",fontWeight:700}} onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

// ─── Share Kitty Modal ───
function ShareKittyModal({ kitty, onClose, onOpenContribute }) {
  const [copied, setCopied] = useState(false);
  // Build a hash-based link — works inside iframes and on real URLs
  const link = (() => {
    try {
      const u = new URL(window.location.href);
      u.hash = `kitty=${kitty.id}`;
      u.search = ""; // remove any leftover search params
      return u.toString();
    } catch {
      return `${window.location.href.split("?")[0].split("#")[0]}#kitty=${kitty.id}`;
    }
  })();
  const pct = Math.round(((kitty.raised||0)/(kitty.goal||1))*100);

  const msg  = `🎉 Hi! I'm raising funds for *${kitty.name}* via M-Pamoja.\n\nWe've raised KES ${fmt(kitty.raised||0)} of our KES ${fmt(kitty.goal)} goal (${pct}%).\n\nYour contribution matters — click the link to contribute in seconds, no app needed!\n👉 ${link}`;
  const msgEncoded = encodeURIComponent(msg);

  const channels = [
    { key:"wa",    label:"WhatsApp",  icon:"💬", href:`https://wa.me/?text=${msgEncoded}` },
    { key:"tg",    label:"Telegram",  icon:"✈️", href:`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`🎉 Support ${kitty.name} on M-Pamoja!`)}` },
    { key:"em",    label:"Email",     icon:"📧", href:`mailto:?subject=${encodeURIComponent(`Support: ${kitty.name}`)}&body=${encodeURIComponent(msg)}` },
    { key:"sms",   label:"SMS",       icon:"💬", href:`sms:?body=${msgEncoded}` },
    { key:"fb",    label:"Facebook",  icon:"👍", href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}` },
    { key:"tw",    label:"Twitter/X", icon:"🐦", href:`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Support ${kitty.name} 🎉`)}&url=${encodeURIComponent(link)}` },
  ];

  const copyLink = () => {
    try {
      navigator.clipboard.writeText(link);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = link; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const nativeShare = () => {
    if (navigator.share) {
      navigator.share({ title: kitty.name, text: msg, url: link }).catch(() => {});
    } else {
      copyLink();
    }
  };

  return (
    <div>
      <div className="modal-title">Share Kitty 🔗</div>

      {/* Kitty preview card */}
      <div className="share-kitty-preview">
        <div className="skp-orb" />
        <div style={{position:"relative",zIndex:1}}>
          <div className="skp-label">Sharing</div>
          <div className="skp-name">{kitty.name}</div>
          <div className="skp-sub">KES {fmt(kitty.raised||0)} raised · {pct}% of goal</div>
          <div className="skp-prog"><div className="skp-prog-fill" style={{width:`${Math.min(100,pct)}%`}} /></div>
        </div>
      </div>

      {/* PRIMARY CTA — contribute right now, no link needed */}
      <button className="confirm-btn" style={{marginBottom:"1rem",fontSize:"0.95rem",padding:"0.95rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}
        onClick={() => { onClose(); onOpenContribute(kitty); }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        Contribute Now
      </button>

      {/* Divider */}
      <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1rem"}}>
        <div style={{flex:1,height:1,background:"var(--border)"}} />
        <span style={{fontSize:"0.68rem",fontWeight:600,color:"var(--text3)",letterSpacing:"0.04em",textTransform:"uppercase"}}>or share the link</span>
        <div style={{flex:1,height:1,background:"var(--border)"}} />
      </div>

      {/* Unique link */}
      <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.45rem",letterSpacing:"0.01em"}}>Unique contribution link</div>
      <div className="share-link-box" onClick={copyLink}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        <span className="share-link-url">{link}</span>
        <button className="share-link-copy" onClick={e => { e.stopPropagation(); copyLink(); }}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      {copied && <div className="share-copied-badge">✅ Link copied to clipboard!</div>}

      {/* Share channels */}
      <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.5rem",letterSpacing:"0.01em"}}>Share via</div>
      <div className="share-channels">
        {channels.map(ch => (
          <a key={ch.key} href={ch.href} target="_blank" rel="noopener noreferrer" className={`share-ch ${ch.key}`}
            style={{textDecoration:"none"}}>
            <div className="share-ch-icon">{ch.icon}</div>
            <span className="share-ch-label">{ch.label}</span>
          </a>
        ))}
      </div>

      {/* Native share */}
      <button className="back-btn" style={{marginBottom:"0.5rem"}} onClick={nativeShare}>
        📤 More Sharing Options
      </button>
      <button className="back-btn" onClick={onClose}>Close</button>
    </div>
  );
}

// ─── Public Contribute Popup (shown to anyone arriving via share link — no login needed) ───
// ─── Public Contribute Popup (shown to anyone arriving via share link — no login needed) ───
function PublicContributePopup({ kitty, onClose, onContribute, loading }) {
  const pct = Math.round(((kitty?.raised||0)/(kitty?.goal||1))*100);
  const [step, setStep] = useState(1);
  const [name, setName]   = useState("");
  const [anon, setAnon]   = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("mpesa");
  const [phone, setPhone]   = useState("");
  const [pin, setPin]       = useState("");
  const [done, setDone]     = useState(false);
  const parsedAmt = parseFloat(amount) || 0;
  const displayName = anon ? "Anonymous" : (name.trim() || "Contributor");

  // If kitty is not loaded yet, show loading state
  if (!kitty) {
    return (
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-sheet" style={{maxWidth:440, textAlign:"center", padding:"2rem"}}>
          <span className="modal-handle" />
          <div style={{fontSize:"2rem", marginBottom:"0.5rem"}}>🔄</div>
          <div style={{color:"var(--text3)"}}>Loading kitty details...</div>
        </div>
      </div>
    );
  }

  const handleKey = (k) => {
    if (k === "del") { setPin(p => p.slice(0,-1)); return; }
    if (pin.length >= 4) return;
    const np = pin + k; setPin(np);
    if (np.length === 4) {
      setTimeout(() => {
        onContribute(kitty.id, parsedAmt, displayName, phone);
        setDone(true);
      }, 450);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && !done && onClose()}>
      <div className="modal-sheet" style={{maxWidth:440}}>
        <span className="modal-handle" />
        {!done && (
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        )}

        {/* Kitty hero */}
        <div className="pub-kitty-hero" style={{marginBottom: (kitty.mediaImage || kitty.mediaBanner || kitty.description) ? "0.5rem" : "1rem", borderRadius: (kitty.mediaImage || kitty.mediaBanner) ? "16px 16px 0 0" : 16}}>
          <div className="pub-kitty-orb" />
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:"0.6rem",fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>Contributing to</div>
            <div className="pub-kitty-name">{kitty.name}</div>
            <div className="pub-kitty-sub">KES {fmt(kitty.raised||0)} raised · {pct}% funded</div>
            <div className="pub-kitty-prog"><div className="pub-kitty-fill" style={{width:`${Math.min(100,pct)}%`}} /></div>
            <div style={{display:"flex",gap:0,marginTop:"0.6rem"}}>
              {[["KES "+fmt(kitty.goal),"Goal"],[pct+"%","Funded"],[(kitty.contributors||0)+" ","Contributors"]].map(([v,l]) => (
                <div key={l} style={{flex:1,textAlign:"center",borderLeft:l!=="Goal"?"1px solid rgba(255,255,255,0.2)":undefined}}>
                  <div style={{fontSize:"0.9rem",fontWeight:800,color:"#fff",fontFamily:"var(--mono)",letterSpacing:"-0.02em"}}>{v}</div>
                  <div style={{fontSize:"0.58rem",fontWeight:600,color:"rgba(255,255,255,0.65)",marginTop:1}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign media + description shown below hero */}
        {(kitty.mediaBanner || kitty.mediaImage || kitty.description) && (
          <div style={{marginBottom:"1rem",background:"var(--surface2)",borderRadius:"0 0 16px 16px",overflow:"hidden",border:"1.5px solid var(--border)",borderTop:"none"}}>
            {kitty.mediaBanner && (
              <img src={kitty.mediaBanner.dataUrl} alt="banner" style={{width:"100%",maxHeight:110,objectFit:"cover",display:"block"}} />
            )}
            {!kitty.mediaBanner && kitty.mediaImage && (
              <img src={kitty.mediaImage.dataUrl} alt="campaign" style={{width:"100%",maxHeight:130,objectFit:"cover",objectPosition:"top",display:"block"}} />
            )}
            {kitty.description && (
              <div style={{padding:"0.7rem 0.9rem",fontSize:"0.78rem",color:"var(--text2)",lineHeight:1.6}}>
                {kitty.description}
              </div>
            )}
          </div>
        )}

        {done ? (
          <div style={{textAlign:"center",padding:"0.5rem 0 1rem"}}>
            <div style={{fontSize:"3.5rem",marginBottom:"0.6rem"}}>🎉</div>
            <div style={{fontSize:"1.05rem",fontWeight:800,letterSpacing:"-0.02em",marginBottom:6}}>Thank you{anon?"":`, ${name.trim()}`}!</div>
            <div style={{fontSize:"0.82rem",color:"var(--text2)",lineHeight:1.5,marginBottom:"1rem"}}>
              Your contribution of <strong>KES {fmt(parsedAmt)}</strong> to <strong>{kitty.name}</strong> has been received. 💛
            </div>
            <div style={{background:"var(--emerald-light)",border:"1.5px solid rgba(16,185,129,0.2)",borderRadius:12,padding:"0.8rem",marginBottom:"1.25rem",fontSize:"0.75rem",color:"#065F46",lineHeight:1.5}}>
              ✅ Processed via {method==="mpesa"?"M-Pesa":method==="airtel"?"Airtel Money":"Bank Transfer"}
            </div>
            <button className="confirm-btn" style={{background:"var(--grad2)",boxShadow:"0 8px 24px rgba(16,185,129,0.25)"}} onClick={onClose}>Done ✓</button>
            <div style={{marginTop:"1rem",fontSize:"0.68rem",color:"var(--text3)"}}>Powered by <strong>M-Pamoja</strong> Community Finance</div>
          </div>

        ) : step === 1 ? (
          <>
            <div className="modal-title">Make a Contribution</div>
            <div className="field"><label>Your Name</label>
              <input placeholder="Jane Wambua" value={name} onChange={e => setName(e.target.value)} disabled={anon} style={{opacity:anon?0.45:1}} />
            </div>
            <div className="anon-check-row" onClick={() => setAnon(a => !a)}>
              <div className={`anon-checkbox${anon?" checked":""}`} />
              <div><div className="anon-label">Contribute anonymously</div><div className="anon-sub">Your name shows as "Anonymous".</div></div>
            </div>
            <div className="field"><label>Amount (KES)</label>
              <input type="number" min="10" placeholder="e.g. 500" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            {parsedAmt > 0 && (
              <div className="amount-display" style={{marginBottom:"1rem"}}>
                <div className="amount-display-lbl">Contributing</div>
                <div className="amount-display-val">KES {fmt(parsedAmt)}</div>
              </div>
            )}
            <button className="confirm-btn" onClick={() => {
              if (parsedAmt < 10 || (!anon && !name.trim())) return;
              setStep(2);
            }}>Continue →</button>
          </>

        ) : step === 2 ? (
          <>
            <div className="modal-title">Payment Method</div>
            <div className="pay-methods">
              <div className={`pay-method${method==="mpesa"?" active":""}`} onClick={() => { setMethod("mpesa"); setPhone(""); }}>
                <div className="pay-method-icon">📱</div><div className="pay-method-name">M-Pesa</div>
              </div>
              <div className={`pay-method${method==="airtel"?" active-airtel":""}`} onClick={() => { setMethod("airtel"); setPhone(""); }}>
                <div className="pay-method-icon">🔴</div><div className="pay-method-name" style={method==="airtel"?{color:"#e4000f"}:{}}>Airtel</div>
              </div>
              <div className={`pay-method${method==="bank"?" active":""}`} onClick={() => { setMethod("bank"); setPhone(""); }}>
                <div className="pay-method-icon">🏦</div><div className="pay-method-name">Bank</div>
              </div>
            </div>
            {(method==="mpesa"||method==="airtel") && (
              <div className="field"><label>{method==="mpesa"?"M-Pesa":"Airtel Money"} Number</label>
                <input type="tel" placeholder="0712345678" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            )}
            {method==="bank" && (
              <div style={{background:"var(--surface2)",borderRadius:12,padding:"0.85rem",border:"1.5px solid var(--border)",fontSize:"0.8rem",color:"var(--text2)",lineHeight:1.5,marginBottom:"1rem"}}>
                🏦 Bank transfer instructions will be sent after confirming.
              </div>
            )}
            <button className="confirm-btn" style={{marginTop:"0.75rem"}} onClick={() => {
              if ((method==="mpesa"||method==="airtel") && phone.replace(/\D/g,"").length < 9) return;
              if (method==="bank") { onContribute(kitty.id, parsedAmt, displayName, ""); setDone(true); return; }
              setStep(3);
            }}>Confirm →</button>
            <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
          </>

        ) : (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>📲</div>
            <div style={{fontSize:"0.85rem",color:"var(--text2)",marginBottom:"1rem",lineHeight:1.5}}>
              Enter {method==="airtel"?"Airtel Money":"M-Pesa"} PIN to send <strong>KES {fmt(parsedAmt)}</strong>
            </div>
            <div className="mpesa-pin-row">
              {[0,1,2,3].map(i => <div key={i} className={`pin-box${pin.length>i?" filled":""}`}>{pin.length>i?"★":"●"}</div>)}
            </div>
            <div className="keypad-grid">
              {["1","2","3","4","5","6","7","8","9","*","0","del"].map(k => (
                <button key={k} className="key-btn" onClick={() => handleKey(k)}>{k==="del"?"⌫":k}</button>
              ))}
            </div>
            <button className="back-btn" style={{marginTop:"0.75rem"}} onClick={() => { setStep(2); setPin(""); }}>← Back</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Kitties Page ───
// ─── Kitty Report Detail Page (full-page, not a modal) ───
function KittyReportPage({ kitty, transactions, user, onBack, onWithdraw, onContribute, onShare, onToast }) {
  const pct = Math.round(((kitty.raised||0)/(kitty.goal||1))*100);
  const { fee, pct: fp } = getKittyFee(kitty);
  const net   = (kitty.raised||0) - fee;
  const txs   = transactions.filter(t => t.kitty === kitty.name);
  const today = new Date().toLocaleDateString("en-KE", { day:"2-digit", month:"short", year:"numeric" });

  // ── CSV / Excel export ──
  const [reportPreview, setReportPreview] = useState(null);

  const exportCSV = () => {
    const headers = ["Ref","Contributor","Phone","Type","Gross (KES)","Fee (KES)","Net (KES)","Status","Time"];
    const rows = txs.map(t => [t.ref, t.name, t.phone||"—", t.type, t.gross||0, t.fee||0, t.net||0, t.status||"sent", t.time||""]);
    setReportPreview({ type:"excel", csvHeaders: headers, csvData: rows, filename:`${kitty.name.replace(/[^a-z0-9]/gi,"_")}_report`, title:`${kitty.name} — Contributors` });
  };

  // ── PDF export (mobile-optimised) ──
  const exportPDF = () => {
    const txRows = txs.map(t => `
      <div class="tx-card">
        <div class="tx-card-top">
          <div>
            <div class="tx-name">${t.name}</div>
            <div class="tx-ref">${t.ref}${t.phone ? " · " + t.phone : ""}</div>
          </div>
          <div class="tx-amt">KES ${Number(t.gross||0).toLocaleString()}</div>
        </div>
        <div class="tx-card-bot">
          <span class="tx-badge">${t.type}</span>
          <span class="tx-time">${t.time}</span>
          <span class="tx-fee">Fee KES ${Number(t.fee||0).toLocaleString()} · Net KES ${Number(t.net||0).toLocaleString()}</span>
        </div>
      </div>`).join("");

    const htmlContent = `<!DOCTYPE html><html><head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>${kitty.name} — Kitty Report</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Segoe UI',Arial,sans-serif;color:#0d0f14;background:#f5f6fa;font-size:14px;padding:0}
      .wrap{max-width:680px;margin:0 auto;padding:16px}

      /* Header */
      .logo-row{display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #4f46e5}
      .logo-box{width:40px;height:40px;min-width:40px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:11px;display:flex;align-items:center;justify-content:center}
      .logo-box svg{width:24px;height:24px}
      .brand{font-size:1.2rem;font-weight:800;letter-spacing:-0.02em}
      .brand span{color:#4f46e5}
      .report-tag{margin-left:auto;font-size:0.65rem;font-weight:700;color:#8c90a6;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap}

      /* Hero */
      .hero{background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:16px;padding:20px;color:#fff;margin-bottom:16px}
      .hero h1{font-size:1.25rem;font-weight:800;margin-bottom:3px;line-height:1.25}
      .hero .sub{font-size:0.72rem;opacity:0.75;margin-bottom:12px}
      .prog-track{height:8px;background:rgba(255,255,255,0.25);border-radius:6px;overflow:hidden;margin:0 0 6px}
      .prog-fill{height:100%;background:rgba(255,255,255,0.85);border-radius:6px}
      .prog-labels{display:flex;justify-content:space-between;font-size:0.68rem;opacity:0.8}

      /* Stats */
      .stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px}
      .stat{background:#fff;border-radius:12px;padding:14px;border:1.5px solid #e2e4ee}
      .stat-val{font-size:1.05rem;font-weight:800;color:#4f46e5}
      .stat-lbl{font-size:0.6rem;font-weight:600;color:#8c90a6;text-transform:uppercase;letter-spacing:0.05em;margin-top:3px}

      /* Section title */
      .section-title{font-size:0.7rem;font-weight:700;color:#4b5066;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;padding-bottom:6px;border-bottom:1.5px solid #e2e4ee}

      /* Transaction cards — mobile-first */
      .tx-card{background:#fff;border-radius:12px;padding:12px 14px;margin-bottom:8px;border:1px solid #e2e4ee;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
      .tx-card-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px}
      .tx-name{font-size:0.82rem;font-weight:700;color:#1a1d26}
      .tx-ref{font-size:0.65rem;color:#8c90a6;margin-top:1px}
      .tx-amt{font-size:0.9rem;font-weight:800;color:#059669;white-space:nowrap}
      .tx-card-bot{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
      .tx-badge{font-size:0.58rem;font-weight:700;background:#eef0ff;color:#4f46e5;border-radius:20px;padding:2px 8px;text-transform:uppercase;letter-spacing:0.04em}
      .tx-time{font-size:0.62rem;color:#8c90a6}
      .tx-fee{font-size:0.62rem;color:#8c90a6;margin-left:auto}

      /* Empty state */
      .empty{background:#fff;border-radius:12px;padding:28px;text-align:center;color:#8c90a6;font-size:0.82rem;border:1px solid #e2e4ee}

      /* Footer */
      .footer{margin-top:20px;padding-top:12px;border-top:1px solid #e2e4ee;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;font-size:0.65rem;color:#8c90a6}

      /* Print button */
      .print-btn{text-align:center;margin-top:16px}
      .print-btn button{background:#4f46e5;color:#fff;border:none;border-radius:10px;padding:10px 28px;font-size:0.85rem;font-weight:700;cursor:pointer;width:100%;max-width:320px}

      @media print{
        body{background:#fff;padding:0}
        .print-btn{display:none}
        .wrap{padding:12px}
      }
      @media(min-width:540px){
        .stats{grid-template-columns:repeat(4,1fr)}
      }
    </style></head><body>
    <div class="wrap">
      <div class="logo-row">
        <div class="logo-box"><svg viewBox="0 0 80 88" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="22" cy="11" r="10" fill="#fff" opacity=".9"/>
          <circle cx="58" cy="11" r="10" fill="#fff" opacity=".7"/>
          <path d="M15,20 C10,20 6,23 6,28 L6,76 C6,82 10,86 15,86 C20,86 24,82 24,76 L24,52 C30,60 36,66 40,70 L40,55 C36,50 30,42 24,33 L24,28 C24,23 20,20 15,20 Z" fill="#fff" opacity=".9"/>
          <path d="M65,20 C70,20 74,23 74,28 L74,76 C74,82 70,86 65,86 C60,86 56,82 56,76 L56,52 C50,60 44,66 40,70 L40,55 C44,50 50,42 56,33 L56,28 C56,23 60,20 65,20 Z" fill="#fff" opacity=".7"/>
        </svg></div>
        <div><div class="brand">M-<span>Pamoja</span></div><div style="font-size:0.6rem;color:#8c90a6;margin-top:1px">Community Fundraising</div></div>
        <div class="report-tag">Kitty Report · ${today}</div>
      </div>

      <div class="hero">
        <h1>${kitty.name}</h1>
        <div class="sub">${kittyCategory(kitty)} · Created ${kitty.created} · ${user.name}</div>
        <div class="prog-track"><div class="prog-fill" style="width:${Math.min(100,pct)}%"></div></div>
        <div class="prog-labels"><span>${pct}% funded</span><span>KES ${Number(kitty.raised||0).toLocaleString()} of KES ${Number(kitty.goal||0).toLocaleString()}</span></div>
      </div>

      <div class="stats">
        <div class="stat"><div class="stat-val">KES ${Number(kitty.raised||0).toLocaleString()}</div><div class="stat-lbl">Total Raised</div></div>
        <div class="stat"><div class="stat-val">KES ${Number(kitty.goal||0).toLocaleString()}</div><div class="stat-lbl">Goal</div></div>
        <div class="stat"><div class="stat-val">${kitty.contributors||0}</div><div class="stat-lbl">Contributors</div></div>
        <div class="stat"><div class="stat-val" style="color:#059669">KES ${Number(net).toLocaleString()}</div><div class="stat-lbl">Net (fee ${fp}%)</div></div>
      </div>

      <div class="section-title">Transaction History · ${txs.length} records</div>
      ${txs.length ? txRows : `<div class="empty">No transactions recorded for this kitty yet.</div>`}

      <div class="footer">
        <span>Generated by M-Pamoja · ${today}</span>
        <span>Confidential · Internal use only</span>
      </div>
      <div class="print-btn"><button onclick="window.print()">🖨️ Print / Save as PDF</button></div>
    </div>
    </body></html>`;

    setReportPreview({ type:"pdf", html: htmlContent, filename:`${kitty.name.replace(/[^a-z0-9]/gi,"-")}-report-${today}`, title:`${kitty.name} — Kitty Report` });
  };

  const statBox = (val, lbl, color="var(--brand)") => (
    <div style={{flex:1,background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:14,padding:"0.85rem 0.7rem",textAlign:"center",minWidth:0}}>
      <div style={{fontSize:"1rem",fontWeight:800,color,fontFamily:"var(--mono)",letterSpacing:"-0.02em"}}>{val}</div>
      <div style={{fontSize:"0.58rem",fontWeight:600,color:"var(--text3)",marginTop:2,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lbl}</div>
    </div>
  );

  return (
    <div className="page-wrap">
      {/* Back / Close header */}
      <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"1rem"}}>
        <button onClick={onBack} style={{width:36,height:36,border:"1.5px solid var(--border)",borderRadius:10,background:"var(--surface)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:"1rem",fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{kitty.name}</div>
          <div style={{fontSize:"0.68rem",color:"var(--text3)",marginTop:1}}>{ kittyCategory(kitty) } · Created {kitty.created}</div>
        </div>
        <button onClick={onBack} style={{width:36,height:36,border:"1.5px solid var(--border)",borderRadius:10,background:"var(--surface)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}} title="Close report">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Hero progress card */}
      <div style={{background:"var(--grad)",borderRadius:20,padding:"1.2rem 1.3rem",marginBottom:"1rem",position:"relative",overflow:"hidden",boxShadow:"var(--shadow-brand)"}}>
        <div style={{position:"absolute",width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.07)",top:-40,right:-30}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:"0.62rem",fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2}}>Total Raised</div>
          <div style={{fontSize:"2rem",fontWeight:800,color:"#fff",letterSpacing:"-0.04em",fontFamily:"var(--mono)"}}>KES {fmt(kitty.raised||0)}</div>
          <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.7)",marginBottom:"0.9rem"}}>of KES {fmt(kitty.goal)} goal · {pct}% funded</div>
          <div style={{height:7,background:"rgba(255,255,255,0.2)",borderRadius:6,overflow:"hidden",marginBottom:"0.5rem"}}>
            <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:"rgba(255,255,255,0.85)",borderRadius:6,transition:"width 0.8s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",color:"rgba(255,255,255,0.7)"}}>
            {(kitty.raised||0) >= kitty.goal
              ? <span style={{color:"rgba(255,255,255,0.95)",fontWeight:700}}>🎯 KES {fmt((kitty.raised||0)-kitty.goal)} over target</span>
              : <span>KES {fmt(kitty.goal-(kitty.raised||0))} to go</span>
            }
            <span>{kitty.contributors||0} contributors</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{display:"flex",gap:"0.5rem",marginBottom:"1rem"}}>
        {statBox(`KES ${fmt(net)}`, "Net Payout", "var(--emerald)")}
        {statBox(`KES ${fmt(fee)}`, `Fee (${fp}%)`, "var(--amber)")}
        {statBox(kitty.contributors||0, "Supporters", "var(--violet)")}
      </div>

      {/* Export buttons */}
      <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:16,padding:"1rem",marginBottom:"1rem",boxShadow:"var(--shadow-sm)"}}>
        <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.65rem",display:"flex",alignItems:"center",gap:"0.4rem"}}>
          <span>📊</span> Export Report
        </div>
        <div style={{display:"flex",gap:"0.6rem"}}>
          <button onClick={exportPDF} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem",background:"var(--rose-light)",color:"var(--rose)",border:"1.5px solid rgba(244,63,94,0.25)",borderRadius:12,padding:"0.65rem 0",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.18s"}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            PDF Report
          </button>
          <button onClick={exportCSV} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem",background:"var(--emerald-light)",color:"var(--emerald)",border:"1.5px solid rgba(16,185,129,0.25)",borderRadius:12,padding:"0.65rem 0",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.18s"}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>
            Excel / CSV
          </button>
        </div>
      </div>

      {reportPreview && <ReportPreviewModal {...reportPreview} onClose={() => setReportPreview(null)} />}

      {/* Kitty details card */}
      <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:16,padding:"1rem",marginBottom:"1rem",boxShadow:"var(--shadow-sm)"}}>
        <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.7rem",display:"flex",alignItems:"center",gap:"0.4rem"}}><span>📋</span> Kitty Details</div>
        {[
          ["Name", kitty.name],
          ["Category", kittyCategory(kitty)],
          ["Status", "🟢 Active"],
          ["Created", kitty.created],
          ["Goal", `KES ${fmt(kitty.goal)}`],
          ["Raised", `KES ${fmt(kitty.raised||0)}`],
          ["Visibility", kitty.isPrivate ? "🔒 Private" : "🌍 Public"],
        ].map(([l,v]) => (
          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.45rem 0",borderBottom:"1px solid var(--border2)"}}>
            <span style={{fontSize:"0.72rem",color:"var(--text3)",fontWeight:600}}>{l}</span>
            <span style={{fontSize:"0.78rem",fontWeight:700,color:"var(--text)",textAlign:"right",maxWidth:"60%"}}>{v}</span>
          </div>
        ))}
      </div>

      {/* Transactions list */}
      <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:16,padding:"1rem",marginBottom:"1rem",boxShadow:"var(--shadow-sm)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.7rem"}}>
          <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text2)",display:"flex",alignItems:"center",gap:"0.4rem"}}><span>💳</span> Transactions</div>
          <span style={{fontSize:"0.65rem",fontWeight:700,background:"var(--brand-light)",color:"var(--brand)",borderRadius:20,padding:"2px 10px"}}>{txs.length} records</span>
        </div>
        {txs.length === 0 ? (
          <div style={{textAlign:"center",padding:"1.5rem 0",color:"var(--text3)",fontSize:"0.78rem"}}>No transactions yet</div>
        ) : txs.map((t,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.55rem 0",borderBottom:"1px solid var(--border2)"}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:t.type==="Withdrawal"?"var(--rose-light)":"var(--emerald-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",flexShrink:0}}>
              {t.type==="Withdrawal" ? "↑" : "↓"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:"0.78rem",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.name}</div>
              <div style={{fontSize:"0.62rem",color:"var(--text3)",marginTop:1}}>{t.ref} · {t.time}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:"0.82rem",fontWeight:800,color:t.type==="Withdrawal"?"var(--rose)":"var(--emerald)",fontFamily:"var(--mono)"}}>
                {t.type==="Withdrawal"?"-":"+"} KES {fmt(t.gross)}
              </div>
              <div style={{fontSize:"0.6rem",color:"var(--text3)"}}>{t.type}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{display:"flex",gap:"0.6rem",flexWrap:"wrap"}}>
        <button className="btn btn-brand btn-sm" style={{flex:1}} onClick={() => onShare(kitty)}>🔗 Share</button>
        <button className="btn btn-sky btn-sm" style={{flex:1}} onClick={() => onContribute(kitty)}>💰 Contribute</button>
        <button className="btn btn-green btn-sm" style={{flex:1}} onClick={() => onWithdraw(kitty)}>💸 Withdraw</button>
      </div>
    </div>
  );
}

function KittiesPage({ state, user, onToast, onNewKitty, onEditKitty, onWithdraw, onContribute, autoOpen, onBack }) {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => { if (autoOpen) { setModalOpen(true); } }, []);
  const [editKitty, setEditKitty] = useState(null);
  const [viewKitty, setViewKitty] = useState(null);       // modal detail
  const [reportKitty, setReportKitty] = useState(null);   // full-page report
  const [contributeKitty, setContributeKitty] = useState(null);
  const [withdrawKitty, setWithdrawKitty] = useState(null);
  const [shareKitty, setShareKitty] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("raised"); // raised | goal | pct | name

  const kitties = state.kitties.filter(k => {
    // Check if user owns this kitty
    const isOwner = k.createdBy === user.email || 
                    k.creatorId === user.id || 
                    k.creator_id === user.id ||
                    k.creatorEmail === user.email;
    
    // Check if it's a contributions kitty (or no category specified)
    const isContributions = !k.feeCategory || 
                           k.feeCategory === "contributions" ||
                           k.category === "Contributions" ||
                           k.category === 0; // If category is an enum value
    
    return isOwner && isContributions;
  });
  const filtered = kitties
    .filter(k => !search || k.name.toLowerCase().includes(search.toLowerCase()) || kittyCategory(k).toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "goal") return (b.goal||0)-(a.goal||0);
      if (sortBy === "pct")  return ((b.raised||0)/(b.goal||1)) - ((a.raised||0)/(a.goal||1));
      return (b.raised||0)-(a.raised||0); // default: raised
    });

  const totalRaised = kitties.reduce((s,k)=>s+(k.raised||0),0);
  const totalGoal   = kitties.reduce((s,k)=>s+(k.goal||0),0);
  const totalCtrib  = kitties.reduce((s,k)=>s+(k.contributors||0),0);

  // ── Full-page report view ──
  if (reportKitty) {
    return (
      <KittyReportPage
        kitty={reportKitty}
        transactions={state.transactions}
        user={user}
        onBack={() => setReportKitty(null)}
        onWithdraw={(k) => { setReportKitty(null); setWithdrawKitty(k); }}
        onContribute={(k) => { setReportKitty(null); setContributeKitty(k); }}
        onShare={(k) => { setReportKitty(null); setShareKitty(k); }}
        onToast={onToast}
      />
    );
  }

  return (
    <div className="page-wrap">
      {/* Summary hero */}
      <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:20,padding:"1.1rem 1.2rem",marginBottom:"1rem",boxShadow:"var(--shadow-sm)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"}}>
          <div>
            <div style={{fontSize:"1rem",fontWeight:800,letterSpacing:"-0.02em"}}>My Kitties</div>
            <div style={{fontSize:"0.68rem",color:"var(--text3)",marginTop:1}}>Your active campaigns</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <div style={{background:"var(--brand-light)",color:"var(--brand)",fontWeight:800,fontSize:"1.4rem",fontFamily:"var(--mono)",borderRadius:14,padding:"0.35rem 0.85rem",letterSpacing:"-0.04em"}}>{kitties.length}</div>
            <button onClick={onBack} style={{width:34,height:34,border:"1.5px solid var(--border)",borderRadius:10,background:"var(--surface2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div style={{display:"flex",gap:"0.5rem"}}>
          <div style={{flex:1,background:"var(--surface2)",borderRadius:12,padding:"0.65rem 0.5rem",textAlign:"center",border:"1.5px solid var(--border)"}}>
            <div style={{fontSize:"0.85rem",fontWeight:800,color:"var(--brand)",fontFamily:"var(--mono)"}}>KES {fmt(totalRaised)}</div>
            <div style={{fontSize:"0.58rem",fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.04em",marginTop:1}}>Total Raised</div>
          </div>
          <div style={{flex:1,background:"var(--surface2)",borderRadius:12,padding:"0.65rem 0.5rem",textAlign:"center",border:"1.5px solid var(--border)"}}>
            <div style={{fontSize:"0.85rem",fontWeight:800,color:"var(--violet)",fontFamily:"var(--mono)"}}>KES {fmt(totalGoal)}</div>
            <div style={{fontSize:"0.58rem",fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.04em",marginTop:1}}>Total Goal</div>
          </div>
          <div style={{flex:1,background:"var(--surface2)",borderRadius:12,padding:"0.65rem 0.5rem",textAlign:"center",border:"1.5px solid var(--border)"}}>
            <div style={{fontSize:"0.85rem",fontWeight:800,color:"var(--emerald)",fontFamily:"var(--mono)"}}>{totalCtrib}</div>
            <div style={{fontSize:"0.58rem",fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.04em",marginTop:1}}>Supporters</div>
          </div>
        </div>
      </div>

      {/* Create button */}
      <button className="new-kitty-btn" onClick={() => setModalOpen(true)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Create New Kitty
      </button>

      {kitties.length > 0 && (<>
        {/* Search + Sort */}
        <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.85rem"}}>
          <div style={{flex:1,position:"relative"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search kitties…"
              style={{width:"100%",background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:10,padding:"0.55rem 0.75rem 0.55rem 2rem",fontSize:"0.78rem",fontFamily:"var(--font)",color:"var(--text)",outline:"none"}} />
          </div>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
            style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:10,padding:"0 0.7rem",fontSize:"0.72rem",fontFamily:"var(--font)",color:"var(--text2)",fontWeight:600,outline:"none",cursor:"pointer",minWidth:90}}>
            <option value="raised">↓ Raised</option>
            <option value="goal">↓ Goal</option>
            <option value="pct">↓ % Done</option>
            <option value="name">A–Z Name</option>
          </select>
        </div>
      </>)}

      {filtered.length === 0 && kitties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap">{Icons.kitties}</div>
          <div className="empty-title">No kitties yet</div>
          <div className="empty-sub">Create your first kitty to start collecting contributions from your community.</div>
          <button className="btn btn-brand btn-sm" onClick={() => setModalOpen(true)}>+ Create Kitty</button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:"center",padding:"2rem 0",color:"var(--text3)",fontSize:"0.82rem"}}>No kitties match "{search}"</div>
      ) : filtered.map(k => {
        const pct = Math.round(((k.raised||0)/(k.goal||1))*100);
        const { fee, pct: fp } = getKittyFee(k);
        const catColors = { Medical:"var(--rose)", Wedding:"var(--violet)", Education:"var(--sky)", Business:"var(--amber)", Chama:"var(--emerald)", Emergency:"var(--rose)", Other:"var(--brand)" };
        const catColor  = catColors[k.category] || "var(--brand)";
        return (
          <div key={k.id} className="kitty-list-card" style={{cursor:"pointer"}} onClick={() => setViewKitty(k)}>
            {/* Top row */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.4rem"}}>
              <div style={{flex:1,marginRight:"0.5rem"}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:"0.58rem",fontWeight:700,color:catColor,background:`${catColor}18`,borderRadius:20,padding:"2px 8px",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>
                    {kittyCategory(k)}
                  </div>
                <div className="klc-name">{k.name}</div>
                <div style={{fontSize:"0.65rem",color:"var(--text3)",marginTop:2}}>Created {k.created}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:"1.05rem",fontWeight:800,color:"var(--brand)",fontFamily:"var(--mono)",letterSpacing:"-0.03em"}}>KES {fmt(k.raised||0)}</div>
                <div style={{fontSize:"0.62rem",color:"var(--text3)"}}>of KES {fmt(k.goal)}</div>
              </div>
            </div>

            {/* Progress */}
            <div className="prog-track" style={{marginBottom:"0.3rem"}}><div className="prog-fill" style={{width:`${Math.min(100,pct)}%`}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",color:"var(--text3)",marginBottom:"0.6rem"}}>
              <span style={{color:pct>=100?"var(--emerald)":"var(--brand)",fontWeight:700}}>{pct}% funded</span>
              <span>👥 {k.contributors||0} · Fee KES {fmt(fee)} ({fp}%)</span>
            </div>

            {/* Actions */}
            <div className="klc-actions" onClick={e => e.stopPropagation()}>
              <button className="btn btn-brand btn-sm" onClick={() => setReportKitty(k)}>📊 Report</button>
              <button className="btn btn-amber btn-sm" onClick={() => setEditKitty(k)}>Edit</button>
              <button className="btn btn-sky btn-sm" onClick={() => setContributeKitty(k)}>Contribute</button>
              <button className="btn btn-green btn-sm" onClick={() => setWithdrawKitty(k)}>Withdraw</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShareKitty(k)}>Share</button>
            </div>
          </div>
        );
      })}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <NewKittyForm onSubmit={(form) => { onNewKitty(form); setModalOpen(false); onToast("Kitty Created! 🎉", `"${form.name}" is now live`); }} onClose={() => setModalOpen(false)} />
      </Modal>
      <Modal open={!!editKitty} onClose={() => setEditKitty(null)}>
        {editKitty && <EditKittyForm kitty={editKitty} onSubmit={(updates) => { onEditKitty(editKitty.id, updates); setEditKitty(null); onToast("Kitty Updated ✅", `"${updates.name}" saved`); }} onClose={() => setEditKitty(null)} />}
      </Modal>
      <Modal open={!!viewKitty} onClose={() => setViewKitty(null)} hideClose>
        {viewKitty && <KittyDetailModal kitty={viewKitty} user={user} transactions={state.transactions} onClose={() => setViewKitty(null)} onWithdraw={onWithdraw} onContribute={onContribute} onEditKitty={onEditKitty} onToast={onToast} />}
      </Modal>
      <Modal open={!!contributeKitty} onClose={() => setContributeKitty(null)}>
        {contributeKitty && <KittyContributeModal kitty={contributeKitty} user={user} onClose={() => setContributeKitty(null)} onContribute={(id, amt, name, phone) => { onContribute(id, amt, name, phone); onToast("Contributed! 🎉", `KES ${fmt(amt)} added to ${contributeKitty.name}`); }} />}
      </Modal>
      <Modal open={!!withdrawKitty} onClose={() => setWithdrawKitty(null)}>
        {withdrawKitty && <KittyWithdrawModal kitty={withdrawKitty} user={user} onClose={() => setWithdrawKitty(null)} onConfirm={(k, net, fee, phone, partial) => { onWithdraw(k.id, net, fee, phone, partial); onToast("Withdrawal Sent! 💸", `KES ${fmt(net)} is on its way`); }} />}
      </Modal>
      <Modal open={!!shareKitty} onClose={() => setShareKitty(null)}>
        {shareKitty && <ShareKittyModal kitty={shareKitty} onClose={() => setShareKitty(null)} onOpenContribute={(k) => { setShareKitty(null); setContributeKitty(k); }} />}
      </Modal>
    </div>
  );
}

// ─── Event Detail Modal ───
function EventDetailModal({ event, onClose, onManage, onShare }) {
  const isActive = event.status !== "disabled";
  const pct = Math.min(100, Math.round(((event.attendees||0)/(event.target||1))*100));

  return (
    <div>
      {/* Hero */}
      <div style={{background:"var(--grad-events)",borderRadius:18,padding:"1.2rem 1.3rem",marginBottom:"1rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:150,height:150,borderRadius:"50%",background:"rgba(255,255,255,0.07)",top:-40,right:-30}}/>
        <div style={{position:"absolute",width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.05)",bottom:-20,left:20}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem"}}>
            <div style={{fontSize:"0.6rem",fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",textTransform:"uppercase"}}>
              {isActive ? "🟢 Active" : "⚫ Disabled"}
            </div>
          </div>
          <div style={{fontSize:"1.1rem",fontWeight:800,color:"#fff",letterSpacing:"-0.02em",marginBottom:"0.4rem",lineHeight:1.25}}>{event.name}</div>
          <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.8)",marginBottom:"0.3rem"}}>📍 {event.location}</div>
          <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.8)",marginBottom:"0.85rem"}}>📅 {event.date} {event.month}</div>

          {/* Attendance bar */}
          <div style={{height:5,background:"rgba(255,255,255,0.2)",borderRadius:4,overflow:"hidden",marginBottom:"0.35rem"}}>
            <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:"rgba(255,255,255,0.85)",borderRadius:4,transition:"width 0.6s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",color:"rgba(255,255,255,0.7)"}}>
            <span>{event.attendees||0} attending</span>
            <span>Target: {event.target||0} · {pct}%</span>
          </div>
        </div>
      </div>

      {/* Media */}
      {event.mediaBanner && (
        <img src={event.mediaBanner.dataUrl} alt="banner"
          style={{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:14,display:"block",marginBottom:"0.75rem",boxShadow:"var(--shadow)"}} />
      )}
      {!event.mediaBanner && event.mediaImage && (
        <img src={event.mediaImage.dataUrl} alt="event"
          style={{width:"100%",maxHeight:180,objectFit:"cover",objectPosition:"center",borderRadius:14,display:"block",marginBottom:"0.75rem",boxShadow:"var(--shadow)"}} />
      )}
      {event.mediaDoc && (
        <div style={{display:"flex",alignItems:"center",gap:"0.65rem",background:"var(--brand-light)",border:"1.5px solid rgba(79,70,229,0.2)",borderRadius:12,padding:"0.75rem 0.9rem",marginBottom:"0.75rem"}}>
          <span style={{fontSize:"1.2rem"}}>{event.mediaDoc.type&&event.mediaDoc.type.startsWith("image/")?"🖼️":"📎"}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--brand)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{event.mediaDoc.name}</div>
            <div style={{fontSize:"0.62rem",color:"var(--text3)"}}>Event document · Tap to view</div>
          </div>
        </div>
      )}

      {/* Description */}
      {event.description && (
        <div style={{background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:12,padding:"0.85rem 1rem",marginBottom:"0.9rem"}}>
          <div style={{fontSize:"0.62rem",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.4rem"}}>About This Event</div>
          <div style={{fontSize:"0.82rem",color:"var(--text2)",lineHeight:1.6}}>{event.description}</div>
        </div>
      )}

      {/* Details grid */}
      <div style={{background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:12,padding:"0.75rem 1rem",marginBottom:"1rem"}}>
        {[
          ["Event", event.name],
          ["Date", `${event.date} ${event.month}`],
          ["Venue", event.location||"—"],
          ["Status", isActive ? "🟢 Active" : "⚫ Disabled"],
          ["Attendees", `${event.attendees||0} / ${event.target||0}`],
        ].map(([l,v]) => (
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"0.4rem 0",borderBottom:"1px solid var(--border2)"}}>
            <span style={{fontSize:"0.7rem",color:"var(--text3)",fontWeight:600}}>{l}</span>
            <span style={{fontSize:"0.75rem",fontWeight:700,color:"var(--text)",textAlign:"right",maxWidth:"60%"}}>{v}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{display:"flex",gap:"0.6rem"}}>
        <button className="btn btn-sky btn-sm" style={{flex:1,padding:"0.7rem",fontSize:"0.82rem"}} onClick={() => { onClose(); onShare(event); }}>🔗 Share</button>
        <button className="btn btn-ghost btn-sm" style={{flex:1,padding:"0.7rem",fontSize:"0.82rem"}} onClick={() => { onClose(); onManage(event); }}>⚙️ Manage</button>
      </div>
      <button className="back-btn" style={{marginTop:"0.6rem"}} onClick={onClose}>Close</button>
    </div>
  );
}

// ─── Notifications Panel ───
function NotificationsPanel({ notifications, onClose, onMarkAllRead, onClearAll }) {
  const unreadCount = notifications.filter(n => !n.read).length;
  return (
    <>
      <div className="notif-panel-backdrop" onClick={onClose} />
      <div className="notif-panel" style={{paddingTop:"var(--header-h)"}}>
        <div className="notif-header">
          <div>
            <div className="notif-header-title">Notifications</div>
            {unreadCount > 0 && (
              <div style={{fontSize:"0.68rem",color:"var(--text3)",marginTop:1}}>{unreadCount} unread</div>
            )}
          </div>
          <div style={{display:"flex",gap:"0.6rem",alignItems:"center"}}>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={onMarkAllRead}>Mark all read</button>
            )}
            {notifications.length > 0 && (
              <button className="notif-mark-all" style={{color:"var(--rose)"}} onClick={() => onClearAll(null)}>Clear all</button>
            )}
            <button className="notif-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="notif-body">
          {notifications.length === 0 ? (
            <div style={{textAlign:"center",padding:"3rem 1rem"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>🔔</div>
              <div style={{fontSize:"0.88rem",fontWeight:700,marginBottom:"0.3rem"}}>All caught up!</div>
              <div style={{fontSize:"0.75rem",color:"var(--text3)"}}>No notifications yet.</div>
            </div>
          ) : notifications.map(n => (
            <div key={n.id} className={`notif-item${!n.read?" unread":""}`} style={{position:"relative"}}>
              <div className="notif-icon" style={{background:n.bg||"var(--brand-light)"}}>{n.icon}</div>
              <div className="notif-content">
                <div className="notif-title">{n.title}</div>
                <div className="notif-body-text">{n.body}</div>
                <div className="notif-time">{n.time}</div>
              </div>
              <button
                onClick={() => onClearAll && onClearAll(n.id)}
                style={{position:"absolute",top:8,right:8,width:20,height:20,border:"none",background:"var(--surface3)",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",color:"var(--text3)",fontWeight:700,lineHeight:1,flexShrink:0,transition:"all 0.18s"}}
                title="Dismiss"
              >✕</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Manage Chama Members Modal ───
function ManageMembersModal({ chama, onClose, onAddMember, onRemoveMember }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const members = chama.memberList || [];

  const handleAdd = () => {
    if (!name.trim()) return;
    onAddMember(chama.id, { id: Date.now(), name: name.trim(), phone: phone.trim(), joined: new Date().toLocaleDateString("en-KE",{month:"short",year:"numeric"}) });
    setName(""); setPhone("");
  };

  return (
    <div>
      <div className="modal-title">👥 Manage Members — {chama.name}</div>
      <div style={{background:"var(--violet-light)",border:"1.5px solid rgba(124,58,237,0.18)",borderRadius:12,padding:"0.75rem 1rem",marginBottom:"1.1rem",display:"flex",alignItems:"center",gap:"0.6rem"}}>
        <span style={{fontSize:"1.2rem"}}>👥</span>
        <div>
          <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--violet)"}}>{members.length} {members.length===1?"member":"members"}</div>
          <div style={{fontSize:"0.65rem",color:"var(--text2)",marginTop:1}}>Max capacity: {chama.members}</div>
        </div>
      </div>

      {/* Add Member Form */}
      <div style={{background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:14,padding:"0.9rem 1rem",marginBottom:"1rem"}}>
        <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.65rem"}}>➕ Add New Member</div>
        <div className="field" style={{marginBottom:"0.6rem"}}>
          <label>Full Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Jane Wambua" />
        </div>
        <div className="field" style={{marginBottom:"0.75rem"}}>
          <label>Phone Number (optional)</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="e.g. 0712345678" type="tel" />
        </div>
        <button className="confirm-btn" style={{background:"var(--grad-chama)",boxShadow:"0 8px 24px rgba(124,58,237,0.28)",padding:"0.7rem"}}
          onClick={handleAdd} disabled={!name.trim()}>
          Add Member →
        </button>
      </div>

      {/* Members List */}
      <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.5rem"}}>Current Members</div>
      {members.length === 0 ? (
        <div style={{textAlign:"center",padding:"1.5rem",color:"var(--text3)",fontSize:"0.78rem",background:"var(--surface2)",borderRadius:12,border:"1.5px dashed var(--border)"}}>
          No members yet. Add the first member above.
        </div>
      ) : members.map(m => (
        <div key={m.id} className="member-item" style={{flexDirection:"column",alignItems:"stretch",gap:0}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.65rem"}}>
            <div className="member-av">{(m.name||"?").slice(0,2).toUpperCase()}</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="member-name">{m.name}</div>
              <div className="member-phone">{m.phone || "—"} · Joined {m.joined}</div>
            </div>
            <button type="button" className="member-remove" onClick={() => setConfirmId(confirmId === m.id ? null : m.id)}>Remove</button>
          </div>
          {confirmId === m.id && (
            <div style={{marginTop:"0.55rem",background:"var(--rose-light)",border:"1.5px solid rgba(244,63,94,0.25)",borderRadius:10,padding:"0.65rem 0.75rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.55rem"}}>
                <span style={{fontSize:"1rem",flexShrink:0}}>⚠️</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--rose)"}}>Remove {m.name}?</div>
                  <div style={{fontSize:"0.65rem",color:"var(--text2)",marginTop:1,lineHeight:1.4}}>This will permanently remove them from the chama.</div>
                </div>
              </div>
              <div style={{display:"flex",gap:"0.5rem"}}>
                <button type="button" onClick={() => setConfirmId(null)}
                  style={{flex:1,background:"var(--surface)",color:"var(--text2)",border:"1.5px solid var(--border)",borderRadius:8,padding:"0.45rem 0",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.18s"}}>
                  Cancel
                </button>
                <button type="button" onClick={() => { onRemoveMember(chama.id, m.id); setConfirmId(null); }}
                  style={{flex:1,background:"var(--rose)",color:"#fff",border:"none",borderRadius:8,padding:"0.45rem 0",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.18s"}}>
                  Yes, Remove
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button className="back-btn" style={{marginTop:"0.75rem"}} onClick={onClose}>Close</button>
    </div>
  );
}

// ─── Manage Event Modal ───
function ManageEventModal({ event, onClose, onSave, onToggleStatus }) {
  const [form, setForm] = useState({
    name: event.name, date: event.date, month: event.month,
    location: event.location, target: event.target, description: event.description || ""
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const isActive = event.status !== "disabled";

  const [mediaImage,  setMediaImage]  = useState(event.mediaImage  || null);
  const [mediaBanner, setMediaBanner] = useState(event.mediaBanner || null);
  const [mediaDoc,    setMediaDoc]    = useState(event.mediaDoc    || null);
  const [activeTab,   setActiveTab]   = useState("image");

  const readFile = (file, setter) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setter({ dataUrl: e.target.result, name: file.name, size: file.size, type: file.type });
    reader.readAsDataURL(file);
  };
  const fmtSize = (b) => b < 1024*1024 ? `${(b/1024).toFixed(0)} KB` : `${(b/1024/1024).toFixed(1)} MB`;
  const isImg   = (f) => f && f.type && f.type.startsWith("image/");

  const zoneBase = {
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    gap:"0.4rem", cursor:"pointer", borderRadius:14, padding:"1.1rem 0.75rem", textAlign:"center", transition:"all 0.2s",
  };

  const mediaTabs = [
    { key:"image",  label:"📸 Photo"    },
    { key:"banner", label:"🖼️ Banner"   },
    { key:"doc",    label:"📎 Document" },
  ];

  return (
    <div>
      <div className="modal-title">⚙️ Manage Event</div>

      {/* Status toggle */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:isActive?"var(--emerald-light)":"var(--surface3)",border:`1.5px solid ${isActive?"rgba(16,185,129,0.25)":"var(--border)"}`,borderRadius:14,padding:"0.85rem 1rem",marginBottom:"1.1rem"}}>
        <div>
          <div style={{fontSize:"0.82rem",fontWeight:700,color:isActive?"var(--emerald)":"var(--text3)"}}>
            {isActive ? "🟢 Event is Active" : "⚫ Event is Disabled"}
          </div>
          <div style={{fontSize:"0.68rem",color:"var(--text2)",marginTop:2}}>
            {isActive ? "Visible and accepting registrations" : "Hidden from public view"}
          </div>
        </div>
        <button onClick={() => onToggleStatus(event.id)} style={{
          background:isActive?"var(--rose-light)":"var(--emerald-light)",
          color:isActive?"var(--rose)":"var(--emerald)",
          border:"none",borderRadius:8,padding:"0.45rem 0.9rem",fontSize:"0.72rem",fontWeight:700,cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.18s",flexShrink:0
        }}>
          {isActive ? "Disable" : "Activate"}
        </button>
      </div>

      {/* Edit fields */}
      <div style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.65rem"}}>Edit Details</div>
      <div className="field"><label>Event Name</label>
        <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Annual Harambee" />
      </div>
      <div className="g2">
        <div className="field"><label>Day</label>
          <input value={form.date} onChange={e=>set("date",e.target.value)} placeholder="e.g. 15" maxLength={2} />
        </div>
        <div className="field"><label>Month</label>
          <select value={form.month} onChange={e=>set("month",e.target.value)}>
            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m=><option key={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="field"><label>Location</label>
        <input value={form.location} onChange={e=>set("location",e.target.value)} placeholder="e.g. Serena Hotel, Nairobi" />
      </div>
      <div className="field"><label>Target Attendees</label>
        <input type="number" min="1" value={form.target} onChange={e=>set("target",e.target.value)} placeholder="e.g. 200" />
      </div>
      <div className="field"><label>Description <span style={{fontWeight:400,color:"var(--text3)"}}>(optional)</span></label>
        <textarea value={form.description} onChange={e=>set("description",e.target.value)} placeholder="What is this event about?"
          style={{width:"100%",background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"0.72rem 0.9rem",color:"var(--text)",fontFamily:"var(--font)",fontSize:"0.88rem",outline:"none",resize:"none",minHeight:64,lineHeight:1.5,transition:"border-color 0.18s"}}
          onFocus={e=>e.target.style.borderColor="var(--sky)"} onBlur={e=>e.target.style.borderColor="var(--border)"} />
      </div>

      {/* ── Event Media Upload ── */}
      <div style={{background:"linear-gradient(135deg,#F0F9FF,#EEF0FF)",border:"1.5px solid rgba(14,165,233,0.2)",borderRadius:14,padding:"0.9rem 1rem",marginBottom:"1.1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.6rem"}}>
          <span style={{fontSize:"1rem"}}>📁</span>
          <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--sky)"}}>Event Media</div>
          {(mediaImage||mediaBanner||mediaDoc) && (
            <span style={{fontSize:"0.62rem",fontWeight:700,color:"var(--emerald)",background:"var(--emerald-light)",borderRadius:20,padding:"1px 7px",marginLeft:"auto"}}>✓ Media added</span>
          )}
        </div>

        {/* Tabs */}
        <div className="media-tabs">
          {mediaTabs.map(t => (
            <button type="button" key={t.key} className={`media-tab${activeTab===t.key?" active":""}`}
              onClick={()=>setActiveTab(t.key)}>{t.label}</button>
          ))}
        </div>

        {/* Photo tab */}
        {activeTab==="image" && (
          mediaImage ? (
            <div style={{position:"relative"}}>
              <img src={mediaImage.dataUrl} alt="preview" style={{width:"100%",maxHeight:130,objectFit:"cover",borderRadius:10,display:"block",border:"2px solid rgba(14,165,233,0.25)"}} />
              <button type="button" className="media-remove-btn" onClick={()=>setMediaImage(null)}>✕</button>
              <div style={{marginTop:"0.3rem",fontSize:"0.65rem",color:"var(--text3)",textAlign:"center"}}>📸 {mediaImage.name} · {fmtSize(mediaImage.size)}</div>
              <FileZone accept="image/*" onFile={f=>readFile(f,setMediaImage)}
                style={{marginTop:"0.4rem",textAlign:"center",fontSize:"0.68rem",fontWeight:700,color:"var(--sky)",textDecoration:"underline",borderRadius:8,padding:"0.2rem 0",cursor:"pointer"}}>
                Replace photo
              </FileZone>
            </div>
          ) : (
            <FileZone accept="image/*" onFile={f=>readFile(f,setMediaImage)}
              className="media-upload-zone image-zone" style={zoneBase}>
              <div className="media-upload-icon" style={{background:"var(--sky-light)",width:38,height:38,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>📸</div>
              <div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--sky)"}}>Event Photo</div>
              <div style={{fontSize:"0.62rem",color:"var(--text3)"}}>JPG, PNG, WEBP · max 10MB</div>
              <div style={{marginTop:"0.2rem",fontSize:"0.68rem",fontWeight:700,color:"var(--sky)",background:"var(--sky-light)",borderRadius:60,padding:"3px 14px",border:"1.5px solid rgba(14,165,233,0.3)"}}>Tap to upload</div>
            </FileZone>
          )
        )}

        {/* Banner tab */}
        {activeTab==="banner" && (
          mediaBanner ? (
            <div style={{position:"relative"}}>
              <img src={mediaBanner.dataUrl} alt="banner" style={{width:"100%",maxHeight:120,objectFit:"cover",borderRadius:10,display:"block",border:"2px solid rgba(124,58,237,0.25)"}} />
              <button type="button" className="media-remove-btn" onClick={()=>setMediaBanner(null)}>✕</button>
              <div style={{marginTop:"0.3rem",fontSize:"0.65rem",color:"var(--text3)",textAlign:"center"}}>🖼️ {mediaBanner.name} · {fmtSize(mediaBanner.size)}</div>
              <FileZone accept="image/*" onFile={f=>readFile(f,setMediaBanner)}
                style={{marginTop:"0.4rem",textAlign:"center",fontSize:"0.68rem",fontWeight:700,color:"var(--violet)",textDecoration:"underline",borderRadius:8,padding:"0.2rem 0",cursor:"pointer"}}>
                Replace banner
              </FileZone>
            </div>
          ) : (
            <FileZone accept="image/*" onFile={f=>readFile(f,setMediaBanner)}
              className="media-upload-zone" style={zoneBase}>
              <div className="media-upload-icon" style={{background:"var(--violet-light)",width:38,height:38,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>🖼️</div>
              <div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--violet)"}}>Event Banner</div>
              <div style={{fontSize:"0.62rem",color:"var(--text3)"}}>Wide format · JPG, PNG · max 10MB</div>
              <div style={{marginTop:"0.2rem",fontSize:"0.68rem",fontWeight:700,color:"var(--violet)",background:"var(--violet-light)",borderRadius:60,padding:"3px 14px",border:"1.5px solid rgba(124,58,237,0.25)"}}>Tap to upload</div>
            </FileZone>
          )
        )}

        {/* Document tab */}
        {activeTab==="doc" && (
          mediaDoc ? (
            <div>
              {isImg(mediaDoc) ? (
                <div style={{position:"relative"}}>
                  <img src={mediaDoc.dataUrl} alt="doc" style={{width:"100%",maxHeight:140,objectFit:"cover",borderRadius:10,display:"block",border:"2px solid rgba(79,70,229,0.2)"}} />
                  <button type="button" className="media-remove-btn" onClick={()=>setMediaDoc(null)}>✕</button>
                </div>
              ) : (
                <div className="media-doc-preview">
                  <div className="media-doc-icon">📎</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="media-doc-name">{mediaDoc.name}</div>
                    <div className="media-doc-size">{fmtSize(mediaDoc.size)}</div>
                  </div>
                  <div style={{fontSize:"0.65rem",fontWeight:700,color:"var(--emerald)",background:"var(--emerald-light)",borderRadius:6,padding:"2px 7px"}}>✓ Saved</div>
                </div>
              )}
              <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
                <FileZone accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,image/*,application/pdf"
                  onFile={f=>readFile(f,setMediaDoc)}
                  style={{flex:1,textAlign:"center",fontSize:"0.68rem",fontWeight:700,color:"var(--brand)",textDecoration:"underline",borderRadius:8,padding:"0.3rem 0",cursor:"pointer"}}>
                  Replace file
                </FileZone>
                <button type="button" onClick={()=>setMediaDoc(null)}
                  style={{flex:1,background:"var(--rose-light)",color:"var(--rose)",border:"none",borderRadius:8,padding:"0.3rem 0",fontSize:"0.68rem",fontWeight:700,cursor:"pointer",fontFamily:"var(--font)"}}>
                  ✕ Remove
                </button>
              </div>
            </div>
          ) : (
            <FileZone accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,image/*,application/pdf"
              onFile={f=>readFile(f,setMediaDoc)}
              className="media-upload-zone" style={zoneBase}>
              <div className="media-upload-icon" style={{background:"var(--brand-light)",width:38,height:38,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>📎</div>
              <div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--brand)"}}>Programme / Flyer / Doc</div>
              <div style={{fontSize:"0.62rem",color:"var(--text3)"}}>PDF, DOC, JPG · max 20MB</div>
              <div style={{marginTop:"0.2rem",fontSize:"0.68rem",fontWeight:700,color:"var(--brand)",background:"var(--brand-light)",borderRadius:60,padding:"3px 14px",border:"1.5px solid rgba(79,70,229,0.25)"}}>Tap to upload</div>
            </FileZone>
          )
        )}

        {/* Summary pills */}
        {(mediaImage||mediaBanner||mediaDoc) && (
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginTop:"0.65rem"}}>
            {mediaImage  && <span style={{display:"inline-flex",alignItems:"center",gap:4,background:"var(--sky-light)",color:"var(--sky)",fontSize:"0.62rem",fontWeight:700,borderRadius:60,padding:"3px 10px",border:"1px solid rgba(14,165,233,0.2)"}}>📸 Photo ✓</span>}
            {mediaBanner && <span style={{display:"inline-flex",alignItems:"center",gap:4,background:"var(--violet-light)",color:"var(--violet)",fontSize:"0.62rem",fontWeight:700,borderRadius:60,padding:"3px 10px",border:"1px solid rgba(124,58,237,0.2)"}}>🖼️ Banner ✓</span>}
            {mediaDoc    && <span style={{display:"inline-flex",alignItems:"center",gap:4,background:"var(--brand-light)",color:"var(--brand)",fontSize:"0.62rem",fontWeight:700,borderRadius:60,padding:"3px 10px",border:"1px solid rgba(79,70,229,0.2)"}}>📎 Doc ✓</span>}
          </div>
        )}
      </div>

      <button className="confirm-btn" style={{background:"var(--grad-events)",boxShadow:"0 8px 24px rgba(14,165,233,0.28)"}} onClick={() => {
        if (!form.name.trim()) return;
        onSave(event.id, { name:form.name.trim(), date:form.date, month:form.month, location:form.location.trim(), target:Number(form.target)||0, description:form.description.trim(), mediaImage, mediaBanner, mediaDoc });
        onClose();
      }}>Save Changes →</button>
      <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
        <button className="back-btn" style={{flex:1,marginTop:0}} onClick={onClose}>Cancel</button>
        <button className="back-btn" style={{flex:1,marginTop:0,background:"var(--surface3)",fontWeight:700}} onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

// ─── Share Event Modal ───
function ShareEventModal({ event, onClose }) {
  const [copied, setCopied] = useState(false);
  const link = (() => {
    try {
      const u = new URL(window.location.href);
      u.hash = `event=${event.id}`;
      u.search = "";
      return u.toString();
    } catch {
      return `${window.location.href.split("?")[0].split("#")[0]}#event=${event.id}`;
    }
  })();

  const msg = `🎊 You're invited to *${event.name}*!\n\n📍 ${event.location}\n📅 ${event.date} ${event.month}\n👥 ${event.attendees}/${event.target} attending\n\n${event.description ? event.description + "\n\n" : ""}Join us and be part of this amazing event!\n👉 ${link}`;
  const msgEncoded = encodeURIComponent(msg);

  const copyLink = () => {
    try { navigator.clipboard.writeText(link); } catch {
      const ta = document.createElement("textarea");
      ta.value = link; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const channels = [
    { key:"wa",  label:"WhatsApp", icon:"💬", href:`https://wa.me/?text=${msgEncoded}` },
    { key:"tg",  label:"Telegram", icon:"✈️", href:`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`🎊 ${event.name}`)}` },
    { key:"em",  label:"Email",    icon:"📧", href:`mailto:?subject=${encodeURIComponent(`Invitation: ${event.name}`)}&body=${encodeURIComponent(msg)}` },
    { key:"sms", label:"SMS",      icon:"💬", href:`sms:?body=${msgEncoded}` },
    { key:"fb",  label:"Facebook", icon:"👍", href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}` },
    { key:"tw",  label:"Twitter/X",icon:"🐦", href:`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join ${event.name} 🎊`)}&url=${encodeURIComponent(link)}` },
  ];

  return (
    <div>
      <div className="modal-title">Share Event 🎊</div>

      {/* Event preview */}
      <div style={{background:"var(--grad-events)",borderRadius:16,padding:"1.1rem 1.2rem",marginBottom:"1rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.07)",top:-30,right:-30}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:"0.6rem",fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>Sharing Event</div>
          <div style={{fontSize:"1rem",fontWeight:800,color:"#fff",letterSpacing:"-0.02em",marginBottom:4}}>{event.name}</div>
          <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.75)"}}>📍 {event.location} · 📅 {event.date} {event.month}</div>
          <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.7)",marginTop:2}}>👥 {event.attendees}/{event.target} attending</div>
        </div>
      </div>

      {/* Link */}
      <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.45rem"}}>Event invite link</div>
      <div className="share-link-box" onClick={copyLink} style={{borderColor:"rgba(14,165,233,0.3)"}}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--sky)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        <span className="share-link-url">{link}</span>
        <button className="share-link-copy" style={{background:"var(--sky-light)",color:"var(--sky)"}} onClick={e=>{e.stopPropagation();copyLink();}}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      {copied && <div className="share-copied-badge">✅ Link copied to clipboard!</div>}

      <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text2)",margin:"1rem 0 0.5rem"}}>Share via</div>
      <div className="share-channels">
        {channels.map(ch => (
          <a key={ch.key} href={ch.href} target="_blank" rel="noopener noreferrer" className={`share-ch ${ch.key}`} style={{textDecoration:"none"}}>
            <div className="share-ch-icon">{ch.icon}</div>
            <span className="share-ch-label">{ch.label}</span>
          </a>
        ))}
      </div>
      <button className="back-btn" style={{marginTop:"0.75rem"}} onClick={() => {
        if (navigator.share) { navigator.share({ title: event.name, text: msg, url: link }).catch(()=>{}); }
        else { copyLink(); }
      }}>📤 More Sharing Options</button>
      <button className="back-btn" onClick={onClose}>Close</button>
    </div>
  );
}

// ─── Chama Page ───
function ChamaPage({ state, user, onToast, onNewChama, onEditChama, onChamaContribute, onChamaWithdraw, onAddMember, onRemoveMember, onEditKitty, onWithdraw, onContribute, autoOpen, onBack }) {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => { if (autoOpen) { setModalOpen(true); } }, []);
  const [viewChama, setViewChama] = useState(null);
  const [editChama, setEditChama] = useState(null);
  const [withdrawChama, setWithdrawChama] = useState(null);
  const [contributeChama, setContributeChama] = useState(null);
  const [membersChama, setMembersChama] = useState(null);
  const [editKitty, setEditKitty] = useState(null);
  const [withdrawKitty, setWithdrawKitty] = useState(null);
  const [contributeKitty, setContributeKitty] = useState(null);
  const [reportKitty, setReportKitty] = useState(null);
  const [viewKittyC, setViewKittyC] = useState(null);
  const [editKittyC, setEditKittyC] = useState(null);
  const [withdrawKittyC, setWithdrawKittyC] = useState(null);
  const [contributeKittyC, setContributeKittyC] = useState(null);
  const [membersKittyC, setMembersKittyC] = useState(null);
  const chamas = state.chamas.filter(c => c.createdBy === user.email);
  const chamaKitties = state.kitties.filter(k => k.createdBy === user.email && k.feeCategory === "chama");

  const calcPenaltyLabel = (c) => {
    if (!c.penaltyValue) return null;
    const base = c.penaltyType === "fixed" ? `KES ${fmt(c.penaltyValue)}` : `${c.penaltyValue}%`;
    return `${base}${c.penaltyPerDay ? "/day late" : " flat penalty"}`;
  };

  return (
    <div className="page-wrap">
      <div className="page-hero">
        <div><div className="ph-title">My Chamas</div><div className="ph-sub">Group savings & investments</div></div>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <div className="ph-badge ph-badge-violet">{chamas.length + chamaKitties.length}</div>
          <button onClick={onBack} style={{width:34,height:34,border:"1.5px solid var(--border)",borderRadius:10,background:"var(--surface2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <button className="new-chama-btn" onClick={() => setModalOpen(true)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Create New Chama
      </button>

      {/* ── Chama Groups ── */}
      {chamas.length === 0 && chamaKitties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap violet">{Icons.chama}</div>
          <div className="empty-title">No Chamas yet</div>
          <div className="empty-sub">Start a savings group with your friends, family or colleagues and grow together.</div>
          <button className="btn btn-violet btn-sm" onClick={() => setModalOpen(true)}>+ Create Chama</button>
        </div>
      ) : chamas.map(c => {
        const penaltyLabel = calcPenaltyLabel(c);
        return (
          <div key={c.id} className="chama-card" style={{cursor:"pointer"}} onClick={() => setViewChama(state.chamas.find(x=>x.id===c.id)||c)}>
            <div className="chama-top">
              <div className="chama-name">{c.name}</div>
              <div className="chama-badge">{c.cycle}</div>
            </div>
            <div className="chama-meta">
              <span>👥 {(c.memberList||[]).length || c.members} members</span>
              <span>📅 Next: {c.nextMeeting}</span>
            </div>
            {penaltyLabel && (
              <div style={{display:"flex",alignItems:"center",gap:6,background:"#FFF7ED",border:"1.5px solid rgba(245,158,11,0.3)",borderRadius:10,padding:"0.55rem 0.85rem",fontSize:"0.75rem",fontWeight:700,color:"var(--amber)",marginBottom:"0.65rem",lineHeight:1.4}}>
                ⚠️ Late penalty: {penaltyLabel}
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:"0.65rem",color:"var(--text3)",marginBottom:2}}>Pool Balance</div>
                <div className="chama-pool">KES {fmt(c.pool)}</div>
              </div>
              <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",justifyContent:"flex-end"}} onClick={e=>e.stopPropagation()}>
                <button className="btn btn-violet btn-sm" onClick={() => setContributeChama(c)}>Contribute</button>
                <button className="btn btn-green btn-sm" onClick={() => setWithdrawChama(c)}>💸 Withdraw</button>
                <button className="btn btn-sky btn-sm" onClick={() => setMembersChama(state.chamas.find(x=>x.id===c.id))}>👥 Members</button>
                <button className="btn btn-amber btn-sm" onClick={() => setEditChama(c)}>Edit</button>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Chama Kitties ── */}
      {chamaKitties.length > 0 && (<>
        <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em",margin:"1.1rem 0 0.6rem",paddingBottom:"0.4rem",borderBottom:"1.5px solid var(--border)"}}>
          🤝 Chama Kitties · {chamaKitties.length}
        </div>
        {chamaKitties.map(k => {
          const pct = Math.round(((k.raised||0)/(k.goal||1))*100);
          const { fee, pct: fp } = getKittyFee(k);
          return (
            <div key={k.id} className="kitty-list-card" style={{cursor:"pointer"}} onClick={() => setViewKittyC(k)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.4rem"}}>
                <div style={{flex:1,marginRight:"0.5rem"}}>
                  <div style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:"0.58rem",fontWeight:700,color:"var(--violet)",background:"rgba(124,58,237,0.1)",borderRadius:20,padding:"2px 8px",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>🤝 Chama</div>
                  <div className="klc-name">{k.name}</div>
                  <div style={{fontSize:"0.65rem",color:"var(--text3)",marginTop:2}}>Created {k.created}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:"1.05rem",fontWeight:800,color:"var(--violet)",fontFamily:"var(--mono)",letterSpacing:"-0.03em"}}>KES {fmt(k.raised||0)}</div>
                  <div style={{fontSize:"0.62rem",color:"var(--text3)"}}>of KES {fmt(k.goal)}</div>
                </div>
              </div>
              <div className="prog-track" style={{marginBottom:"0.3rem"}}><div className="prog-fill" style={{width:`${Math.min(100,pct)}%`,background:"var(--violet)"}}/></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",color:"var(--text3)",marginBottom:"0.6rem"}}>
                <span style={{color:pct>=100?"var(--emerald)":"var(--violet)",fontWeight:700}}>{pct}% funded</span>
                <span>👥 {k.contributors||0} · Fee KES {fmt(fee)} ({fp}%)</span>
              </div>
              <div className="klc-actions" onClick={e=>e.stopPropagation()}>
                <button className="btn btn-violet btn-sm" onClick={() => setContributeKittyC(k)}>Contribute</button>
                <button className="btn btn-green btn-sm" onClick={() => setWithdrawKittyC(k)}>💸 Withdraw</button>
                <button className="btn btn-sky btn-sm" onClick={() => setMembersKittyC(k)}>👥 Members</button>
                <button className="btn btn-amber btn-sm" onClick={() => { if(onEditKitty) setEditKittyC(k); }}>Edit</button>
              </div>
            </div>
          );
        })}
      </>)}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <NewChamaForm onSubmit={(form) => { onNewChama(form); setModalOpen(false); onToast("Chama Created! 🏠", `"${form.name}" is ready`); }} onClose={() => setModalOpen(false)} />
      </Modal>
      <Modal open={!!editChama} onClose={() => setEditChama(null)}>
        {editChama && <EditChamaForm chama={editChama} onSubmit={(updates) => { onEditChama(editChama.id, updates); setEditChama(null); onToast("Chama Updated ✅", `"${updates.name}" saved`); }} onClose={() => setEditChama(null)} />}
      </Modal>
      <Modal open={!!viewChama} onClose={() => setViewChama(null)}>
        {viewChama && <ChamaDetailModal chama={viewChama} onClose={() => setViewChama(null)} onContribute={(c) => { setViewChama(null); setContributeChama(c); }} onWithdraw={(c) => { setViewChama(null); setWithdrawChama(c); }} />}
      </Modal>
      <Modal open={!!contributeChama} onClose={() => setContributeChama(null)}>
        {contributeChama && <ChamaContributeModal chama={contributeChama} onClose={() => setContributeChama(null)} onConfirm={(chamaId, amount) => { onChamaContribute(chamaId, amount); onToast("Contribution Sent! 🏠", `KES ${fmt(amount)} added to chama`); }} />}
      </Modal>
      <Modal open={!!withdrawChama} onClose={() => setWithdrawChama(null)}>
        {withdrawChama && <ChamaWithdrawModal chama={withdrawChama} user={user} onClose={() => setWithdrawChama(null)} onConfirm={(chama, net, fee, dest, gross) => { onChamaWithdraw(chama.id, net, fee, dest, gross); setWithdrawChama(null); onToast("Withdrawal Sent! 💸", `KES ${fmt(net)} is on its way`); }} />}
      </Modal>
      <Modal open={!!membersChama} onClose={() => setMembersChama(null)}>
        {membersChama && (() => {
          const liveChama = state.chamas.find(c => c.id === membersChama.id) || membersChama;
          return <ManageMembersModal
            chama={liveChama}
            onClose={() => setMembersChama(null)}
            onAddMember={(chamaId, member) => {
              onAddMember(chamaId, member);
              onToast("Member Added ✅", `${member.name} has joined the chama`);
            }}
            onRemoveMember={(chamaId, memberId) => {
              onRemoveMember(chamaId, memberId);
              onToast("Member Removed", "Member has been removed from the chama");
            }}
          />;
        })()}
      </Modal>
      {/* ── Chama Kitty Modals ── */}
      <Modal open={!!viewKittyC} onClose={() => setViewKittyC(null)} hideClose>
        {viewKittyC && (() => { const live = state.kitties.find(k=>k.id===viewKittyC.id)||viewKittyC; return <KittyDetailModal kitty={live} user={user} transactions={state.transactions} onClose={() => setViewKittyC(null)} onWithdraw={(id,net,fee,phone,partial) => { if(onWithdraw) onWithdraw(id,net,fee,phone,partial); }} onContribute={(id,amt,name,phone) => { if(onContribute) onContribute(id,amt,name,phone); }} onEditKitty={onEditKitty} onToast={onToast} />; })()}
      </Modal>
      <Modal open={!!editKittyC} onClose={() => setEditKittyC(null)}>
        {editKittyC && <EditKittyForm kitty={editKittyC} onSubmit={(updates) => { if(onEditKitty) onEditKitty(editKittyC.id, updates); setEditKittyC(null); onToast("Kitty Updated ✅", `"${updates.name}" saved`); }} onClose={() => setEditKittyC(null)} />}
      </Modal>
      <Modal open={!!contributeKittyC} onClose={() => setContributeKittyC(null)}>
        {contributeKittyC && <KittyContributeModal kitty={contributeKittyC} user={user} onClose={() => setContributeKittyC(null)} onConfirm={(id,amt,name,phone) => { if(onContribute) onContribute(id,amt,name,phone); setContributeKittyC(null); onToast("Contributed! 🎉", `KES ${fmt(amt)} sent`); }} />}
      </Modal>
      <Modal open={!!withdrawKittyC} onClose={() => setWithdrawKittyC(null)}>
        {withdrawKittyC && (() => { const live = state.kitties.find(k=>k.id===withdrawKittyC.id)||withdrawKittyC; return <KittyWithdrawModal kitty={live} user={user} onClose={() => setWithdrawKittyC(null)} onConfirm={(id,net,fee,phone,partial) => { if(onWithdraw) onWithdraw(id,net,fee,phone,partial); setWithdrawKittyC(null); onToast("Withdrawal Sent! 💸", `KES ${fmt(net)} is on its way`); }} />; })()}
      </Modal>
      <Modal open={!!membersKittyC} onClose={() => setMembersKittyC(null)}>
        {membersKittyC && (() => { const live = state.kitties.find(k=>k.id===membersKittyC.id)||membersKittyC; return <KittyContributorsReport kitty={live} transactions={state.transactions} user={user} onBack={() => setMembersKittyC(null)} onWithdraw={(k)=>{ setMembersKittyC(null); setWithdrawKittyC(k); }} onContribute={(k)=>{ setMembersKittyC(null); setContributeKittyC(k); }} onShare={()=>{}} onToast={onToast} />; })()}
      </Modal>
    </div>
  );
}

// ─── Events Page ───
function EventsPage({ state, user, onToast, onNewEvent, onEditEvent, onToggleEventStatus, onEditKitty, onContribute, onWithdraw, autoOpen, onBack }) {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => { if (autoOpen) { setModalOpen(true); } }, []);
  const [viewEvent,    setViewEvent]    = useState(null);
  const [manageEvent,  setManageEvent]  = useState(null);
  const [shareEvent,   setShareEvent]   = useState(null);
  const [editKittyE,       setEditKittyE]       = useState(null);
  const [viewKittyE,       setViewKittyE]       = useState(null);
  const [withdrawKittyE,   setWithdrawKittyE]   = useState(null);
  const [contributeKittyE, setContributeKittyE] = useState(null);
  const [membersKittyE,    setMembersKittyE]    = useState(null);

  const events      = state.events.filter(e => e.createdBy === user.email);
  const eventKitties = state.kitties.filter(k => k.createdBy === user.email && k.feeCategory === "events");
  const totalCount  = events.length + eventKitties.length;

  return (
    <div className="page-wrap">
      <div className="page-hero">
        <div><div className="ph-title">My Events</div><div className="ph-sub">Fundraisers & community events</div></div>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <div className="ph-badge ph-badge-sky">{totalCount}</div>
          <button onClick={onBack} style={{width:34,height:34,border:"1.5px solid var(--border)",borderRadius:10,background:"var(--surface2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <button className="new-event-btn" onClick={() => setModalOpen(true)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Create New Event
      </button>

      {totalCount === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap sky">{Icons.events}</div>
          <div className="empty-title">No events yet</div>
          <div className="empty-sub">Organise fundraisers, harambees and community events with M-Pamoja.</div>
          <button className="btn btn-sky btn-sm" onClick={() => setModalOpen(true)}>+ Create Event</button>
        </div>
      ) : (<>

        {/* ── Event Calendar Cards ── */}
        {events.length > 0 && (<>
          <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em",margin:"0.5rem 0 0.6rem",paddingBottom:"0.4rem",borderBottom:"1.5px solid var(--border)"}}>
            📅 Events · {events.length}
          </div>
          {events.map(ev => {
            const isActive = ev.status !== "disabled";
            const liveEv = state.events.find(e=>e.id===ev.id)||ev;
            return (
              <div key={ev.id} className="event-card" style={{cursor:"pointer",opacity:isActive?1:0.65}} onClick={() => setViewEvent(liveEv)}>
                <div className="event-date-box" style={!isActive?{background:"var(--surface3)",borderColor:"var(--border)"}:{}}>
                  <div className="event-date-day" style={!isActive?{color:"var(--text3)"}:{}}>{ev.date}</div>
                  <div className="event-date-mon" style={!isActive?{color:"var(--text3)"}:{}}>{ev.month}</div>
                </div>
                <div className="event-info">
                  <div className="event-name">{ev.name}</div>
                  <div className="event-meta">
                    <span>📍 {ev.location}</span><br/>
                    <span>👥 {ev.attendees} / {ev.target} attending</span>
                  </div>
                  <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",alignItems:"center"}} onClick={e=>e.stopPropagation()}>
                    <div className={`event-pill ${isActive?"event-pill-active":"event-pill-disabled"}`}>{isActive?"● Active":"● Disabled"}</div>
                    <button className="btn btn-sky btn-sm" onClick={() => setShareEvent(liveEv)}>Share</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setManageEvent(liveEv)}>Manage</button>
                  </div>
                </div>
              </div>
            );
          })}
        </>)}

        {/* ── Event Kitties ── */}
        {eventKitties.length > 0 && (<>
          <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em",margin:"1.1rem 0 0.6rem",paddingBottom:"0.4rem",borderBottom:"1.5px solid var(--border)"}}>
            🎟️ Event Kitties · {eventKitties.length}
          </div>
          {eventKitties.map(k => {
            const pct = Math.round(((k.raised||0)/(k.goal||1))*100);
            const { fee, pct: fp } = getKittyFee(k);
            return (
              <div key={k.id} className="kitty-list-card" style={{cursor:"pointer"}} onClick={() => setViewKittyE(k)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.4rem"}}>
                  <div style={{flex:1,marginRight:"0.5rem"}}>
                    <div style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:"0.58rem",fontWeight:700,color:"var(--sky)",background:"rgba(14,165,233,0.1)",borderRadius:20,padding:"2px 8px",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>🎟️ Events</div>
                    <div className="klc-name">{k.name}</div>
                    <div style={{fontSize:"0.65rem",color:"var(--text3)",marginTop:2}}>Created {k.created}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:"1.05rem",fontWeight:800,color:"var(--sky)",fontFamily:"var(--mono)",letterSpacing:"-0.03em"}}>KES {fmt(k.raised||0)}</div>
                    <div style={{fontSize:"0.62rem",color:"var(--text3)"}}>of KES {fmt(k.goal)}</div>
                  </div>
                </div>
                <div className="prog-track" style={{marginBottom:"0.3rem"}}><div className="prog-fill" style={{width:`${Math.min(100,pct)}%`,background:"var(--sky)"}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",color:"var(--text3)",marginBottom:"0.6rem"}}>
                  <span style={{color:pct>=100?"var(--emerald)":"var(--sky)",fontWeight:700}}>{pct}% funded</span>
                  <span>👥 {k.contributors||0} · Fee KES {fmt(fee)} ({fp}%)</span>
                </div>
                  <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",alignItems:"center"}} onClick={e=>e.stopPropagation()}>
                    <button className="btn btn-sky btn-sm" onClick={() => setContributeKittyE(k)}>Contribute</button>
                    <button className="btn btn-green btn-sm" onClick={() => setWithdrawKittyE(k)}>💸 Withdraw</button>
                    <button className="btn btn-violet btn-sm" onClick={() => setMembersKittyE(k)}>👥 Members</button>
                    <button className="btn btn-amber btn-sm" onClick={() => setEditKittyE(k)}>Edit</button>
                  </div>





              </div>
            );
          })}
        </>)}
      </>)}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <NewEventForm onSubmit={(form) => { onNewEvent(form); setModalOpen(false); onToast("Event Created! 🎊", `"${form.name}" is scheduled`); }} onClose={() => setModalOpen(false)} />
      </Modal>
      <Modal open={!!viewEvent} onClose={() => setViewEvent(null)}>
        {viewEvent && (() => {
          const live = state.events.find(e=>e.id===viewEvent.id)||viewEvent;
          return <EventDetailModal event={live} onClose={() => setViewEvent(null)} onManage={(ev) => setManageEvent(ev)} onShare={(ev) => setShareEvent(ev)} />;
        })()}
      </Modal>
      <Modal open={!!manageEvent} onClose={() => setManageEvent(null)}>
        {manageEvent && (() => {
          const liveEvent = state.events.find(e => e.id === manageEvent.id) || manageEvent;
          return <ManageEventModal
            event={liveEvent}
            onClose={() => setManageEvent(null)}
            onToggleStatus={(id) => {
              onToggleEventStatus(id);
              const ev = state.events.find(e=>e.id===id);
              const wasActive = ev?.status !== "disabled";
              onToast(wasActive ? "Event Disabled" : "Event Activated ✅", wasActive ? "Event is now hidden" : "Event is now live");
              setManageEvent(null);
            }}
            onSave={(id, updates) => { onEditEvent(id, updates); onToast("Event Updated ✅", `"${updates.name}" saved`); }}
          />;
        })()}
      </Modal>
      <Modal open={!!shareEvent} onClose={() => setShareEvent(null)}>
        {shareEvent && <ShareEventModal event={shareEvent} onClose={() => setShareEvent(null)} />}
      </Modal>
      <Modal open={!!membersKittyE} onClose={() => setMembersKittyE(null)}>
        {membersKittyE && (() => { const live = state.kitties.find(k=>k.id===membersKittyE.id)||membersKittyE; return <KittyContributorsReport kitty={live} transactions={state.transactions} user={user} onBack={() => setMembersKittyE(null)} onWithdraw={(k)=>{ setMembersKittyE(null); setWithdrawKittyE(k); }} onContribute={(k)=>{ setMembersKittyE(null); setContributeKittyE(k); }} onShare={()=>{}} onToast={onToast} />; })()}
      </Modal>
      <Modal open={!!editKittyE} onClose={() => setEditKittyE(null)}>
        {editKittyE && <EditKittyForm kitty={editKittyE} onSubmit={(updates) => { if(onEditKitty) onEditKitty(editKittyE.id, updates); setEditKittyE(null); onToast("Kitty Updated ✅", `"${updates.name}" saved`); }} onClose={() => setEditKittyE(null)} />}
      </Modal>
      <Modal open={!!viewKittyE} onClose={() => setViewKittyE(null)} hideClose>
        {viewKittyE && (() => { const live = state.kitties.find(k=>k.id===viewKittyE.id)||viewKittyE; return <KittyDetailModal kitty={live} user={user} transactions={state.transactions} onClose={() => setViewKittyE(null)} onWithdraw={(id,net,fee,phone,partial) => { if(onWithdraw) onWithdraw(id,net,fee,phone,partial); }} onContribute={(id,amt,name,phone) => { if(onContribute) onContribute(id,amt,name,phone); }} onEditKitty={onEditKitty} onToast={onToast} />; })()}
      </Modal>
      <Modal open={!!contributeKittyE} onClose={() => setContributeKittyE(null)}>
        {contributeKittyE && <KittyContributeModal kitty={contributeKittyE} user={user} onClose={() => setContributeKittyE(null)} onConfirm={(id,amt,name,phone) => { if(onContribute) onContribute(id,amt,name,phone); setContributeKittyE(null); onToast("Contributed! 🎉", `KES ${fmt(amt)} sent`); }} />}
      </Modal>
      <Modal open={!!withdrawKittyE} onClose={() => setWithdrawKittyE(null)}>
        {withdrawKittyE && (() => { const live = state.kitties.find(k=>k.id===withdrawKittyE.id)||withdrawKittyE; return <KittyWithdrawModal kitty={live} user={user} onClose={() => setWithdrawKittyE(null)} onConfirm={(id,net,fee,phone,partial) => { if(onWithdraw) onWithdraw(id,net,fee,phone,partial); setWithdrawKittyE(null); onToast("Withdrawal Sent! 💸", `KES ${fmt(net)} is on its way`); }} />; })()}
      </Modal>
    </div>
  );
}

// ─── Contribute Page ───
function ContributePage({ state, user, onToast, onContribute }) {
  const [kitties, setKitties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [sel, setSel] = useState("");
  const [amount, setAmount] = useState("");
  const [contribName, setContribName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [method, setMethod] = useState("mpesa");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [stkOpen, setStkOpen] = useState(false);
  const [catCollapsed, setCatCollapsed] = useState({});
  // Chama-specific
  const [isLate, setIsLate] = useState(false);
  const [lateDays, setLateDays] = useState("");
  const [baseAmount, setBaseAmount] = useState("");

  // ── Fetch kitties from API when component mounts ──
  useEffect(() => {
    const fetchKitties = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('mpamoja_token');
        
        console.log('🔍 ContributePage: Fetching kitties...');
        
        if (!token) {
          console.warn('No token found, using state data');
          const userKitties = state.kitties.filter(k => 
            k.createdBy === user.email
          );
          console.log('📦 User kitties from state:', userKitties);
          setKitties(userKitties);
          if (userKitties.length > 0) {
            setSel(userKitties[0].id);
          }
          setLoading(false);
          return;
        }

        const response = await fetch('/api/kitties', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ ContributePage - All Kitties from API:', data);
          
          // Filter for user's kitties
          const userKitties = data.filter(k => {
            const isOwner = k.createdBy === user.email || 
                           k.creatorId === user.id || 
                           k.creator_id === user.id ||
                           k.creatorEmail === user.email;
            return isOwner;
          });
          
          console.log('👤 User kitties after filter:', userKitties);
          
          // Don't filter by category - show all kitties
          setKitties(userKitties);
          if (userKitties.length > 0) {
            console.log('🔑 Setting first kitty as selected:', userKitties[0].id);
            setSel(userKitties[0].id);
          } else {
            console.warn('No kitties found for user');
          }
        } else {
          console.error('API response not OK:', response.status);
          // Fallback to state data
          const userKitties = state.kitties.filter(k => 
            k.createdBy === user.email
          );
          setKitties(userKitties);
          if (userKitties.length > 0) {
            setSel(userKitties[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching kitties:', error);
        // Fallback to state data
        const userKitties = state.kitties.filter(k => 
          k.createdBy === user.email
        );
        setKitties(userKitties);
        if (userKitties.length > 0) {
          setSel(userKitties[0].id);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchKitties();
  }, [state.kitties, user.email, user.id]);

  // ── Debug: Log when kitties change ──
  useEffect(() => {
    console.log('📊 ContributePage - kitties updated:', kitties);
    console.log('📊 ContributePage - selected kitty ID:', sel);
  }, [kitties, sel]);

  const toggleCat = (key) => setCatCollapsed(c => ({ ...c, [key]: !c[key] }));

  const handleSelKitty = (id) => {
    console.log('🔄 Selecting kitty:', id);
    setSel(id);
    setStep(1);
    setAmount(""); setBaseAmount(""); setContribName("");
    setIsLate(false); setLateDays(""); setPhone(""); setPin("");
  };

  const selKitty = kitties.find(k => String(k.id) === String(sel));
  console.log('🎯 Selected kitty object:', selKitty);
  
  const kittyType = selKitty?.feeCategory || selKitty?.category || "contributions";
  const isChama = kittyType === "chama" || kittyType === "Chama";

  const displayName = anonymous ? "Anonymous" : (contribName.trim() || user.name);
  const isAirtel = method === "airtel";
  const needsPhone = method === "mpesa" || method === "airtel";

  // Chama penalty calc
  const hasPenalty = isChama && (selKitty?.penaltyValue > 0 || selKitty?.contributionAmount > 0);
  const parsedBase = parseFloat(isChama ? baseAmount : amount) || 0;
  const parsedDays = parseInt(lateDays) || 0;
  const calcPenalty = () => {
    if (!isChama || !isLate || parsedBase <= 0 || !selKitty?.penaltyValue) return 0;
    const units = selKitty.penaltyPerDay ? Math.max(1, parsedDays) : 1;
    return selKitty.penaltyType === "fixed"
      ? selKitty.penaltyValue * units
      : parsedBase * (selKitty.penaltyValue / 100) * units;
  };
  const penaltyAmt = calcPenalty();
  const totalChama = parsedBase + penaltyAmt;

  // Show all kitties in one group for simplicity
  const catGroups = [
    { key: "all", label: "All Kitties", emoji: "🐾", color: "var(--brand)",  bg: "var(--brand-light)",  border: "rgba(79,70,229,0.25)" },
  ];

  const goToReview = () => {
    if (needsPhone && !phone.trim()) { onToast("Phone required", "Please enter your payment number"); return; }
    if (needsPhone && phone.replace(/\D/g,"").length < 9) { onToast("Invalid number", "Enter a valid 10-digit number"); return; }
    setStep(3);
  };

  const finishPayment = () => {
    const amt = isChama ? totalChama : parseFloat(amount);
    setStkOpen(false); setPin(""); setStep(1);
    onContribute(Number(sel), isChama ? parsedBase : amt, displayName, phone);
    setAmount(""); setBaseAmount(""); setContribName(""); setPhone(""); setIsLate(false); setLateDays("");
    onToast("Payment Successful! 🎉", `KES ${fmt(isChama ? parsedBase : amt)} contributed${anonymous ? " anonymously" : ` as ${displayName}`}`);
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="contrib-wrap">
        <div className="steps-indicator">
          {[1,2,3].map(s => <div key={s} className={`step-dot${step >= s ? " active" : ""}`} />)}
        </div>
        <div className="contrib-card">
          <div style={{textAlign:"center", padding:"2rem"}}>
            <div style={{fontSize:"1.2rem", marginBottom:"0.5rem"}}>🔄</div>
            <div style={{color:"var(--text3)"}}>Loading your kitties...</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ──
  return (
    <div className="contrib-wrap">
      <div className="steps-indicator">
        {[1,2,3].map(s => <div key={s} className={`step-dot${step >= s ? " active" : ""}`} />)}
      </div>

      {step === 1 && (
        <div className="contrib-card">
          <div className="cc-title">Make a Contribution</div>

          {/* ── Kitty picker ── */}
          <div style={{marginBottom:"1rem"}}>
            <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.5rem",letterSpacing:"0.01em"}}>
              Select Kitty ({kitties.length} available)
            </div>
            {kitties.length === 0 ? (
              <div style={{textAlign:"center",padding:"1.5rem",color:"var(--text3)",fontSize:"0.78rem",background:"var(--surface2)",borderRadius:12,border:"1px solid var(--border)"}}>
                No kitties yet. Create one first.
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:"0.45rem"}}>
                {catGroups.map(g => {
                  // Show all kitties
                  const items = kitties;
                  if (items.length === 0) return null;
                  const isOpen = !catCollapsed[g.key] || true; // Always open
                  return (
                    <div key={g.key} style={{borderRadius:12,border:`1.5px solid ${g.border}`,overflow:"hidden"}}>
                      <div style={{
                        width:"100%",display:"flex",alignItems:"center",gap:7,
                        padding:"0.55rem 0.75rem",
                        background: g.bg,
                        border:"none",
                      }}>
                        <div style={{width:24,height:24,borderRadius:7,background: g.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",flexShrink:0}}>{g.emoji}</div>
                        <span style={{fontSize:"0.7rem",fontWeight:800,color: g.color,textTransform:"uppercase",letterSpacing:"0.05em",flex:1,textAlign:"left"}}>{g.label}</span>
                        <span style={{fontSize:"0.58rem",fontWeight:700,color: g.color,background: `${g.color}18`,borderRadius:20,padding:"1px 7px"}}>{items.length}</span>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:2,padding:"4px 6px 6px"}}>
                        {items.map(k => {
                          const pct = Math.round(((k.raised||0)/(k.goal||1))*100);
                          const isSelected = String(sel) === String(k.id);
                          return (
                            <button key={k.id} onClick={() => handleSelKitty(k.id)} style={{
                              display:"flex",alignItems:"center",gap:"0.6rem",
                              padding:"0.6rem 0.7rem",borderRadius:10,
                              border:`1.5px solid ${isSelected ? g.color : "transparent"}`,
                              background: isSelected ? `${g.color}12` : "var(--surface)",
                              cursor:"pointer",fontFamily:"var(--font)",textAlign:"left",transition:"all 0.15s",width:"100%",
                            }}>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:"0.78rem",fontWeight:700,color: isSelected ? g.color : "var(--text)",lineHeight:1.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{k.name}</div>
                                <div style={{fontSize:"0.6rem",color:"var(--text3)",marginTop:2,display:"flex",gap:6}}>
                                  <span>KES {fmt(k.raised||0)} raised</span>
                                  <span style={{color: isSelected ? g.color : "var(--text3)",fontWeight:600}}>{pct}%</span>
                                </div>
                                <div style={{height:3,background:"var(--surface3)",borderRadius:4,marginTop:4,overflow:"hidden"}}>
                                  <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background: isSelected ? g.color : "var(--border)",borderRadius:4}}/>
                                </div>
                              </div>
                              {isSelected && (
                                <div style={{width:18,height:18,borderRadius:"50%",background:g.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Selected kitty identity banner ── */}
          {selKitty && (() => {
            const pct = Math.round(((selKitty.raised||0)/(selKitty.goal||1))*100);
            const catColor = isChama ? "var(--violet)" : "var(--brand)";
            const catEmoji = isChama ? "🤝" : "🎯";
            const catLabel = isChama ? "Chama" : "Contributions";
            const gradBg   = isChama ? "linear-gradient(135deg,#7C3AED,#4F46E5)" : "linear-gradient(135deg,#4F46E5,#7C3AED)";
            return (
              <div style={{
                background: gradBg,
                borderRadius:16,padding:"1rem 1.1rem",
                marginBottom:"1.1rem",color:"#fff",
                boxShadow: isChama ? "0 8px 24px rgba(124,58,237,0.28)" : "0 8px 24px rgba(79,70,229,0.28)",
                position:"relative",overflow:"hidden",
              }}>
                <div style={{position:"absolute",width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.07)",top:-30,right:-20,pointerEvents:"none"}}/>
                <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"3px 10px",fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"0.5rem"}}>
                  {catEmoji} {catLabel}
                </div>
                <div style={{fontSize:"1rem",fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.25,marginBottom:"0.1rem"}}>
                  {selKitty.name}
                </div>
                <div style={{fontSize:"0.62rem",opacity:0.75,marginBottom:"0.75rem"}}>
                  Created {selKitty.created} · {selKitty.contributors||0} contributor{(selKitty.contributors||0)!==1?"s":""}
                </div>
                <div style={{height:5,background:"rgba(255,255,255,0.25)",borderRadius:6,overflow:"hidden",marginBottom:"0.35rem"}}>
                  <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:"rgba(255,255,255,0.85)",borderRadius:6,transition:"width 0.6s"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",opacity:0.85}}>
                  <span><strong style={{fontSize:"0.8rem",opacity:1}}>KES {fmt(selKitty.raised||0)}</strong> raised</span>
                  <span style={{fontWeight:700}}>{pct}% of KES {fmt(selKitty.goal)}</span>
                </div>
                <div style={{marginTop:"0.7rem",paddingTop:"0.6rem",borderTop:"1px solid rgba(255,255,255,0.2)",fontSize:"0.68rem",fontWeight:600,opacity:0.9,display:"flex",alignItems:"center",gap:5}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  You are contributing to <strong style={{fontSize:"0.72rem"}}>{selKitty.name}</strong>
                </div>
              </div>
            );
          })()}
          
          {isChama && selKitty && (<>
            <div className="field">
              <label>Contribution Amount (KES){selKitty.contributionAmount > 0 && <span style={{fontWeight:400,color:"var(--text3)"}}> · Suggested KES {fmt(selKitty.contributionAmount)}</span>}</label>
              <input type="number" placeholder={selKitty.contributionAmount ? `e.g. ${selKitty.contributionAmount}` : "Enter amount"} min="10" value={baseAmount} onChange={e => setBaseAmount(e.target.value)} />
            </div>
            {selKitty.penaltyValue > 0 && (<>
              <div onClick={() => { setIsLate(l => !l); setLateDays(""); }}
                style={{display:"flex",alignItems:"flex-start",gap:"0.65rem",background:isLate?"#FFF7ED":"var(--surface2)",
                  border:`1.5px solid ${isLate?"rgba(245,158,11,0.4)":"var(--border)"}`,borderRadius:12,
                  padding:"0.75rem 0.85rem",cursor:"pointer",transition:"all 0.18s",marginBottom:"0.6rem"}}>
                <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${isLate?"var(--amber)":"var(--border)"}`,
                  background:isLate?"var(--amber)":"var(--surface)",display:"flex",alignItems:"center",
                  justifyContent:"center",flexShrink:0,marginTop:1,transition:"all 0.18s"}}>
                  {isLate && <span style={{color:"#fff",fontSize:"0.7rem",fontWeight:800}}>✓</span>}
                </div>
                <div>
                  <div style={{fontSize:"0.8rem",fontWeight:700,color:isLate?"var(--amber)":"var(--text)"}}>I'm paying late</div>
                  <div style={{fontSize:"0.67rem",color:"var(--text3)",marginTop:2,lineHeight:1.4}}>
                    Penalty: {selKitty.penaltyType==="fixed"?`KES ${selKitty.penaltyValue}`:`${selKitty.penaltyValue}%`}{selKitty.penaltyPerDay?" per day late":""}
                  </div>
                </div>
              </div>
              {isLate && selKitty.penaltyPerDay && (
                <div className="field" style={{marginBottom:"0.85rem"}}>
                  <label>Days Late</label>
                  <input type="number" placeholder="e.g. 3" min="1" value={lateDays} onChange={e => setLateDays(e.target.value)} />
                </div>
              )}
              {isLate && penaltyAmt > 0 && (
                <div style={{background:"#FFF7ED",border:"1.5px solid rgba(245,158,11,0.3)",borderRadius:10,padding:"0.65rem 0.85rem",marginBottom:"0.85rem",fontSize:"0.75rem"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{color:"var(--text2)"}}>Base contribution</span><span style={{fontWeight:700}}>KES {fmt(parsedBase)}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{color:"var(--amber)"}}>Late penalty</span><span style={{fontWeight:700,color:"var(--amber)"}}>+ KES {fmt(penaltyAmt)}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid rgba(245,158,11,0.2)",paddingTop:4}}>
                    <span style={{fontWeight:700}}>Total</span><span style={{fontWeight:800,color:"var(--amber)"}}>KES {fmt(totalChama)}</span>
                  </div>
                </div>
              )}
            </>)}
          </>)}

          {/* ── CONTRIBUTIONS kitty step 1: name + anonymous + amount ── */}
          {!isChama && (<>
            <div className="field"><label>Your Name</label>
              <input placeholder="Enter your name" value={contribName} onChange={e => setContribName(e.target.value)} disabled={anonymous} style={{opacity: anonymous ? 0.45 : 1}} />
            </div>
            <div className="anon-check-row" onClick={() => setAnonymous(a => !a)}>
              <div className={`anon-checkbox${anonymous ? " checked" : ""}`} />
              <div>
                <div className="anon-label">Contribute anonymously</div>
                <div className="anon-sub">Your name will be hidden from the public. The kitty owner will see "Anonymous".</div>
              </div>
            </div>
            <div className="field"><label>Amount (KES)</label>
              <input type="number" placeholder="Enter amount" min="10" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="amount-display">
              <div className="amount-display-lbl">You're contributing</div>
              <div className="amount-display-val">KES {fmt(parseFloat(amount) || 0)}</div>
            </div>
          </>)}

          <button className="confirm-btn" style={isChama?{background:"var(--grad-chama)",boxShadow:"0 8px 24px rgba(124,58,237,0.28)"}:{}} onClick={() => {
            if (isChama) {
              if (parsedBase < 10) { onToast("Invalid amount","Minimum is KES 10"); return; }
            } else {
              if ((parseFloat(amount) || 0) < 10) { onToast("Invalid amount","Minimum is KES 10"); return; }
              if (!anonymous && !contribName.trim()) { onToast("Name required","Please enter your name or contribute anonymously"); return; }
            }
            setStep(2);
          }}>Continue →</button>
        </div>
      )}

      {step === 2 && (
        <div className="contrib-card">
          <div className="cc-title">Payment Method</div>
          {isChama && (
            <div style={{background:"var(--violet-light)",borderRadius:12,padding:"0.7rem 0.9rem",marginBottom:"1rem",border:"1.5px solid rgba(124,58,237,0.15)",fontSize:"0.75rem",color:"var(--violet)",fontWeight:600}}>
              🤝 {selKitty?.name} · <strong>KES {fmt(totalChama)}</strong>{penaltyAmt > 0 ? ` (incl. KES ${fmt(penaltyAmt)} penalty)` : ""}
            </div>
          )}
          <div className="pay-methods">
            <div className={`pay-method${method === "mpesa" ? " active" : ""}`} onClick={() => { setMethod("mpesa"); setPhone(""); }}>
              <div className="pay-method-icon">📱</div><div className="pay-method-name">M-Pesa</div>
            </div>
            <div className={`pay-method${method === "airtel" ? " active-airtel" : ""}`} onClick={() => { setMethod("airtel"); setPhone(""); }}>
              <div className="pay-method-icon">🔴</div><div className="pay-method-name" style={method==="airtel"?{color:"#e4000f"}:{}}>Airtel Money</div>
            </div>
            <div className={`pay-method${method === "bank" ? " active" : ""}`} onClick={() => { setMethod("bank"); setPhone(""); }}>
              <div className="pay-method-icon">🏦</div><div className="pay-method-name">Bank</div>
            </div>
          </div>
          {method === "mpesa" && (
            <div className="field">
              <label>M-Pesa Number <span style={{color:"var(--rose)"}}>*</span></label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0712345678" type="tel" />
            </div>
          )}
          {method === "airtel" && (
            <div className="field">
              <label>Airtel Money Number <span style={{color:"var(--rose)"}}>*</span></label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0733123456" type="tel" />
              <div style={{marginTop:"0.4rem",fontSize:"0.68rem",color:"#e4000f",fontWeight:600}}>🔴 Airtel Money — Enter your Airtel number</div>
            </div>
          )}
          {method === "bank" && (
            <div style={{background:"var(--surface2)",borderRadius:12,padding:"0.85rem",border:"1.5px solid var(--border)",fontSize:"0.8rem",color:"var(--text2)",lineHeight:1.5}}>
              🏦 You'll receive bank transfer instructions after confirming.
            </div>
          )}
          <button className="confirm-btn" style={{marginTop:"1rem",...(isChama?{background:"var(--grad-chama)",boxShadow:"0 8px 24px rgba(124,58,237,0.28)"}:{})}} onClick={goToReview}>Review →</button>
          <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
          {needsPhone && (
            <div className="mpesa-sim">
              <div className="mpesa-sim-logo" style={isAirtel?{background:"#e4000f"}:{}}><span>{isAirtel?"A":"M"}</span>{isAirtel?"AIRTEL":"PESA"}</div>
              <div className="mpesa-msg">Enter your {isAirtel ? "Airtel Money" : "M-Pesa"} number above and click Review to proceed.</div>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="contrib-card">
          <div className="cc-title">Review & Confirm</div>
          <div className="summary-box">
            {[
              ["Kitty", selKitty?.name || "—"],
              ...(isChama ? [
                ["Base Amount", `KES ${fmt(parsedBase)}`],
                ...(penaltyAmt > 0 ? [["Late Penalty", `+ KES ${fmt(penaltyAmt)}`]] : []),
                ["Total", `KES ${fmt(totalChama)}`],
              ] : [
                ["Contributing as", displayName],
                ["Amount", `KES ${fmt(parseFloat(amount))}`],
                ["Total", `KES ${fmt(parseFloat(amount))}`],
              ]),
              ["Method", method === "mpesa" ? `M-Pesa (${maskPhone(phone)})` : method === "airtel" ? `Airtel Money (${maskPhone(phone)})` : "Bank Transfer"],
            ].map(([l, v], i, arr) => (
              <div key={i} className={`summary-row${i === arr.length-1 ? " total" : ""}`}>
                <span>{l}</span>
                <span style={l==="Late Penalty"?{color:"var(--amber)",fontWeight:700}:l==="Contributing as"&&anonymous?{color:"var(--text3)",fontStyle:"italic"}:{}}>{v}</span>
              </div>
            ))}
          </div>
          <button className="confirm-btn" style={isChama?{background:"var(--grad-chama)",boxShadow:"0 8px 24px rgba(124,58,237,0.28)"}:{}} onClick={() => {
            if (method === "mpesa" || method === "airtel") { setStkOpen(true); }
            else {
              const amt = isChama ? parsedBase : parseFloat(amount);
              onContribute(Number(sel), amt, displayName, "");
              onToast("Processing…","Bank transfer initiated");
              setStep(1); setAmount(""); setBaseAmount(""); setContribName(""); setIsLate(false); setLateDays("");
            }
          }}>Confirm & Pay →</button>
          <button className="back-btn" onClick={() => setStep(2)}>← Back</button>
        </div>
      )}

      {stkOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setStkOpen(false)}>
          <div className="modal-sheet">
            <span className="modal-handle" />
            <div className="cc-title" style={{marginBottom:"0.75rem"}}>{isAirtel ? "Airtel Money" : "M-Pesa"} Payment</div>
            <div style={{textAlign:"center",padding:"0.5rem 0 1rem"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>{isAirtel ? "🔴" : "📲"}</div>
              <div style={{fontSize:"0.82rem",color:"var(--text2)",lineHeight:1.5,marginBottom:"0.25rem"}}>
                Sending <strong>KES {fmt(isChama ? totalChama : parseFloat(amount))}</strong> from {maskPhone(phone)}
              </div>
              <div style={{fontSize:"0.75rem",color:"var(--text3)",marginBottom:"1rem"}}>Enter your {isAirtel?"Airtel Money":"M-Pesa"} PIN to complete</div>
              <div className="mpesa-pin-row">
                {[0,1,2,3].map(i => <div key={i} className={`pin-box${pin.length > i ? " filled" : ""}`} style={isAirtel&&pin.length>i?{borderColor:"#e4000f",background:"#fff5f5",color:"#e4000f"}:{}}>{pin.length > i ? "★" : "●"}</div>)}
              </div>
              <div className="keypad-grid">
                {["1","2","3","4","5","6","7","8","9","*","0","del"].map(k => (
                  <button key={k} className="key-btn" onClick={() => {
                    if (k === "del") { setPin(p => p.slice(0,-1)); return; }
                    if (pin.length < 4) {
                      const np = pin + k; setPin(np);
                      if (np.length === 4) setTimeout(finishPayment, 500);
                    }
                  }}>{k === "del" ? "⌫" : k}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Withdraw Page ───
function WithdrawPage({ state, user, onToast, onWithdraw }) {
  const kitties = state.kitties.filter(k => k.createdBy === user.email);
  const withdrawals = state.withdrawals.filter(w => w.ownerEmail === user.email);
  const [withdrawKitty, setWithdrawKitty] = useState(null);
  return (
    <div className="withdraw-wrap">
      <div className="fee-banner">
        <div className="fee-banner-title"><span style={{display:"flex"}}>{Icons.info}</span>Platform Fee Schedule</div>
        <div style={{fontSize:"0.65rem",fontWeight:700,color:"var(--brand)",textTransform:"uppercase",letterSpacing:"0.06em",margin:"0.4rem 0 0.2rem"}}>🎯 Contributions Kitty</div>
        <div className="fee-row"><span>Up to KES 100,000 raised</span><strong>2.2% of amount raised</strong></div>
        <div className="fee-row"><span>Above KES 100,000 raised</span><strong>Fixed KES 2,400</strong></div>
        <div style={{fontSize:"0.65rem",fontWeight:700,color:"var(--violet)",textTransform:"uppercase",letterSpacing:"0.06em",margin:"0.55rem 0 0.2rem"}}>🤝 Chama</div>
        <div className="fee-row"><span>Up to KES 55,556 raised</span><strong>1.8% of amount raised</strong></div>
        <div className="fee-row"><span>Above KES 55,556 raised</span><strong>Fixed KES 1,000</strong></div>
        <div style={{fontSize:"0.65rem",fontWeight:700,color:"var(--sky)",textTransform:"uppercase",letterSpacing:"0.06em",margin:"0.55rem 0 0.2rem"}}>🎟️ Events</div>
        <div className="fee-row"><span>All amounts</span><strong>3.5% of amount raised (no cap)</strong></div>
      </div>
      {kitties.length === 0 && (
        <div className="empty-state" style={{marginBottom:"1rem"}}>
          <div className="empty-icon-wrap">{Icons.transfer}</div>
          <div className="empty-title">No kitties yet</div>
          <div className="empty-sub">Create a kitty and collect contributions before withdrawing.</div>
        </div>
      )}
      {kitties.map(k => {
        const { fee, pct } = getKittyFee(k);
        const net = (k.raised || 0) - fee;
        return (
          <div key={k.id} className="wd-kitty-card">
            <div className="wkc-top"><div className="wkc-name">{k.name}</div><div className="wkc-avail">KES {fmt(k.raised || 0)}</div></div>
            <div className="wkc-fee">Platform fee: KES {fmt(fee)} ({pct}%) · Net: KES {fmt(net)}</div>
            <div className="prog-track"><div className="prog-fill" style={{width:`${Math.min(100,Math.round(((k.raised||0)/(k.goal||1))*100))}%`}} /></div>
            <button className="wkc-btn" onClick={() => setWithdrawKitty(k)}>
              Withdraw →
            </button>
          </div>
        );
      })}
      <div className="wd-history-title">Withdrawal History</div>
      {withdrawals.length === 0 && <div style={{fontSize:"0.78rem",color:"var(--text3)",textAlign:"center",padding:"1rem"}}>No withdrawals yet</div>}
      {withdrawals.map((w,i) => (
        <div key={i} className="wd-hist-item">
          <div className="wd-hist-icon">{Icons.transfer}</div>
          <div style={{flex:1,minWidth:0}}>
            <div className="wd-hist-name">{w.kitty}</div>
            <div className="wd-hist-date">{w.date}</div>
            <span className="wd-hist-pill">Sent</span>
          </div>
          <div className="wd-hist-amt">
            <div className="wd-hist-net">KES {fmt(w.net)}</div>
            <div className="wd-hist-fee">Fee: KES {fmt(w.fee)}</div>
          </div>
        </div>
      ))}
      <Modal open={!!withdrawKitty} onClose={() => setWithdrawKitty(null)}>
        {withdrawKitty && (
          <KittyWithdrawModal
            kitty={withdrawKitty}
            user={user}
            onClose={() => setWithdrawKitty(null)}
            onConfirm={(k, net, fee, phone, partial) => {
              onWithdraw(k.id, net, fee, phone, partial);
              onToast("Withdrawal Sent! 💸", `KES ${fmt(net)} processing via ${phone}`);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

// ─── WhatsApp Page ───
function WhatsappPage({ state, user, onToast }) {
  const [kitties, setKitties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selKitty, setSelKitty] = useState("");
  const [group, setGroup] = useState("Support Group");
  const [includeLink, setIncludeLink] = useState(true);
  const [includePaybill, setIncludePaybill] = useState(true);
  const [manualPaybill, setManualPaybill] = useState("");
  const [manualAccNo, setManualAccNo] = useState("");
  const [showContribs, setShowContribs] = useState(false);
  const [waCollapsed, setWaCollapsed] = useState({});

  // ── Fetch kitties from API when component mounts ──
  useEffect(() => {
    const fetchKitties = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('mpamoja_token');
        
        if (!token) {
          console.warn('No token found, using state data');
          const userKitties = state.kitties.filter(k => k.createdBy === user.email);
          setKitties(userKitties);
          if (userKitties.length > 0) {
            setSelKitty(userKitties[0].id);
            setGroup(userKitties[0].name);
          }
          setLoading(false);
          return;
        }

        const response = await fetch('/api/kitties', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ WhatsApp - Kitties from API:', data);
          
          // Filter for user's kitties
          const userKitties = data.filter(k => 
            k.createdBy === user.email || 
            k.creatorId === user.id || 
            k.creator_id === user.id
          );
          
          setKitties(userKitties);
          if (userKitties.length > 0) {
            setSelKitty(userKitties[0].id);
            setGroup(userKitties[0].name);
          }
        } else {
          // Fallback to state data
          const userKitties = state.kitties.filter(k => k.createdBy === user.email);
          setKitties(userKitties);
          if (userKitties.length > 0) {
            setSelKitty(userKitties[0].id);
            setGroup(userKitties[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching kitties:', error);
        // Fallback to state data
        const userKitties = state.kitties.filter(k => k.createdBy === user.email);
        setKitties(userKitties);
        if (userKitties.length > 0) {
          setSelKitty(userKitties[0].id);
          setGroup(userKitties[0].name);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchKitties();
  }, [state.kitties, user.email, user.id]);

  const getKitty = () => kitties.find(x => String(x.id) === String(selKitty));

  const handleSelKitty = (id) => {
    setSelKitty(id);
    const k = kitties.find(x => String(x.id) === String(id));
    if (k) setGroup(k.name);
    setShowContribs(false);
  };

  // Resolve payment details — use kitty's saved data, else fall back to manual entry
  const getPaymentLine = (k) => {
    if (!k) return null;
    const pb = k.paybill || manualPaybill;
    const acc = k.accountNo || manualAccNo || k.id;
    if (k.payChannel === "Paybill" && pb) return `Paybill: *${pb}*\n\tAccount No: *${acc}*`;
    if (k.payChannel === "Till" && k.tillNo) return `Till No: *${k.tillNo}*`;
    if (k.payChannel === "Mobile" && k.mobile) return `M-Pesa: *${k.mobile}*`;
    // Fall back to manual if provided
    if (manualPaybill) return `Paybill: *${manualPaybill}*\n\tAccount No: *${manualAccNo || k.id}*`;
    return null;
  };

  const buildReport = (k) => {
    if (!k) return "";
    const allTxs   = state.transactions.filter(t => t.kitty === k.name);
    const contribs = allTxs.filter(t => t.type === "Contribution");
    const wds      = allTxs.filter(t => t.type === "Withdrawal");

    const totalIn  = contribs.reduce((s, t) => s + (t.gross || 0), 0);
    const totalOut = wds.reduce((s, t) => s + (t.gross || 0), 0);
    const balance  = totalIn - totalOut;
    const goal     = k.goal || 1;

    const raised   = k.raised || 0;
    const pct      = Math.round((raised / goal) * 100);
    const pctDisplay = pct.toFixed(1);

    const { fee: platformFee, pct: feePct } = getKittyFee(k);
    const netAfterFee = Math.max(0, raised - platformFee);
    const sep = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

    let msg = `*${k.name}*\n\n`;

    // ── Contributions ──
    msg += `     𝗖𝗢𝗡𝗧𝗥𝗜𝗕𝗨𝗧𝗜𝗢𝗡𝗦\n`;
    msg += `${sep}\n`;
    if (contribs.length === 0) {
      msg += `_(No contributions yet — be the first!)_\n`;
    } else {
      contribs.forEach((t, i) => {
        msg += `${i + 1}. ${t.name || "Anonymous"}:  KES ${fmt(t.gross || 0)}\n`;
      });
    }

    // ── Withdrawals (if any) ──
    if (wds.length > 0) {
      msg += `\n     𝗪𝗜𝗧𝗛𝗗𝗥𝗔𝗪𝗔𝗟𝗦\n`;
      msg += `${sep}\n`;
      wds.forEach((t, i) => {
        msg += `${i + 1}. ${t.name || "Admin"}:  − KES ${fmt(t.gross || 0)}${t.fee > 0 ? ` (fee: KES ${fmt(t.fee)})` : ""}\n`;
      });
    }

    // ── Summary ──
    msg += `${sep}\n`;
    msg += `𝗧𝗼𝘁𝗮𝗹 𝗥𝗮𝗶𝘀𝗲𝗱: *KES ${fmt(raised)}*\n`;
    if (wds.length > 0) {
      msg += `𝗧𝗼𝘁𝗮𝗹 𝗪𝗶𝘁𝗵𝗱𝗿𝗮𝘄𝗻: *− KES ${fmt(totalOut)}*\n`;
      msg += `𝗡𝗲𝘁 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: *KES ${fmt(balance)}*\n`;
    }
    msg += `𝗚𝗼𝗮𝗹: KES ${fmt(goal)}\n`;
    msg += `𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺 𝗙𝗲𝗲 (${feePct}%): − KES ${fmt(platformFee)}\n`;
    msg += `𝗡𝗲𝘁 𝗣𝗮𝘆𝗼𝘂𝘁: *KES ${fmt(netAfterFee)}*\n`;

    // ── Progress bar ──
    const filled = Math.min(10, Math.round(pct / 10));
    const bar = "🟩".repeat(filled) + "⬜".repeat(10 - filled);
    msg += `*Progress:* 📊 ${pctDisplay}%\n${bar}\n`;
    msg += `${sep}\n`;

    // ── Payment options ──
    const kittyLink = `https://mpamoja.com/kitty/${k.id}/`;
    if (includeLink) {
      msg += `\n💳 *Contribute here:*\n👉 ${kittyLink}\n`;
    }
    const payLine = getPaymentLine(k);
    if (includePaybill && payLine) {
      msg += `\nOR:\t${payLine}\n`;
    }

    msg += `\n_Sharing is caring! 💖 Let your friends know about M-Pamoja and help them manage their chamas like a pro!_`;
    return msg;
  };

  const kitty = getKitty();
  const reportText = buildReport(kitty);
  const hasPayDetails = kitty && (kitty.paybill || kitty.tillNo || kitty.mobile);
  const showManualPaybill = includePaybill && !hasPayDetails;

  const openWhatsApp = () => {
    if (!kitty) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(reportText)}`, "_blank");
  };

  const copyReport = () => {
    navigator.clipboard?.writeText(reportText).then(() => onToast("Copied! 📋", "Report copied to clipboard"));
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="wa-wrap">
        <div className="wa-form-card">
          <div style={{textAlign:"center", padding:"2rem"}}>
            <div style={{fontSize:"1.2rem", marginBottom:"0.5rem"}}>🔄</div>
            <div style={{color:"var(--text3)"}}>Loading your kitties...</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ──
  return (
    <div className="wa-wrap">
      <div className="wa-form-card">
        <div className="cc-title">📤 WhatsApp Report</div>

        {/* ── Categorised collapsible kitty picker ── */}
        {(() => {
          const waGroups = [
            { key: "contributions", label: "Contributions", emoji: "🎯", color: "var(--brand)",  bg: "var(--brand-light)",  border: "rgba(79,70,229,0.25)"  },
            { key: "chama",         label: "Chama",         emoji: "🤝", color: "var(--violet)", bg: "var(--violet-light)", border: "rgba(124,58,237,0.25)" },
            { key: "events",        label: "Events",        emoji: "🎟️", color: "var(--sky)",    bg: "var(--sky-light)",    border: "rgba(14,165,233,0.25)" },
          ];
          return (
            <div style={{marginBottom:"0.85rem"}}>
              <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.5rem",letterSpacing:"0.01em"}}>Select Kitty</div>
              {kitties.length === 0 ? (
                <div style={{textAlign:"center",padding:"1.2rem",color:"var(--text3)",fontSize:"0.78rem",background:"var(--surface2)",borderRadius:12,border:"1px solid var(--border)"}}>
                  No kitties yet. Create one first!
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
                  {waGroups.map(g => {
                    const items = kitties.filter(k => (k.feeCategory||"contributions") === g.key);
                    if (items.length === 0) return null;
                    const isOpen = !waCollapsed[g.key];
                    return (
                      <div key={g.key} style={{borderRadius:12,border:`1.5px solid ${g.border}`,overflow:"hidden"}}>
                        <button onClick={() => setWaCollapsed(c => ({...c, [g.key]: !c[g.key]}))} style={{
                          width:"100%",display:"flex",alignItems:"center",gap:7,padding:"0.55rem 0.75rem",
                          background: isOpen ? g.bg : "var(--surface2)",border:"none",cursor:"pointer",fontFamily:"var(--font)",transition:"background 0.18s",
                        }}>
                          <div style={{width:24,height:24,borderRadius:7,background: isOpen ? g.color : "var(--surface3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",flexShrink:0,transition:"background 0.18s"}}>{g.emoji}</div>
                          <span style={{fontSize:"0.7rem",fontWeight:800,color: isOpen ? g.color : "var(--text2)",textTransform:"uppercase",letterSpacing:"0.05em",flex:1,textAlign:"left"}}>{g.label}</span>
                          <span style={{fontSize:"0.58rem",fontWeight:700,color: isOpen ? g.color : "var(--text3)",background: isOpen ? `${g.color}18` : "var(--surface3)",borderRadius:20,padding:"1px 7px"}}>{items.length}</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isOpen ? g.color : "var(--text3)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            style={{flexShrink:0,transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",transition:"transform 0.22s"}}>
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </button>
                        {isOpen && (
                          <div style={{display:"flex",flexDirection:"column",gap:2,padding:"4px 6px 6px"}}>
                            {items.map(k => {
                              const pct = Math.round(((k.raised||0)/(k.goal||1))*100);
                              const isSelected = String(selKitty) === String(k.id);
                              return (
                                <button key={k.id} onClick={() => handleSelKitty(k.id)} style={{
                                  display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.6rem 0.7rem",
                                  borderRadius:10,border:`1.5px solid ${isSelected ? g.color : "transparent"}`,
                                  background: isSelected ? `${g.color}12` : "var(--surface)",
                                  cursor:"pointer",fontFamily:"var(--font)",textAlign:"left",transition:"all 0.15s",
                                }}>
                                  <div style={{flex:1,minWidth:0}}>
                                    <div style={{fontSize:"0.78rem",fontWeight:700,color: isSelected ? g.color : "var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{k.name}</div>
                                    <div style={{fontSize:"0.6rem",color:"var(--text3)",marginTop:2,display:"flex",gap:6}}>
                                      <span>KES {fmt(k.raised||0)}</span>
                                      <span style={{color: isSelected ? g.color : "var(--text3)",fontWeight:600}}>{pct}%</span>
                                    </div>
                                    <div style={{height:3,background:"var(--surface3)",borderRadius:4,marginTop:3,overflow:"hidden"}}>
                                      <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background: isSelected ? g.color : "var(--border)",borderRadius:4}}/>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <div style={{width:18,height:18,borderRadius:"50%",background:g.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── Contributors quick-view link ── */}
        {kitty && (() => {
          const contribs = state.transactions.filter(t => t.kitty === kitty.name && t.type === "Contribution");
          return (
            <>
              <button onClick={() => setShowContribs(true)} style={{
                display:"flex",alignItems:"center",gap:6,
                background:"var(--brand-light)",border:"1.5px solid rgba(79,70,229,0.2)",
                borderRadius:10,padding:"0.5rem 0.9rem",
                fontSize:"0.75rem",fontWeight:700,color:"var(--brand)",
                cursor:"pointer",fontFamily:"var(--font)",marginBottom:"0.9rem",width:"100%",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                👥 View Contributors ({contribs.length})
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:"auto"}}><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              <Modal open={showContribs} onClose={() => setShowContribs(false)}>
                <div>
                  <div className="cc-title" style={{marginBottom:"0.25rem"}}>👥 Contributors</div>
                  <div style={{fontSize:"0.7rem",color:"var(--text3)",marginBottom:"1rem"}}>{kitty.name} · {contribs.length} contributor{contribs.length!==1?"s":""}</div>
                  {contribs.length === 0 ? (
                    <div style={{textAlign:"center",padding:"2rem 1rem",color:"var(--text3)",fontSize:"0.82rem"}}>No contributions yet for this kitty.</div>
                  ) : (
                    <div style={{display:"flex",flexDirection:"column",gap:"0.45rem",maxHeight:"55vh",overflowY:"auto"}}>
                      {contribs.map((t, i) => (
                        <div key={i} style={{
                          display:"flex",alignItems:"center",justifyContent:"space-between",
                          background:"var(--surface2)",borderRadius:12,padding:"0.65rem 0.85rem",
                          border:"1px solid var(--border)",
                        }}>
                          <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
                            <div style={{
                              width:32,height:32,borderRadius:"50%",
                              background:"var(--brand-light)",
                              display:"flex",alignItems:"center",justifyContent:"center",
                              fontSize:"0.72rem",fontWeight:800,color:"var(--brand)",flexShrink:0,
                            }}>{(t.name||"?")[0].toUpperCase()}</div>
                            <div>
                              <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--text)"}}>{t.name||"Anonymous"}</div>
                              <div style={{fontSize:"0.62rem",color:"var(--text3)"}}>{t.phone||""} · {t.time||""}</div>
                            </div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontSize:"0.82rem",fontWeight:800,color:"var(--emerald)"}}>KES {fmt(t.gross||0)}</div>
                            <div style={{fontSize:"0.6rem",color:"var(--text3)"}}>{t.ref||""}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{marginTop:"0.85rem",padding:"0.6rem 0.75rem",background:"var(--surface2)",borderRadius:10,display:"flex",justifyContent:"space-between",fontSize:"0.72rem",fontWeight:700}}>
                    <span style={{color:"var(--text2)"}}>Total raised</span>
                    <span style={{color:"var(--brand)"}}>KES {fmt(contribs.reduce((s,t)=>s+(t.gross||0),0))}</span>
                  </div>
                  <button className="back-btn" style={{marginTop:"0.75rem"}} onClick={() => setShowContribs(false)}>Close</button>
                </div>
              </Modal>
            </>
          );
        })()}

        <div className="field">
          <label>WhatsApp Group Name</label>
          <input value={group} onChange={e => setGroup(e.target.value)} placeholder="e.g. Harambee Fund Group" />
        </div>

        {/* Include toggles */}
        <div style={{marginBottom:"0.85rem"}}>
          <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.5rem",letterSpacing:"0.01em"}}>Include in Report</div>
          {[
            { label: "Contribution Link", emoji: "🔗", val: includeLink, set: setIncludeLink },
            { label: "Paybill / Payment Details", emoji: "💳", val: includePaybill, set: setIncludePaybill },
          ].map((opt, i) => (
            <div key={i} onClick={() => opt.set(v => !v)}
              style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.55rem 0.75rem",
                borderRadius:12,border:`1.5px solid ${opt.val?"var(--brand)":"var(--border)"}`,
                background:opt.val?"var(--brand-light)":"var(--surface2)",
                cursor:"pointer",marginBottom:"0.4rem",transition:"all 0.18s"}}>
              <div style={{width:20,height:20,borderRadius:6,
                border:`2px solid ${opt.val?"var(--brand)":"var(--border)"}`,
                background:opt.val?"var(--brand)":"transparent",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {opt.val && <span style={{color:"#fff",fontSize:"0.65rem",fontWeight:800}}>✓</span>}
              </div>
              <span style={{fontSize:"0.75rem",fontWeight:600,color:opt.val?"var(--brand)":"var(--text2)"}}>{opt.emoji} {opt.label}</span>
            </div>
          ))}
        </div>

        {/* Manual paybill entry if kitty has no payment details saved */}
        {showManualPaybill && (
          <div style={{background:"#FFFBEB",border:"1.5px solid #FDE68A",borderRadius:12,padding:"0.75rem",marginBottom:"0.85rem"}}>
            <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--amber)",marginBottom:"0.5rem"}}>⚠️ No payment details saved for this kitty — enter manually:</div>
            <div style={{display:"flex",gap:"0.5rem"}}>
              <div className="field" style={{flex:1,marginBottom:0}}>
                <label style={{fontSize:"0.65rem"}}>Paybill No.</label>
                <input value={manualPaybill} onChange={e => setManualPaybill(e.target.value)} placeholder="e.g. 4990390" style={{fontSize:"0.78rem",padding:"0.4rem 0.6rem"}} />
              </div>
              <div className="field" style={{flex:1,marginBottom:0}}>
                <label style={{fontSize:"0.65rem"}}>Account No.</label>
                <input value={manualAccNo} onChange={e => setManualAccNo(e.target.value)} placeholder="e.g. 8722" style={{fontSize:"0.78rem",padding:"0.4rem 0.6rem"}} />
              </div>
            </div>
          </div>
        )}

        {/* Show detected payment method */}
        {includePaybill && hasPayDetails && kitty && (
          <div style={{background:"var(--emerald-light)",border:"1.5px solid rgba(16,185,129,0.25)",borderRadius:12,padding:"0.6rem 0.75rem",marginBottom:"0.85rem",fontSize:"0.72rem",color:"#065F46",fontWeight:600}}>
            ✅ Payment details from kitty:{" "}
            {kitty.payChannel === "Paybill" && `Paybill ${kitty.paybill} · Acc ${kitty.accountNo || kitty.id}`}
            {kitty.payChannel === "Till" && `Till No. ${kitty.tillNo}`}
            {kitty.payChannel === "Mobile" && `M-Pesa ${kitty.mobile}`}
          </div>
        )}

        {/* ── WhatsApp-style message preview ── */}
        {kitty && (
          <div style={{marginBottom:"0.85rem"}}>
            <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text2)",marginBottom:"0.5rem",letterSpacing:"0.01em"}}>Message Preview</div>
            {/* WhatsApp phone frame */}
            <div style={{borderRadius:18,overflow:"hidden",border:"2.5px solid #e0e0e0",boxShadow:"0 8px 32px rgba(0,0,0,0.13)",background:"#fff",maxWidth:360,margin:"0 auto"}}>
              {/* Status bar */}
              <div style={{background:"#075E54",padding:"4px 12px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"#fff",fontSize:"0.6rem",fontWeight:600}}>{new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M1 6l11 11L23 6"/></svg>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/></svg>
                </div>
              </div>
              {/* Group header */}
              <div style={{background:"#075E54",padding:"6px 12px 10px",display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>👥</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:"#fff",fontWeight:700,fontSize:"0.82rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{group}</div>
                  <div style={{color:"rgba(255,255,255,0.7)",fontSize:"0.6rem"}}>
                    {state.transactions.filter(t=>t.kitty===kitty.name&&t.type==="Contribution").slice(0,3).map(t=>t.name.split(" ")[0]).join(", ")}{state.transactions.filter(t=>t.kitty===kitty.name&&t.type==="Contribution").length>3?`, +${state.transactions.filter(t=>t.kitty===kitty.name&&t.type==="Contribution").length-3} more`:""}
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </div>
              </div>
              {/* Chat wallpaper */}
              <div style={{
                background:"#E5DDD5",
                backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c5bdb5' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                padding:"10px 10px 6px",minHeight:200,maxHeight:320,overflowY:"auto",
                display:"flex",flexDirection:"column",gap:6,
              }}>
                {/* Outgoing bubble */}
                <div style={{alignSelf:"flex-end",maxWidth:"85%"}}>
                  <div style={{
                    background:"#DCF8C6",borderRadius:"12px 2px 12px 12px",
                    padding:"6px 8px 18px",
                    fontSize:"0.62rem",color:"#1a1a1a",
                    whiteSpace:"pre-wrap",lineHeight:1.5,
                    boxShadow:"0 1px 2px rgba(0,0,0,0.15)",
                    fontFamily:"'Segoe UI',Arial,sans-serif",
                    wordBreak:"break-word",
                    position:"relative",
                  }}>
                    {reportText}
                    {/* Tail */}
                    <div style={{position:"absolute",bottom:4,right:8,display:"flex",alignItems:"center",gap:3}}>
                      <span style={{fontSize:"0.5rem",color:"#8696A0"}}>{new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                      <svg width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M1 4l3 3 9-6" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 4l3 3 5-6" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/></svg>
                    </div>
                  </div>
                  {/* Sender avatar + name */}
                  <div style={{display:"flex",alignItems:"center",gap:4,marginTop:3,justifyContent:"flex-end"}}>
                    <span style={{fontSize:"0.55rem",color:"#8696A0"}}>{user.name}</span>
                    <div style={{width:18,height:18,borderRadius:"50%",background:"var(--grad)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.5rem",color:"#fff",fontWeight:800}}>{user.initials?.slice(0,2)||"DU"}</div>
                  </div>
                </div>
              </div>
              {/* WhatsApp input bar */}
              <div style={{background:"#F0F0F0",padding:"6px 8px",display:"flex",alignItems:"center",gap:6}}>
                <div style={{flex:1,background:"#fff",borderRadius:20,padding:"6px 12px",fontSize:"0.65rem",color:"#8696A0",boxShadow:"0 1px 2px rgba(0,0,0,0.1)"}}>Type a message</div>
                <div style={{width:32,height:32,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.5rem"}}>
          <button className="confirm-btn" style={{flex:2,padding:"0.75rem",background:"#25D366",boxShadow:"0 8px 24px rgba(37,211,102,0.3)"}} onClick={openWhatsApp}>
            <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              Send via WhatsApp
            </span>
          </button>
          <button className="back-btn" style={{flex:1,marginTop:0,border:"1.5px solid var(--border)",fontSize:"0.75rem"}} onClick={copyReport}>📋 Copy</button>
        </div>
      </div>
    </div>
  );
}

// ─── Transactions Page ───
function TransactionsPage({ state, user, onToast }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const txs = state.transactions.filter(t => t.ownerEmail === user.email);
  const filtered = txs.filter(t => (filter === "all" || t.type === filter) && (!search || t.name.toLowerCase().includes(search) || t.ref.toLowerCase().includes(search)));
  const totalC = txs.filter(t => t.type === "Contribution").reduce((s,t) => s+t.gross, 0);
  const totalW = txs.filter(t => t.type === "Withdrawal").reduce((s,t) => s+t.gross, 0);
  const fees = txs.reduce((s,t) => s+(t.fee||0), 0);

  const [reportPreview, setReportPreview] = useState(null); // { type, html, csvData, csvHeaders, filename, title }

  const exportPDF = () => {
    const now = new Date().toLocaleDateString("en-KE", {day:"2-digit",month:"short",year:"numeric"});
    const rows = filtered.map(t => `
      <div class="tx-card">
        <div class="tx-top">
          <div>
            <div class="tx-name">${t.name||"Anonymous"}</div>
            <div class="tx-meta">${t.ref}${t.phone ? " · " + t.phone : ""} · ${t.kitty||"—"}</div>
          </div>
          <div class="tx-amt" style="color:${t.type==="Contribution"?"#10B981":"#F59E0B"}">KES ${fmt(t.gross)}</div>
        </div>
        <div class="tx-bot">
          <span class="tx-badge" style="background:${t.type==="Contribution"?"#ecfdf5":"#fffbeb"};color:${t.type==="Contribution"?"#059669":"#d97706"}">${t.type}</span>
          <span class="tx-detail">${t.status||"sent"}</span>
          ${t.fee>0?`<span class="tx-detail">Fee KES ${fmt(t.fee)}</span>`:""}
        </div>
      </div>`).join("");

    const html = `<!DOCTYPE html><html><head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>M-Pamoja Transactions – ${user.name}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Segoe UI',Arial,sans-serif;background:#f5f6fa;color:#111827;padding:0}
      .wrap{max-width:680px;margin:0 auto;padding:16px}
      .header{background:linear-gradient(135deg,#4F46E5,#7C3AED);border-radius:16px;padding:20px;color:#fff;margin-bottom:16px}
      .header h1{font-size:1.2rem;font-weight:800;letter-spacing:-0.02em}
      .header p{font-size:0.72rem;opacity:0.8;margin-top:4px}
      .stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px}
      .stat{background:#fff;border-radius:12px;padding:14px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
      .stat-lbl{font-size:0.6rem;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px}
      .stat-val{font-size:1.05rem;font-weight:800;letter-spacing:-0.03em}
      .section-title{font-size:0.68rem;font-weight:700;color:#4b5066;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;padding-bottom:6px;border-bottom:1.5px solid #e2e4ee}
      .tx-card{background:#fff;border-radius:12px;padding:12px 14px;margin-bottom:8px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
      .tx-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:7px}
      .tx-name{font-size:0.82rem;font-weight:700;color:#1a1d26}
      .tx-meta{font-size:0.63rem;color:#9CA3AF;margin-top:2px}
      .tx-amt{font-size:0.9rem;font-weight:800;white-space:nowrap}
      .tx-bot{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
      .tx-badge{font-size:0.58rem;font-weight:700;border-radius:20px;padding:2px 8px;text-transform:uppercase;letter-spacing:0.04em}
      .tx-detail{font-size:0.62rem;color:#9CA3AF}
      .empty{background:#fff;border-radius:12px;padding:28px;text-align:center;color:#9CA3AF;font-size:0.82rem}
      .footer{margin-top:20px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:0.65rem;color:#9CA3AF;text-align:center}
      .print-btn{text-align:center;margin-top:16px}
      .print-btn button{background:#4F46E5;color:#fff;border:none;border-radius:10px;padding:10px 28px;font-size:0.85rem;font-weight:700;cursor:pointer;width:100%;max-width:320px}
      @media print{body{background:#fff}.print-btn{display:none}.wrap{padding:12px}}
      @media(min-width:540px){.stats{grid-template-columns:repeat(4,1fr)}}
    </style></head><body>
    <div class="wrap">
      <div class="header"><h1>M-Pamoja · Transaction Report</h1><p>${user.name} · Generated ${now} · ${filtered.length} transactions</p></div>
      <div class="stats">
        <div class="stat"><div class="stat-lbl">Contributions</div><div class="stat-val" style="color:#4F46E5">KES ${fmt(totalC)}</div></div>
        <div class="stat"><div class="stat-lbl">Withdrawals</div><div class="stat-val" style="color:#F59E0B">KES ${fmt(totalW)}</div></div>
        <div class="stat"><div class="stat-lbl">Transactions</div><div class="stat-val">${txs.length}</div></div>
        <div class="stat"><div class="stat-lbl">Fees Charged</div><div class="stat-val" style="color:#F43F5E">KES ${fmt(fees)}</div></div>
      </div>
      <div class="section-title">All Transactions · ${filtered.length} records</div>
      ${rows || `<div class="empty">No transactions found.</div>`}
      <div class="footer">M-Pamoja Community Finance · mpamoja.co.ke · Auto-generated</div>
      <div class="print-btn"><button onclick="window.print()">🖨️ Print / Save as PDF</button></div>
    </div>
    </body></html>`;
    setReportPreview({ type:"pdf", html, filename:`mpamoja-transactions-${new Date().toISOString().slice(0,10)}`, title:"Transaction Report" });
  };

  const exportExcel = () => {
    const headers = ["Ref","Name","Phone","Kitty","Type","Gross (KES)","Fee (KES)","Net (KES)","Status","Time"];
    const rows = filtered.map(t => [t.ref, t.name||"Anonymous", t.phone||"", t.kitty||"", t.type, t.gross, t.fee||0, t.net||t.gross, t.status||"sent", t.time||""]);
    setReportPreview({ type:"excel", csvHeaders: headers, csvData: rows, filename:`mpamoja-transactions-${new Date().toISOString().slice(0,10)}`, title:"Transactions Spreadsheet" });
  };

  return (
    <div className="tx-wrap">
      <div className="tx-stats">
        <div className="tx-stat-card"><div className="tx-stat-lbl">Contributions</div><div className="tx-stat-val text-brand">KES {fmt(totalC)}</div></div>
        <div className="tx-stat-card"><div className="tx-stat-lbl">Withdrawals</div><div className="tx-stat-val text-amber">KES {fmt(totalW)}</div></div>
        <div className="tx-stat-card"><div className="tx-stat-lbl">Total Transactions</div><div className="tx-stat-val">{txs.length}</div></div>
        <div className="tx-stat-card"><div className="tx-stat-lbl">Fees Charged</div><div className="tx-stat-val text-rose">KES {fmt(fees)}</div></div>
      </div>
      <div className="tx-filter-row">
        {[["all","All"],["Contribution","Contributions"],["Withdrawal","Withdrawals"]].map(([v,l]) => (
          <button key={v} className={`tx-filter-pill${filter === v ? " active" : ""}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>
      <input className="tx-search" placeholder="🔍  Search name or reference…" value={search} onChange={e => setSearch(e.target.value.toLowerCase())} />
      {filtered.map(t => (
        <div key={t.ref} className="tx-item">
          <div className={`tx-av ${t.type === "Contribution" ? "tx-av-contrib" : "tx-av-wd"}`}>{(t.name||"AN").slice(0,2).toUpperCase()}</div>
          <div style={{flex:1,minWidth:0}}>
            <div className="tx-item-name" style={{display:"flex",alignItems:"center",gap:"0.4rem"}}>
              {t.name || "Anonymous"}
              {t.name === "Anonymous" && <span style={{fontSize:"0.58rem",fontWeight:700,padding:"1px 6px",borderRadius:60,background:"var(--surface3)",color:"var(--text3)",letterSpacing:"0.04em"}}>ANON</span>}
            </div>
            <div className="tx-item-ref">{t.ref}{t.phone ? ` · ${maskPhone(t.phone)}` : ""}</div>
            <div className="tx-item-kitty">{t.kitty}</div>
            <span className={`tx-pill ${t.type === "Contribution" ? "pill-contrib" : "pill-wd"}`}>{t.type}</span>
          </div>
          <div className="tx-item-amount">
            <div className="tx-item-gross" style={{color: t.type==="Contribution" ? "var(--emerald)" : "var(--amber)"}}>KES {fmt(t.gross)}</div>
            {t.fee > 0 && <div className="tx-item-fee">Fee: KES {fmt(t.fee)}</div>}
          </div>
        </div>
      ))}
      <div style={{display:"flex",gap:"0.6rem",marginTop:"0.75rem"}}>
        <button className="tx-export-btn" style={{flex:1}} onClick={exportPDF}>
          <span style={{display:"flex"}}>{Icons.download}</span>Export PDF
        </button>
        <button className="tx-export-btn" style={{flex:1,color:"var(--emerald)",borderColor:"var(--emerald)"}} onClick={exportExcel}>
          <span style={{display:"flex",fontSize:"1rem"}}>📊</span>Export Excel
        </button>
      </div>
      {reportPreview && (
        <ReportPreviewModal {...reportPreview} onClose={() => setReportPreview(null)} />
      )}
    </div>
  );
}

// ─── Settings Page ───
function SettingsPage({ user, onToast, onLogout, onBack }) {
  const [form, setForm] = useState({ 
    name: user.name || "", 
    email: user.email || "", 
    phone: user.phoneNumber || user.phone || ""  // ✅ Handle both naming conventions
  });
  
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // You can add API call here to update profile
      // await updateProfile(form);
      onToast("Saved!", "Profile updated successfully");
    } catch (error) {
      onToast("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-wrap">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
        <div style={{fontSize:"1rem",fontWeight:800,letterSpacing:"-0.02em"}}>Profile</div>
        <button onClick={onBack} style={{width:34,height:34,border:"1.5px solid var(--border)",borderRadius:10,background:"var(--surface)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"var(--shadow-sm)"}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      
      <div className="settings-card">
        <div className="profile-avatar-row">
          <div className="profile-av">{user.initials || "U"}</div>
          <div>
            <div className="profile-av-name">{user.name || "User"}</div>
            <div className="profile-av-role">{user.role || "Member"}</div>
          </div>
        </div>
        
        <div className="sc-title">Profile Settings</div>
        
        <div className="field">
          <label>Full Name</label>
          <input 
            value={form.name} 
            onChange={e => setForm(f => ({...f, name: e.target.value}))} 
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="field">
          <label>Email</label>
          <input 
            value={form.email} 
            onChange={e => setForm(f => ({...f, email: e.target.value}))} 
            placeholder="Enter your email"
            type="email"
          />
        </div>
        
        <div className="field">
          <label>Phone Number</label>
          <input 
            value={form.phone} 
            onChange={e => setForm(f => ({...f, phone: e.target.value}))} 
            placeholder="Enter your phone number"
            type="tel"
          />
        </div>
        
        <button 
          className="confirm-btn" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes →"}
        </button>
      </div>
      
      <div className="settings-card">
        <div className="sc-title">Account</div>
        <button className="logout-btn" onClick={onLogout}>
          <span style={{display:"flex"}}>{Icons.logout}</span>Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Portal Orb Home Navigator ───
function PortalOrb({ label, onHome }) {
  const [warping, setWarping] = useState(false);
  const [particles, setParticles] = useState([]);
  const colors = ["#fff","#C7D2FE","#A7F3D0","#FDE68A","#FBCFE8"];

  const handleTap = () => {
    // Spawn burst particles
    const burst = Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * 360;
      const dist = 28 + Math.random() * 22;
      return {
        id: Date.now() + i,
        px: `${Math.cos((angle * Math.PI) / 180) * dist}px`,
        py: `${Math.sin((angle * Math.PI) / 180) * dist}px`,
        c: colors[i % colors.length],
        delay: `${Math.random() * 0.08}s`,
      };
    });
    setParticles(burst);
    setWarping(true);
    setTimeout(() => {
      onHome();
    }, 420);
    setTimeout(() => setParticles([]), 600);
  };

  return (
    <div className="portal-orb-wrap" style={warping ? {animation:"orbExit 0.42s ease-in forwards"} : {}}>
      {/* Glow */}
      <div className="portal-glow" />
      {/* Pulse rings */}
      <div className="portal-ring" />
      <div className="portal-ring2" />
      {/* Warp ripple on click */}
      {warping && <div className="portal-warp-ripple" />}
      {/* Particles */}
      <div className="portal-particles">
        {particles.map(p => (
          <div key={p.id} className="portal-particle"
            style={{"--px":p.px,"--py":p.py,"--c":p.c,animationDelay:p.delay,
              marginLeft:"-2.5px",marginTop:"-2.5px"}} />
        ))}
      </div>
      {/* Main orb button */}
      <button className="portal-orb" onClick={handleTap} title="Back to Home">
        <svg className="portal-orb-icon" viewBox="0 0 24 24">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
          <path d="M9 21V12h6v9"/>
        </svg>
      </button>
      {/* Floating page label */}
      <div className="portal-label">{label}</div>
    </div>
  );
}

// ─── Main App ───
// ─── Report Preview Modal ───
function ReportPreviewModal({ type, html, csvData, csvHeaders, filename, title, onClose }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (type === "pdf" && iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) { doc.open(); doc.write(html); doc.close(); }
    }
  }, [html, type]);

  const handlePrint = () => {
    if (type === "pdf" && iframeRef.current) {
      iframeRef.current.contentWindow?.focus();
      iframeRef.current.contentWindow?.print();
    }
  };

  const handleDownload = () => {
    if (type === "pdf") {
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename + ".html";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      const bom = "\uFEFF";
      const csv = [csvHeaders, ...csvData].map(r => r.map(v => `"${String(v||"").replace(/"/g,'""')}"`).join(",")).join("\r\n");
      const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename + ".csv";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  const handleShare = async () => {
    if (type === "pdf") {
      const blob = new Blob([html], { type: "text/html" });
      const file = new File([blob], filename + ".html", { type: "text/html" });
      if (navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file], title }); return; } catch(e) {}
      }
    } else {
      const bom = "\uFEFF";
      const csv = [csvHeaders, ...csvData].map(r => r.map(v => `"${String(v||"").replace(/"/g,'""')}"`).join(",")).join("\r\n");
      const blob = new Blob([bom + csv], { type: "text/csv" });
      const file = new File([blob], filename + ".csv", { type: "text/csv" });
      if (navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file], title }); return; } catch(e) {}
      }
    }
    // Fallback: share via URL if Web Share not available
    if (navigator.share) {
      try { await navigator.share({ title, text: `M-Pamoja Report: ${title}` }); } catch(e) {}
    } else {
      handleDownload();
    }
  };

  return (
    <div className="report-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="report-modal-sheet">
        {/* Top bar */}
        <div className="report-modal-bar">
          <div style={{fontSize:"1.1rem"}}>{type === "pdf" ? "📄" : "📊"}</div>
          <div className="report-modal-title">{title}</div>
          <button className="report-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        {type === "pdf" ? (
          <iframe ref={iframeRef} className="report-modal-iframe" title={title} />
        ) : (
          <div className="rma-excel-wrap">
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#217346",marginBottom:"0.6rem",letterSpacing:"0.04em",textTransform:"uppercase"}}>
              📊 Spreadsheet Preview — {csvData.length} rows
            </div>
            <table className="rma-excel-table">
              <thead><tr>{csvHeaders.map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {csvData.map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j}>{cell ?? "—"}</td>)}</tr>
                ))}
                {csvData.length === 0 && (
                  <tr><td colSpan={csvHeaders.length} style={{textAlign:"center",padding:"1.5rem",color:"#9CA3AF"}}>No data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Action buttons */}
        <div className="report-modal-actions">
          <button className="rma-btn primary" onClick={handlePrint} style={{display: type==="excel"?"none":"flex"}}>
            <div className="rma-btn-icon">🖨️</div>
            <div className="rma-btn-label" style={{color:"#fff"}}>Print / PDF</div>
          </button>
          <button className="rma-btn" onClick={handleDownload} style={{borderColor: type==="excel"?"#217346":"var(--border)",background: type==="excel"?"#f0faf4":"var(--surface2)"}}>
            <div className="rma-btn-icon">{type === "excel" ? "📊" : "💾"}</div>
            <div className="rma-btn-label" style={{color: type==="excel"?"#217346":"var(--text2)"}}>
              {type === "excel" ? "Save Excel" : "Save HTML"}
            </div>
          </button>
          <button className="rma-btn" onClick={handleShare}>
            <div className="rma-btn-icon">↗️</div>
            <div className="rma-btn-label">Share</div>
          </button>
          <button className="rma-btn" onClick={onClose}>
            <div className="rma-btn-icon">✕</div>
            <div className="rma-btn-label">Close</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MPamojaApp() {
  // ─── ALL STATE DECLARATIONS FIRST ───
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("overview");
  const [state, setState] = useState({ ...DEFAULT_STATE });
  const [toast, setToast] = useState(null);
  const [newKittyModal, setNewKittyModal] = useState(false);
  const [autoOpen, setAutoOpen] = useState(false);
  const [hubConnection, setHubConnection] = useState(null);
  const [signalRConnected, setSignalRConnected] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifsRead, setNotifsRead] = useState(false);
  const [clearedNotifIds, setClearedNotifIds] = useState(new Set());
  
  // ── Detect public share link via hash (#kitty=ID) or localStorage handoff ──
  const [publicKittyId, setPublicKittyId] = useState(() => {
    try {
      const hash = window.location.hash;
      const hashMatch = hash.match(/[#&]kitty=([^&]+)/);
      if (hashMatch) return hashMatch[1];
      const params = new URLSearchParams(window.location.search);
      if (params.get("kitty")) return params.get("kitty");
      const stored = localStorage.getItem("mpamoja_open_kitty");
      if (stored) { localStorage.removeItem("mpamoja_open_kitty"); return stored; }
    } catch {}
    return null;
  });

  // ─── FETCH FUNCTION ───
const fetchKittiesFromApi = async () => {
  try {
    console.log('🔍 fetchKittiesFromApi called');
    const token = localStorage.getItem('mpamoja_token');
    console.log('🔑 Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.warn('No token found');
      return;
    }

    console.log('📡 Making API request to /api/kitties');
    const response = await fetch('/api/kitties', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('📡 Response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Kitties from API:', data);
      
      setState(prev => ({
        ...prev,
        kitties: data
      }));

      // ⭐ After updating kitties, re-join groups for new kitties
      if (hubConnection && signalRConnected) {
        const userKitties = data.filter(k => 
          k.createdBy === user.email || 
          k.creatorId === user.id || 
          k.creator_id === user.id
        );
        
        for (const kitty of userKitties) {
          try {
            await hubConnection.invoke('WatchKitty', String(kitty.id));
            console.log(`✅ (Re)joined kitty group: ${kitty.name}`);
          } catch (err) {
            console.warn(`Failed to watch kitty ${kitty.id}:`, err);
          }
        }
      }

    } else {
      console.error('❌ API responded with error:', response.status);
    }
  } catch (error) {
    console.error('❌ Error fetching kitties:', error);
  }
};

  // ─── POLLING FUNCTION ───
  const pollPaymentStatus = async (intentId, token, onAttempt) => {
    const maxAttempts = 30; // 30 seconds max
    const pollInterval = 1000; // 1 second between polls
    
    return new Promise((resolve) => {
      let attempts = 0;
      let isResolved = false;
      
      const checkStatus = async () => {
        if (isResolved) return;
        
        attempts++;
        if (onAttempt) onAttempt(attempts);
        
        try {
          console.log(`📡 Polling attempt ${attempts}/${maxAttempts} for intent: ${intentId}`);
          
          const response = await fetch(`${BASE}/api/public/kitties/status/${intentId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!response.ok) {
            console.error(`❌ HTTP error: ${response.status}`);
            if (attempts >= maxAttempts) {
              isResolved = true;
              resolve({ 
                confirmed: false, 
                error: `Server error: ${response.status}` 
              });
              return;
            }
            setTimeout(checkStatus, pollInterval);
            return;
          }
          
          const data = await response.json();
          console.log(`📡 Poll result:`, data);
          
          if (data.status === 'Confirmed' || data.status === 'Success' || data.status === 'Completed') {
            isResolved = true;
            console.log('✅ Payment confirmed!');
            resolve({ 
              confirmed: true, 
              receipt: data.receipt || data.mpesaReceiptNumber || data.transactionId 
            });
            return;
          }
          
          if (data.status === 'Failed' || data.status === 'Cancelled' || data.status === 'Error') {
            isResolved = true;
            console.log('❌ Payment failed:', data);
            resolve({ 
              confirmed: false, 
              error: data.error || data.failureReason || 'Payment was cancelled or failed' 
            });
            return;
          }
          
          if (attempts >= maxAttempts) {
            isResolved = true;
            console.log('⏱️ Polling timeout');
            resolve({ 
              confirmed: false, 
              error: 'Payment timed out. Please check your M-Pesa and try again.' 
            });
            return;
          }
          
          console.log(`⏳ Still pending... (${attempts}/${maxAttempts})`);
          setTimeout(checkStatus, pollInterval);
          
        } catch (error) {
          console.error('❌ Polling error:', error);
          if (attempts >= maxAttempts) {
            isResolved = true;
            resolve({ 
              confirmed: false, 
              error: 'Network error while checking payment status' 
            });
            return;
          }
          setTimeout(checkStatus, pollInterval);
        }
      };
      
      checkStatus();
    });
  };

  // ─── ALL useCallback DECLARATIONS ───
  const navWithAutoOpen = useCallback((key) => {
    setAutoOpen(true);
    setPage(key);
  }, []);

  const showToast = useCallback((title, body) => setToast({ title, body }), []);

  // ─── ALL useEffect HOOKS (in the correct order) ───
  
  // 1. Session restoration
  useEffect(() => {
    console.log('🔄 Checking for existing session...');
    const savedUser = localStorage.getItem('mpamoja_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.token) {
          if (!user.phoneNumber && user.phone) {
            user.phoneNumber = user.phone;
          }
          setUser(user);
          setPage("overview");
          console.log('✅ Session restored from localStorage');
        } else {
          localStorage.removeItem('mpamoja_user');
          localStorage.removeItem('mpamoja_token');
        }
      } catch (e) {
        console.error('❌ Failed to restore session:', e);
        localStorage.removeItem('mpamoja_user');
        localStorage.removeItem('mpamoja_token');
      }
    }
  }, []);

  // 2. Fetch kitties when user logs in
  useEffect(() => {
    console.log('👤 User state changed:', user);
    if (user) {
      console.log('📡 Fetching kitties for user:', user.email);
      fetchKittiesFromApi();
    }
  }, [user]);

  // 3. Inject styles
  useEffect(() => {
    const el = document.createElement("style");
    el.innerHTML = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // 4. Listen for hash changes
  useEffect(() => {
    const onHash = () => {
      try {
        const hash = window.location.hash;
        const m = hash.match(/[#&]kitty=([^&]+)/);
        if (m) setPublicKittyId(m[1]);
      } catch {}
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // 5. Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  //6. connect to SignalR
  useEffect(() => {
  if (!user) {
    // Disconnect if user logs out
    if (hubConnection) {
      hubConnection.stop();
      setHubConnection(null);
      setSignalRConnected(false);
    }
    return;
  }

  const connectToSignalR = async () => {
    try {
      const token = localStorage.getItem('mpamoja_token');
      if (!token) {
        console.warn('No token available for SignalR connection');
        return;
      }

      console.log('🔌 Connecting to SignalR...');
      
      const connection = new HubConnectionBuilder()
        .withUrl('/hubs/kitty', {  // ← This should work if proxy is configured
    accessTokenFactory: () => token,
    skipNegotiation: true,  // ← Try adding this for WebSocket-only
    transport: HttpTransportType.WebSockets  // ← Force WebSocket transport
  })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      // ── Listen for kitty progress updates ──
      connection.on('kittyProgress', (data) => {
        console.log('📊 KittyProgress update received:', data);
        
        setState(prev => {
          // Update the specific kitty
          const updatedKitties = prev.kitties.map(k => 
            k.id === data.kittyId
              ? {
                  ...k,
                  raised: data.raised,
                  contributors: data.contributorCount
                }
              : k
          );
          
          return {
            ...prev,
            kitties: updatedKitties
          };
        });

        // Show a toast notification
        showToast('💰 New Contribution!', 'Someone just contributed to a kitty!');
      });

      // ── Listen for new contribution events ──
      connection.on('newContribution', (data) => {
        console.log('🆕 NewContribution received:', data);
        
        // Add to transactions
        setState(prev => {
          const kittyName = prev.kitties.find(k => k.id === data.kittyId)?.name || '';
          
          return {
            ...prev,
            transactions: [
              {
                ref: `SIGNALR-${Date.now().toString().slice(-6)}`,
                name: data.contributorName || "Anonymous",
                phone: "",
                kitty: kittyName,
                gross: data.amount,
                fee: 0,
                net: data.amount,
                type: "Contribution",
                status: "Confirmed",
                time: "Just now",
                ownerEmail: user.email,
              },
              ...prev.transactions
            ]
          };
        });

        showToast('🎉 Contribution Received!', `${data.contributorName || 'Someone'} contributed KES ${fmt(data.amount)}`);
      });

      // ── Listen for connection events ──
      connection.on('Connected', (data) => {
        console.log('✅ SignalR connected:', data);
        setSignalRConnected(true);
      });

      connection.on('JoinedKittyGroup', (data) => {
        console.log('✅ Joined kitty group:', data);
      });

      connection.on('LeftKittyGroup', (data) => {
        console.log('👋 Left kitty group:', data);
      });

      // ── Start the connection ──
      await connection.start();
      console.log('✅ SignalR connection established!');
      setHubConnection(connection);
      setSignalRConnected(true);

      // ── Join all kitty groups for the user ──
      const userKitties = state.kitties.filter(k => 
        k.createdBy === user.email || 
        k.creatorId === user.id || 
        k.creator_id === user.id
      );
      
      for (const kitty of userKitties) {
        try {
          await connection.invoke('WatchKitty', String(kitty.id));
          console.log(`✅ Watching kitty: ${kitty.name} (${kitty.id})`);
        } catch (err) {
          console.warn(`Failed to watch kitty ${kitty.id}:`, err);
        }
      }

    } catch (error) {
      console.error('❌ SignalR connection failed:', error);
      setSignalRConnected(false);
      
      // Retry after 5 seconds
      setTimeout(() => {
        if (user) {
          console.log('🔄 Retrying SignalR connection...');
          connectToSignalR();
        }
      }, 5000);
    }
  };

  connectToSignalR();

  // Cleanup on unmount or user logout
  return () => {
    if (hubConnection) {
      hubConnection.stop();
      setHubConnection(null);
      setSignalRConnected(false);
    }
  };
}, [user, state.kitties]); // Re-run when kitties change to join new groups

  // ─── ALL HANDLER FUNCTIONS ───

  const handleLogin = (user) => {
    console.log('🔐 User logged in:', user);
    setUser(user);
    localStorage.setItem('mpamoja_user', JSON.stringify(user));
    localStorage.setItem('mpamoja_token', user.token);
    setPage("overview");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mpamoja_user');
    localStorage.removeItem('mpamoja_token');
    setPage("overview");
  };

  const handleNewKitty = async (form) => {
    try {
      const token = localStorage.getItem('mpamoja_token');
      if (!token) {
        showToast("Error", "You must be logged in to create a kitty");
        return;
      }

      let categoryString = "Contributions";
      if (form.feeCategory === "chama") categoryString = "Chama";
      else if (form.feeCategory === "events") categoryString = "Events";

      const kittyData = {
        name: form.name.trim(),
        description: form.description?.trim() || "",
        category: categoryString,
        goalKes: Number(form.goal),
        ...(form.endDate && { deadline: form.endDate }),
        ...(form.beneficiaryName && { beneficiaryName: form.beneficiaryName }),
        ...(form.beneficiaryPhone && { beneficiaryPhone: form.beneficiaryPhone }),
        ...(form.beneficiaryIdNumber && { beneficiaryIdNumber: form.beneficiaryIdNumber }),
      };

      console.log('📤 Creating kitty:', kittyData);

      const response = await fetch('/api/kitties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(kittyData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        let errorMessage = `Server error: ${response.status}`;
        try {
          const error = JSON.parse(errorText);
          errorMessage = error.error || error.message || errorMessage;
        } catch {
          // Use default error message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Kitty created:', data);

      const newKitty = {
        id: data.id,
        name: data.name || form.name,
        raised: data.raisedCents ? data.raisedCents / 100 : 0,
        goal: data.goalCents ? data.goalCents / 100 : Number(form.goal),
        contributors: data.contributorCount || 0,
        created: data.createdAt ? data.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
        createdBy: user.email,
        feeCategory: form.feeCategory || "contributions",
        category: form.feeCategory || "contributions",
        description: form.description || "",
        isPrivate: form.isPrivate || false,
        mediaImage: form.mediaImage || null,
        mediaDoc: form.mediaDoc || null,
        mediaBanner: form.mediaBanner || null,
        shareToken: data.shareToken,
        shareUrl: data.shareUrl,
        _id: data.id,
      };

      setState(prev => ({
        ...prev,
        kitties: [...prev.kitties, newKitty]
      }));

      showToast("🎉 Kitty Created!", `"${form.name}" is now live`);

    } catch (error) {
      console.error('❌ Error creating kitty:', error);
      showToast("Error", error.message || "Failed to create kitty. Please try again.");
    }
  };

  // const handleContribute = async (kittyId, amount, displayName, phone) => {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const token = localStorage.getItem('mpamoja_token');
  //       if (!token) {
  //         reject({ error: "You must be logged in to contribute" });
  //         return;
  //       }

  //       let kitty = state.kitties.find(k => k.id === kittyId);
        
  //       if (!kitty || !kitty.shareToken) {
  //         console.log('🔄 Fetching kitty from API...');
  //         const response = await fetch(`${BASE}/api/kitties/${kittyId}`, {
  //           headers: { 'Authorization': `Bearer ${token}` }
  //         });
          
  //         if (!response.ok) {
  //           reject({ error: 'Failed to fetch kitty details' });
  //           return;
  //         }
          
  //         const apiKitty = await response.json();
  //         if (apiKitty.shareToken) {
  //           setState(prev => ({
  //             ...prev,
  //             kitties: prev.kitties.map(k =>
  //               k.id === kittyId ? { ...k, shareToken: apiKitty.shareToken } : k
  //             )
  //           }));
  //           kitty = { ...kitty, shareToken: apiKitty.shareToken };
  //         }
  //       }

  //       const shareToken = kitty?.shareToken;
  //       if (!shareToken) {
  //         reject({ error: "This kitty doesn't have a share link yet." });
  //         return;
  //       }

  //       console.log('📤 Sending contribution request...');
  //       const response = await fetch(`${BASE}/api/public/kitties/${shareToken}/contribute`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`
  //         },
  //         body: JSON.stringify({
  //           name: displayName,
  //           phone: phone || "",
  //           amountKes: amount,
  //           anonymous: displayName === "Anonymous"
  //         })
  //       });

  //       const responseText = await response.text();
  //       console.log('📡 Response:', response.status, responseText);

  //       if (!response.ok) {
  //         let errorMessage = 'Failed to contribute';
  //         try {
  //           const error = JSON.parse(responseText);
  //           errorMessage = error.error || errorMessage;
  //         } catch {
  //           // Use default message
  //         }
  //         reject({ error: errorMessage });
  //         return;
  //       }

  //       let data;
  //       try {
  //         data = JSON.parse(responseText);
  //       } catch {
  //         reject({ error: 'Invalid response from server' });
  //         return;
  //       }

  //       console.log('📡 STK Response:', data);

  //       if (data.status === 'StkSent' || data.status === 'Pending') {
  //         console.log('⏳ STK sent, waiting for confirmation...');
  //         const intentId = data.intentId || data.checkoutRequestID;
          
  //         const result = await pollPaymentStatus(intentId, token);
          
  //         if (result.confirmed) {
  //           console.log('✅ Payment confirmed!');
  //           setState(prev => ({
  //             ...prev,
  //             kitties: prev.kitties.map(k =>
  //               k.id === kittyId
  //                 ? {
  //                     ...k,
  //                     raised: (k.raised || 0) + amount,
  //                     contributors: (k.contributors || 0) + 1
  //                   }
  //                 : k
  //             ),
  //             transactions: [...prev.transactions, {
  //               ref: intentId || `CON-${Date.now().toString().slice(-6)}`,
  //               name: displayName || "Anonymous",
  //               phone: phone || "",
  //               kitty: kitty.name || "",
  //               gross: amount,
  //               fee: 0,
  //               net: amount,
  //               type: "Contribution",
  //               status: "Confirmed",
  //               time: "Just now",
  //               ownerEmail: user.email,
  //               receipt: result.receipt
  //             }]
  //           }));

  //           resolve({ confirmed: true, receipt: result.receipt });
  //         } else {
  //           console.log('❌ Payment failed:', result.error);
  //           reject({ error: result.error || "Payment failed. Please try again." });
  //         }
  //       } else if (data.status === 'Confirmed') {
  //         console.log('✅ Payment confirmed instantly!');
  //         setState(prev => ({
  //           ...prev,
  //           kitties: prev.kitties.map(k =>
  //             k.id === kittyId
  //               ? {
  //                   ...k,
  //                   raised: (k.raised || 0) + amount,
  //                   contributors: (k.contributors || 0) + 1
  //                 }
  //               : k
  //           ),
  //           transactions: [...prev.transactions, {
  //             ref: data.intentId || `CON-${Date.now().toString().slice(-6)}`,
  //             name: displayName || "Anonymous",
  //             phone: phone || "",
  //             kitty: kitty.name || "",
  //             gross: amount,
  //             fee: 0,
  //             net: amount,
  //             type: "Contribution",
  //             status: "Confirmed",
  //             time: "Just now",
  //             ownerEmail: user.email
  //           }]
  //         }));
          
  //         resolve({ confirmed: true });
  //       } else {
  //         reject({ error: data.error || 'Failed to initiate payment' });
  //       }

  //     } catch (error) {
  //       console.error('❌ Error contributing:', error);
  //       reject({ error: error.message || "An unexpected error occurred" });
  //     }
  //   });
  // };

  const handleContribute = async (kittyId, amount, displayName, phone) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = localStorage.getItem('mpamoja_token');
      if (!token) {
        reject({ error: "You must be logged in to contribute" });
        return;
      }

      // Find the kitty
      let kitty = state.kitties.find(k => k.id === kittyId);
      
      // Get shareToken
      if (!kitty || !kitty.shareToken) {
        console.log('🔄 Fetching kitty from API...');
        const response = await fetch(`${BASE}/api/kitties/${kittyId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          reject({ error: 'Failed to fetch kitty details' });
          return;
        }
        
        const apiKitty = await response.json();
        if (apiKitty.shareToken) {
          setState(prev => ({
            ...prev,
            kitties: prev.kitties.map(k =>
              k.id === kittyId ? { ...k, shareToken: apiKitty.shareToken } : k
            )
          }));
          kitty = { ...kitty, shareToken: apiKitty.shareToken };
        }
      }

      const shareToken = kitty?.shareToken;
      if (!shareToken) {
        reject({ error: "This kitty doesn't have a share link yet." });
        return;
      }

      // Make the contribution
      console.log('📤 Sending contribution request...');
      const response = await fetch(`${BASE}/api/public/kitties/${shareToken}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: displayName,
          phone: phone || "",
          amountKes: amount,
          anonymous: displayName === "Anonymous"
        })
      });

      const responseText = await response.text();
      console.log('📡 Response:', response.status, responseText);

      if (!response.ok) {
        let errorMessage = 'Failed to contribute';
        try {
          const error = JSON.parse(responseText);
          errorMessage = error.error || errorMessage;
        } catch {
          // Use default message
        }
        reject({ error: errorMessage });
        return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        reject({ error: 'Invalid response from server' });
        return;
      }

      console.log('📡 STK Response:', data);

      // ⭐ Check for Confirmed status first (demo mode)
      if (data.status === 'Confirmed' || data.status === 'Success' || data.status === 'Completed') {
        console.log('✅ Payment confirmed instantly (demo mode)!');
        // Update React state
        setState(prev => ({
          ...prev,
          kitties: prev.kitties.map(k =>
            k.id === kittyId
              ? {
                  ...k,
                  raised: (k.raised || 0) + amount,
                  contributors: (k.contributors || 0) + 1
                }
              : k
          ),
          transactions: [...prev.transactions, {
            ref: data.intentId || `CON-${Date.now().toString().slice(-6)}`,
            name: displayName || "Anonymous",
            phone: phone || "",
            kitty: kitty.name || "",
            kittyId: kitty.id,
            gross: amount,
            fee: 0,
            net: amount,
            type: "Contribution",
            status: "Confirmed",
            time: "Just now",
            ownerEmail: user.email,
            receipt: data.receipt || "DEMO_RECEIPT"
          }]
        }));
        
        resolve({ confirmed: true, receipt: data.receipt || "DEMO_RECEIPT" });
        return;
      }

      // Check if STK was sent (real M-Pesa flow)
      if (data.status === 'StkSent' || data.status === 'Pending') {
        console.log('⏳ STK sent, waiting for confirmation...');
        const intentId = data.intentId || data.checkoutRequestID;
        
        // Wait for polling to complete
        const result = await pollPaymentStatus(intentId, token);
        
        if (result.confirmed) {
          console.log('✅ Payment confirmed!');
          // Update React state
          setState(prev => ({
            ...prev,
            kitties: prev.kitties.map(k =>
              k.id === kittyId
                ? {
                    ...k,
                    raised: (k.raised || 0) + amount,
                    contributors: (k.contributors || 0) + 1
                  }
                : k
            ),
            transactions: [...prev.transactions, {
              ref: intentId || `CON-${Date.now().toString().slice(-6)}`,
              name: displayName || "Anonymous",
              phone: phone || "",
              kitty: kitty.name || "",
              kittyId: kitty.id,
              gross: amount,
              fee: 0,
              net: amount,
              type: "Contribution",
              status: "Confirmed",
              time: "Just now",
              ownerEmail: user.email,
              receipt: result.receipt
            }]
          }));

          resolve({ confirmed: true, receipt: result.receipt });
        } else {
          console.log('❌ Payment failed:', result.error);
          reject({ error: result.error || "Payment failed. Please try again." });
        }
      } else {
        reject({ error: data.error || 'Failed to initiate payment' });
      }

    } catch (error) {
      console.error('❌ Error contributing:', error);
      reject({ error: error.message || "An unexpected error occurred" });
    }
  });
};

  const handleEditKitty = (kittyId, updates) => {
    setState(s => ({
      ...s,
      kitties: s.kitties.map(k => k.id === kittyId ? { ...k, ...updates } : k)
    }));
  };

  const handleWithdraw = async (kittyId, net, fee, phone, partial) => {
    try {
      const token = localStorage.getItem('mpamoja_token');
      if (!token) {
        showToast("Error", "You must be logged in to withdraw");
        return;
      }

      const kittyObj = state.kitties.find(k => k.id === kittyId);
      const gross = partial || (kittyObj?.raised || 0);

      const response = await fetch(`${BASE}/api/kitties/${kittyId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: gross * 100,
          phone: phone,
          netAmount: net * 100
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to withdraw');
      }

      const data = await response.json();
      const today = new Date().toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });

      setState(s => ({
        ...s,
        kitties: s.kitties.map(k =>
          k.id === kittyId
            ? { ...k, raised: Math.max(0, (k.raised || 0) - gross) }
            : k
        ),
        withdrawals: [...s.withdrawals, {
          date: today,
          kitty: kittyObj?.name || "",
          gross,
          fee,
          net,
          pct: data.feePercentage || "2.2",
          status: "sent",
          ownerEmail: user.email
        }],
        transactions: [...s.transactions, {
          ref: data.reference || `WD${Date.now().toString().slice(-6)}`,
          name: user.name,
          phone,
          kitty: kittyObj?.name || "",
          gross,
          fee,
          net,
          type: "Withdrawal",
          status: "sent",
          time: "Just now",
          ownerEmail: user.email
        }]
      }));

      showToast("Withdrawal Sent! 💸", `KES ${net} is on its way`);

    } catch (error) {
      console.error('Error withdrawing:', error);
      showToast("Error", error.message || "Failed to withdraw. Please try again.");
    }
  };

  // ─── CHAMA HANDLERS ───
  const handleChamaContribute = (chamaId, amount) => {
    setState(s => ({
      ...s,
      chamas: s.chamas.map(c => c.id === chamaId ? { ...c, pool: (c.pool || 0) + amount } : c)
    }));
  };

  const handleChamaWithdraw = (chamaId, net, fee, dest, gross) => {
    const today = new Date().toLocaleDateString("en-KE", { day:"2-digit", month:"short", year:"numeric" });
    setState(s => ({
      ...s,
      chamas: s.chamas.map(c => c.id === chamaId ? { ...c, pool: Math.max(0, (c.pool||0) - gross) } : c),
      transactions: [...s.transactions, {
        ref: "CWD" + Date.now().toString().slice(-6),
        name: user.name,
        phone: dest || "",
        kitty: s.chamas.find(c => c.id === chamaId)?.name || "Chama",
        gross, fee, net,
        type: "Withdrawal",
        status: "sent",
        time: "Just now",
        ownerEmail: user.email
      }]
    }));
  };

  const handleNewChama = (form) => {
    setState(s => ({
      ...s,
      chamas: [...s.chamas, {
        id: Date.now(), name: form.name, members: Number(form.members)||0, pool: 0,
        cycle: form.cycle, nextMeeting: "TBD", createdBy: user.email,
        contributionAmount: Number(form.contribution) || 0,
        penaltyType: form.penaltyType || "fixed",
        penaltyValue: Number(form.penaltyValue) || 0,
        penaltyPerDay: form.penaltyPerDay || false
      }]
    }));
  };

  const handleEditChama = (chamaId, updates) => {
    setState(s => ({
      ...s,
      chamas: s.chamas.map(c => c.id === chamaId ? { ...c, ...updates } : c)
    }));
  };

  // ─── EVENT HANDLERS ───
  const handleNewEvent = (form) => {
    setState(s => ({
      ...s,
      events: [...s.events, {
        id: Date.now(), name: form.name, date: form.date||"01", month: form.month,
        location: form.location, attendees: 0, target: Number(form.target)||0,
        createdBy: user.email, status: "active",
        description: form.description || "",
        mediaImage:  form.mediaImage  || null,
        mediaBanner: form.mediaBanner || null,
        mediaDoc:    form.mediaDoc    || null,
      }]
    }));
  };

  const handleEditEvent = (eventId, updates) => {
    setState(s => ({ ...s, events: s.events.map(e => e.id === eventId ? { ...e, ...updates } : e) }));
  };

  const handleToggleEventStatus = (eventId) => {
    setState(s => ({ ...s, events: s.events.map(e => e.id === eventId ? { ...e, status: e.status === "disabled" ? "active" : "disabled" } : e) }));
  };

  // ─── CHAMA MEMBER HANDLERS ───
  const handleChamaAddMember = (chamaId, member) => {
    setState(s => ({ ...s, chamas: s.chamas.map(c => c.id === chamaId ? { ...c, memberList: [...(c.memberList||[]), member] } : c) }));
  };

  const handleChamaRemoveMember = (chamaId, memberId) => {
    setState(s => ({ ...s, chamas: s.chamas.map(c => c.id === chamaId ? { ...c, memberList: (c.memberList||[]).filter(m => m.id !== memberId) } : c) }));
  };

  // ─── BUILD NOTIFICATIONS ───
  const buildNotifications = () => {
    const notifs = [];
    if (user) {
      const myKitties = state.kitties.filter(k => k.createdBy === user.email);
      const myChamas  = state.chamas.filter(c => c.createdBy === user.email);
      const myEvents  = state.events.filter(e => e.createdBy === user.email);
      const myTxs     = state.transactions.filter(t => t.ownerEmail === user.email && t.type === "Contribution").slice(-5).reverse();

      myTxs.forEach((t,i) => notifs.push({
        id: `tx-${i}`, icon:"💰", bg:"var(--emerald-light)",
        title: `New Contribution`, body: `${t.name} contributed KES ${fmt(t.gross)} to ${t.kitty}`, time: t.time, read: notifsRead
      }));
      myKitties.filter(k => k.raised >= k.goal).forEach(k => notifs.push({
        id:`goal-${k.id}`, icon:"🎯", bg:"var(--brand-light)",
        title:"Goal Reached! 🎉", body:`${k.name} has reached its goal of KES ${fmt(k.goal)}`, time:"Recently", read: notifsRead
      }));
      myChamas.forEach(c => (c.memberList||[]).slice(-2).reverse().forEach((m,i) => notifs.push({
        id:`mem-${c.id}-${i}`, icon:"👥", bg:"var(--violet-light)",
        title:"New Chama Member", body:`${m.name} joined ${c.name}`, time:`Joined ${m.joined}`, read: notifsRead
      })));
      myEvents.filter(e=>e.status==="active").forEach(e => notifs.push({
        id:`ev-${e.id}`, icon:"🎊", bg:"var(--sky-light)",
        title:"Event Active", body:`${e.name} is live — ${e.attendees}/${e.target} attending`, time:`${e.date} ${e.month}`, read: notifsRead
      }));
      if (notifs.length === 0) notifs.push({
        id:"welcome", icon:"🎉", bg:"var(--brand-light)",
        title:"Welcome to M-Pamoja!", body:"Start by creating a kitty, chama, or event.", time:"Now", read: notifsRead
      });
    }
    return notifs.slice(0, 10);
  };

  const notifications = buildNotifications().filter(n => !clearedNotifIds.has(n.id));
  const unreadCount = notifsRead ? 0 : notifications.length;

  // ─── RENDER PAGE FUNCTION ───
  const renderPage = () => {
    const ao = autoOpen;
    if (autoOpen) setAutoOpen(false);
    switch (page) {
      case "overview": return <OverviewPage state={state} user={user} onNav={navWithAutoOpen} onToast={showToast} onRefresh={fetchKittiesFromApi} onWithdraw={handleWithdraw} onContribute={handleContribute} onEditKitty={handleEditKitty} />;
      case "kitties": return <KittiesPage state={state} user={user} onToast={showToast} onNewKitty={handleNewKitty} onEditKitty={handleEditKitty} onWithdraw={handleWithdraw} onContribute={handleContribute} autoOpen={ao} onBack={() => setPage("overview")} />;
      case "chama": return <ChamaPage state={state} user={user} onToast={showToast} onNewChama={handleNewChama} onEditChama={handleEditChama} onChamaContribute={handleChamaContribute} onChamaWithdraw={handleChamaWithdraw} onAddMember={handleChamaAddMember} onRemoveMember={handleChamaRemoveMember} onEditKitty={handleEditKitty} onWithdraw={handleWithdraw} onContribute={handleContribute} autoOpen={ao} onBack={() => setPage("overview")} />;
      case "events": return <EventsPage state={state} user={user} onToast={showToast} onNewEvent={handleNewEvent} onEditEvent={handleEditEvent} onToggleEventStatus={handleToggleEventStatus} onEditKitty={handleEditKitty} onWithdraw={handleWithdraw} onContribute={handleContribute} autoOpen={ao} onBack={() => setPage("overview")} />;
      case "contribute": return <ContributePage state={state} user={user} onToast={showToast} onContribute={handleContribute} />;
      case "withdraw": return <WithdrawPage state={state} user={user} onToast={showToast} onWithdraw={handleWithdraw} />;
      case "whatsapp": return <WhatsappPage state={state} user={user} onToast={showToast} />;
      case "transactions": return <TransactionsPage state={state} user={user} onToast={showToast} />;
      case "settings": return <SettingsPage user={user} onToast={showToast} onLogout={handleLogout} onBack={() => setPage("overview")} />;
      default: return null;
    }
  };

  // ─── NAV ACTIVE CLASS ───
  const navActiveClass = (p) => {
    if (p === "chama" && page === "chama") return "bn-item active-chama";
    if (p === "events" && page === "events") return "bn-item active-events";
    if (page === p) return "bn-item active";
    return "bn-item";
  };

  // ─── SHARE LINK: skip auth, show popup directly ───
  if (publicKittyId) {
    const pk = state.kitties.find(k => String(k.id) === String(publicKittyId));
    const gradBg = {
      minHeight:"100vh", display:"flex", alignItems:"flex-end", justifyContent:"center",
      background:"linear-gradient(160deg,#F0F1FF 0%,#EEF2FF 40%,#EFF8F4 100%)",
      position:"relative", overflow:"hidden"
    };
    const blobs = (
      <>
        <div style={{position:"absolute",width:320,height:320,borderRadius:"50%",background:"#C7D2FE",filter:"blur(70px)",opacity:0.45,top:-80,left:-60,pointerEvents:"none"}} />
        <div style={{position:"absolute",width:260,height:260,borderRadius:"50%",background:"#A7F3D0",filter:"blur(60px)",opacity:0.4,bottom:-60,right:-40,pointerEvents:"none"}} />
        <div style={{position:"absolute",width:180,height:180,borderRadius:"50%",background:"#FDE68A",filter:"blur(50px)",opacity:0.25,bottom:120,left:30,pointerEvents:"none"}} />
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-60%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.5rem",opacity:0.18,pointerEvents:"none",userSelect:"none"}}>
          <MPamojaLogo size={72} />
          <div style={{fontWeight:800,fontSize:"1.4rem",letterSpacing:"-0.03em",color:"#4F46E5"}}>M-Pamoja</div>
        </div>
      </>
    );
    return (
      <div style={gradBg}>
        {blobs}
        {pk ? (
          <PublicContributePopup
            kitty={pk}
            onClose={() => setPublicKittyId(null)}
            onContribute={(kittyId, amount, displayName, phone) => {
              setState(s => ({
                ...s,
                kitties: s.kitties.map(k =>
                  k.id === kittyId
                    ? { ...k, raised: (k.raised||0) + amount, contributors: (k.contributors||0) + 1 }
                    : k
                )
              }));
            }}
          />
        ) : (
          <div style={{width:"100%",maxWidth:440,padding:"1rem",paddingBottom:"2rem",position:"relative",zIndex:1}}>
            <div style={{background:"#fff",borderRadius:24,padding:"2rem 1.5rem",boxShadow:"0 20px 60px rgba(0,0,0,0.12)",textAlign:"center"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>🔍</div>
              <div style={{fontSize:"1rem",fontWeight:700,marginBottom:"0.4rem"}}>Kitty not found</div>
              <div style={{fontSize:"0.8rem",color:"var(--text3)",lineHeight:1.5}}>This link may be expired or incorrect. Ask the organiser to share a fresh link.</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── AUTH SCREEN ───
  if (!user) {
    return (
      <>
        <Toast msg={toast} onDone={() => setToast(null)} />
        <AuthScreen onLogin={handleLogin} />
      </>
    );
  }

  // ─── MAIN APP RENDER ───
  return (
    <div className="dash">
      <Toast msg={toast} onDone={() => setToast(null)} />

      {showNotifs && (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => { setShowNotifs(false); setNotifsRead(true); }}
          onMarkAllRead={() => setNotifsRead(true)}
          onClearAll={(id) => {
            if (id !== null && id !== undefined) {
              setClearedNotifIds(prev => new Set([...prev, id]));
            } else {
              setClearedNotifIds(new Set(notifications.map(n => n.id)));
              setNotifsRead(true);
            }
          }}
        />
      )}

      <header className="mob-header">
  {/* Left: logo + brand → home */}
  <div className="mh-left" onClick={() => setPage("overview")}>
    <div className="mh-logo"><MPamojaLogo size={36} /></div>
    <div className="mh-brand">M-<span>Pamoja</span></div>
  </div>

  {/* Center: scrolling marquee */}
  <div className="mh-center">
    <div className="marquee-track">
      {/* Duplicate for seamless loop */}
      {[0,1].map(copy => (
        <div key={copy} className="marquee-inner" aria-hidden={copy===1}>
          {["M-Pamoja","✦","Let's grow together","✦","Pamoja tunaweza","✦","Community first","✦","M-Pamoja","✦","Let's grow together","✦","Pamoja tunaweza","✦","Community first","✦"].map((txt, i) => (
            txt === "✦"
              ? <span key={i} className="marquee-star">✦</span>
              : <span key={i} className="marquee-item"><span className="marquee-text">{txt}</span></span>
          ))}
        </div>
      ))}
    </div>
  </div>

  {/* Right: notif + avatar */}
<div className="mh-right">
  {/* ── Connection Status Indicator ── */}
  <span 
    style={{ 
      width: 8, 
      height: 8, 
      borderRadius: '50%', 
      background: signalRConnected ? '#10B981' : '#F59E0B',
      display: 'inline-block',
      marginRight: '4px',
      flexShrink: 0
    }}
    title={signalRConnected ? '🟢 Live updates connected' : '🟡 Reconnecting...'}
  />
  
  <button className="mh-notif" style={{position:"relative"}} onClick={() => { setShowNotifs(true); }}>
    {Icons.bell}
    {unreadCount > 0 && (
      <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
    )}
  </button>
  <div className="mh-avatar" onClick={() => setPage("settings")}>{user.initials}</div>
</div>
</header>

      {page !== "overview" && (() => {
        const pageLabels = {
          kitties:"Kitties", chama:"Chama", events:"Events",
          contribute:"Contribute", withdraw:"Withdraw",
          whatsapp:"WhatsApp", transactions:"Transactions", settings:"Settings",
        };
        const label = pageLabels[page] || page;
        return (
          <PortalOrb
            label={label}
            onHome={() => setPage("overview")}
          />
        );
      })()}

      <div className="main-content">
        {renderPage()}
      </div>

      <nav className="bottom-nav">
        <button className={navActiveClass("overview")} onClick={() => setPage("overview")}>
          <div className="bn-icon">{Icons.home}</div>
          <span className="bn-label">Home</span>
        </button>
        <button className={navActiveClass("kitties")} onClick={() => setPage("kitties")}>
          <div className="bn-icon">{Icons.kitties}</div>
          <span className="bn-label">Kitties</span>
        </button>
        <button className={navActiveClass("chama")} onClick={() => setPage("chama")}>
          <div className="bn-icon">{Icons.chama}</div>
          <span className="bn-label">Chama</span>
        </button>
        <button className={navActiveClass("events")} onClick={() => setPage("events")}>
          <div className="bn-icon">{Icons.events}</div>
          <span className="bn-label">Events</span>
        </button>
        <button className={navActiveClass("settings")} onClick={() => setPage("settings")}>
          <div className="bn-icon">{Icons.profile}</div>
          <span className="bn-label">Profile</span>
        </button>
      </nav>

      <Modal open={newKittyModal} onClose={() => setNewKittyModal(false)}>
        <NewKittyForm onSubmit={(form) => { handleNewKitty(form); setNewKittyModal(false); showToast("Kitty Created! 🎉", `"${form.name}" is now live`); }} onClose={() => setNewKittyModal(false)} />
      </Modal>

      {publicKittyId && (() => {
        const pk = state.kitties.find(k => String(k.id) === String(publicKittyId));
        return pk ? (
          <PublicContributePopup
            kitty={pk}
            onClose={() => setPublicKittyId(null)}
            onContribute={(kittyId, amt, displayName, phone) => {
              handleContribute(kittyId, amt, displayName, phone);
              setPublicKittyId(null);
              showToast("Contributed! 🎉", `KES ${fmt(amt)} sent to ${pk.name}`);
            }}
          />
        ) : null;
      })()}
    </div>
  );
}

import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<MPamojaApp />);
}