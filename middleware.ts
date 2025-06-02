import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Health check endpoint
  if (request.nextUrl.pathname === '/health') {
    return new NextResponse('OK', { status: 200 });
  }

  // Ingen redirect behövs - Render hanterar frejfund.com → www.frejfund.com
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