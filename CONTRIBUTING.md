# Contributing

Thanks for considering a contribution!

## Getting set up

```bash
# Backend
cd backend
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, EMAIL_USER/PASS
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm start
```

Optionally seed some sample data:

```bash
cd backend && node ../database/seed.js
```

## Project structure

See the top-level `README.md` for the full directory layout. In short:

- `backend/controllers` — request handlers (thin — delegate to `services/`)
- `backend/services` — business logic (QR generation, email, payments, PDF)
- `backend/models` — Mongoose schemas
- `frontend/src/pages` — routed pages
- `frontend/src/components` — reusable, presentational pieces
- `frontend/src/services` — API calls (one file per resource)

## Making changes

1. Fork and branch from `main`.
2. Keep controllers thin — new business logic belongs in `services/`.
3. Run `npm run build` in `frontend/` before opening a PR, to catch
   compile errors.
4. Describe what changed and why in your PR description.

## Reporting bugs

Open an issue with steps to reproduce, what you expected, and what
happened instead. Screenshots help for UI issues.
