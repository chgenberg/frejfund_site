import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Log for debugging
  console.log('Middleware - Host:', hostname);
  console.log('Middleware - URL:', url.toString());

  // Redirect www to non-www
  if (hostname.includes('www.')) {
    const newUrl = new URL(request.url);
    newUrl.host = hostname.replace('www.', '');
    console.log('Redirecting to:', newUrl.toString());
    return NextResponse.redirect(newUrl, 301);
  }

  // Health check endpoint
  if (url.pathname === '/health') {
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