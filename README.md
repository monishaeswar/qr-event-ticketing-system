# 🎟 Virtual Event Ticketing & QR Check-in System

A full-stack web application for hosting events, booking digital tickets, and performing QR-based check-ins at the venue.

![Tech Stack](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)

---

## ✨ Features

- 🎪 **Event Management** — Admins can create, edit, and manage events with categories, seats, and pricing
- 🎫 **Ticket Booking** — Users book tickets instantly with seat availability tracking
- 📧 **Email QR Tickets** — Digital QR-coded tickets are sent via email upon booking
- 📱 **QR Check-in Scanner** — Admins scan QR codes at the venue with real-time validation
- 📊 **Admin Dashboard** — Live stats for revenue, bookings, events, and check-ins
- 🔐 **JWT Authentication** — Secure role-based access (User / Admin)
- 📋 **Booking Management** — Filter bookings by event, status; view/cancel tickets

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB, Mongoose                   |
| Frontend  | React.js, React Router v6           |
| Styling   | Bootstrap 5                         |
| Auth      | JWT (jsonwebtoken), bcryptjs        |
| QR Code   | `qrcode` npm package                |
| Email     | Nodemailer (Gmail SMTP)             |
| QR Scan   | html5-qrcode (camera-based scanner) |

---

## 📁 Project Structure

```
qr-event-ticketing-system/
├── backend/
│   ├── config/            # db.js, cloudinary.js, mail.js
│   ├── controllers/       # authController, eventController, bookingController, etc.
│   ├── middleware/        # authMiddleware, adminMiddleware, uploadMiddleware,
│   │                      # validationMiddleware, errorHandler
│   ├── models/            # User, Event, Booking, Payment, Ticket
│   ├── routes/            # thin route definitions per resource
│   ├── services/          # qrService, emailService, paymentService,
│   │                      # pdfService, notificationService
│   ├── utils/              # generateQRCode, generatePDF, generateTicketId,
│   │                      # logger, constants
│   ├── templates/
│   │   └── ticketEmail.html
│   ├── uploads/            # events/, profiles/ (local image storage)
│   ├── app.js              # express app (no side effects)
│   ├── server.js           # DB connect + listen
│   └── .env.example
├── frontend/
│   └── src/
│       ├── components/     # Navbar, Footer, EventCard, TicketCard,
│       │                   # QRCodeCard, BookingForm, Loader, Button, Modal
│       ├── pages/          # Home, Events, EventDetails, BookTicket,
│       │                   # MyTickets, Profile, Login, Register,
│       │                   # AdminDashboard, AdminEvents, CreateEvent,
│       │                   # EditEvent, ManageBookings, QRScanner, NotFound
│       ├── layouts/        # MainLayout, AdminLayout
│       ├── services/       # api.js + one service module per resource
│       ├── hooks/          # useAuth
│       ├── context/        # AuthContext
│       ├── routes/         # AppRoutes, ProtectedRoute
│       └── utils/          # formatters
├── database/
│   ├── collections.md      # Mongo collection reference (this is a Mongo
│   │                       # project, so no schema.sql)
│   ├── seed.js             # sample admin user + events
│   └── ER-diagram.md       # Mermaid ER diagram
└── README.md
```

Every original route (`/api/auth/*`, `/api/events*`, `/api/tickets/*`,
`/api/admin/*`) still works exactly as before — the restructure only moved
logic into controllers/services and added new endpoints alongside them
(`/api/users`, `/api/bookings`, `/api/payments`, `/api/qr`). See
`CHANGELOG.md` for the full list of changes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email sending)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/virtual-event-ticketing.git
cd virtual-event-ticketing
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Gmail credentials
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Create Admin User
Register a user, then update their role in MongoDB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

Or seed a ready-made admin (`admin@eventticket.com` / `admin123`) plus a
few sample events:
```bash
cd backend && node ../database/seed.js
```

---

## 🔑 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event-ticketing
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all events |
| GET | `/api/events/:id` | Get event details |
| POST | `/api/events` | Create event (Admin) |
| PUT | `/api/events/:id` | Update event (Admin) |
| DELETE | `/api/events/:id` | Deactivate event (Admin) |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tickets/book` | Book ticket (single-step) |
| GET | `/api/tickets/my` | Get my tickets |
| GET | `/api/tickets/:ticketId` | Get a ticket by ID |
| POST | `/api/tickets/cancel/:ticketId` | Cancel ticket |

### Bookings & Payments (new)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking → charge → issue ticket |
| GET | `/api/bookings/my` | My bookings (with payment + ticket populated) |
| GET | `/api/bookings/:id` | Get a booking by ID |
| GET | `/api/payments/my` | My payment records |
| GET | `/api/payments/:id` | Get a payment by ID |

### Users (new)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get my profile |
| PUT | `/api/users/profile` | Update name/phone/profile picture |
| PUT | `/api/users/password` | Change password |

### QR (new)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/qr/checkin` | QR check-in (canonical route) |
| GET | `/api/qr/:ticketId` | Re-fetch a ticket's QR image |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Stats + recent bookings |
| GET | `/api/admin/bookings` | All bookings (filterable) |
| POST | `/api/admin/checkin` | QR check-in (kept for backward compatibility) |
| GET | `/api/admin/events/:id/stats` | Per-event statistics |

---

## 🎯 Key Highlights

- **QR Code Generation**: Each ticket gets a unique QR encoding `{ticketId, eventId, userId, quantity}` using the `qrcode` library
- **Email Delivery**: QR ticket is embedded as an inline image in the HTML email via Nodemailer
- **Real-time Check-in Validation**: Admin scans QR → backend validates status → marks `checked-in` with timestamp
- **Duplicate Scan Prevention**: Already checked-in tickets return a warning with the original check-in time
- **Seat Management**: `availableSeats` auto-decrements on booking and restores on cancellation

---

## 📸 Screenshots

> After deployment, add screenshots of:
> - Home page with event listings
> - Event detail with booking form
> - My Tickets page with QR code display
> - Admin Dashboard with stats
> - QR Scanner interface

---

## 📄 License

MIT License — feel free to use for portfolio or learning purposes.
