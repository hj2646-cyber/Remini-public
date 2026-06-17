import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-env";

export interface JwtPayload {
  caregiverId: string;
  email: string;
  role?: string;  // "admin" / "caregiver"
}

// Extend Express Request to include caregiverId
declare global {
  namespace Express {
    interface Request {
      caregiverId?: string;
    }
  }
}

/**
 * JWT authentication middleware.
 * Extracts caregiver ID from Bearer token and attaches it to req.caregiverId.
 * Returns 401 if no token or invalid token.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required. Provide a Bearer token." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.caregiverId = decoded.caregiverId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
    return;
  }
}

/**
 * Optional auth middleware: attaches caregiverId if a valid token is present,
 * but does NOT reject the request if no token is provided.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.caregiverId = decoded.caregiverId;
  } catch {
    // Token is invalid, but we don't block the request
  }

  next();
}

/**
 * Generate a JWT token for a caregiver.
 *
 * - role = "admin"  → 만료 없음 (관리자 영구 토큰)
 * - role = "caregiver" / 기타 → 7일 만료 (일반)
 */
export function generateToken(caregiverId: string, email: string, role?: string): string {
  const payload: JwtPayload = { caregiverId, email, role };
  if (role === "admin") {
    // 만료 없음 — 시연·관리자 작업용 영구 토큰
    return jwt.sign(payload, JWT_SECRET);
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
