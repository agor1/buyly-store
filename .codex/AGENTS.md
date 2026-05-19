# Buyly Store Agent Guidelines

Ten plik opisuje, jak agent ma pracowac w repozytorium Buyly Store. Projekt jest monorepo z osobnym frontendem Next.js i backendem Express/Prisma. Agent powinien najpierw zrozumiec istniejace konwencje, a dopiero potem wprowadzac najmniejsza poprawna zmiane.

## Project Context

Buyly Store to aplikacja e-commerce/marketplace.

- `frontend/` - Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/Radix-style UI primitives, Zustand, Axios.
- `backend/` - Express 5, TypeScript ESM, Prisma, PostgreSQL, Zod, JWT + httpOnly cookie, bcryptjs.
- `backend/prisma/schema.prisma` - modele domenowe: users, categories, products, cart items, orders, order items.
- `README.md` - opis uruchamiania, endpointow i aktualnego stanu aplikacji.

Glowny przeplyw produktu MVP: katalog produktow -> szczegoly produktu -> koszyk -> checkout/zamowienie -> historia zamowien -> panel admina.

## Repository Structure

Frontend:

- `frontend/app/(guest)` - publiczne strony: home, produkty, wyszukiwanie, kontakt, login, rejestracja.
- `frontend/app/(customer)` - strony klienta: koszyk, checkout, profil, ustawienia, zamowienia.
- `frontend/app/(admin)` - panel admina: produkty i zamowienia.
- `frontend/components` - komponenty layoutu, produktow, motion i UI primitives.
- `frontend/lib/api` - klient API i funkcje komunikacji z backendem.
- `frontend/lib/store` - Zustand stores dla auth i koszyka.
- `frontend/lib/schemas` oraz `frontend/lib/validators` - walidacja formularzy.

Backend:

- `backend/server.ts` - konfiguracja Express, middleware, routing, health check.
- `backend/src/routes` - definicje endpointow.
- `backend/src/controllers` - cienka warstwa HTTP.
- `backend/src/services` - logika biznesowa i Prisma.
- `backend/src/schemas` - walidacja Zod requestow i query params.
- `backend/src/middleware` - auth, role, walidacja i obsluga bledow.
- `backend/src/errors` - typowane bledy aplikacyjne.
- `backend/src/constants` - stale domenowe.
- `backend/src/types` - typy wspoldzielone w backendzie.

## Commands

Uruchamiaj komendy z katalogu aplikacji, ktorej dotyczy zmiana.

Backend:

```bash
cd backend
npm run dev
npm run build
npm start
```

Frontend:

```bash
cd frontend
npm run dev
npm run lint
npm run build
npm start
```

Preferowana weryfikacja:

- Zmiany frontendowe: `npm run lint`; przy trasach, typach, server/client boundaries lub konfiguracji takze `npm run build`.
- Zmiany backendowe: `npm run build`.
- Zmiany Prisma: sprawdz `schema.prisma`, migracje i czy generowanie klienta przechodzi przez `npm run build`.

## General Engineering Rules

- Preferuj najmniejsza poprawna zmiane zamiast duzych refaktorow.
- Zachowuj separacje warstw: route -> middleware/walidacja -> controller -> service -> data access.
- Kontrolery maja byc cienkie: pobieraja zwalidowane dane, wywoluja service i zwracaja HTTP response.
- Service zawiera logike biznesowa i zaklada, ze dane zostaly zwalidowane na granicy aplikacji.
- Nie dodawaj abstrakcji na zapas.
- Nie duplikuj stalych domenowych; uzywaj wspolnych constow, enumow albo `as const`.
- Nie uzywaj magic stringow do sterowania bledami, np. `error.message === "PRODUCT_NOT_FOUND"`.
- Nie dodawaj nowej biblioteki UI, state managementu albo klienta HTTP bez wyraznej potrzeby.
- Nie zmieniaj formatowania calego pliku, jesli zadanie wymaga malej zmiany.
- Nie modyfikuj `.env`, `node_modules`, `.next`, `dist`, cache ani wygenerowanych artefaktow.

## Environment And Configuration

Backend wymaga co najmniej:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- `PORT`

Frontend uzywa:

- `NEXT_PUBLIC_API_URL`

Nie commituj sekretow ani lokalnych plikow `.env`. Jesli dodajesz nowa zmienna srodowiskowa, zaktualizuj dokumentacje tylko wtedy, gdy user o to poprosi albo zadanie dotyczy konfiguracji/dokumentacji.

