import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptionsWithName;
};

function redirectWithCookies(
  request: NextRequest,
  path: string,
  cookiesToSet: CookieToSet[],
) {
  const response = NextResponse.redirect(new URL(path, request.url), {
    status: 303,
  });

  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return redirectWithCookies(request, "/owner/login?error=config", []);
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const cookiesToSet: CookieToSet[] = [];
  const authClient = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(nextCookies) {
        cookiesToSet.push(...nextCookies);
      },
    },
  });

  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return redirectWithCookies(request, "/owner/login?error=auth", cookiesToSet);
  }

  return redirectWithCookies(request, "/owner", cookiesToSet);
}
