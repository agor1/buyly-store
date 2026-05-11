# Buyly Store

Buyly Store to aplikacja e-commerce/marketplace budowana jako monorepo z osobnym frontendem Next.js i backendem Express. Projekt jest w trakcie rozwoju. Dokumentacja opisuje aktualny stan aplikacji i będzie uzupełniana razem z domykaniem kolejnych funkcji.

## Stack

Frontend:
- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/Radix-style UI primitives
- Zustand do lokalnego stanu auth
- Axios jako klient API
- Motion do animacji
- next-themes do motywu

Backend:
- Node.js + Express 5
- TypeScript
- ESM z `moduleResolution: NodeNext`
- Prisma 7
- PostgreSQL
- Zod do walidacji requestow
- JWT + cookie httpOnly do autoryzacji
- bcryptjs do hashowania hasel

## Struktura Projektu

```txt
buyly-store/
  backend/
    prisma/
      schema.prisma
    src/
      config/
      constants/
      controllers/
      generated/
      lib/
      middleware/
      routes/
      schemas/
      services/
      types/
    server.ts
  frontend/
    app/
      (admin)/
      (customer)/
      (guest)/
    components/
      layout/
      motion/
      products/
      ui/
    lib/
```

## Wymagania

- Node.js zgodny z aktualnymi zaleznosciami projektu
- npm
- PostgreSQL
- Dostepna zmienna `DATABASE_URL` dla backendu
- Dostepna zmienna `JWT_SECRET` dla backendu

## Konfiguracja Srodowiska

Backend czyta zmienne srodowiskowe z `.env` przez `dotenv/config`.

Minimalny `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/buyly_store"
JWT_SECRET="dlugi-losowy-sekret-minimum-32-znaki"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
PORT="5000"
```

Frontend korzysta z `NEXT_PUBLIC_API_URL`.

Minimalny `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Jesli `NEXT_PUBLIC_API_URL` nie jest ustawione, frontend uzywa domyslnie `http://localhost:5000/api`.

## Instalacja

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

## Uruchamianie

Backend w trybie development:

```bash
cd backend
npm run dev
```

Backend uruchamia sie domyslnie na `http://localhost:5000`.

Frontend w trybie development:

```bash
cd frontend
npm run dev
```

Frontend uruchamia sie domyslnie na `http://localhost:3000`.

## Build I Weryfikacja

Backend:

```bash
cd backend
npm run build
npm run start
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
npm run start
```

Aktualnie frontend przechodzi `lint` i `build`. Backend przechodzi `build`.

## Backend

Backend wystawia API pod prefiksem `/api`.

Główne pliki:
- `backend/server.ts` - konfiguracja Express, CORS, parsery, routing, health check
- `backend/src/routes/*` - definicje endpointow
- `backend/src/controllers/*` - warstwa HTTP
- `backend/src/services/*` - logika biznesowa i Prisma
- `backend/src/schemas/*` - walidacja Zod
- `backend/src/middleware/auth.middleware.ts` - odczyt JWT z headera lub cookie
- `backend/src/middleware/role.middleware.ts` - kontrola rol
- `backend/src/lib/prisma.ts` - klient Prisma
- `backend/src/config/env.ts` - wymagane zmienne srodowiskowe

### Moduly Domenowe

Auth:
- rejestracja
- logowanie
- wylogowanie
- pobranie aktualnego uzytkownika
- zmiana roli przez admina

Categories:
- lista kategorii
- pobranie kategorii po slugu

Products:
- lista produktow
- pobranie produktu po slugu
- tworzenie produktu przez admina
- aktualizacja produktu przez admina
- usuwanie produktu przez admina

Orders:
- tworzenie zamowienia przez customer/admin
- pobranie swoich zamowien
- pobranie wszystkich zamowien przez admina
- zmiana statusu zamowienia przez admina

## Backend API

Base URL lokalnie:

```txt
http://localhost:5000/api
```

### Health Check

`GET /health`

Zwraca status aplikacji i liczbe uzytkownikow w bazie.

### Auth

`POST /api/auth/register`

Body:

```json
{
  "email": "user@example.com",
  "password": "Password1!",
  "name": "User"
}
```

`POST /api/auth/login`

Body:

```json
{
  "email": "user@example.com",
  "password": "Password1!"
}
```

`POST /api/auth/logout`

Czyści cookie `token`.

`GET /api/auth/me`

Wymaga poprawnego tokena JWT.

`POST /api/auth/change-role`

Wymaga roli `ADMIN`.

Body:

```json
{
  "userId": "user_id",
  "role": "ADMIN"
}
```

### Categories

`GET /api/categories`

Zwraca liste kategorii.

`GET /api/categories/:slug`

Zwraca pojedyncza kategorie po slugu.

### Products

`GET /api/products`

Zwraca liste produktow z kategoriami.

`GET /api/products/:slug`

Zwraca pojedynczy produkt po slugu.

`POST /api/products`

Wymaga roli `ADMIN`.

Body:

```json
{
  "name": "Klawiatura mechaniczna",
  "slug": "klawiatura-mechaniczna",
  "description": "Opis produktu",
  "price": 299,
  "categoryId": "category_id"
}
```

`PUT /api/products/:id`

Wymaga roli `ADMIN`. Body takie jak przy tworzeniu produktu.

`DELETE /api/products/:id`

Wymaga roli `ADMIN`.

### Orders

`GET /api/orders`

Wymaga roli `ADMIN`.

`POST /api/orders`

Wymaga roli `CUSTOMER` albo `ADMIN`.

Body:

```json
{
  "shippingAddress": "ul. Testowa 1, Warszawa",
  "items": [
    {
      "productId": "product_id",
      "quantity": 1
    }
  ]
}
```

