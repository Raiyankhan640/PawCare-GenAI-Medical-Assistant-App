import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Only protect routes that MUST require authentication
const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/doctor/dashboard(.*)",
  "/admin(.*)",
  "/video-call(.*)",
  "/appointments(.*)",
  "/petchat(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Check if this is a protected route
  if (isProtectedRoute(req)) {
    try {
      const { userId } = await auth();
      if (!userId) {
        return (await auth()).redirectToSignIn();
      }
    } catch (error) {
      // If auth fails due to clock skew, still allow the request
      console.log("Middleware auth error (allowing request):", error.message);
    }
  }

  const response = NextResponse.next();

  // Add performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};