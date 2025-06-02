import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const requestUrl = request.url;
  
  // Log for debugging
  console.log('Middleware - Host:', hostname);
  console.log('Middleware - Original URL:', requestUrl);

  // Handle www redirect
  if (hostname.includes('www.')) {
    // Create a proper URL without port
    const cleanHost = hostname.replace('www.', '').split(':')[0]; // Remove www and port
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const pathname = request.nextUrl.pathname;
    const search = request.nextUrl.search;
    
    const redirectUrl = `${protocol}://${cleanHost}${pathname}${search}`;
    console.log('Redirecting to:', redirectUrl);
    
    return NextResponse.redirect(redirectUrl, 301);
  }

  // Health check endpoint
  if (request.nextUrl.pathname === '/health') {
    return new NextResponse('OK', { status: 200 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)' 
  ]
}; 