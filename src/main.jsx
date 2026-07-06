import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';
import App from './App';

// Legacy share links (#story=id) → real /stories/:id URLs, before the router boots
const legacyStory = window.location.hash.match(/^#story=(.+)$/);
if (legacyStory) {
  window.history.replaceState(null, '', `/stories/${legacyStory[1]}`);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
