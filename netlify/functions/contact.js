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

const ses = new SESClient({
  region: REGION,
  // Explicit keys so we never depend on the Lambda runtime's own AWS role
  // (which has no access to your SES account).
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
  },
});

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'method-not-allowed' });
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'bad-json' });
  }

  // Honeypot: bots fill the hidden field. Pretend success, send nothing.
  if (data.botcheck) return json(200, { ok: true });

  const name  = String(data.firstName || '').trim();
  const email = String(data.email || '').trim();
  if (!name || !isEmail(email)) return json(400, { ok: false, error: 'missing-fields' });

  const partner = String(data.partnerName || '').trim();
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
    await ses.send(new SendEmailCommand({
      Source: `${STUDIO_NAME} · website <${FROM}>`,
      Destination: { ToAddresses: [TO] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: `New enquiry: ${name}${partner ? ' & ' + partner : ''}`, Charset: 'UTF-8' },
        Body: { Text: { Data: rows.map((r) => `${r[0]}: ${r[1]}`).join('\n'), Charset: 'UTF-8' } },
      },
    }));
  } catch (err) {
    console.error('[contact] studio notification failed:', err);
    return json(502, { ok: false, error: 'send-failed' });
  }

  // 2) Thank the sender — best-effort. If it fails, the studio has already been
  // notified, so we still report success to the couple.
  try {
    await ses.send(new SendEmailCommand({
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
  } catch (err) {
    console.error('[contact] thank-you failed (studio was notified):', err);
  }

  return json(200, { ok: true });
};

function json(statusCode, obj) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
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
