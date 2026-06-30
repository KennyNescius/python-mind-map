import { ContentData } from './content';

/**
 * Persists the edited content. In production this POSTs to a Netlify Function
 * (added in Phase 3) which commits content.json back to the GitHub repo. The
 * function is gated behind Netlify Identity, so we attach the logged-in user's
 * JWT when available.
 */

const SAVE_ENDPOINT = '/.netlify/functions/save-content';

interface NetlifyUser {
  token?: { access_token?: string };
  jwt?: () => Promise<string>;
}

interface NetlifyIdentity {
  currentUser?: () => NetlifyUser | null;
}

async function getAuthToken(): Promise<string | null> {
  const identity = (window as unknown as { netlifyIdentity?: NetlifyIdentity }).netlifyIdentity;
  const user = identity?.currentUser?.();
  if (!user) return null;
  try {
    if (typeof user.jwt === 'function') return await user.jwt();
  } catch {
    /* fall through */
  }
  return user.token?.access_token ?? null;
}

export async function saveContent(data: ContentData): Promise<void> {
  const token = await getAuthToken();
  const res = await fetch(SAVE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Сохранение не удалось (HTTP ${res.status}). ${text}`.trim());
  }
}

/** Offline fallback: download content.json so it can be committed by hand. */
export function downloadContent(data: ContentData): void {
  const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
