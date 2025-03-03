export const adminsOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: "Access denied. Admins only." });
  };
  
  // Middleware for allowing access to regular users only
  export const usersOnly = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
      return next();
    }
    return res.status(403).json({ message: "Access denied. Users only." });
  };
  