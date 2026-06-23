# Duckmetric Project Checkpoint
> Updated: 2026-06-23 | Session: ses_10bc18e74ffemAmlLHqe9Vm7Bn

## Project Overview
**Duckmetric** is a modern TypeScript fullstack application built with Better-T-Stack. Monorepo managed by Turborepo with Bun.

## Tech Stack
- **Frontend**: Astro 7 (SSR) + TailwindCSS 4
- **Backend**: oRPC (type-safe RPC + OpenAPI)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Better-Auth (email/password, Google, Facebook, Email OTP)
- **Email**: Hostinger SMTP (nodemailer)
- **Notifications**: shadcn/ui sonner (dark theme, bottom-right)
- **Build**: Turborepo monorepo
- **Linting**: Biome

## Auth Features

### Login Flow (`/login`)
- Google & Facebook social sign-in
- Email → "Continue with password" OR "Log in with OTP"
- Email check API: verifies existence + password status before showing password form
  - Not registered → toast error with "Sign up" action
  - No password (OTP-only) → toast info suggesting OTP
- Password login → dashboard
- OTP login → verify 6-digit code → dashboard

### Signup Flow (`/signup`)
- Step 1: Full name (+ Google/Facebook)
- Step 2: Email → verification OTP
- Step 3: Verify email OTP
- Step 4: Set password (skippable) → account created

### Forgot Password (`/forgot-password`)
- Email → OTP → new password → success → login

### Auth Pages
- No header/footer (AuthLayout.astro)
- shadcn sonner toast notifications

## File Structure
```
packages/
├── auth/src/         # Auth config, email sender
├── env/src/          # Environment variables
├── api/src/          # oRPC routes
└── db/prisma/        # Prisma schema

apps/web/src/
├── pages/
│   ├── login.astro
│   ├── signup.astro
│   ├── forgot-password.astro
│   ├── dashboard.astro
│   └── api/
│       ├── auth/[...all].ts
│       └── check-email.ts
├── layouts/
│   ├── Layout.astro      # Main (with header)
│   └── AuthLayout.astro  # Auth (no header)
├── components/
│   ├── Header.astro
│   └── ui/sonner.js      # shadcn sonner wrapper
└── lib/
    ├── auth-client.ts
    └── orpc.ts
```
