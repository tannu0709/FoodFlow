import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET_STRING = JWT_SECRET;

export interface AuthUser {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export function createToken(user: AuthUser) {
  return jwt.sign(user, JWT_SECRET_STRING, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET_STRING) as AuthUser;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false,
      status: 401,
      message: "Please login first",
    };
  }

  if (user.role !== "admin") {
    return {
      authorized: false,
      status: 403,
      message: "Admin access required",
    };
  }

  return {
    authorized: true,
    user,
  };
}
