import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'id'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  // Simple locale negotiation
  const preferredLocales = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim().toLowerCase().split('-')[0]);

  for (const preferred of preferredLocales) {
    if (locales.includes(preferred)) {
      return preferred;
    }
  }

  return defaultLocale;
}

import { getSession } from './lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- DASHBOARD AUTH CHECK ---
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    const session = await getSession();
    if (!session) {
      const loginUrl = new URL('/dashboard/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/dashboard/login')) {
    const session = await getSession();
    if (session) {
      const dashboardUrl = new URL('/dashboard/portal-update', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }
  // ----------------------------

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Check if the path is a static file, api, or dashboard
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/dashboard') ||
    pathname.includes('.')
  ) {
    return;
  }

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
