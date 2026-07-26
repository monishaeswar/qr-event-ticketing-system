const { USER_ROLES } = require('../utils/constants');

// Must run after authMiddleware.protect, which populates req.user.
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === USER_ROLES.ADMIN) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
};

module.exports = { adminOnly };