## Skills

### Skill: Next.js Frontend

Use when working in `frontend/app`, `frontend/components`, `frontend/lib/api`, `frontend/lib/store`, UI flows, routing, loading/error states, auth guards or customer/admin pages.

Rules:

- Preferuj Server Components dla danych SEO i render-only pages.
- Dodawaj `"use client"` tylko tam, gdzie potrzebne sa hooki, event handlery, Zustand, `window`, `localStorage`, animacje albo interakcje.
- Zachowuj istniejacy styl Buyly: dark-first, cyber/terminal, cienkie bordery, kompaktowe spacingi, cyan accents, tokeny z `globals.css`.
- Uzywaj istniejacych komponentow z `components/ui` przed tworzeniem nowych primitives.
- Uzywaj `@/` aliasu, jesli plik juz stosuje importy absolutne.
- Nie dodawaj `useMemo`/`useCallback` domyslnie; uzywaj ich tylko przy realnej potrzebie albo istniejacym wzorcu.
- Przy nowych trasach sprawdz mobile i desktop layout.
- Po zmianach uruchom `npm run lint`; przy zmianach routingu lub server/client boundaries uruchom tez `npm run build`.

### Skill: Backend API

Use when working in `backend/server.ts`, `backend/src/routes`, `controllers`, `services`, `middleware`, `schemas`, `errors`, `types` or API behavior.

Rules:

- Zachowuj kolejnosc: route -> middleware/walidacja -> controller -> service -> Prisma.
- Waliduj `req.body`, `req.query` i `req.params` na granicy aplikacji.
- Nie parsuj recznie query params w kontrolerze, jesli mozna uzyc Zod coercion.
- Kontroler nie powinien mapowac wszystkich przypadkow biznesowych przez `try/catch`; pozwol globalnemu error middleware obsluzyc `AppError`.
- Nie zwracaj szczegolow implementacyjnych przy nieoczekiwanych bledach.
- Po zmianach uruchom `npm run build` w `backend/`.

### Skill: Zod Validation

Use when adding or changing request validation, form validation, query params, payload coercion or typed validated data flow.

Rules:

- Backendowe schematy trzymaj w `backend/src/schemas`.
- Frontendowe formularze trzymaj w `frontend/lib/schemas` albo aktualnym miejscu projektu.
- Dla query params preferuj `z.coerce.number()`, `z.enum(...)`, `.default(...)`, `.optional()` i `.transform(...)`.
- Nie ukrywaj blednych danych przez fallbacki typu `Number(value) || 1`, jesli blad powinien dac `400`.
- Po walidacji przekazuj dalej gotowe dane, np. przez `res.locals` albo jawnie typowany obiekt.

### Skill: Auth And Authorization

Use when working on login, register, logout, `/auth/me`, JWT, cookies, auth store, route guards or role checks.

Rules:

- Backend uzywa JWT i cookie httpOnly; frontend ma auth store w Zustand.
- Chronione backend endpoints musza uzywac `authMiddleware` i `roleMiddleware` tam, gdzie jest wymagana rola.
- Panel admina wymaga roli `ADMIN`.
- Strefa klienta wymaga `CUSTOMER` albo `ADMIN`.
- Nie przechowuj nowych sekretow ani danych wrazliwych w localStorage.
- Przy zmianach sesji sprawdz login, logout, odswiezenie strony i przekierowania guardow.

### Skill: Products And Catalog

Use when working on product list, product details, search, filters, sorting, categories, stock or admin product management.

Rules:

- Publiczny katalog pokazuje tylko aktywne produkty.
- Slug produktu powinien pozostac unikalny i stabilny dla URL.
- Nie duplikuj sort values; uzywaj `PRODUCT_SORT` i wspolnych stalych.
- Zmiany w magazynie musza byc spojne z koszykiem i zamowieniami.
- Usuwanie produktow powinno uwzgledniac historie zamowien; preferuj soft delete, jesli produkt moze byc powiazany z order items.

### Skill: Cart And Checkout

Use when working on cart store, cart API, add-to-cart controls, checkout, order creation or checkout success flow.

Rules:

