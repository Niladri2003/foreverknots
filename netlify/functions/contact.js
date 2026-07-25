/**
 * foreverknots contact form backend — Amazon SES (Netlify Function)
 * -----------------------------------------------------------------
 * The website's Contact form POSTs an enquiry here. This function then sends
 * TWO emails through Amazon SES (via the AWS SDK):
 *   1. the enquiry to the studio  (reply-to = the couple)
 *   2. an auto thank-you to the sender  (reply-to = the studio)
 *
 * Credentials never touch the browser — they live in Netlify env vars. See
 * netlify/functions/SES_SETUP.md for the one-time AWS + Netlify setup.
 *
 * Required env (Netlify ▸ Site settings ▸ Environment variables):
 *   SES_REGION            e.g. us-east-1 — the region your sender is verified in
 *   SES_ACCESS_KEY_ID     IAM access key id with ses:SendEmail
 *   SES_SECRET_ACCESS_KEY IAM secret access key
 *   CONTACT_FROM          a VERIFIED SES sender, e.g. contact@foreverknots.studio
 *   CONTACT_TO            where enquiries land (defaults to CONTACT_FROM)
 */
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const REGION      = process.env.SES_REGION || 'us-east-1';
const FROM        = process.env.CONTACT_FROM || 'contact@foreverknots.studio';
const TO          = process.env.CONTACT_TO || FROM;
const STUDIO_NAME = 'foreverknots';

// Log the resolved config once per cold start. Never logs the actual keys —
// only whether they're present, so a missing env var is obvious in the logs.
console.log('[contact] init', {
  region: REGION,
  from: FROM,
  to: TO,
  hasAccessKeyId: Boolean(process.env.SES_ACCESS_KEY_ID),
  hasSecretKey: Boolean(process.env.SES_SECRET_ACCESS_KEY),
});

const ses = new SESClient({
  region: REGION,
  // Explicit keys so we never depend on the Lambda runtime's own AWS role
  // (which has no access to your SES account).
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
  },
});

