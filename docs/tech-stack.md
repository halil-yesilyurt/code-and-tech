# Code & Tech – Project Tech Stack

Below is an overview of the primary technologies, libraries and services that power the Code & Tech blog.

## ⚙️ Core Runtime

| Layer | Technology | Purpose |
|-------|------------|---------|
| Runtime | **Node.js 18** | Executes the Next.js application (locally & on Vercel) |
| Framework | **Next.js 13 (App Router)** | React framework for SSR, SSG, ISR & API routes |
| Language | **TypeScript** | Type-safe JavaScript across the entire codebase |
| UI Library | **React 18** | Component model & hooks API |
| Styling | **Tailwind CSS v3** + PostCSS | Utility-first styling, JIT compilation, custom plugins |
| Build Script | **Custom build.js** | Wraps 'next build', disables Next.js telemetry for production builds |

## 🗂 Content layer

| Role | Technology | Purpose |
|------|------------|---------|
| CMS | **WordPress (Headless)** | Content authoring & storage |
| API | **WordPress REST API** (`/wp-json`) | Exposes posts, pages, categories, tags |
| Auth | **JWT Authentication for WP REST API** | Secures protected endpoints when required |

## ✉️ Email / Notifications

| Service | Purpose |
|---------|---------|
| **Resend** | Transactional email service for contact-form submissions (Note: The 'resend' npm package is included for potential future use, but is not currently used in the codebase.) |

## 🛡 Security & Optimisation

* JWT-secured endpoints on WordPress
* Rate-limiting helper (`src/lib/rate-limit.ts`)
* `ErrorBoundary` component for graceful client-side error handling

## 🧰 Developer Tooling

* **ESLint** with custom config (`eslint.config.mjs`)
* **Prettier** (handled via IDE / CI)
* **GitHub CLI** for branching & PR automation
* **GitHub Actions / Vercel** (deployment)

## 📦 Package Management

* **npm** (lockfile committed)

## 🖥️ Hosting / CI

| Platform | Usage |
|----------|-------|
| **Vercel** | Builds & serves the Next.js frontend with global Edge Network |
| **InfinityFree** (example) | Hosts WordPress backend on free PHP hosting |

## 📚 Documentation & Planning

* Markdown docs in `/docs` (PRD, setup guides, tech-stack, etc.)
* Mermaid diagrams for architecture when appropriate

---

> This document should be updated any time a significant dependency or architectural decision is added to the project. 