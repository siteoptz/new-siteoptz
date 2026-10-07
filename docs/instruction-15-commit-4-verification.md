# Instruction 15 — commit 4 verification

Both requirements from the revised commit 4 spec, run against a real Preview deployment
(`new-siteoptz-5ezpzfkrc-siteoptzs-projects.vercel.app`), submitted through an actual browser
(real clicks on the Send button, not a script or curl), with the payload read at the receiving
end rather than from a server log.

## Phase 1 — payload shape, read at webhook.site

`GHL_WEBHOOK_URL` was temporarily pointed at a webhook.site inspector for the Preview
environment. Two submissions, both read back via webhook.site's own API (not this app's logs).

Identifying values below (`smsConsentIp`, `phone`, `email`, `name`, `company`) have been
replaced with RFC 5737/documentation-range placeholders. Field shapes, types, and every other
value - timestamps, the full `smsConsentText`, landing page, ad parameters, `environment` - are
unmodified.

**Checked:**

```json
{
  "name": "Test Submission",
  "email": "test@example.com",
  "phone": "+15555550123",
  "company": "Test Co",
  "role": "Ops",
  "locations": "1",
  "spend": "under-10k",
  "stack": "",
  "smsConsent": true,
  "locationsLabel": "1 location",
  "spendLabel": "Under $10k/month",
  "submittedAt": "2026-10-07T21:27:36.932Z",
  "source": "siteoptz.com/contact",
  "environment": "preview",
  "smsConsentAt": "2026-10-07T21:27:36.932Z",
  "smsConsentPage": "/contact",
  "smsConsentLandingPage": "/contact",
  "smsConsentIp": "203.0.113.42",
  "fbclid": "",
  "utm_source": "",
  "utm_medium": "",
  "utm_campaign": "",
  "utm_content": "",
  "utm_term": "",
  "gclid": "",
  "adParamsSource": ""
}
```

(`smsConsentText` omitted above for length - confirmed separately, byte-identical to
`SMS_CONSENT_TEXT_V1`.)

**Unchecked:**

```json
{
  "name": "Test Submission",
  "email": "test@example.com",
  "phone": "+15555550123",
  "company": "Test Co",
  "role": "Ops",
  "locations": "1",
  "spend": "under-10k",
  "stack": "",
  "smsConsent": false,
  "locationsLabel": "1 location",
  "spendLabel": "Under $10k/month",
  "submittedAt": "2026-10-07T21:29:02.461Z",
  "source": "siteoptz.com/contact",
  "environment": "preview",
  "smsConsentAt": "2026-10-07T21:29:02.461Z",
  "smsConsentPage": "/contact",
  "smsConsentLandingPage": "/contact",
  "smsConsentIp": "203.0.113.42",
  "fbclid": "",
  "utm_source": "",
  "utm_medium": "",
  "utm_campaign": "",
  "utm_content": "",
  "utm_term": "",
  "gclid": "",
  "adParamsSource": ""
}
```

Before each submission, clicking the privacy link inside the consent label (real click, real
new tab) was confirmed to leave the checkbox unchecked both before and after.

## Phase 2 — the real GHL webhook

`GHL_WEBHOOK_URL` was then repointed to the real production GoHighLevel webhook for Preview
(previously only set for Production - this was the gap the checklist flagged, now closed:
Preview has its own value and has been redeployed with it baked in). Two further submissions,
same browser, same deployed form:

- **Checked** - name "SiteOptz GHL Mapping Test - CHECKED", phone +15555550123 (placeholder;
  the live test used a real number provided in chat, not recorded here), confirmed success
  ("Your submission is in.") on the deployed page.
- **Unchecked** - name "SiteOptz GHL Mapping Test - UNCHECKED", same phone, confirmed success
  the same way.

Both are real contacts in production GoHighLevel now, intentionally, so the inbound webhook's
mapping screen has seen `smsConsent` in both states plus every new field. Safe to delete both
once mapping is confirmed.

**Known duplicate risk:** the first two attempts at the "CHECKED" submission hung client-side
(a stuck browser tab, confirmed unrelated to the app - a fresh tab retried immediately and
succeeded normally). The server-side request for a hung attempt may or may not have completed
independently of the client confirmation. **Check GoHighLevel for more than one contact named
"SiteOptz GHL Mapping Test - CHECKED" and delete any extras.**

## Checklist results

- [x] Two browser submissions, box checked and unchecked, read at a request inspector
- [x] `smsConsent` is boolean `false` when unchecked, never `"on"`, `"false"`, or absent
- [x] `smsConsentText` byte identical to `SMS_CONSENT_TEXT_V1`
- [x] `smsConsentIp` is one address, not a chain (confirmed on real Vercel infrastructure, not
      `::1` - actual value redacted above, replaced with the `203.0.113.42` placeholder)
- [x] `smsConsentPage` and `smsConsentLandingPage` both present and non-empty
- [x] All seven ad-parameter fields (`fbclid`/`utm_*`/`gclid`) plus `adParamsSource` present as
      empty strings on a direct visit, never omitted
- [x] `environment` reads `preview` on this preview deploy (confirmed directly; production was
      not separately re-tested here, since production already carried `GHL_WEBHOOK_URL` before
      this session and its own deploys already read `VERCEL_ENV` the same way)
- [x] Phone normalizes to `+1XXXXXXXXXX` - confirmed again here with `(555) 222-3333` and
      `555-444-5555`; all four input formats were already confirmed earlier in this
      instruction's own verification passes
- [x] Privacy link inside the consent label opens without toggling the checkbox
- [x] `GHL_WEBHOOK_URL` present on Preview **and redeployed** - was missing before this
      session; added and confirmed live

Not done here, and not something this session can do - manual GoHighLevel configuration:

- [ ] After mapping: every GHL workflow entry condition requires `Environment = production`
- [ ] A live STOP reply flips SMS DND on the test contact

Both require hands-on access to the GoHighLevel account itself.
