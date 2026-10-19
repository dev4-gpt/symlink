import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// The server requires an access key for every /api route (SYMVIBE_API_KEY). Send it only to this app's own
// /api paths, keep it for the browser session, and ask for it once if the server says it is missing.
const ACCESS_KEY_STORAGE = 'symvibe-access-key';
const nativeFetch = window.fetch.bind(window);
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const isOwnApi = url.startsWith('/api/') || url.startsWith(`${window.location.origin}/api/`);
  if (!isOwnApi) return nativeFetch(input, init);
  const send = (key: string | null) => {
    const headers = new Headers(init?.headers);
    if (key) headers.set('Authorization', `Bearer ${key}`);
    return nativeFetch(input, { ...init, headers });
  };
  let response = await send(sessionStorage.getItem(ACCESS_KEY_STORAGE));
  if (response.status === 401) {
    const entered = window.prompt('Enter the access key for this workspace');
    if (entered) {
      sessionStorage.setItem(ACCESS_KEY_STORAGE, entered);
      response = await send(entered);
    }
  }
  return response;
};

createRoot(document.getElementById('root')!).render(<App />);
