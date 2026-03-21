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
virtual-event-ticketing/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (name, email, role)
│   │   ├── Event.js         # Event schema (title, seats, price)
│   │   └── Ticket.js        # Ticket schema (QR, status, ticketId)
│   ├── routes/
│   │   ├── auth.js          # Register, Login, Me
│   │   ├── events.js        # CRUD for events
│   │   ├── tickets.js       # Book, list, cancel tickets
│   │   └── admin.js         # Dashboard, bookings, QR check-in
│   ├── middleware/
│   │   └── auth.js          # JWT protect + adminOnly
│   ├── utils/
│   │   └── qrEmail.js       # QR code generator + email sender
│   ├── server.js
│   └── .env.example
├── frontend/
│   └── src/
│       ├── context/
│       │   └── AuthContext.js
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Events.js
│       │   ├── EventDetail.js
│       │   ├── MyTickets.js
│       │   ├── Login.js / Register.js
│       │   ├── AdminDashboard.js
│       │   ├── AdminEvents.js
│       │   ├── AdminBookings.js
│       │   └── QRScanner.js   ← Camera-based QR check-in
│       └── components/
│           └── Navbar.js
└── README.md
```

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
| POST | `/api/tickets/book` | Book ticket |
| GET | `/api/tickets/my` | Get my tickets |
| POST | `/api/tickets/cancel/:ticketId` | Cancel ticket |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Stats + recent bookings |
| GET | `/api/admin/bookings` | All bookings (filterable) |
| POST | `/api/admin/checkin` | **QR Check-in validation** |
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
