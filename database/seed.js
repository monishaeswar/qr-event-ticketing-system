// Mongo-native equivalent of the `seed.sql` referenced in the project
// structure (there's no relational schema here - see collections.md).
//
// Usage (from backend/):
//   node ../database/seed.js
//
// Requires MONGO_URI in backend/.env (or defaults to localhost).
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const mongoose = require('mongoose');
const connectDB = require('../backend/config/db');
const User = require('../backend/models/User');
const Event = require('../backend/models/Event');

const seed = async () => {
  await connectDB();
  console.log('Connected for seeding');

  let admin = await User.findOne({ email: 'admin@eventticket.com' });
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: 'admin@eventticket.com',
      password: 'admin123', // hashed automatically by the User model's pre-save hook
      role: 'admin',
    });
    console.log('Created admin user: admin@eventticket.com / admin123');
  } else {
    console.log('Admin user already exists, skipping');
  }

  const sampleEvents = [
    {
      title: 'Tech Conference 2026',
      description: 'A full day of talks on AI, cloud, and developer tooling.',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      time: '09:00',
      venue: 'Grand Convention Center',
      category: 'Conference',
      ticketPrice: 1499,
      totalSeats: 200,
      availableSeats: 200,
      createdBy: admin._id,
    },
    {
      title: 'Summer Music Fest',
      description: 'Live performances from local and touring bands.',
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      time: '18:00',
      venue: 'Riverside Amphitheater',
      category: 'Concert',
      ticketPrice: 999,
      totalSeats: 500,
      availableSeats: 500,
      createdBy: admin._id,
    },
    {
      title: 'React Workshop',
      description: 'Hands-on workshop covering React 18 and modern tooling.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      time: '10:00',
      venue: 'Innovation Hub, Room 3B',
      category: 'Workshop',
      ticketPrice: 499,
      totalSeats: 40,
      availableSeats: 40,
      createdBy: admin._id,
    },
  ];

  for (const eventData of sampleEvents) {
    const exists = await Event.findOne({ title: eventData.title });
    if (!exists) {
      await Event.create(eventData);
      console.log(`Created event: ${eventData.title}`);
    } else {
      console.log(`Event already exists, skipping: ${eventData.title}`);
    }
  }

  console.log('Seeding complete.');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
