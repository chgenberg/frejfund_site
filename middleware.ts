import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';

  // Use the forwarded host if available (this is what Render sends)
  if (forwardedHost) {
    url.host = forwardedHost;
    url.protocol = forwardedProto;
    url.port = ''; // Clear any port number
  }

  // Redirect www to non-www
  if (hostname.startsWith('www.') || (forwardedHost && forwardedHost.startsWith('www.'))) {
    const newHost = (forwardedHost || hostname).replace('www.', '');
    url.host = newHost;
    url.protocol = forwardedProto;
    url.port = ''; // Clear any port number
    return NextResponse.redirect(url, 301);
  }

  // Health check endpoint for Render
  if (url.pathname === '/health') {
    return new NextResponse('OK', { status: 200 });
  }

  // Create response with correct host headers
  const response = NextResponse.next();
  
  // Set the correct host header to prevent port being added
  if (forwardedHost) {
    response.headers.set('x-forwarded-host', forwardedHost);
  }

  return response;
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