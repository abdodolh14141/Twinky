import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;
const TOKEN_MISSING_MESSAGE = "Bad Request: Token is missing";
const TOKEN_INVALID_MESSAGE = "Unauthorized: Invalid or expired token";

export const authenticateJWT = (req, res, next) => {
  try {
    // Extract token
    const token = extractToken(req);

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new Error(TOKEN_INVALID_MESSAGE);
      }

      // Attach decoded data to request object
      req.dataAuto = decoded;
      next();
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Extract token from request
const extractToken = (req) => {
  const token = req.cookies.token;

  if (!token) {
    throw createError(400, TOKEN_MISSING_MESSAGE);
  }

  return token;
};

// Create error object
const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
