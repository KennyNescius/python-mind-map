import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Editor from './components/Editor.tsx';
import './index.css';

// Minimal path-based routing: /edit opens the editor, everything else the map.
const isEditor = window.location.pathname.replace(/\/+$/, '').endsWith('/edit');

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isEditor ? <Editor /> : <App />}</StrictMode>
);
