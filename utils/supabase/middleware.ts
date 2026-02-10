import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value }) =>
          supabaseResponse.cookies.set(name, value),
        );
      },
    },
  });

  // This will refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle protected routes
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isParentDashboard = request.nextUrl.pathname.startsWith('/parent-dashboard');

  if (!user && (isDashboard || isParentDashboard)) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // Cross-role protection
  if (user) {
    // We need to check the role from the public.profiles table
    // For middleware, we'll do a quick fetch
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'parent';

    // If a parent tries to access the admin dashboard, redirect them
    if (role === 'parent' && isDashboard) {
      const url = request.nextUrl.clone();
      url.pathname = '/parent-dashboard';
      return NextResponse.redirect(url);
    }

    // If an admin tries to access the parent dashboard, redirect them (optional, but consistent)
    if (role === 'admin' && isParentDashboard) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
};