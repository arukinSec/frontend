# Statera Admin (Prototype)

Statera Admin is the internal auditing dashboard used to securely monitor and manage connected user accounts (Gmail, Google Drive, Google Contacts) for threat protection and security auditing.

## Architecture & Security
- **Zero-Install Security**: Integrates directly with Google Cloud OAuth. Vulnerable users do not need to install mobile apps or software.
- **Silent Token Refresh**: Implements a highly robust `fetchWithAuth` wrapper. If a Google Access Token expires, the UI pauses, seamlessly invokes a Supabase Edge Function (`refresh-google-token`), updates the token securely, and retries the original request. The user experiences zero interruption.

## Core Integrations

### 1. Profile (`ProfileUI.jsx`)
The landing view when a member is opened. Fetches the full Google profile via `people/me`.
- Displays name, photo, job title, company, bio, nickname
- All linked email addresses with badges: **Primary**, **Linked** (account-level), or **Contact only** — allowing auditors to immediately see which emails are actually tied to the Google account vs just saved in contacts
- All phone numbers, physical addresses, birthday, websites/social URLs, relations
- Stats row: email count, phone count, org count, address count, linked URL count
- Audit record: consent date, status, registered email

### 2. Gmail Gateway (`GmailUI.jsx`)
A fully featured, paginated email client built directly into the dashboard.
- **Optimistic Pagination Engine**: Fetches 80 Message IDs at a time, displays 20, and silently preloads the next 20 metadata objects in the background for instant page transitions without blowing through API quotas.
- **Folder Navigation**: Instantly switch between Inbox, Sent, Spam, and Trash.
- **Advanced Server-Side Search**: Implements a 1000ms debounced search directly against the Gmail API (using the `q` parameter), allowing auditors to instantly query the entire inbox history with advanced operators (e.g., `from:paypal has:attachment`).
- **CRUD Capabilities**:
  - **Read**: Full email viewer with HTML parsing.
  - **Create**: "New Message" compose modal that constructs raw RFC 2822 emails, Base64URL encodes them, and sends them directly via the API.
  - **Delete/Archive**: Instant archiving and trashing of malicious emails.
  - **Update**: Auto-marks unread emails as read upon viewing.

### 3. Google Drive Gateway (`DriveUI.jsx`)
- **Folder navigation** with breadcrumb trail — drill into any folder, navigate back via crumbs.
- **Sidebar views**: My Drive, Shared with me, Images (thumbnail grid), Videos (flat table).
- **File viewer modal**: inline preview for Google Docs/Sheets/Slides (iframe), images (blob), PDFs (embedded), text/JSON/XML (code block). Videos, audio, and binaries show a "no preview" fallback instantly.
- **Custom confirm dialogs** for both download and trash actions (replaces browser `window.confirm`).
- **Real storage quota** fetched from `drive/v3/about` — displays in GB or TB depending on plan.
- Allows downloading standard files and auto-exports Google Workspace documents (Docs, Sheets, Slides) to PDF.
- Audit log written to `audit_logs` table on every trash action.

### 4. Google Contacts Gateway (`ContactsUI.jsx`)
- Built on the Google People API (`connections`).
- **Three tabs**: Contacts (searchable list with incomplete flagging), Companies (grouped by org, expandable), Stats (breakdown with caveat about non-Google contacts).
- **Incomplete contact flagging**: contacts with no name are highlighted in amber with a warning badge.
- Includes job title display alongside company name.

## Setup & Running Locally
```bash
npm install
npm run dev
```
*Note: Ensure the local Supabase Edge Functions are running (`npx supabase functions serve`) in the backend repository for the token refresh system to work!*

---

## 🗺️ Roadmap

### Audit Report Tab (`AuditReportUI.jsx`) — NOT YET BUILT
A dedicated tab that uses Gmail search to automatically detect and summarise connected external accounts.

**How it works:**
- Runs targeted Gmail API searches against known platform sender domains (e.g. `from:facebookmail.com`, `from:linkedin.com`, `from:twitter.com`)
- For each platform where emails are found, surfaces: account status, first email date (approx. signup), last email date (last activity), total email count
- Scans email subject lines to auto-detect security events

**Platforms to detect:**
- Facebook · Instagram · Twitter/X · LinkedIn · TikTok · Snapchat · Pinterest · Reddit · YouTube · WhatsApp
- Financial: PayPal · Stripe · bank notifications · crypto platforms
- Shopping: Amazon · eBay

**Username / handle extraction:**
- Parse email body/subject to extract the actual username or display name used on each platform
- e.g. `"Hi @john_doe, someone logged into your account"` → extracts `@john_doe` for Twitter/X

**Security flags to auto-detect (subject line scan):**
- `⚠️ Suspicious login` — "Someone tried to log in", "Unusual sign-in", "New device login"
- `⚠️ Password changed` — "Your password was changed", "Password reset successful"
- `⚠️ Account recovery` — "Account recovery request", "Verify your identity"
- `⚠️ New account` — "Welcome to X", "Confirm your email" (indicates recently created account)
- `⚠️ 2FA activity` — OTP/verification code emails in volume (indicates active usage)

**Report output format:**
```
CONNECTED ACCOUNTS
──────────────────
✅ Facebook       Last: Jun 12 · 47 emails · ⚠️ Password reset detected
✅ Instagram      Last: Jun 28 · 12 emails
✅ LinkedIn       Last: May 3  · 8 emails
✅ Twitter/X      Last: Jan 24 · 3 emails (inactive)
❌ TikTok         No emails found
❌ Snapchat       No emails found
```

**Future:** Exportable as PDF / JSON report for offline audit records.
