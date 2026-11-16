# GharSathi

GharSathi is an independent home-planning platform for budget-conscious Indian families and first-time home builders. The frontend uses React, TypeScript, Vite, and Tailwind CSS. The separate API uses Express and PostgreSQL.

## Requirements

- Node.js 18.19+ and npm
- A PostgreSQL database for account registration and saved home profiles

## Run locally

Install frontend dependencies once, then start the frontend and API together:

```sh
npm install
npm run dev
```

The first API startup applies any pending SQL migrations automatically. Before the first run, make sure `backend/.env` exists and has a valid PostgreSQL URL and a unique `JWT_SECRET` of at least 32 characters. The app reads the API configuration from that file.

If you have not set up the API environment yet, create it from the example:

```sh
cd backend
npm install
cp .env.example .env
```

Set `DATABASE_URL` to a PostgreSQL database you control and replace the example `JWT_SECRET`. Then return to the project root and run `npm run dev`. Vite runs at `http://localhost:5173` and proxies `/api` to the API at `http://localhost:6000`. Registration, sign-in, and saved profiles require a reachable PostgreSQL database.

Create and preview a production frontend build with:

```sh
npm run build
npm run preview
```

The frontend `.env.example` contains only an optional API origin. Frontend variables prefixed with `VITE_` are public in the browser bundle; never put passwords, database URLs, or signing secrets there. Backend secrets belong in the untracked `backend/.env` file.

## Current stage

- Responsive home page with compact navigation for home ideas, the cost planner, process, and about information.
- Account registration and sign-in backed by an independent Express API, bcrypt password hashes, and HTTP-only session cookies.
- Protected home profile flow that saves city, plot dimensions, built-up area, floors, bedrooms, and an optional INR budget to the signed-in account.
- Parameterized PostgreSQL queries and explicit SQL migrations.
- Budget estimator, house design filters, knowledge hub, password recovery, email verification, and enquiry submission are later stages.
- The official logo is not yet in `public/assets/`. The header's text wordmark and decorative house mark are temporary, not the supplied logo.
- Architecture photos load from Unsplash and need an internet connection.

The collected home details are planning inputs, not verified estimates or construction specifications. GharSathi does not replace licensed architects or structural engineers. Site-specific engineering, safety-critical designs, and regulatory approvals require qualified professional review.
