import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies["access_token"];
  if (!accessToken) return res.status(401).json({ error: "Missing token" });

  const token = accessToken.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string; email: string; };
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Unauthorized" });
  }
};
