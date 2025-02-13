import pkg from "jsonwebtoken";
import AuthError from "../config/errors/AuthError.js";
const { verify, TokenExpiredError } = pkg;

export const authContext = ({ req } = {}) => {
  try {
    if (!req || !req.headers) {
      console.log("❌ Missing request object or headers!");
      return {}; // Return empty context if no headers
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("❌ No or invalid Authorization header!");
      return {}; // Return empty context if no token
    }

    const token = authHeader.split(" ")[1];
    console.log("🔑 Extracted Token:", token);

    if (!process.env.AUTH_ACCESS_TOKEN_SECRET) {
      console.error("❌ Missing JWT secret!");
      throw new AuthError("Internal Server Error", "JWT secret is not configured.");
    }

    const decoded = verify(token, process.env.AUTH_ACCESS_TOKEN_SECRET);
    console.log("✅ Decoded User:", decoded);

    return { user: { id: decoded._id, role: decoded.role }, token };

  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message, error.stack);

    if (error instanceof TokenExpiredError) {
      throw new AuthError("Token has expired. Please log in again.", "Session expired.");
    }

    throw new AuthError("Invalid token", "Token is tampered or malformed.");
  }
};