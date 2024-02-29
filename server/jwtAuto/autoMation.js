import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("Token is missing");
    return res.status(400).json({
      success: false,
      message: "Bad Request: Token is missing",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT Verification Error:", err.message);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }

    req.dataAuto = decoded;
    next();
  });
};
