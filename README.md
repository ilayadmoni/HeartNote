# ❤️ HeartNote

**HeartNote** is a premium Hebrew digital greeting card platform. Users choose from a gallery of beautifully animated templates, personalize their card, and share a unique link with their loved ones — no app download required.

> _יצירת ברכות דיגיטליות מעוצבות – בעברית, לכל אירוע._

---

## ✨ Key Features

| Feature                 | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| 🎨 **Template Gallery** | Curated collection of animated greeting card templates        |
| ✏️ **Live Editor**      | Real-time preview as users customize text, colors, and images |
| 🔗 **Shareable Links**  | Every card gets a unique public URL for sharing               |
| 👤 **User Profiles**    | Avatar selection, name editing, and creation history          |
| 📱 **Fully Responsive** | Optimized for mobile, tablet, and desktop                     |
| 🌙 **Dark Mode**        | System-aware and manually toggleable dark theme               |
| ♿ **Accessible**       | Focus trapping, keyboard navigation, and ARIA labels          |
| 🌐 **RTL-First**        | Designed right-to-left for Hebrew content                     |
| 🔐 **Auth**             | Email/password authentication with password reset flow        |
| 💎 **Tiered Plans**     | Free tier with usage limits; Premium for power users          |

---

## 🚀 Tech Stack

| Layer            | Technology                                                  |
| ---------------- | ----------------------------------------------------------- |
| **Framework**    | [Next.js 14](https://nextjs.org/) (App Router)              |
| **Language**     | TypeScript                                                  |
| **Styling**      | Tailwind CSS                                                |
| **Animations**   | Framer Motion                                               |
| **Icons**        | Lucide React                                                |
| **Backend**      | [Supabase](https://supabase.com/) (Auth, Database, Storage) |
| **Server Logic** | Next.js Server Actions                                      |
| **State Mgmt**   | React Query (TanStack)                                      |
| **Validation**   | Zod                                                         |
| **Email**        | Resend                                                      |

---

## 📁 Project Structure

```
HeartNote/
├── client/                          # Next.js application
│   └── src/
│       ├── app/                     # App Router pages (RSC + layouts)
│       │   ├── (main)/             # Authenticated routes
│       │   └── (public)/           # Public routes (gallery, pricing)
│       ├── actions/                 # Server Actions (auth, profile, creations)
│       ├── components/              # UI components
│       │   ├── auth/               # Login / register / password reset
│       │   ├── editor/             # Template editor (desktop + mobile)
│       │   ├── header/             # Responsive header + mobile menu
│       │   ├── home/               # Landing page sections
│       │   ├── profile/            # User profile (desktop + mobile)
│       │   ├── templates/          # Template renderers (SurpriseGift, SteamyWindow, …)
│       │   └── ui/                 # Shared UI primitives
│       ├── contexts/                # React contexts (Auth, Theme)
│       ├── hooks/                   # Custom hooks
│       ├── lib/                     # Utilities, Supabase clients, validations
│       ├── providers/               # Query & context providers
│       └── types/                   # Global TypeScript types
├── supabase/
│   └── migrations/                  # SQL migration files (DDL)
├── .env.example                     # Environment variable template
└── README.md
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

### Required

| Variable                        | Description                                                   |
| ------------------------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL                                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (publishable) key                          |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service-role key (server-only)                       |
| `NEXT_PUBLIC_SITE_URL`          | Canonical site URL (e.g. `https://heartnote.co.il`)           |
| `RESEND_KEY`                    | [Resend](https://resend.com/) API key for transactional email |
| `MAIL_HEART_NOTE`               | Recipient email for the contact form                          |

### Optional

| Variable             | Description                     | Default                               |
| -------------------- | ------------------------------- | ------------------------------------- |
| `RESEND_FROM_EMAIL`  | Sender email                    | `HeartNote <noreply@heartnote.co.il>` |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID | _(disabled)_                          |

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** 9+
- A [Supabase](https://supabase.com/) project with the schema applied (see `supabase/migrations/`)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/HeartNote.git
cd HeartNote/client

# Install dependencies
npm install

# Create your env file
cp ../.env.example .env.local
# → Edit .env.local with your Supabase + Resend keys
```

### Development

```bash
npm run dev         # Start on http://localhost:3000
npm run dev:lan     # Start on 0.0.0.0 (for mobile testing on same WiFi)
```

### Type Checking & Linting

```bash
npm run type-check  # TypeScript strict mode check (tsc --noEmit)
npm run lint        # ESLint
```

### Production Build

```bash
npm run build       # Generates optimized .next/ output
npm start           # Serve the production build on port 3000
```

---

## 🗄️ Database

HeartNote uses **Supabase PostgreSQL** with Row Level Security (RLS).

Migration files are in `supabase/migrations/`. The main init file `000_init.sql` contains:

- `profiles` table (user data, subscription tier, creation counts)
- `templates` table (template metadata, config schemas, expiration policies)
- `creations` table (user-generated cards with shareable slugs)
- `subscription_policies` table (tier limits and features)
- RLS policies, triggers, and seed data

---

## 📄 License

MIT
