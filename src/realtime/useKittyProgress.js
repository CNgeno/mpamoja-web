import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { tokenStore } from '../api/client';

const HUB_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Subscribes to live progress for a kitty (FR-CON-09).
 * Returns the latest { raised, goal, contributorCount, pct } or null until the first push.
 */
export function useKittyProgress(kittyId) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (!kittyId) return;
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${HUB_BASE}/hubs/kitty`, {
        accessTokenFactory: () => tokenStore.get() || '',
      })
      .withAutomaticReconnect()
      .build();

    let active = true;
    conn.on('kittyProgress', (p) => { if (active) setProgress(p); });

    conn.start()
      .then(() => conn.invoke('WatchKitty', String(kittyId)))
      .catch(() => { /* proxy or hub down in dev — page still works via polling/refresh */ });

    return () => {
      active = false;
      conn.invoke('UnwatchKitty', String(kittyId)).catch(() => {});
      conn.stop().catch(() => {});
    };
  }, [kittyId]);

  return progress;
}
