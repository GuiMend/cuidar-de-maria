import { headers } from "next/headers";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  const headersList = headers();
  const origin = headersList.get("origin");

  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: "price_1PDA8cCdMA1bKz2J93rHwdXO",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (err: any) {
    return new Response(err?.message || "Something went wrong", {
      status: err?.statusCode || 500,
    });
  }
}
