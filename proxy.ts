import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: string;
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  // Only protect admin routes
  if (pathname.startsWith("/admin")) {
    // User is not logged in
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as TokenPayload;

      // User is not an admin
      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/menu", request.url));
      }

      // Admin is allowed
      return NextResponse.next();
    } catch (error) {
      console.error("Proxy authentication error:", error);

      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
