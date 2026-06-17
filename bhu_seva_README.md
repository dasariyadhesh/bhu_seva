# Bhuseva – Trust & Donation Management Platform

> A full-stack web application I built to digitize and bring transparency to trust-based donation management. The platform supports multiple user roles — Donors, Administrators, and Viewers — and provides end-to-end donation tracking, UTR verification, bank statement reconciliation, and AI-powered budget analysis.

---

## Why I Built This

Managing donations for a charitable trust manually — through spreadsheets, WhatsApp messages, and cash records — creates zero accountability and room for error. I built Bhuseva to solve that for a real trust (TrustTrack) that handles activities like **Nithya Annadhanam** (daily food service), **Saplings Distribution**, and **Arulneri Thavachchalai** social needs.

The goals were:
- Make every donation traceable with transaction IDs and UTR verification
- Give admins full control over donation status, user roles, and category management
- Let donors see exactly where their money goes — by category and activity
- Use AI to help admins make smarter budget allocation decisions

---

## What This Platform Does

### For Donors
- Browse donation categories (Annadhanam, Saplings, Social Needs, etc.)
- Submit a donation with amount, purpose, PAN card, and payment UTR
- Track their donation history and status (Pending / Successful / Failed)
- View upcoming events and recent trust activities

### For Administrators
- Verify donations by matching submitted UTR against actual bank records
- Manage user roles (Admin / Editor / Viewer)
- Update donation categories, menu items, and need lists
- Upload trust logo and QR code for payments
- View AI-powered budget reallocation suggestions based on contributions vs expenses
- Manage gallery images and recent activity feed

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Firebase Authentication (Google OAuth + Email) |
| Database | Firebase Firestore (via context) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Export | XLSX (Excel export) |
| Hosting | Firebase App Hosting (`apphosting.yaml`) |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Root redirect (auth-aware)
│   ├── layout.tsx            # Global layout + auth provider
│   ├── home/page.tsx         # Public landing page
│   ├── login/page.tsx        # Login (Google OAuth + email/password)
│   ├── dashboard/page.tsx    # Donor dashboard
│   ├── my-donations/page.tsx # Donor's donation history
│   └── admin/page.tsx        # Admin control panel
│
├── components/
│   ├── header.tsx            # Navigation + logout
│   ├── admin/
│   │   ├── admin-dashboard.tsx       # Tabs: settings, users, donations
│   │   ├── donation-management.tsx   # UTR verification + status updates
│   │   └── user-management.tsx       # Role management
│   └── dashboard/
│       ├── category-card.tsx         # Donation category cards
│       ├── donation-dialog.tsx       # Donation submission form
│       ├── donor-board.tsx           # Top donors leaderboard
│       ├── bank-statement.tsx        # Bank reconciliation view
│       ├── gallery.tsx               # Trust activity gallery
│       └── vision-statement.tsx      # Trust mission display
│
├── context/
│   └── auth-context.tsx      # Global state: auth, donations, users, categories
│
├── lib/
│   ├── firebase.ts           # Firebase app + auth initialization
│   ├── donations.ts          # Donation types, interfaces, and seed data
│   ├── users.ts              # User types, roles, and seed data
│   └── utils.ts              # Utility functions (cn, etc.)
│
└── hooks/
    ├── use-toast.ts          # Toast notification hook
    └── use-mobile.tsx        # Responsive breakpoint hook
```

---

## Key Features in Detail

### Role-Based Access Control
Three roles managed via `AuthContext`:
- **Admin** — full access: verify donations, manage users, update categories, upload assets
- **Editor** — can update categories and content but cannot manage users
- **Viewer** (default for Google OAuth users) — read-only dashboard access

### Donation Lifecycle
```
Donor submits → PENDING → Admin verifies UTR → SUCCESSFUL
                                              → FAILED (wrong UTR or timeout)
Pending donations auto-fail after 5 minutes (configurable timeout)
```

### UTR Verification
Admin enters the UTR from the trust's bank statement. The system matches it against the donor's submitted UTR. Duplicate UTRs are caught and rejected to prevent double-counting.

---

## How I Tested This

### Manual Testing
- Ran the app locally against a Firebase test project
- Tested all three role flows (Admin, Editor, Viewer) using seeded test accounts
- Verified the donation lifecycle: submit → pending → UTR match → successful / failed
- Tested duplicate UTR detection and the 5-minute auto-fail timeout

### Component-Level Testing
Each component handles its own error states — invalid form inputs are caught by Zod schemas via React Hook Form, with inline validation messages. Toast notifications confirm every state change.

### Auth Testing
- Google OAuth flow tested via Firebase Auth popup
- Email/password login tested with seeded credentials
- Route protection verified: unauthenticated users are redirected to `/home`; non-admin users cannot access `/admin`

---

## Running Locally

### Prerequisites
- Node.js 18+
- A Firebase project with Authentication enabled (Google + Email/Password)
- A Google AI API key (for Genkit / Gemini)

### Setup

```bash
git clone https://github.com/dasariyadhesh/bhu_seva.git
cd bhu_seva
npm install
```

Create a `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Run

```bash
# Start the Next.js app (port 9002)
npm run dev

```

App runs at `http://localhost:9002`

### Test Accounts (seeded)
| Email | Password | Role |
|---|---|---|
| admin@trusttrack.org | adminpassword | Admin |
| editor@trusttrack.org | editorpassword | Editor |
| viewer@trusttrack.org | viewerpassword | Viewer |

---

## Deployment

The project is configured for **Firebase App Hosting** via `apphosting.yaml`:

```bash
firebase deploy
```

---

## Design Decisions

**Why Next.js App Router?**
Server components allow AI Genkit flows to run server-side (`'use server'`) without exposing API keys to the browser. The `/admin` page is protected at the component level using the auth context.

**Why AuthContext for global state instead of a database?**
For this version, all mutable state (donations, users, categories) lives in React context initialized from seed data in `lib/donations.ts` and `lib/users.ts`. This keeps the app fully runnable without Firestore rules setup. A future version will persist everything to Firestore.

---

## Author

**Yadhesh DG**
Software Engineer — Distributed Systems & Backend Engineering

- LinkedIn: [linkedin.com/in/dasariyadhesh](https://linkedin.com/in/dasariyadhesh)
- GitHub: [github.com/dasariyadhesh](https://github.com/dasariyadhesh)
- Email: dasariyadhesh@gmail.com
