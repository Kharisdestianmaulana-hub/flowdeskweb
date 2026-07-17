import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/auth';

const locales = ['en', 'id'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  const preferredLocales = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim().toLowerCase().split('-')[0]);

  for (const preferred of preferredLocales) {
    if (locales.includes(preferred)) return preferred;
  }

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard auth check
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
  }

  if (pathname.startsWith('/dashboard/login')) {
    const session = await getSession();
    if (session) {
      return NextResponse.redirect(new URL('/dashboard/portal-update', request.url));
    }
  }

  // Skip static files, api, dashboard
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/dashboard') ||
    pathname.includes('.')
  ) {
    return;
  }

  // Skip if locale already present
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  // Redirect to locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
