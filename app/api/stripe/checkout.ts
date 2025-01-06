import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  const _session = await getServerSession();
  try {
    const data = await request.json();
    const priceId = request.nextUrl.searchParams.get('priceId') as string;

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_URL}/billing`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/billing`,
        metadata: {
          priceId,
          name: _session?.user?.name as string,
          email: _session?.user?.email as string
        },
      });
    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}