`GET /api/orders/my`

Wymaga roli `CUSTOMER` albo `ADMIN`.

`PATCH /api/orders/:id`

Wymaga roli `ADMIN`.

Body:

```json
{
  "status": "CONFIRMED"
}
```

Dostepne statusy:
- `PENDING`
- `CONFIRMED`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

## Baza Danych

Prisma schema znajduje sie w `backend/prisma/schema.prisma`.

Modele:
- `User`
- `Category`
- `Product`
- `Order`
- `OrderItem`

Enumy:
- `UserRole`: `ADMIN`, `CUSTOMER`, `GUEST`
- `OrderStatus`: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`

Prisma Client jest generowany do:

```txt
backend/src/generated/prisma
```

## Frontend

Frontend jest oparty o Next.js App Router.

Główne obszary routingu:
- `frontend/app/(guest)` - strony publiczne
- `frontend/app/(customer)` - strony klienta
- `frontend/app/(admin)` - miejsce na strony admina

Aktualne strony:
- `/` - strona glowna
- `/products` - widok produktow
- `/products/search` - wyszukiwarka/lista produktow
- `/products/[slug]` - detale produktu pobierane po slugu
- `/login` - logowanie
- `/register` - rejestracja
- `/search` - publiczna strona wyszukiwania
- `/profile` - profil klienta
- `/profile/settings` - ustawienia profilu i motywu

## Frontend: Dane I Auth

`frontend/lib/api.ts` tworzy instancje Axios z:
- `baseURL` z `NEXT_PUBLIC_API_URL`
- `withCredentials: true`
- automatycznym dodaniem `Authorization: Bearer <token>` z Zustand store

Stan sesji jest przechowywany w:

```txt
frontend/lib/auth-store.ts
```

Hook operacji auth znajduje sie w:

```txt
frontend/app/hooks/useAuth.ts
```

## Frontend: Produkty

Kluczowe pliki:
- `frontend/lib/products.ts` - `getProducts`, `getProduct`
- `frontend/lib/categories.ts` - pobieranie kategorii
- `frontend/components/products/product-search-view.tsx` - lista, filtry kategorii, widok wynikow
- `frontend/components/products/product-list.tsx` - renderowanie listy produktow
- `frontend/components/products/product-card.tsx` - karta produktu
- `frontend/components/products/product-details-view.tsx` - widok detali produktu

Klikniecie produktu prowadzi do:

```txt
/products/:slug
```

Widok detali pobiera produkt przez:

```txt
GET /api/products/:slug
```

## Frontend: Animacje

Projekt korzysta z `motion`.

Główne pliki animacji:
- `frontend/app/template.tsx` - globalne przejscie stron
- `frontend/components/motion/page-transition.tsx` - wrapper animacji strony
- `frontend/components/motion/reveal.tsx` - animacje wejscia i stagger

Animacje sa podlaczone m.in. do:
- navbaru
- footera
- strony glownej
- list produktow
- kart produktow
- widoku detali produktu

Komponenty animacji korzystaja z `useReducedMotion`, wiec respektuja preferencje systemowe uzytkownika.

## Frontend: UI I Styl

Projekt ma ciemny, techniczny styl marketplace z cyan accentami.

Wspolne komponenty UI znajduja sie w:

```txt
frontend/components/ui
```

Layout:
- `frontend/components/layout/navbar.tsx`
- `frontend/components/layout/footer.tsx`

Globalne style:

```txt
frontend/app/globals.css
```

## Role I Autoryzacja

Dostepne role:
- `GUEST`
- `CUSTOMER`
- `ADMIN`

JWT jest odczytywany z:
- naglowka `Authorization: Bearer <token>`
- cookie `token`

Backend uzywa `roleMiddleware` do ograniczenia endpointow admin/customer.

## Znane Ograniczenia I TODO

Projekt nie jest jeszcze zamkniety funkcjonalnie. Najwazniejsze rzeczy do dokonczenia:

1. Search, sortowanie, zakres cen i paginacja sa czesciowo wizualne i wymagaja pelnego podpiecia pod dane.
2. Koszyk nie jest jeszcze zaimplementowany jako pelny flow zakupowy.
3. Przyciski ilosci, dodania do koszyka i ulubionych na stronie produktu sa obecnie UI bez pelnej logiki biznesowej.
4. Zamowienia wymagaja dalszego uszczelnienia: walidacja stocku, aktywnosci produktu, transakcje i dekrementacja stanu magazynowego.
5. Model usuwania danych w Prisma uzywa `onDelete: Cascade`; dla historii zamowien docelowo warto przejsc na soft delete albo restrykcje.
6. Brakuje testow automatycznych backendu i frontendu.
7. Obsluga bledow API moze zostac dopracowana pod jednolity format odpowiedzi.
8. Strona produktu nadal pobiera dane po stronie klienta; docelowo warto wrocic do SSR z prawdziwym `notFound()` i metadanymi SEO.
9. Dostepnosc formularzy moze zostac poprawiona przez `aria-invalid`, `role="alert"` i pelniejsze walidacje po stronie UI.
10. Copy i polskie znaki wymagaja koncowego przegladu przed wydaniem.

## Standard Pracy

Przed oddaniem zmian warto uruchomic:

```bash
cd frontend
npm run lint
npm run build
```

```bash
cd backend
npm run build
```

W przypadku zmian w backendzie ESM lokalne importy powinny miec rozszerzenie `.js`, np.:

```ts
import { prisma } from "../lib/prisma.js";
```

Dotyczy to importow wzglednych `./` i `../`. Importow z paczek npm nie zmieniamy.
