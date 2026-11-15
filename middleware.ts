import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Keeps the Supabase session fresh and keeps everything under /admin behind the login.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // getClaims verifies the signed session locally (ES256 keys) instead of calling the auth server on every tap.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const onLogin = request.nextUrl.pathname === "/admin/login";

  if (!user && !onLogin) return NextResponse.redirect(new URL("/admin/login", request.url));
  if (user && onLogin) return NextResponse.redirect(new URL("/admin", request.url));
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
