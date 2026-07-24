// Contact-form delivery.
//
// In production the form POSTs to a same-origin Netlify Function
// (netlify/functions/contact) that sends two emails via Amazon SES: the enquiry
// to the studio and an automatic thank-you to the sender. Keys stay server-side.
//
// The endpoint can be overridden with VITE_CONTACT_ENDPOINT — e.g. to point at a
// different function path, or the legacy Google Apps Script /exec URL.
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || '/.netlify/functions/contact';

// A relative same-origin path is always "ready"; an override is ready if it's a
// URL. (In `vite` dev the function isn't served — use `netlify dev`, or the send
// will fail and the form falls back to its WhatsApp option.)
export const contactEndpointReady = () =>
  ENDPOINT.startsWith('/') || /^https?:\/\//.test(ENDPOINT);

/**
 * Deliver an enquiry. Resolves on success, throws on any failure so the UI can
 * show an error + WhatsApp fallback rather than silently losing the note.
 */
export async function sendEnquiry(payload) {
  if (!contactEndpointReady()) {
    console.warn('[contact] VITE_CONTACT_ENDPOINT is not set, enquiry not delivered.');
    throw new Error('endpoint-not-configured');
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`send-failed-${res.status}`);

  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(data.error || 'send-failed');
  return data;
}
