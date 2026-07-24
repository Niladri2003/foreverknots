# Contact form backend: Amazon SES via a Netlify Function

The enquiry form POSTs to a same-origin Netlify Function
(`netlify/functions/contact.js`) that sends two emails through **Amazon SES**:

1. the **enquiry** → the studio inbox (`CONTACT_TO`), reply-to = the couple
2. an **auto thank-you** → the person who wrote in, reply-to = the studio

Keys live only in Netlify env vars — never in the browser or the repo.

## Status (already done ✅)

- **Domain `foreverknots.studio` verified** in SES → you can send **From** any
  `@foreverknots.studio` address (e.g. `contact@foreverknots.studio`).
- **Production access granted** (out of the SES sandbox) → the thank-you can be
  sent to **any** enquirer, not just verified addresses.

So only two things remain: an IAM key, and the Netlify env vars.

## 1. Get an IAM access key (Access Key ID + Secret)

The AWS SDK uses SES's **API**, which needs an IAM **access key id + secret access
key**. Note: an SES **SMTP password is NOT the same thing** and will not work with
the SDK.

**Shortcut — reuse the user AWS already made for you.** When you created SMTP
credentials, AWS created an IAM user (e.g. `ses-smtp-user.20260724-…`) that
already has SES send permission. Just add an access key to it:

1. AWS console → **IAM → Users → open that `ses-smtp-user.*` user**.
2. **Security credentials** tab → **Create access key** → choose *Application
   running outside AWS* → **Create**.
3. Copy the **Access Key ID** and **Secret access key**. (The secret is shown
   **once** — grab it now.)

> Prefer a clean, separate user instead? Create one, attach an inline policy with
> `{"Effect":"Allow","Action":"ses:SendEmail","Resource":"*"}`, then create an
> access key on it.

> Keep these secret. They go straight into Netlify below — do not paste them
> into code, commits, chat, or anywhere in the repo.

## 2. Set the env vars in Netlify

Netlify → **Site settings → Environment variables → Add**. Add these five:

| Key | Value |
|-----|-------|
| `SES_REGION` | `us-east-1` |
| `SES_ACCESS_KEY_ID` | *(the IAM Access Key ID)* |
| `SES_SECRET_ACCESS_KEY` | *(the IAM Secret access key)* |
| `CONTACT_FROM` | `contact@foreverknots.studio` |
| `CONTACT_TO` | **the real inbox you actually read** (see note) |

> ⚠️ **`CONTACT_TO`** — this is where your leads land, so point it at a mailbox
> you genuinely check. `contact@foreverknots.studio` is only *verified for
> sending*; it is not necessarily a real mailbox that receives mail. If you don't
> have a working `@foreverknots.studio` inbox, set `CONTACT_TO` to your everyday
> address (e.g. your Gmail). Reply-to is set to the couple either way, so hitting
> Reply always reaches them.

Redeploy (or trigger a deploy) after adding the variables so the function picks
them up.

## 3. Test end to end

Submit the form on the deployed site with a real email you can check:

- **`CONTACT_TO`** receives the enquiry (reply-to = the couple).
- **The sender** receives the branded "We have your note · foreverknots"
  thank-you (reply-to = the studio).

If either is missing, open the function log: Netlify → **Logs → Functions →
`contact`**. Errors from SES (e.g. `MessageRejected`, an unverified From) show up
there.

## Local development

`vite` alone does **not** serve functions. To exercise the form locally, run
`netlify dev` (Netlify CLI) with the same env vars in a local `.env`, which
serves both the site and `/.netlify/functions/contact`. Otherwise the send fails
locally and the form shows its WhatsApp fallback — which is expected.

## Good to know

- **Cost:** SES is ~US$0.10 per 1,000 emails; each enquiry sends 2. Effectively
  cents per month. Netlify Functions are free far beyond a contact form's volume.
- **From vs reply-to:** the "From" is now literally `contact@foreverknots.studio`
  (domain verified), which is better for branding and deliverability than the old
  Apps Script approach. Replies still route by the per-email reply-to.
- **Overriding the endpoint:** the client defaults to
  `/.netlify/functions/contact`. Set `VITE_CONTACT_ENDPOINT` to override (e.g. to
  fall back to the legacy Apps Script `/exec` URL).
- **Spam:** a hidden honeypot field is included; bot-filled submissions are
  dropped server-side before any email is sent.
