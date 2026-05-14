import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = {
  matcher: ['/studio/:path*', '/api/:path*'],
};
