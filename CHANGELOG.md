# Changelog

All notable changes to this project are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- Layered backend architecture: `config/`, `controllers/`, `services/`, `utils/`
- `Booking` and `Payment` models plus a `/api/bookings` flow (in addition to
  the existing one-step `/api/tickets/book`)
- `middleware/adminMiddleware.js`, `uploadMiddleware.js`,
  `validationMiddleware.js`, `errorHandler.js` (split out of the old
  combined `auth.js`)
- Local/Cloudinary-optional image uploads for events and profiles
- Frontend `layouts/`, `services/`, `hooks/`, `routes/`, `utils/` folders
- New pages: `Profile`, `BookTicket`, `CreateEvent`, `EditEvent`, `NotFound`
- New reusable components: `Footer`, `EventCard`, `TicketCard`,
  `QRCodeCard`, `BookingForm`, `Loader`, `Button`, `Modal`
- `AdminLayout` sidebar (using the `.admin-sidebar` CSS class that existed
  in `App.css` but was never wired up to any component)
- `database/collections.md` and `database/seed.js` (Mongo-native docs/seed,
  since this project uses MongoDB rather than a SQL database)
- `LICENSE`, `CONTRIBUTING.md`, this changelog

### Changed
- `server.js` split into `app.js` (Express app, no side effects) and
  `server.js` (DB connect + listen)
- All backend route handlers moved out of route files and into
  `controllers/`, with routes now thin
- Renamed `AdminBookings` → `ManageBookings`, `EventDetail` → `EventDetails`
  to match the intended page structure
- Frontend components/pages/context renamed `.js` → `.jsx`

### Notes
- All original API endpoints (`/api/auth/*`, `/api/events*`,
  `/api/tickets/*`, `/api/admin/*`) still work exactly as before —
  new endpoints were added alongside them, not in place of them.
