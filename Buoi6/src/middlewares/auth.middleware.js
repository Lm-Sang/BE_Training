import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/error.helper.js";

export const authMiddleware = {
  authenticateToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing or invalid authorization header");
    }

    const accessToken = authorizationHeader.split(" ")[1];

    try {
      const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = payload;
      next();
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  },
};
