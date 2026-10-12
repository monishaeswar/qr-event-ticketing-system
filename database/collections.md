# Database Collections

This project uses **MongoDB via Mongoose**, not a relational database, so
there's no `schema.sql`. This file documents the five collections instead —
the source of truth is always `backend/models/*.js`.

> Note: the reference project structure this repo is modeled on assumed a
> SQL database (`schema.sql`, `seed.sql`). Since the actual app is
> Mongo/Mongoose-based, those two files have been replaced by this document
> and `seed.js` (see below) respectively.

## User

| Field         | Type     | Notes                                  |
|---------------|----------|-----------------------------------------|
| name          | String   | required                                |
| email         | String   | required, unique, lowercase             |
| password      | String   | required, bcrypt-hashed, min 6 chars     |
| role          | String   | `user` \| `admin`, default `user`       |
| phone         | String   | optional                                |
| profileImage  | String   | optional, path under `/uploads/profiles`|
| timestamps    |          | createdAt, updatedAt                    |

## Event

| Field          | Type     | Notes                                              |
|----------------|----------|-----------------------------------------------------|
| title          | String   | required                                            |
| description    | String   | required                                            |
| date           | Date     | required                                            |
| time           | String   | required                                            |
| venue          | String   | required                                            |
| category       | String   | one of Conference/Concert/Workshop/Seminar/Sports/Other |
| ticketPrice    | Number   | required                                            |
| totalSeats     | Number   | required                                            |
| availableSeats | Number   | decremented on booking, incremented on cancellation |
| imageUrl       | String   | optional, path under `/uploads/events`              |
| isActive       | Boolean  | soft-delete flag                                    |
| createdBy      | ObjectId | ref `User`                                          |

## Booking

Represents the *intent* to reserve seats, created before payment.

| Field        | Type     | Notes                                  |
|--------------|----------|-----------------------------------------|
| event        | ObjectId | ref `Event`                             |
| user         | ObjectId | ref `User`                              |
| quantity     | Number   | 1–10                                    |
| totalAmount  | Number   |                                          |
| status       | String   | `pending` \| `confirmed` \| `cancelled` |
| payment      | ObjectId | ref `Payment`, set once charged         |
| ticket       | ObjectId | ref `Ticket`, set once issued           |

## Payment

Simulated payment record (see `backend/services/paymentService.js` for
where to plug in a real gateway).

| Field         | Type     | Notes                                          |
|---------------|----------|--------------------------------------------------|
| booking       | ObjectId | ref `Booking`                                   |
| user          | ObjectId | ref `User`                                      |
| amount        | Number   |                                                  |
| currency      | String   | default `INR`                                   |
| method        | String   | default `simulated`                             |
| status        | String   | `pending` \| `success` \| `failed` \| `refunded`|
| transactionId | String   |                                                  |
| paidAt        | Date     |                                                  |

## Ticket

The issued ticket, with its QR code, created once a booking is confirmed.

| Field         | Type     | Notes                                          |
|---------------|----------|--------------------------------------------------|
| ticketId      | String   | required, unique, e.g. `EVT-9F3C1A2B`           |
| booking       | ObjectId | ref `Booking` (optional - legacy direct bookings have none) |
| event         | ObjectId | ref `Event`                                     |
| user          | ObjectId | ref `User`                                      |
| quantity      | Number   | 1–10                                            |
| totalAmount   | Number   |                                                  |
| qrCode        | String   | base64 PNG data URL                             |
| status        | String   | `booked` \| `checked-in` \| `cancelled`         |
| checkedInAt   | Date     | set by the QR scanner check-in flow             |
| attendeeName  | String   | required                                        |
| attendeeEmail | String   | required                                        |

## Relationships

```
User ──< Booking >── Event
          │
          ├──> Payment
          └──> Ticket
```

A `Ticket` can also exist without a `Booking` (the legacy one-step
`POST /api/tickets/book` flow bypasses Booking/Payment entirely).
