# Buyly Store

## Overview

Buyly Store is a TypeScript e-commerce project split into two applications:

- `backend/` - Express API with Prisma, PostgreSQL, Zod validation, JWT auth, cart, favorites, orders, product promotions, Cloudinary image upload, and contact email delivery.
- `frontend/` - Next.js App Router storefront with guest, customer, and admin views.

The frontend talks to the backend through `/api` endpoints and stores authentication state client-side while the backend uses cookies for authenticated flows.

## Demo

Add a short walkthrough GIF or MP4 here when publishing the repository. A good demo path is:

```text
docs/demo.gif
```

Then reference it with:

```md
![Buyly Store demo](docs/demo.gif)
```

## Features

- Guest storefront with product browsing, search, contact form, login, and registration pages.
- Customer cart, favorites, and checkout flow with separate delivery address fields for city, postal code, street, and house number.
- Customer profile page with username editing and password change confirmation. After a successful password change, the user is logged out and redirected to `/login`.
- Customer order history with status, shipping, payment, and ordered product details.
- Admin panel routes for products and orders, including product image upload and promotion date/price fields.
- Product promotions with backend-side effective price calculation for orders.
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
  src/utils/              Shared backend helpers, including product pricing
  tests/                  Jest unit tests for services and pricing helpers

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

Example files are provided for local setup:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

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

CLOUDINARY_CLOUD_NAME="cloud-name"
CLOUDINARY_API_KEY="api-key"
CLOUDINARY_API_SECRET="api-secret"
CLOUDINARY_PRODUCTS_FOLDER="buyly/products"
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
- `CLOUDINARY_*` variables are required for admin product image uploads through `POST /api/uploads/product-image`.

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
- `/api/favorites` - authenticated favorite product routes.
- `/api/orders` - authenticated order routes.
- `POST /api/uploads/product-image` - admin-only Cloudinary product image upload.

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

Use the available test, build, and lint commands for touched apps.

Backend:

```bash
cd backend
npm test
npx tsc --noEmit
npx tsc --noEmit --project tsconfig.test.json
npm run build
```

Backend tests use Jest with TypeScript/ESM support and mock Prisma for unit-level service coverage. Current test coverage focuses on high-risk domain logic:

- product promotion pricing in `src/utils/product-pricing.ts`
- single product lookup behavior in `src/services/product.service.ts`
- cart stock validation and item updates in `src/services/cart.service.ts`
- favorite product add/remove behavior in `src/services/favorite.service.ts`
- order creation totals, promo pricing, stock restoration, and fulfilled-order protections in `src/services/orders.service.ts`

Run a single backend test file with:

```bash
cd backend
npm test -- tests/orders.service.test.ts
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
