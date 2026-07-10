import React from 'react';

export const faqCategories = [
  {
    id: 'general',
    title: 'General & Terminology',
    description: 'The basics of Arukin, how it works, and key terminology.',
    questions: [
      {
        q: "What is Arukin?",
        a: <>Arukin is a Google account management and oversight tool designed for families and professionals. It lets a trusted person (the Manager) oversee the Google accounts of children, elderly relatives, or high-profile individuals for signs of phishing, scams, and data leaks — without ever needing their passwords.</>
      },
      {
        q: "What is a Manager?",
        a: <>A Manager is the admin of the Arukin dashboard. This is usually the family member or professional who sets up the system. Managers log in with basic Google profile scopes (just email and profile picture) to access the dashboard and generate Connection IDs for the people they look after.</>
      },
      {
        q: "What is a Member?",
        a: <>A Member is the person being looked after (e.g., a parent or grandparent). They connect their Google account to the Manager's dashboard using a secure 6-digit Connection ID. By connecting, they grant the Manager restricted access to scan their Inbox, Drive, and Contacts for threats.</>
      },
      {
        q: "What is a Self-Audit?",
        a: <>A Self-Audit is a safe way to test Arukin's capabilities on your own data before inviting family members. By connecting your own email and accepting the necessary scopes to perform a self-audit, you become a Trial member, unlocking PRO features for your own account.</>
      },
      {
        q: "How do I connect a family member's account?",
        a: <>1. Log into your Manager dashboard.<br/>2. Note your 6-digit Connection ID displayed at the top.<br/>3. Send the person you're helping to the 'Member Portal' link (arukin.pages.dev/client).<br/>4. They log in with their Google account and enter your 6-digit ID.<br/>5. They authorize the Google scopes, and they will instantly appear on your dashboard.</>
      }
    ]
  },
  {
    id: 'pricing',
    title: 'Pricing, Memberships & Open Source',
    description: 'Learn about our open-source philosophy, hosted plans, and scan limits.',
    questions: [
      {
        q: "What is the difference between Free, Trial, Weekly Pass, and Pro Memberships?",
        a: <><p className="mb-2"><strong>Free Tier:</strong> Allows you to have 1 active member account. You get read-only access to their inbox, Drive, and limited contact information. Active operations (like deleting emails) are locked.</p><p className="mb-2"><strong>Trial Membership:</strong> A free feature enabled when Managers connect their email and accept the scopes to perform a self-audit. Trial members can have 2 active accounts (1 self-audit account with full PRO features, and 1 member account with limited FREE features).</p><p className="mb-2"><strong>Weekly Pass:</strong> A 1-week (7-day) paid license that unlocks full PRO features for all your connected members for a short duration.</p><p><strong>Annual PRO:</strong> Unlocks all features permanently for the year, including full active operations, advanced threat detection, and priority support. PRO members can have 1 self-audit account + 3 active member accounts.</p></>
      },
      {
        q: "How many members can I connect?",
        a: <>Free accounts can have 1 active member account. Trial members can have 2 active accounts (1 self-audit + 1 member). Weekly Pass and PRO accounts can have 1 self-audit + 3 active member accounts.</>
      },
      {
        q: "What are 'Scan Limits'?",
        a: <><p className="mb-2">To prevent API abuse and manage Google quota limits, we enforce monthly scan limits per member.</p><ul className="list-disc pl-5"><li><strong>Free accounts:</strong> 1 insight scan + 2 footprint scans per month.</li><li><strong>PRO accounts:</strong> 5 insight scans + 10 footprint scans per month.</li></ul><p className="mt-2">An 'insight scan' refers to a deep analysis of inbox threats, while a 'footprint scan' looks at overall account health and connected apps.</p></>
      },
      {
        q: "Is Arukin completely open-source?",
        a: <>Yes! The core Arukin architecture, including the React frontend and Supabase edge functions, is 100% open-source. Anyone can view the code, audit our security practices, contribute, or self-host the platform. You can find our official repositories at github.com/arukin.</>
      },
      {
        q: "If it's free and open-source, why do you charge for pricing plans?",
        a: <>While the software itself is free, the infrastructure required to run it securely is not. Our paid plans cover our <strong>Managed Cloud Hosting</strong>. When you purchase a PRO plan, you are paying for the convenience of high-availability servers, automated updates, ongoing maintenance, and out-of-the-box security without the headache of managing databases and edge functions yourself.</>
      },
      {
        q: "Can I self-host Arukin?",
        a: <>Absolutely, and we encourage it for users who require absolute data isolation! You can deploy Arukin on your own AWS, GCP, or VPS infrastructure. If you need enterprise-level assistance setting up a self-hosted instance, we offer a paid <strong>Self-Hosted Enterprise Pass</strong> which provides priority onboarding and setup assistance.</>
      }
    ]
  },
  {
    id: 'features',
    title: 'Features & Capabilities',
    description: 'Discover what Arukin can and cannot do to protect accounts.',
    questions: [
      {
        q: "What data can I actually see as a Manager?",
        a: <>Once a member connects, you can view their recent emails (to spot phishing or fake invoices), view their Google Drive files (specifically checking for publicly exposed sensitive documents), and review their Google Contacts (to spot suspicious connections or known scammers).</>
      },
      {
        q: "Can I reply to their emails or delete their files?",
        a: <>Arukin is designed as an auditing tool, not an email client. You cannot compose new emails or send replies on their behalf. However, on PRO plans, you <em>can</em> use Active Operations to instantly archive or trash malicious emails to prevent the member from clicking them.</>
      },
      {
        q: "Can I download their Google Drive files?",
        a: <>On the Free tier, Drive oversight is read-only and non-interactive. On the PRO tier (and for self-audit on Trial), Managers can securely preview and download specific file types (like PDFs or Docs) to inspect them for malware or sensitive leaked data.</>
      },
      {
        q: "Does it monitor YouTube, Google Photos, or Google Maps?",
        a: <>No. While these integrations are on our long-term roadmap, they are intentionally excluded from the current version. We adhere to a strict principle of data minimization—we only request the scopes absolutely necessary to stop financial fraud and phishing (Gmail, Drive, Contacts).</>
      }
    ]
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    description: 'How we keep tokens safe and ensure data never leaks.',
    questions: [
      {
        q: "Does Arukin ask for or store my family member's password?",
        a: <>Never. Arukin uses standard Google OAuth 2.0. Members log in directly through Google's secure servers. We only receive an access token, which we use to query APIs. We never see, touch, or store their passwords.</>
      },
      {
        q: "Does Arukin store my family's emails on its servers?",
        a: <>No. Arukin utilizes a strict <strong>Server-Side Proxy Architecture</strong>. When you view a member's inbox, the request is securely routed through our proxy edge functions straight to Google's API. The data is fetched in real-time and passed to your dashboard. We do not store their emails, drive files, or contacts in our database.</>
      },
      {
        q: "How is my dashboard data protected?",
        a: <>Data fetched to your dashboard is cached locally in your browser to improve performance. This cache is protected by Web Crypto AES-GCM encryption, meaning the data at rest on your device is encrypted and bound uniquely to your active session.</>
      },
      {
        q: "How do I revoke access as a member?",
        a: <>Go to <a href="https://myaccount.google.com/connections" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">https://myaccount.google.com/connections</a> with the Google account you authenticated. Search for <strong>Arukin</strong> and simply click "Delete all connections you have with Arukin" at the bottom. This completely revokes Arukin and the Manager's access to your account. Even if the Manager hasn't disconnected you from their dashboard, they will no longer be able to see or view your emails, drive files, or contacts.</>
      },
      {
        q: "Will Google send them a security alert when I connect?",
        a: <>Yes. As per standard Google security protocols, when a member first connects their account to Arukin and grants access to their Gmail/Drive, Google will send them a security alert email notifying them that a new application was authorized.</>
      },
      {
        q: "Does Arukin sell my family's data to advertisers or third parties?",
        a: <>Absolutely not. Arukin operates on a strict zero-knowledge, zero-persistence model. We charge for our cloud infrastructure, not by monetizing your data.</>
      },
      {
        q: "Can the Arukin developers or support team see my emails or Drive files?",
        a: <>No. Our backend utilizes "blind" edge functions. They act only as a secure tunnel between your browser and Google's API. Because the data is never saved to our database, there is physically nothing for our team to look at.</>
      },
      {
        q: "What stops a hacker from using Arukin as a spyware tool against someone?",
        a: <>Two things. First, the member must explicitly consent and pass through Google's strict OAuth warning screens. Second, Google sends an immediate security alert to their phone/email the moment Arukin is authorized, making it impossible to install silently.</>
      },
      {
        q: "How long does Arukin retain access to a member's account?",
        a: <>Access remains valid until either the member manually revokes it or their token expires (Google automatically invalidates tokens if a password is changed or if the app goes unused for 6 months).</>
      },
      {
        q: "Is Arukin GDPR and CCPA compliant?",
        a: <>Yes. Because we do not store personal member data on our servers (only the Manager's account email), compliance is inherently built-in. If you request account deletion, all active connection bridges are permanently destroyed within 24 hours.</>
      },
      {
        q: "Why does Google say 'Google hasn't verified this app' when I try to connect?",
        a: <><p className="mb-2">Because Arukin requests highly sensitive permissions (like reading Gmail and Drive), Google classifies it as a "Restricted Scope" application. To officially remove this warning, Google requires developers to pay for a mandatory third-party security audit (CASA) which costs between $15,000 and $75,000 annually.</p><p>Because Arukin is a free, independent open-source project, we simply cannot afford this corporate assessment fee. The app operates exactly as described and is perfectly safe, but Google will show this warning because we do not have the financial backing of a massive corporation.</p></>
      },
      {
        q: "How do I bypass the 'Unverified App' warning?",
        a: <>When you encounter the "Google hasn't verified this app" screen during login, simply click the <strong>"Advanced"</strong> link at the bottom left of the warning, and then click <strong>"Go to Arukin (unsafe)"</strong>. <br/><br/><em>(Note: If it instead says something like "Go to qxgoxnywwvvzkbgjfhhx.supabase.co (unsafe)", don't worry! That is simply our secure database provider's URL. It shows up because we either haven't officially verified our Google branding yet, or we haven't been able to afford the Supabase Pro tier required for custom domains. It functions exactly the same securely.)</em> <br/><br/>Clicking this will allow you to proceed to the final permissions screen. If you have any concerns, we strongly encourage you to review our fully open-source codebase on GitHub before connecting.</>
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting & Support',
    description: 'Solutions for common errors and connection issues.',
    questions: [
      {
        q: "Why did a Member's account get disconnected?",
        a: <><p className="mb-2">There are two main reasons this happens:</p><ol className="list-decimal pl-5"><li><strong>Manual Revocation:</strong> The member went into their Google Account settings and manually revoked Arukin's access.</li><li><strong>Token Expiration/Security Event:</strong> If the member changed their Google password or Google detected suspicious activity on their account, Google will automatically invalidate all third-party OAuth tokens, disconnecting them from Arukin. They will need to reconnect using your Connection ID.</li></ol></>
      },
      {
        q: "Why am I seeing 'Rate Limit Exceeded'?",
        a: <>Google strictly limits how many API requests a third-party app can make per minute. If you are rapidly clicking through emails or refreshing the dashboard, you may hit this limit. Simply wait 60 seconds and try again.</>
      },
      {
        q: "How do I permanently delete my Manager account and all data?",
        a: <>You can instantly delete your account straight from the dashboard. Click your profile icon in the top right to open Console Settings. Scroll down and click "Show" on the Danger Zone. Click "Delete Manager Profile", type <strong>DELETE</strong>, and confirm. This will instantly purge all your data, connection IDs, and automatically sever all connected member accounts.</>
      }
    ]
  }
];
