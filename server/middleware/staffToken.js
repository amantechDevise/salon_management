const jwt = require("jsonwebtoken");

const stafauthenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing!" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, staff) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.staff = staff; 
    next();
  });
};

module.exports = stafauthenticateToken;