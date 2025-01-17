import connectMongo from "@Jetzy/app/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const db = await connectMongo();
  const threeMonths = getThreeMonthsLaterDate();

  const body = await req.json();
  const email = body.email;

  if (!email || typeof email !== 'string' || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return NextResponse.json(
      { error: 'Invalid or missing email in the request body' },
      { status: 400 }
    );
  }

  try {
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User Not Found' }, { status: 404 })
    }

    const hasSubscription = await db.collection('jetzyMembershipSubsSchema').findOne({user: user._id});

    if (hasSubscription) {
      return NextResponse.json({ error: 'This User already has a subscription' }, { status: 400 })
    }

    const data = {
      user: user._id,
      customerId: "",
      planId: "",
      sessionId: "",
      subscription: {
        subscriptionId: "",
        priceId: "",
        customerId: "",
        status: "trial",
        internal: "month",
        trialEndsOn: threeMonths,
        gifted: {
          isGifted: true,
          expiresAt: threeMonths,
        },
      },
    };

    const result = await db
      .collection("jetzyMembershipSubsSchema")
      .updateOne(
        { user: user._id },
        { $set: { subscription: data.subscription } },
        { upsert: true }
      );
    
    if (!result.acknowledged) {
      throw new Error('Failed to update the subscription data');
    }
  
    return NextResponse.json(
      { ok: true, message: 'Subscription updated successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown Error";
    console.error({ errorMessage });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

function getThreeMonthsLaterDate() {
  const currentDate = new Date();
  const threeMonthsLater = new Date(currentDate);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  return threeMonthsLater.toISOString();
}
