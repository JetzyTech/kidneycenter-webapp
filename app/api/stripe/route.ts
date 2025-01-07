import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Stripe } from "stripe";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { findUser } from "../webhooks/events";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const loggedUser = await findUser(session?.user?.email as string);
    const data = await request.json();
    const priceId = data.priceId;

    let customerId;

    const customerList = await stripe.customers.list({
      email: loggedUser?.email as string,
      limit: 1,
    });

    const existingCustomer = customerList.data[0];

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: loggedUser?.email as string,
        name: loggedUser?.name as string,
      });
      customerId = newCustomer.id;
    }

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
        metadata: { priceId, email: loggedUser?.email || '', name: loggedUser?.name || '', userId: loggedUser?._id?.toString() || ''
        },
      });

    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
