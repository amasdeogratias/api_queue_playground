import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: () => void,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Access token is required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      userId: string;
    };

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired access token",
    });
  }
};
