import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Editor from './components/Editor.tsx';
import { loadIdentity } from './data/identity.ts';
import './index.css';

// Minimal path-based routing: /edit opens the editor, everything else the map.
const isEditor = window.location.pathname.replace(/\/+$/, '').endsWith('/edit');

// Netlify Identity invite/recovery/OAuth links land on the site root with a
// token in the URL hash (e.g. #invite_token=…). The widget must be present to
// catch it and show the "set password" / finish-login form, then send the user
// to the editor. We only load it when such a token is present, so public pages
// stay clean.
const hash = window.location.hash;
const hasIdentityToken =
  /\b(invite_token|recovery_token|confirmation_token|email_change_token|access_token|error)=/.test(hash);

if (hasIdentityToken && !isEditor) {
  loadIdentity().then((id) => {
    id?.on('login', () => {
      window.location.href = '/edit';
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isEditor ? <Editor /> : <App />}</StrictMode>
);
