import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                   // 1. Pehla bypass yahan:
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     setAll(cookiesToSet: any) {
                        try {
                            // 2. Doosra bypass yahan (forEach ke liye):
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            cookiesToSet.forEach(({ name, value, options }: any) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // The `setAll` method was called from a Server Component.
                        }
                    },
                },
            }
        );

        console.log("Exchanging code for session...");
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            console.log("Auth successful, redirecting...");
            return NextResponse.redirect(`${origin}${next}`);
        }
        console.error("Auth error:", error);
    }

    const errorMessage = code ? "exchange-failed" : "no-code";
    return NextResponse.redirect(`${origin}/?error=${errorMessage}`);
}