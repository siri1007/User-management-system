module.exports = {
  requireRole: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied for this role" });
      }
      next();
    };
  },
  isAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  }
};
