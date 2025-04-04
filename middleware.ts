// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isButlerRoute = createRouteMatcher(['/butler(.*)']);
const isGuestRoute = createRouteMatcher(['/guest(.*)']);

const guestHome = '/guest/home';
const butlerHome = '/butler/dashboard';
const adminHome = '/admin/overview';

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, orgRole } = auth();
  const role = sessionClaims?.metadata?.role || orgRole; // Check if this resolves correctly
  const { pathname } = req.nextUrl;

  // --- Log basic info ---
  console.log(`Middleware triggered for path: ${pathname}`);
  console.log(`User ID: ${userId}`);
  console.log(`User Role (from metadata/org): ${role}`); // Check if role is found!

  // --- 1. Public Routes ---
  if (isPublicRoute(req)) {
    // If user is logged in AND trying to access a public auth page like /sign-in, redirect them away
    if (userId && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
      console.log('User is logged in, redirecting away from auth page...');
      let redirectUrl = '/'; // Default redirect IF role is somehow unknown right after login
      if (role === 'guest') redirectUrl = guestHome;
      else if (role === 'butler') redirectUrl = butlerHome;
      else if (role === 'admin') redirectUrl = adminHome;
      else console.log('Role unknown when redirecting from auth page, defaulting to /'); // Log if role is missing
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
    console.log('Allowing access to public route.');
    return NextResponse.next(); // Allow access to public routes for logged-out users
  }

  // --- 2. Authentication --- (User MUST be logged in here onwards)
  if (!userId) {
    console.log('User not logged in, redirecting to sign-in.');
    const signInUrl = new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL!, req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // --- At this point, user is definitely logged in ---
  console.log('User is logged in.');


  // --- 3. Redirect from Root Path ---
  if (pathname === '/') {
    console.log('User hit root path /');
    if (role === 'guest') {
       console.log('Redirecting guest to guestHome');
       return NextResponse.redirect(new URL(guestHome, req.url));
    }
    if (role === 'butler') {
      console.log('Redirecting butler to butlerHome');
      return NextResponse.redirect(new URL(butlerHome, req.url));
    }
    if (role === 'admin') {
      console.log('Redirecting admin to adminHome');
      return NextResponse.redirect(new URL(adminHome, req.url));
    }
    // Fallback if role is missing or unknown WHEN hitting '/'
    console.log('Role unknown when hitting /, redirecting to default (guestHome)');
    return NextResponse.redirect(new URL(guestHome, req.url));
  }

  // --- 4. Protection for specific role paths --- (Simplified logging)
  if (isAdminRoute(req) && role !== 'admin') {
     console.log(`Redirecting non-admin from admin route (${pathname})`);
     return NextResponse.redirect(new URL(guestHome, req.url));
   }
  if (isButlerRoute(req) && role !== 'butler' /* && role !== 'admin' */) {
     console.log(`Redirecting non-butler from butler route (${pathname})`);
     return NextResponse.redirect(new URL(guestHome, req.url));
   }
  if (isGuestRoute(req) && role !== 'guest' /* && role !== 'admin' && role !== 'butler' */ ) {
     console.log(`Redirecting non-guest from guest route (${pathname})`);
     // Decide where non-guests trying to access guest routes should go
     return NextResponse.redirect(new URL(butlerHome, req.url));
   }

  // --- Allow Access ---
  console.log(`Allowing access for user ${userId} with role ${role} to path ${pathname}`);
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/',
    '/(admin|butler|guest)(.*)',
    '/api/(.*)',
  ],
};