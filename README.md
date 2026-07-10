# Arukin Frontend

Arukin is an advanced security monitoring and account management gateway designed for at-risk persons (vulnerable adults, the elderly, or targets of cyberstalking). It provides a "Trusted Guardian" console for managers to safely steward Google Workspace environments.

This repository contains the highly secure, React 19 + Vite 8 internal dashboard.

---

## Technical Documentation

For a comprehensive breakdown of how Arukin operates securely under the hood, please refer to the official documentation located in the root workspace `docs` repository.

The documentation has been completely restructured into an enterprise knowledge base containing Architecture Decision Records (ADRs) and rigorous security models.

👉 **[Arukin Documentation Hub](https://github.com/arukinSec/docs)**

---

## Key Highlights

### 1. Zero-Install Stewardship
Integrates directly with Google Cloud OAuth. Vulnerable users do not need to install mobile apps, browser extensions, or endpoint management software, minimizing adoption friction and avoiding "stalkerware" paradigms.

### 2. Maximum Security Architecture
- **Server-Side API Proxying**: To eliminate token leakage, the frontend never connects to Google APIs directly. All requests are routed through a backend Supabase Edge Function proxy which injects the access token securely on the server.
- **AES-GCM Client Caching**: Uses the Web Crypto API to securely encrypt cached API responses in the browser's IndexedDB.
- **Content Security Policy & Sanitization**: Employs strict CSP tags and `DOMPurify` to neutralize Cross-Site Scripting (XSS) threats and block raw Google API domains, enforcing the proxy route.

### 3. Core Capabilities
- **Gmail Gateway**: An advanced email client featuring a Footprint Scanner to detect linked Social Media and Financial accounts.
- **Google Drive Gateway**: Drill into folders and securely preview files in a protected iframe.
- **Contacts & Profile**: Map digital exposure and monitor connected organizations.

---

## Local Development

Ensure you have the backend (Supabase) running locally or configured to point to your cloud instance.

```bash
npm install
npm run dev
```

*Note: For the authentication and token proxying to work correctly, the Supabase Edge Functions (`npx supabase functions serve`) must be running in the backend repository.*
