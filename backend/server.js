const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Bootstraps the process: connect to the DB, then start listening.
// app.js itself has no side effects, so it can be required directly in
// tests without opening a real DB connection or port.
connectDB()
  .then(() => {
    app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
