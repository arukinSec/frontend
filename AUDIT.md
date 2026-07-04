# Arukin Admin Prototype Audit

Date: 2026-07-03

Scope: local audit of `/home/phxlm/Work/websites/statera-workspace/arukin-admin`, focused on code integrity, security issues, and product/design direction for a prototype admin application.

No source files were changed during the audit.

## Verification

- `npm run build` passed.
- `npm run lint` passed with warnings.
- `npm audit --omit=dev` reported 0 known production dependency vulnerabilities.

## Highest Priority Findings

### Hard-coded admin credential

`create_admin.js` contains a tracked admin signup credential:

- `create_admin.js:9`

Remove this file or turn it into a parameterized local-only script, rotate that account password, and assume the credential is exposed.

### Client-side auth boundary

The app uses browser state as a practical authorization boundary. `admin_session`, `manager_id`, tier, role, and auth ID are read from `localStorage` and used for routing/data filters:

- `src/App.jsx:32`
- `src/pages/MembersList.jsx:21`

Any browser user can tamper with these values. This is only safe if Supabase RLS independently enforces every ownership rule using server-owned identity such as `auth.uid()`.

### Open manager self-provisioning

Any signed-in Google user can become an manager record if `admin_session` is present, because the app auto-inserts into `managers`:

- `src/App.jsx:50`

That conflicts with the "authorized managers only" product language unless open manager signup is intentional.

### Raw Google tokens reach the browser

Member Google provider tokens are stored in `members` and then selected into the manager browser:

- `src/pages/ClientGateway.jsx:115`
- `src/pages/MemberDashboard.jsx:30`

The requested Google scopes include full Drive and full Gmail access:

- `src/pages/ClientGateway.jsx:6`

This is the central security risk. Prefer server-side Google API proxying through Edge Functions, encrypted refresh-token storage, and never returning raw provider tokens to the browser.

### Missing server-side proof

This frontend repo does not include local Supabase migrations, RLS policies, or Edge Function source for:

- `verify_manager_capacity`
- `refresh-google-token`
- `create-subscription`

Because of that, this repo cannot prove BOLA/IDOR protection. These functions must validate the authenticated caller and object ownership server-side.

## Functional Integrity

### Gmail bulk actions crash

Gmail bulk actions call `setMultiActionLoading`, but that state setter is never declared:

- `src/components/GmailUI.jsx:582`

The same bulk archive/delete actions also lack the Pro-tier guard used by single-message archive/delete.

### Pro/free gating is cosmetic

Tier is read from `localStorage`:

- `src/components/GmailUI.jsx:7`
- `src/components/ContactsUI.jsx:6`
- `src/components/DriveUI.jsx:157`

Once Google tokens are in the browser, a user can bypass UI locks with devtools. Paid-feature and destructive-action authorization needs to live server-side.

### Member search is not wired

The member search input is present but has no state or filtering:

- `src/pages/MembersList.jsx:496`

### README overstates Drive behavior

The README claims Drive download/trash and audit logging, but the current Drive UI only lists/previews and shows a future-update toast for downloads:

- `README.md:37`
- `src/components/DriveUI.jsx:511`

## Security Design Issues

### Weak invite/auth code model

Six-digit manager auth IDs are generated with `Math.random()` in the client:

- `src/App.jsx:51`

Use server-generated, high-entropy invite tokens with expiry, revocation, rate limiting, and audit events.

### Payment function trusts client-supplied IDs

`create-subscription` receives a client-supplied `manager_id`:

- `src/pages/MembersList.jsx:122`

The Edge Function must ignore or verify this against the authenticated user. Otherwise users can attempt payment actions for other managers.

### HTML email rendering needs stricter policy

The app sanitizes email HTML with DOMPurify, which is good:

- `src/components/GmailUI.jsx:902`

However, email HTML can still include tracking images and external links unless explicitly blocked, rewritten, or proxied. Add a stricter email rendering policy.

### Missing CSP/security headers

No CSP/security headers are present in the visible static deploy files:

- `index.html:3`
- `public/_redirects:1`

This matters because the app handles Gmail HTML and dynamically loads payment scripts.

## Design And Product Philosophy

The product direction is coherent for a prototype, but the interface mixes a high-trust security console with aggressive upsell mechanics and broad destructive powers. For a vulnerable-family-member safety tool, the product should bias toward consent clarity, cooldowns, read-only defaults, revocation visibility, and audit trails before monetized unlocks.

The most important roadmap correction is to implement the 24-hour connection cooldown and server-side access controls before expanding features. The current code can request and retain very powerful Google access before those safeguards exist.

## Suggested Remediation Order

1. Rotate/remove the hard-coded admin credential.
2. Move Google API calls behind server-side functions and stop returning provider tokens to the browser.
3. Add or verify Supabase RLS for `managers`, `members`, and `audit_logs`.
4. Require server-side ownership checks in `verify_manager_capacity`, `refresh-google-token`, and `create-subscription`.
5. Replace 6-digit client-generated auth IDs with server-generated invite tokens.
6. Fix Gmail bulk action runtime crash and add server-side feature gating.
7. Add CSP/security headers and stricter HTML email rendering controls.
8. Align README and public claims with currently implemented behavior.

## Next Steps

1. Rotate and remove secrets from `/home/phxlm/Work/websites/statera-workspace/.env`, `/home/phxlm/Work/websites/statera-workspace/arukin-admin/.env.local`, and `/home/phxlm/Work/websites/statera-workspace/arukin/.env`.
2. Revoke and replace the exposed Supabase service role, secret key, DB password, and Google OAuth client secret.
3. Patch `public.verify_manager_capacity` and `public.increment_slots` to set a fixed `search_path`, then rerun `supabase db advisors --db-url ... --type security`.
4. Replace client-side trust in `localStorage` with server-side ownership checks and, where possible, Supabase auth-derived identity.
5. Move Google token handling behind server-side code and stop returning raw provider tokens to the browser.
6. Add or verify stricter RLS policies for `public.managers`, `public.members`, and `public.audit_logs`.
7. Fix the Gmail bulk-action runtime bug in `src/components/GmailUI.jsx`.
8. Reconcile the README and marketing claims with the prototype's actual behavior before any broader rollout.

Report ends here.
