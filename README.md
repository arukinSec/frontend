# ArukinSec Frontend

> **Experimental R&D Phase:**
> ArukinSec is currently a highly experimental prototype. None of the beta features listed below are fixed. The purpose of this prototype is to determine which features are actually used, requested, and which ones can be removed. The architecture, feature set, and roadmap are entirely fluid and subject to major pivots.

ArukinSec Frontend is the internal auditing dashboard used to securely monitor and manage connected user accounts (Gmail, Google Drive, Google Contacts) for threat protection and security auditing.

---

## ⚡ Current Features & Implementations

### 1. Architecture & Security
- **Zero-Install Security**: Integrates directly with Google Cloud OAuth. Vulnerable users do not need to install mobile apps or software.
- **Silent Token Refresh**: Implements a highly robust `fetchWithAuth` wrapper. If a Google Access Token expires, the UI pauses, seamlessly invokes a Supabase Edge Function (`refresh-google-token`), updates the token securely, and retries the original request. The user experiences zero interruption.
- **Database Security**: Locked down with strict PostgreSQL Row-Level Security (RLS) policies and `search_path` hardened RPC functions.
- **Content Security Policy (CSP)**: Employs strict HTTP headers to neutralize Cross-Site Scripting (XSS) threats.

### 2. Profile Gateway (`ProfileUI.jsx`)
The landing view when a member is opened. Fetches the full Google profile via `people/me`.
- Displays name, photo, job title, company, bio, nickname.
- All linked email addresses with badges: **Primary**, **Linked** (account-level), or **Contact only**.
- Audit record: consent date, status, registered email.

### 3. Gmail Gateway (`GmailUI.jsx`)
A fully featured, paginated email client built directly into the dashboard.
- **Optimistic Pagination Engine**: Fetches 80 Message IDs at a time, displays 20, and silently preloads the next 20 metadata objects in the background.
- **Advanced Server-Side Search**: Implements a debounced search directly against the Gmail API, allowing advanced operators (e.g., `from:paypal has:attachment`).
- **Sanitization**: All HTML email bodies are strictly sanitized via `DOMPurify` before rendering to prevent malicious tracking pixels.
- **Remediation**: Instant archiving and trashing of malicious emails. Pro users can execute bulk archive/delete operations.

### 4. Google Drive Gateway (`DriveUI.jsx`)
- **Folder Navigation** with breadcrumb trail — drill into any folder, navigate back via crumbs.
- **File Viewer Modal**: Inline preview for Google Docs/Sheets/Slides (iframe), images (blob), PDFs (embedded), text/JSON/XML (code block). 
- **Real Storage Quota** fetched from `drive/v3/about`.

### 5. Google Contacts Gateway (`ContactsUI.jsx`)
- Built on the Google People API (`connections`).
- **Three Tabs**: Contacts (searchable list), Companies, Stats.
- **Incomplete Flagging**: Contacts with no name are highlighted in amber with a warning badge.

### 6. Billing Console
- **Razorpay Integration**: Dynamic checkout powered by Supabase Edge Functions allowing users to upgrade to PRO or purchase additional connection slots a-la-carte.

---

## 🚀 Future Roadmap

The following concepts are planned or under consideration for future updates:

### Audit Report Tab (`AuditReportUI.jsx`)
A dedicated tab that uses Gmail search to automatically detect and summarize connected external accounts.
- Runs targeted Gmail API searches against known platform sender domains (e.g. `from:facebookmail.com`, `from:linkedin.com`).
- Scans email subject lines to auto-detect security events (`⚠️ Suspicious login`, `⚠️ Password changed`).

### 24-Hour Connection Cooldown
An anti-abuse measure to prevent rapid exploitation by bad actors.
- When a Member authenticates, the connection enters a mandatory **24-hour verification cooldown** before any data can be fetched.

### Batch Exporter (Download as ZIP)
Allows auditors to export batches of emails or Drive files for offline forensic review or backup custody.
- Dynamically packages all exported text files into a single `.zip` archive on the client side using compression libraries.

### Batch Email Sender (Pro / Self-Hosted Feature)
To facilitate compliance, setup notifications, and custom outreach (e.g. RSVP, quarterly security warnings).
- **CSV Parsing:** Upload a standard `.csv` list with custom header variables.
- **API Rate-Limiting & Queueing:** Restricts mailing speed to conform to Google SMTP/Gmail API caps (e.g., 500 sends/day limit on free Gmail) by inserting a 500ms delay queue.

### Scheduled Newsletter & Security Alerts (Cron Dispatch)
Auditors can schedule recurring outreach, security updates, or newsletters to connected member accounts managed by a background scheduler.

### OTP Redirects & Forwarding (Cross-Account OTP Relay)
Enables secure forwarding of time-sensitive One-Time Passwords (OTPs) from a monitored account (Account A) to the auditor's dashboard or notification line (Account B).

### Expanded Google Ecosystem (YouTube, Blogger, Photos)
Deep integrations for auditing additional Google services:
- **YouTube:** Auditing watch histories and comments for radicalization or malicious links.
- **Blogger:** Monitoring published content for unauthorized posts.
- **Google Photos:** Scanning metadata for location anomalies.

---

## 🛠️ Local Development & Deployment
```bash
npm install
npm run dev
```
*Note: Ensure the local Supabase Edge Functions are running (`npx supabase functions serve`) in the backend repository for the token refresh system to work!*

<!-- Trigger Cloudflare Redeploy -->
