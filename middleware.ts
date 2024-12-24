import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/sign-in", "/sign-up", "/"]; // Define your public routes

export default function middleware(request: NextRequest) {
  // Check if the current route is public
  const pathname = request.nextUrl.pathname;
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next(); // Allow access to public routes
  }

  // Apply Clerk Middleware for protected routes
  return clerkMiddleware()(request, {} as any);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