export const handler = async (event, context) => {
  const rid = (context && context.awsRequestId) || '-';
  const log = (...a) => console.log('[contact]', rid, ...a);
  const warn = (...a) => console.warn('[contact]', rid, ...a);
  const t0 = Date.now();

  log('request', event.httpMethod);

  if (event.httpMethod !== 'POST') {
    warn('rejected: method not allowed');
    return json(405, { ok: false, error: 'method-not-allowed' });
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    warn('rejected: body is not valid JSON');
    return json(400, { ok: false, error: 'bad-json' });
  }

  // Honeypot DISABLED for now — it was dropping genuine enquiries (browser
  // autofill / password managers can fill the hidden field). The client still
  // sends `botcheck`; we simply ignore it. To re-enable, drop submissions where
  // it's set — ideally after making the field more autofill-proof first.
  if (data.botcheck) {
    log('honeypot field was set, but honeypot is disabled — processing anyway', {
      email: String(data.email || ''),
      botcheck: String(data.botcheck),
    });
  }

  const name  = String(data.firstName || '').trim();
  const email = String(data.email || '').trim();
  if (!name || !isEmail(email)) {
    warn('rejected: missing fields', { hasName: Boolean(name), hasValidEmail: isEmail(email) });
    return json(400, { ok: false, error: 'missing-fields' });
  }

  // Cloudflare Turnstile — verify the token server-side before we do anything.
  // Secret lives only in the env (TURNSTILE_SECRET); never hard-coded.
  const clientIp = event.headers['x-nf-client-connection-ip']
    || (event.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || undefined;
  try {
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET || '',
        response: String(data.token || ''),
        ...(clientIp ? { remoteip: clientIp } : {}),
      }),
    });
    const outcome = await verify.json();
    if (outcome.success !== true) {
      warn('turnstile verification failed', { codes: outcome['error-codes'] });
      return json(403, { ok: false, error: 'captcha-failed' });
    }
    log('turnstile verified');
  } catch (err) {
    console.error('[contact]', rid, 'turnstile verify error:', errInfo(err));
    return json(502, { ok: false, error: 'captcha-error' });
  }

  const partner = String(data.partnerName || '').trim();
  log('enquiry received', { name, partner: partner || undefined, email, type: data.type || undefined });

  const rows = [
    ['Name', data.firstName],
    ['Partner', data.partnerName],
    ['Email', data.email],
    ['Phone', data.phone],
    ['When', data.date],
    ['Type of shoot', data.type],
    ['Venue / city', data.venue],
    ['Their story', data.story],
  ].filter((r) => r[1]);

  // 1) Notify the studio — this is the one that MUST succeed (it's the lead).
  try {
    log('sending studio notification', { to: TO, from: FROM });
    const res = await ses.send(new SendEmailCommand({
      Source: `${STUDIO_NAME} · website <${FROM}>`,
      Destination: { ToAddresses: [TO] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: `New enquiry: ${name}${partner ? ' & ' + partner : ''}`, Charset: 'UTF-8' },
        Body: { Text: { Data: rows.map((r) => `${r[0]}: ${r[1]}`).join('\n'), Charset: 'UTF-8' } },
      },
    }));
    log('studio notification sent', { messageId: res.MessageId });
  } catch (err) {
    console.error('[contact]', rid, 'studio notification FAILED:', errInfo(err));
    console.error(err);
    return json(502, { ok: false, error: 'send-failed' });
  }

  // 2) Thank the sender — best-effort. If it fails, the studio has already been
  // notified, so we still report success to the couple.
  try {
    log('sending thank-you', { to: email });
    const res = await ses.send(new SendEmailCommand({
      Source: `${STUDIO_NAME} <${FROM}>`,
      Destination: { ToAddresses: [email] },
      ReplyToAddresses: [TO],
      Message: {
        Subject: { Data: 'We have your note · foreverknots', Charset: 'UTF-8' },
        Body: {
          Text: { Data: thankYouText(name), Charset: 'UTF-8' },
          Html: { Data: thankYouHtml(name), Charset: 'UTF-8' },
        },
      },
    }));
    log('thank-you sent', { messageId: res.MessageId });
  } catch (err) {
    console.error('[contact]', rid, 'thank-you FAILED (studio was notified):', errInfo(err));
    console.error(err);
  }

  log('done ok', { ms: Date.now() - t0 });
  return json(200, { ok: true });
};

function json(statusCode, obj) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  };
}

// Compact, log-friendly summary of an AWS SDK / SES error.
function errInfo(err) {
  return {
    name: err && err.name,
    message: err && err.message,
    httpStatus: err && err.$metadata && err.$metadata.httpStatusCode,
  };
}

function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function thankYouText(name) {
  return [
    `Hi ${name},`,
    '',
    'Thank you for writing to foreverknots. Your note is in, and it is read by',
    'us, not a team. You will hear back within two working days, usually with a',
    'few warm questions and a link to book a video call.',
    '',
    'With warmth,',
    'foreverknots',
  ].join('\n');
}

function thankYouHtml(name) {
  return [
    '<div style="font-family:Georgia,\'Times New Roman\',serif;color:#1a1614;',
    'max-width:520px;margin:0 auto;line-height:1.7;font-size:16px;">',
    '<p style="letter-spacing:.18em;text-transform:uppercase;font-size:12px;',
    'color:#9a8f86;margin:0 0 24px;">foreverknots</p>',
    `<p>Hi ${escapeHtml(name)},</p>`,
    '<p>Thank you for writing to us. Your note is in, and it is read by us, ',
    'not a team.</p>',
    '<p>You will hear back within <strong>two working days</strong>, usually with ',
    'a few warm questions and a link to book a video call.</p>',
    '<p style="margin-top:28px;">With warmth,<br>foreverknots</p>',
    '</div>',
  ].join('');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
