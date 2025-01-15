import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Stripe } from "stripe";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { stripe } from "@Jetzy/app/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.text();
    const data = JSON.parse(body);
    const priceId = data.priceId;
    const currentUser = session.user?.user;

    const metadata = {
      priceId,
      email: currentUser?.email,
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      userId: currentUser?._id,
    };

    let customerId;

    const customerList = await stripe.customers.list({
      email: metadata?.email as string,
      limit: 1,
    });

    const existingCustomer = customerList.data[0];

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: metadata?.email as string,
        name: metadata?.name as string,
      });
      customerId = newCustomer.id;
    }

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/packages?prefilled_email=${currentUser?.email}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/packages`,
        metadata: metadata,
      });

    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    console.error({ errorMessage });
    return new NextResponse("Something Went Wrong", {
      status: 500,
      statusText: errorMessage,
    });
  }
}
