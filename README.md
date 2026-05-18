# Buyly Store

## Overview

Buyly Store is a TypeScript e-commerce project split into two applications:

- `backend/` - Express API with Prisma, PostgreSQL, Zod validation, JWT auth, cart and order routes, and contact email delivery.
- `frontend/` - Next.js App Router storefront with guest, customer, and admin views.

The frontend talks to the backend through `/api` endpoints and stores authentication state client-side while the backend uses cookies for authenticated flows.

## Features

- Guest storefront with product browsing, search, contact form, login, and registration pages.
- Customer cart and checkout flow with separate delivery address fields for city, postal code, street, and house number.
- Customer profile page with username editing and password change confirmation. After a successful password change, the user is logged out and redirected to `/login`.
- Customer order history with status, shipping, payment, and ordered product details.
- Admin panel routes for products and orders.
- Shared motion helpers for page and section reveal animations, with reduced-motion support.

## Project Structure

```text
backend/
  prisma/                 Prisma schema and migrations
  src/controllers/        Request handlers
  src/middleware/         Auth, validation, and error middleware
  src/routes/             Express route definitions
  src/schemas/            Zod request schemas
  src/services/           Domain services, including mail delivery

frontend/
  app/                    Next.js App Router pages
  components/             Shared UI, layout, auth, product, cart, and motion components
  lib/api/                Backend API clients
  lib/store/              Client-side state stores
  lib/schemas/            Frontend validation helpers
```

## Installation

Install dependencies separately for each app:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Configuration

Create local environment files as needed. Do not commit `.env` files.

Backend variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/buyly_store"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
PORT="5000"

SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="support@example.com"
SMTP_PASS="smtp-password"
CONTACT_TO_EMAIL="support@example.com"
```

Frontend variables:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Notes:

- `DATABASE_URL` is required by Prisma and the backend database client.
- `JWT_SECRET` is required by backend auth configuration.
- `SMTP_*` and `CONTACT_TO_EMAIL` are required for the contact form email flow.
- `SMTP_SECURE` should usually be `false` for port `587` and `true` for port `465`.

## Development

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Backend API: `http://localhost:5000/api`

## API

Main backend routes:

- `POST /api/contact` - sends a contact form message by email.
- `POST /api/orders` - creates an authenticated order.
- `/api/auth` - authentication routes.
- `/api/categories` - category routes.
- `/api/products` - product routes.
- `/api/cart` - authenticated cart routes.
- `/api/orders` - authenticated order routes.

Example contact request:

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jan Kowalski\",\"email\":\"jan@example.com\",\"message\":\"Chcialbym zapytac o status zamowienia.\"}"
```

Example order request:

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -b "token-cookie-from-login" \
  -d "{\"shippingAddress\":\"Marketplace 12, 00-001 Warszawa\",\"shippingType\":\"courier\",\"paymentType\":\"card\",\"items\":[{\"productId\":\"product-id\",\"quantity\":1}]}"
```

The frontend collects the delivery address in separate fields and combines them into `shippingAddress` before sending the order to the backend.

## Verification

There is no active automated test setup yet. Use the available build and lint commands for touched apps.

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Troubleshooting

- If Prisma cannot connect, verify `DATABASE_URL` and that PostgreSQL is running.
- If authenticated frontend requests fail, verify `NEXT_PUBLIC_API_URL`, `FRONTEND_URL`, and browser cookie settings.
- If the contact form fails to send, verify `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_TO_EMAIL`.
- If emails connect but are rejected, check whether the SMTP provider requires an app password or verified sender address.
