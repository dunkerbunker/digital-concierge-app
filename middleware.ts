// middleware.ts
import {
  clerkMiddleware,
  createRouteMatcher,
  auth, // Import auth to get session claims
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// --- Configuration: Define Roles (Must match values in Clerk publicMetadata.role) ---
const ROLES = {
  ADMIN: 'admin',
  BUTLER: 'butler',
  GUEST: 'guest', // Assuming 'guest' is the default or explicitly set for standard users
};

// --- Route Matchers ---

// Routes accessible to everyone, including logged-out users
const isPublicRoute = createRouteMatcher([
  '/',                      // Landing/Marketing page (adjust if it requires login)
  '/sign-in(.*)',           // Clerk sign-in flow routes
  '/sign-up(.*)',           // Clerk sign-up flow routes
  '/api/webhook(.*)',       // Any public webhooks (e.g., Clerk user sync)
  '/api/example-route',     // Your example public API route
  // Add other public pages like /about, /contact, /pricing if they exist
]);

// Routes specifically for authentication (used for redirection logic)
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

// Routes requiring Admin role
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// Routes requiring Butler role (or Admin)
const isButlerRoute = createRouteMatcher(['/butler(.*)']);

// Routes requiring Guest role (or Butler/Admin - essentially any logged-in user)
const isGuestRoute = createRouteMatcher(['/guest(.*)']);

export default clerkMiddleware((authData, req) => {
  const { userId, sessionClaims, redirectToSignIn } = authData;

  // --- Get User Role from Clerk Metadata ---
  // Assumes role is stored like: publicMetadata: { role: 'admin' | 'butler' | 'guest' }
  // Ensure this key ('role') and the values match your Clerk setup.
  const userRole = sessionClaims?.publicMetadata?.role as string | undefined;

  // --- 1. Redirect logged-in users trying to access auth pages ---
  if (userId && isAuthRoute(req)) {
    let redirectUrl = '/guest/home'; // Default redirect for guests or unknown roles

    // Determine dashboard based on role
    if (userRole === ROLES.ADMIN) {
      redirectUrl = '/admin/overview';
    } else if (userRole === ROLES.BUTLER) {
      redirectUrl = '/butler/dashboard';
    }
    // Guests or users without a specific role assigned yet go to '/guest/home'

    console.log(`Redirecting logged-in user from auth route to: ${redirectUrl}`);
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // --- 2. Allow access to public routes ---
  if (isPublicRoute(req)) {
    // console.log(`Allowing access to public route: ${req.nextUrl.pathname}`);
    return NextResponse.next(); // Does not require authentication
  }

  // --- 3. Redirect unauthenticated users trying to access protected routes ---
  if (!userId) {
    console.log(`Unauthenticated access to protected route: ${req.nextUrl.pathname}. Redirecting to sign-in.`);
    // Pass the intended URL (returnBackUrl) so Clerk redirects them after login
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // --- 4. Role-Based Access Control for Logged-In Users ---
  // At this point, we know the user is logged in (userId exists).

  // Admin Route Protection
  if (isAdminRoute(req)) {
    if (userRole !== ROLES.ADMIN) {
      console.warn(`Unauthorized access attempt to admin route by user ${userId} with role ${userRole}. Redirecting.`);
      // Redirect non-admins trying to access admin pages
      const redirectUrl = userRole === ROLES.BUTLER ? '/butler/dashboard' : '/guest/home';
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
    // console.log(`Allowing admin access for user ${userId} to: ${req.nextUrl.pathname}`);
    return NextResponse.next(); // Allow access if user is admin
  }

  // Butler Route Protection
  if (isButlerRoute(req)) {
    // Allow both Butlers and Admins to access Butler routes
    if (userRole !== ROLES.BUTLER && userRole !== ROLES.ADMIN) {
       console.warn(`Unauthorized access attempt to butler route by user ${userId} with role ${userRole}. Redirecting.`);
       // Redirect non-butlers/non-admins (i.e., guests)
       return NextResponse.redirect(new URL('/guest/home', req.url));
    }
     // console.log(`Allowing butler/admin access for user ${userId} to: ${req.nextUrl.pathname}`);
    return NextResponse.next(); // Allow access if user is butler or admin
  }

  // Guest Route Protection
  if (isGuestRoute(req)) {
    // Any logged-in user (Guest, Butler, Admin) can access guest routes by default.
    // If you needed to restrict this *only* to guests, you would add:
    // if (userRole !== ROLES.GUEST) { /* redirect logic */ }
    // console.log(`Allowing logged-in user access for user ${userId} to: ${req.nextUrl.pathname}`);
    return NextResponse.next(); // Allow access to all logged-in users
  }

  // --- 5. Fallback for any other authenticated routes ---
  // If a route is not public, not an auth route, and doesn't match admin/butler/guest prefixes,
  // but the user is logged in, this rule applies.
  // You might want to be more specific or redirect to a default dashboard.
  // For now, we allow access if they are logged in and haven't been caught by other rules.
  // console.log(`Allowing access to other authenticated route for user ${userId}: ${req.nextUrl.pathname}`);
  return NextResponse.next();

});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any paths containing a period (.) likely indicating a file extension
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
    // Match the root ('/') route explicitly if it wasn't caught by the pattern above
    '/',
    // Include API routes in the matcher if they need protection/logic applied by the middleware
    // '/(api|trpc)(.*)', // Uncomment and adjust if API routes need protection
  ],
};