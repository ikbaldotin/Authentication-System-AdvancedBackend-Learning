**Project: Authentication Service (Next.js + Node/TypeScript + Prisma)**

This repository contains a full-stack authentication example with a TypeScript backend and a Next.js frontend. It implements local and Google OAuth authentication, role-based access control, rate limiting, and persistent storage with Prisma + PostgreSQL.

**Repository Layout**

- **backend/**: Node + TypeScript API and services.
- **frontend/**: Next.js app (App Router) with auth UI components.

**High-level Architecture**

- Frontend (`frontend/`) - Next.js app providing login/register UI and OAuth buttons.
- Backend (`backend/`) - Express (or similar) HTTP API handling auth flows, tokens, and user management.
- Database - Prisma ORM with schema in `backend/prisma/schema.prisma` and generated client in `backend/generated/prisma`.
- Redis (optional) - used for rate-limiting or session/refresh-token storage.

**Key Files**

- Backend entry: [backend/src/app.ts](backend/src/app.ts)
- Prisma schema: [backend/prisma/schema.prisma](backend/prisma/schema.prisma)
- Prisma client helper: [backend/src/lib/prisma.ts](backend/src/lib/prisma.ts)
- Auth module (controllers/services): [backend/src/modules/auth](backend/src/modules/auth)
- Middleware: [backend/src/middleware/authentication.middleware.ts](backend/src/middleware/authentication.middleware.ts)
- Frontend main page: [frontend/app/page.tsx](frontend/app/page.tsx)
- Frontend auth components: [frontend/components/AuthForm.tsx](frontend/components/AuthForm.tsx) and [frontend/components/ui/GoogleLoginButton.tsx](frontend/components/ui/GoogleLoginButton.tsx)

**Backend Overview**

- Language & runtime: TypeScript, Node.js.
- ORM: Prisma. The generated client is under `backend/generated/prisma` and used via `backend/src/lib/prisma.ts`.
- Auth flows implemented:
  - Local register & login (email/password).
  - OAuth with Google via dedicated helpers in `backend/src/lib/google.ts`.
  - Refresh token flow and JWT access tokens.
- Security & helpers:
  - Password hashing and validation in the auth helpers.
  - Authorization middleware for role checking (see `backend/src/constants/system-roles.ts` and `backend/src/middleware/authorization.middleware.ts`).
  - Rate limiting middleware at `backend/src/middleware/rate-limit` for login, register, and OAuth callbacks.

**Frontend Overview**

- Next.js (App Router) with React + TypeScript.
- Contains reusable UI components (`frontend/components/ui`) and auth-specific forms (`frontend/components/LoginForm.tsx`, `frontend/components/RegisterForm.tsx`).
- The frontend calls the backend API (likely via `frontend/lib/api.ts`) to perform auth actions and handle tokens.

**Database & Migrations**

- Prisma schema is at `backend/prisma/schema.prisma` and migrations are stored under `backend/prisma/migrations/`.
- There is a seeding script at `backend/prisma/seed.ts` used to populate initial data.

**Environment Variables (examples)**
Set these in a `.env` file in `backend/` (names are examples — verify exact names in `backend/src/config/env.config.ts`):

- `DATABASE_URL` - PostgreSQL connection string for Prisma.
- `PORT` - Backend server port (e.g., `4000`).
- `JWT_SECRET` - Secret used to sign JWTs.
- `JWT_EXPIRES_IN` - Access token TTL.
- `REFRESH_TOKEN_EXPIRES_IN` - Refresh token TTL.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` - OAuth credentials.
- `REDIS_URL` - If Redis is used for rate limiting / token storage.

**Local Development**

1. Backend
   - Install dependencies and start server (check `backend/package.json` for exact scripts):

```powershell
cd backend
npm install
# run dev or start script defined in package.json
npm run dev
```

- Run Prisma migrations and seed (adjust commands if you use `pnpm`/`yarn`):

```powershell
cd backend
npx prisma migrate dev
ts-node prisma/seed.ts
```

2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

3. Open the frontend in your browser (likely `http://localhost:3000`) and the backend API (e.g., `http://localhost:4000`).

**Testing & Linting**

- Check `backend/package.json` and `frontend/package.json` for `test`, `lint`, and `format` scripts and run them as needed.

**Deployment Notes**

- Build the frontend with `npm run build` and deploy to Vercel/Netlify or any static host that supports Next.js App Router.
- Deploy backend to your preferred Node host (Heroku, Railway, Fly, Docker container). Ensure environment variables and database connection are configured in the production environment.
- Apply Prisma migrations on the production database and regenerate the client if needed.

**Contributing**

- Keep API contracts backward compatible where possible.
- Add unit/integration tests for new auth flows.

**Where to look next in the codebase**

- API routes and controllers: `backend/src/modules/` (look at `auth`, `admin`, and other modules).
- App bootstrap: [backend/src/app.ts](backend/src/app.ts)
- Prisma helpers: [backend/src/lib/prisma.ts](backend/src/lib/prisma.ts)
- Frontend auth UI: `frontend/components` and `frontend/app/`

---

If you'd like, I can:

- run the project locally and verify the auth flows, or
- expand this README with exact script commands and a full `.env.example` using the variable names found in `backend/src/config/env.config.ts`.