- Koszyk klienta jest powiazany z userem i synchronizowany przez backend API.
- Nie tworz zamowienia z pustego koszyka.
- Backend ma ostatecznie weryfikowac produkt, aktywnosc, cene i stan magazynowy.
- Tworzenie zamowienia i zmiana stocku musza byc transakcyjne.
- Po udanym zamowieniu koszyk powinien zostac wyczyszczony i user powinien zobaczyc numer oraz podsumowanie zamowienia.

### Skill: Orders And Admin Panel

Use when working on order history, admin orders, status updates, deletion/cancellation, pagination or order search.

Rules:

- Klient widzi tylko swoje zamowienia.
- Admin widzi liste zamowien, paginacje, wyszukiwanie i moze zmieniac status.
- Anulowanie zamowienia powinno przywracac stock tylko raz.
- Nie reaktywuj anulowanego zamowienia bez jasnego wymagania biznesowego.
- Zmiany statusow powinny byc walidowane przez Zod enum i typy wspoldzielone.

### Skill: Prisma And Database

Use when changing `schema.prisma`, migrations, generated Prisma client usage, relations, indexes or transactional behavior.

Rules:

- Kazda zmiana modelu wymaga migracji albo jasnej informacji, ze migracja nie zostala wykonana.
- Dbaj o relacje i `onDelete`, szczegolnie dla order history.
- Uzywaj transakcji Prisma dla operacji, ktore lacza order, order items, cart cleanup i stock.
- Nie edytuj wygenerowanego klienta Prisma recznie.
- Po zmianach uruchom backend build.

### Skill: Error Handling

Use when adding errors, changing HTTP status mapping, validation failures or global error behavior.

Rules:

- Uzywaj `AppError`, `BadRequestError`, `UnauthorizedError`, `NotFoundError` albo dodaj nowa dedykowana klase, jesli jest potrzebna.
- Nie steruj flow przez porownywanie tekstu `error.message`.
- Globalny error middleware powinien mapowac znane bledy na HTTP response.
- Nie ujawniaj klientowi stack trace ani szczegolow implementacyjnych.

### Skill: Documentation

Use only when the user asks for docs, README, API docs, setup instructions, changelog or agent instructions.

Rules:

- Dokumentacja ma byc konkretna, aktualna i zgodna z kodem.
- Aktualizuj tylko pliki zwiazane z prosba usera.
- Dla zmian konfiguracji opisz wymagane env vars, komendy i migracje.
- Nie dopisuj dokumentacji automatycznie po kazdej zmianie kodu, jesli user o to nie prosil.

### Skill: Git Commits

Use only after explicit user request to create a commit.

Valid triggers:

- `create commit`
- `commit changes`
- `commit this`
- `prepare commit`
- `make a commit`

Rules:

- Przed commitem pokaz zmienione pliki, krotkie podsumowanie i proponowany commit message.
- Zapytaj o potwierdzenie przed utworzeniem commita.
- Nie wykonuj `git push` bez osobnej wyraznej zgody.
- Przed pushem pokaz branch, latest commit, remote i dokladna komende.

Preferred commit format:

```txt
type(scope): short description
```

Allowed types:

- `feat`
- `fix`
- `refactor`
- `docs`
- `style`
- `test`
- `chore`
- `build`
- `ci`

## Review Checklist

Przed zakonczeniem wiekszej zmiany agent powinien sprawdzic:

- Czy zmiana dotyczy tylko wymaganego zakresu.
- Czy nie narusza warstw backendu.
- Czy walidacja danych jest na granicy aplikacji.
- Czy UI zachowuje styl Buyly i jest responsywne.
- Czy auth/role checks sa po obu stronach tam, gdzie trzeba.
- Czy operacje order/cart/stock sa bezpieczne transakcyjnie.
- Czy uruchomiono odpowiedni lint/build albo opisano, dlaczego nie.

## What This File Should Control

Ten plik moze zawierac wymagania dotyczace:

- architektury i separacji warstw,
- zasad walidacji danych,
- obslugi bledow,
- stylu UI i design systemu,
- komend uruchamiania i weryfikacji,
- zasad bezpieczenstwa,
- sposobu pracy z Git,
- kiedy aktualizowac dokumentacje,
- oczekiwanego sposobu komunikacji agenta,
- podzialu na skille/obszary domenowe,
- checklist przed zakonczeniem zadania.

Nie powinien zawierac sekretow, tokenow, hasel, lokalnych sciezek zaleznych od jednej maszyny ani instrukcji sprzecznych z realnym kodem projektu.
