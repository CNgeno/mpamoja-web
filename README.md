# M-Pamoja Web (Frontend)

React + Vite SPA, mobile-first, wired to the .NET API. Visual design and tokens are
lifted verbatim from the approved MVP (Sora + DM Mono, indigo→violet brand, emerald money).

## Run locally
```bash
npm install
npm run dev            # http://localhost:5173
```
The Vite dev server proxies `/api` and `/hubs` to the .NET API on `http://localhost:5000`
(see vite.config.js). Start the backend first: `dotnet run --project src/MPamoja.Api`.
If your API runs on a different port, edit the proxy target in vite.config.js.

## Project structure
```
src/
  api/client.js          One fetch wrapper + typed endpoint groups (auth/kitty/public/withdrawal/dev)
  auth/AuthContext.jsx   JWT session, login/logout, auto-expiry, role/userId from token
  realtime/useKittyProgress.js   SignalR live progress hook (FR-CON-09)
  lib/format.js          KES / phone / time formatting
  components/            ui.jsx primitives, BottomNav, PageHeader — all on MVP tokens
  pages/                 Landing, Register, VerifyOtp, Login, Dashboard,
                         CreateKitty, KittyDetail, Withdraw, PublicContribute
  styles/tokens.css      Design tokens extracted verbatim from the MVP
```

## Routes
| Route | Auth | Purpose |
|---|---|---|
| `/` | public | Landing |
| `/register` → `/verify` | public | Sign-up + OTP (FR-AUTH-01/02) |
| `/login` | public | Sign-in (FR-AUTH-08) |
| `/k/:shareToken` | public | Contribution page from the WhatsApp link (FR-AUTH-09, FR-CON-01) |
| `/app` | required | Dashboard — your kitties (FR-KTY-05) |
| `/app/new` | required | 3-step create wizard (FR-KTY-01) |
| `/app/kitty/:id` | required | Detail + live progress + share + withdrawals |
| `/app/kitty/:id/withdraw` | required | Withdraw with OTP (FR-WDR) |

## Testing the full loop locally (matches the Postman walkthrough)
1. Register → you're routed to /verify. The OTP prints in the **API console**.
2. Verify → you land on /app (dashboard).
3. Create a kitty → routed to its detail page. Copy the share link.
4. Open the share link `/k/{token}` in a new tab (or incognito — it's public).
5. Contribute. Without Daraja it shows "Failed"; confirm it via the dev endpoint:
   `POST /api/dev/payments/{intentId}/simulate-success` — then the public page's
   poll flips to "Confirmed" and the total updates live on the detail tab via SignalR.
6. Withdraw: first mark yourself KYC-verified with `POST /api/dev/users/{userId}/verify-kyc`,
   then use the Withdraw screen; settle with `POST /api/dev/withdrawals/{id}/simulate-b2c`.

## Deploy to Vercel
- Push this folder to a Git repo; import it in Vercel (it auto-detects Vite).
- Set env var **VITE_API_BASE_URL** = your API origin, e.g. `https://api.mpamoja.com`.
- vercel.json rewrites all paths to index.html so client routing survives refresh.
- Ensure the API's CORS `Cors:Origins` includes your Vercel domain (already has mpamoja.com).

## What's stubbed / next
- Chama & Events screens (Sprint 4 backend) — not built yet.
- Reports/CSV export UI (Sprint 4).
- Password-reset screens (endpoints exist; add /forgot + /reset pages).
- Real Daraja STK replaces the dev simulate step with no frontend change.
