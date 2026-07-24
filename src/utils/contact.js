// Contact-form delivery via a free Google Apps Script Web App.
// The endpoint is the script's deployed /exec URL. Set it in a .env file
// (VITE_CONTACT_ENDPOINT=…) or paste it into ENDPOINT below. See
// apps-script/SETUP.md for how to create the script and get the URL.
const ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT || 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';

export const contactEndpointReady = () => /^https:\/\//.test(ENDPOINT);

/**
 * Deliver an enquiry. Resolves on success, throws on any failure so the UI
 * can show an error + WhatsApp fallback rather than silently losing the note.
 */
export async function sendEnquiry(payload) {
  if (!contactEndpointReady()) {
    console.warn('[contact] VITE_CONTACT_ENDPOINT is not set, enquiry not delivered.');
    throw new Error('endpoint-not-configured');
  }

  // Deliberately send a plain string body with no custom headers: that makes
  // this a CORS "simple request" (Content-Type defaults to text/plain), so the
  // browser skips the preflight that Apps Script can't answer. Apps Script's
  // 302 → googleusercontent response carries Access-Control-Allow-Origin: *,
  // so we can still read the JSON reply back.
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`send-failed-${res.status}`);

  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(data.error || 'send-failed');
  return data;
}
