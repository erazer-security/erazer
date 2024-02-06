import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  if (req.method === "POST") {
    const { price } = await req.json();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Create a checkout session in Stripe
      let session;
      if (price.type === "one_time") {
        session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price: price.priceID,
              quantity: 1,
            },
          ],
          mode: "payment",
          allow_promotion_codes: true,
          success_url:
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000/dashboard"
              : "https://erazer.io/dashboard",
          cancel_url:
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000/dashboard"
              : "https://erazer.io/dashboard",
          customer_email: user?.email,
        });
      } else if (price.type === "subscription") {
        session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price: price.priceID,
              quantity: 1,
            },
          ],
          mode: "subscription",
          allow_promotion_codes: true,
          success_url:
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000/dashboard"
              : "https://erazer.io/dashboard",
          cancel_url:
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000/dashboard"
              : "https://erazer.io/dashboard",
          customer_email: user?.email,
        });
      }

      if (session) {
        return new Response(JSON.stringify({ sessionId: session.id }), {
          status: 200,
        });
      } else {
        return new Response(
          JSON.stringify({
            error: { statusCode: 500, message: "Session is not defined" },
          }),
          { status: 500 }
        );
      }
    } catch (err: any) {
      console.log(err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  } else {
    return new Response("Method Not Allowed", {
      headers: { Allow: "POST" },
      status: 405,
    });
  }
}
