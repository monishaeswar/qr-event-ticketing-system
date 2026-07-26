// Minimal timestamped logger. Swap the console calls for a library like
// winston/pino later without touching any call sites elsewhere in the app.
const timestamp = () => new Date().toISOString();

const logger = {
  info: (...args) => console.log(`[INFO ${timestamp()}]`, ...args),
  warn: (...args) => console.warn(`[WARN ${timestamp()}]`, ...args),
  error: (...args) => console.error(`[ERROR ${timestamp()}]`, ...args),
  debug: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG ${timestamp()}]`, ...args);
    }
  },
};

module.exports = logger;
