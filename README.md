# FinDash - Personal Finance Dashboard

FinDash is a premium, production-quality finance dashboard application built as a frontend assignment. It features a fully responsive, dark-mode first design with complex interactive charts and a complete mock data engine.

## Overview

- **Live Data Visualizations**: Analyzes a large mock dataset to render Area, Bar, and Nested Donut charts seamlessly using Recharts.
- **Smart Analytics Engine**: Derives dynamic text-based insights based on real-time spending behavior over a 6-month period.
- **Data Table**: A comprehensive, filterable, and sortable transaction ledger with inline role-action components.
- **Role-Based UI**: Toggles between `Viewer` (read-only) and `Admin` (full CRUD access), seamlessly stored locally.

## Tech Stack

- **React 19 (Vite Build)**: Blazing fast compilation and runtime performance.
- **Tailwind CSS v4**: Built entirely with utility classes and CSS Variable tokens for robust theming.
- **Zustand**: Handles persistent application state, feature flags (role management), and our mock database engine.
- **Recharts**: Beautiful, responsive SVGs directly integrated with React data models.
- **lucide-react**: Lightweight and premium vector SVG icons.
- **date-fns**: Bulletproof date calculations and formatting used across insights and grids.

## Setup Instructions

Make sure you have Node > v18 installed.
From the project directory, run:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application defaults to `Admin` mode in Dark Theme. 

## Features

- **Persisted State**: All changes to filters, roles, and themes survive a page reload. Added/Deleted mock transactions persist! 
- **CSV Export**: Instantly export current table views (respecting active filters).
- **Responsive Layout**: Sidebar collapses into a mobile hamburger menu on small devices; data grids gracefully stack or scroll.
- **Toast Notifications**: Built-in visual feedback system for actions.
- **CSS Transitions**: No heavy animation libraries (framer-motion). It uses native `transition-all` and GPU accelerated transforms for a fluid feel.

## Future Roadmap

- Real backend integration
- Support for customizable chart ranges
- Multiple accounts view

*Built with ♥ for a frontend internship*
