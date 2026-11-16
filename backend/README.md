# GharSathi API

Independent Express API for GharSathi accounts and saved home profiles. It uses PostgreSQL through parameterized `pg` queries and keeps credentials separate from the frontend and the ECE portal.

## Local setup

Requires Node.js 18+ and a PostgreSQL database you control.

```sh
cd backend
npm install
cp .env.example .env
```

Set `DATABASE_URL` to your local PostgreSQL connection string and replace `JWT_SECRET` with a unique random value of at least 32 characters. Never commit `.env` or reuse credentials from another project.

Run the explicit SQL migrations, then start the API:

```sh
npm run migrate
npm run dev
```

The API listens on `http://localhost:6000`; the Vite development server on port 5173 proxies `/api` to it. The frontend can also use `VITE_API_URL` for an API hosted on the same site. Configure `WEB_ORIGIN` on the API to match the frontend origin. Production should use HTTPS and a same-site frontend/API domain because sessions use `SameSite=Lax` cookies; unrelated cross-site hosting needs a separate CSRF and cookie design.

## Routes

- `POST /api/auth/register` — validate and create an account.
- `POST /api/auth/login` — verify credentials and issue an HTTP-only session cookie.
- `GET /api/auth/me` — return the current account.
- `POST /api/auth/logout` — clear the session cookie.
- `GET /api/home-profile` — fetch the signed-in user's home details.
- `PUT /api/home-profile` — validate and save the signed-in user's home details.

Passwords are hashed with bcrypt. Session cookies are HTTP-only, same-site, and secure in production. Sign-in and registration have a rate limit. Home profile writes are scoped to the authenticated account and use parameterized SQL.

The first profile collects city, plot width and length in feet, planned built-up area in square feet, floors, bedrooms, and an optional budget in INR. Do not treat these planning values as engineering specifications or verified cost estimates.
