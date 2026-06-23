# Duckmetric Project Checkpoint
> Created: 2026-06-23 | Session: ses_10bc18e74ffemAmlLHqe9Vm7Bn

## Project Overview
**Duckmetric** is a modern TypeScript fullstack application built with the Better-T-Stack. It's a monorepo managed by Turborepo with Bun as the package manager.

## Architecture

### Tech Stack
- **Frontend**: Astro 7 (SSR) + TailwindCSS 4
- **Backend**: oRPC (type-safe RPC + OpenAPI)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Better-Auth (email/password)
- **Build**: Turborepo monorepo
- **Linting**: Biome
- **Runtime**: Bun 1.3.14

### Monorepo Structure
```
duckmetric/
├── apps/
│   └── web/                    # Astro SSR application
│       └── src/
│           ├── pages/          # Astro pages (index, login, signup, dashboard)
│           ├── components/     # Header, SignInForm, SignUpForm
│           ├── lib/            # auth-client.ts, orpc.ts
│           ├── layouts/        # Layout.astro
│           └── middleware.ts   # Auth middleware
├── packages/
│   ├── api/                    # oRPC routers + procedures
│   │   └── src/
│   │       ├── index.ts        # publicProcedure, protectedProcedure
│   │       ├── context.ts      # Creates session context
│   │       └── routers/        # appRouter with healthCheck, privateData
│   ├── auth/                   # Better-Auth configuration
│   │   └── src/index.ts        # createAuth() with Prisma adapter
│   ├── db/                     # Prisma + PostgreSQL
│   │   ├── prisma/schema/      # auth.prisma, schema.prisma
│   │   └── src/index.ts        # createPrismaClient(), PrismaPg adapter
│   ├── env/                    # Type-safe env vars via @t3-oss/env-core
│   │   └── src/
│   │       ├── server.ts       # DATABASE_URL, BETTER_AUTH_SECRET, etc.
│   │       └── web.ts          # (client-side env)
│   └── config/                 # Shared tsconfig
```

## Key Features

### Authentication Flow
- Better-Auth with Prisma adapter (PostgreSQL)
- Email/password authentication enabled
- Session-based auth with cookies
- Middleware checks auth on every request

### API Layer (oRPC)
- **publicProcedure**: No auth required
- **protectedProcedure**: Requires valid session (throws UNAUTHORIZED)
- RPC endpoint at `/rpc`
- OpenAPI endpoint at `/rpc/api-reference`
- Current routes: `healthCheck`, `privateData`

### Database Schema (Prisma)
Models: `User`, `Session`, `Account`, `Verification`
- User has email (unique), name, image
- Session tracks expiresAt, token, ipAddress, userAgent
- Account stores OAuth/provider tokens

## Environment Variables
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/duckmetric
BETTER_AUTH_SECRET=0hmH3GBdNcfNadRIryXGUitMETtr0fNY
BETTER_AUTH_URL=http://localhost:4321
CORS_ORIGIN=http://localhost:4421
```

## Available Scripts
- `bun run dev` - Start all apps
- `bun run dev:web` - Start web only
- `bun run db:push` - Push schema to DB
- `bun run db:generate` - Generate Prisma client
- `bun run db:migrate` - Run migrations
- `bun run db:studio` - Open Prisma Studio
- `bun run check` - Run Biome lint/format

## Current State
- ✅ Basic auth flow implemented (login/signup/dashboard)
- ✅ oRPC integration working
- ✅ Database schema defined
- ⚠️ Only basic routes (healthCheck, privateData) - no real business logic yet
- ⚠️ Environment has hardcoded secrets (needs .env management)

## Key Files
- `packages/api/src/routers/index.ts` - API route definitions
- `packages/auth/src/index.ts` - Auth configuration
- `packages/db/prisma/schema/auth.prisma` - User/Session models
- `apps/web/src/pages/dashboard.astro` - Protected dashboard page
- `apps/web/src/pages/rpc/[...rest].ts` - oRPC + OpenAPI handler
