# FinDash — Finance Dashboard

A responsive personal finance dashboard built for the 
Frontend Developer Intern assignment. Tracks income, 
expenses, and spending patterns with role-based access 
and interactive data visualizations.

🔗 **Live Demo**: https://finance-dashboard-sandy-rho.vercel.app

---

## Tech Stack

- **React + Vite** — Fast development, modern React patterns
- **Tailwind CSS v4** — Utility-first styling with CSS 
  variable theming for dark/light mode
- **Zustand** — Lightweight state management with 
  localStorage persistence
- **Recharts** — Composable, React-native charts
- **date-fns** — Lightweight date formatting
- **lucide-react** — Clean SVG icon set

---

## Setup
```bash
git clone https://github.com/piyush1457/Finance_Dashboard.git
cd findash
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Features

**Dashboard**
- Personalized time-based greeting
- Summary cards with month-over-month trend indicators
- Area chart (6-month balance trend)
- Donut chart with click-to-filter navigation
- Bar chart (monthly income vs expense)
- Recent activity feed

**Transactions**
- Search, filter by type/category, sort by any column
- Pagination (10 per page)
- Export to CSV
- Empty state UI for no results
- Admin: Add, Edit, Delete with inline form validation
- Viewer: controls disabled with tooltips

**Insights**
- Percentage-context insights (not just raw numbers)
- Rent-to-income ratio with health indicator
- Subscription cost awareness card
- Fixed cost ratio warning
- Savings trend, category breakdown, payment method charts

**Settings**
- Dark / Light mode toggle
- Role switcher (Admin / Viewer)
- Reset mock data

---

## Role-Based UI

Switch roles from **Settings → Role Management**

| Feature | Viewer | Admin |
|---|---|---|
| View all pages | ✔ | ✔ |
| Add transaction | ✘ | ✔ |
| Edit transaction | ✘ | ✔ |
| Delete transaction | ✘ | ✔ |
| Export CSV | ✔ | ✔ |

Current role shown as a badge in the navbar at all times.

---

## Design Decisions

**Zustand over Redux** — For this scale, Redux adds 
unnecessary boilerplate. Zustand achieves the same with 
minimal code and built-in persistence middleware.

**CSS variables for theming** — Core color tokens defined 
as CSS variables consumed by Tailwind, making theme 
switching instantaneous without class duplication.

**No animation libraries** — All transitions use Tailwind 
utilities and CSS transforms, keeping the bundle lean.

**Indian context data** — Transactions use India-relevant 
merchants (Swiggy, Ola, IRCTC, Apollo) and ₹ INR in 
Indian numbering format for realistic insights.

**Percentage-based insights** — Raw numbers alone lack 
context. Every insight shows relative percentages 
(e.g., "Rent is 32% of income") to mirror how real 
financial products communicate data.

---

## Folder Structure
```
src/
├── components/
│   ├── layout/     # Sidebar, Navbar, Layout shell
│   └── ui/         # Button, Card, Modal, Toast, 
│                   # Badge, Skeleton, Input, Select
├── pages/          # Dashboard, Transactions, 
│                   # Insights, Settings
├── store/          # transactionStore, filterStore, 
│                   # appStore (Zustand)
├── data/           # mockTransactions.js (40+ entries)
└── utils/          # formatCurrency, formatDate, 
                    # computeInsights
```
```

---