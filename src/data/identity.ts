/**
 * Thin wrapper around the Netlify Identity widget (loaded from CDN on demand,
 * only on the /edit page). Used to gate saving behind a login that only the
 * site owner has — invited via Netlify Identity (Registration: Invite only).
 */

export interface IdentityUser {
  email?: string;
  jwt?: () => Promise<string>;
  token?: { access_token?: string };
}

export interface NetlifyIdentity {
  init: (opts?: Record<string, unknown>) => void;
  open: (tab?: 'login' | 'signup') => void;
  close: () => void;
  logout: () => void;
  currentUser: () => IdentityUser | null;
  on: (event: string, cb: (user?: IdentityUser) => void) => void;
}

const WIDGET_SRC = 'https://identity.netlify.com/v1/netlify-identity-widget.js';

declare global {
  interface Window {
    netlifyIdentity?: NetlifyIdentity;
  }
}

let loader: Promise<NetlifyIdentity | null> | null = null;

export function loadIdentity(): Promise<NetlifyIdentity | null> {
  if (loader) return loader;
  loader = new Promise((resolve) => {
    if (window.netlifyIdentity) {
      resolve(window.netlifyIdentity);
      return;
    }
    const script = document.createElement('script');
    script.src = WIDGET_SRC;
    script.async = true;
    script.onload = () => {
      const id = window.netlifyIdentity ?? null;
      try {
        id?.init();
      } catch {
        /* ignore */
      }
      resolve(id);
    };
    script.onerror = () => resolve(null); // offline / not on Netlify → download mode
    document.head.appendChild(script);
  });
  return loader;
}
