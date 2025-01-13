import connectMongo from "@Jetzy/app/lib/connectDB";
import Stripe from "stripe";

const MEMBERSHIP_COLLECTION = "jetzyMembershipSubsSchema";
interface Sub {
  subscriptionId: string;
  priceId: string;
  interval?: Stripe.Price.Recurring.Interval | null;
  status: string;
  trialEndsOn: string | null;
  isTrialEnded: boolean | null;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  cost?: number;
}
interface UpdateData {
  planId: string;
  subscription: Sub;
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    const db = await connectMongo();

    if (!session.customer_email) {
      throw new Error("No customer email provided in session");
    }

    const currentUser = await findUser(session.customer_email);

    const data = {
      user: currentUser?._id,
      customerId: session.customer as string,
      planId: session.metadata?.planId || null,
      subscription: {
        subscriptionId: session.subscription as string,
        priceId: session.metadata?.priceId || null,
        interval: "monthly",
        status: "trial",
        trialEndsOn: session.metadata?.trialEndsOn || null,
        isTrialEnded: false,
      },
    };

    await db
      .collection(MEMBERSHIP_COLLECTION)
      .updateOne(
        { customerId: data.customerId },
        { $set: data },
        { upsert: true }
      );
  } catch (error: any) {
    console.error("Error in handleCheckoutSessionCompleted:", error);
    throw error;
  }
}

export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
) {
  const db = await connectMongo();
  const mappedStatus =
    subscription.status === "trialing" ? "trial" : subscription.status;

  const data: {
    user: string;
    customerId: string;
    subscription: Sub;
  } = {
    user: subscription.metadata.userId,
    customerId: subscription.customer as string,
    subscription: {
      subscriptionId: subscription.id,
      priceId: subscription.items.data[0].price.id,
      interval: subscription.items.data[0].price.recurring?.interval,
      status: mappedStatus,
      isTrialEnded: subscription.status !== "trialing",
      trialEndsOn: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
    },
  };

  if (mappedStatus !== "trial") {
    const subscriptionStart = new Date(
      subscription.start_date * 1000
    ).toISOString();
    const subscriptionEnd = new Date(
      subscription.current_period_end * 1000
    ).toISOString();

    data.subscription.subscriptionStart = subscriptionStart;
    data.subscription.subscriptionEnd = subscriptionEnd;
    data.subscription.cost =
      subscription.items.data[0].price.unit_amount! / 100;
  }

  await db
    .collection(MEMBERSHIP_COLLECTION)
    .updateOne({ customerId: subscription.customer }, { $set: data });
}

export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const db = await connectMongo();

  const data = {
    subscription: {
      status: "active",
    },
  };

  await db
    .collection(MEMBERSHIP_COLLECTION)
    .updateOne({ customerId: invoice.customer }, { $set: data });
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const db = await connectMongo();

  const data = {
    subscription: {
      status: "suspended",
    },
  };

  await db
    .collection(MEMBERSHIP_COLLECTION)
    .updateOne({ customerId: invoice.customer }, { $set: data });
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const db = await connectMongo();
  const mappedStatus =
    subscription.status === "trialing" ? "trial" : subscription.status;

  const data: UpdateData = {
    planId: subscription.items.data[0].price.product as string,
    subscription: {
      subscriptionId: subscription.id,
      priceId: subscription.items.data[0].price.id,
      interval: subscription.items.data[0].price.recurring?.interval || null,
      status: subscription.status,
      trialEndsOn: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      isTrialEnded: subscription.trial_end
        ? Date.now() >= subscription.trial_end * 1000
        : true,
    },
  };

  if (mappedStatus !== "trial") {
    const subscriptionStart = new Date(
      subscription.start_date * 1000
    ).toISOString();
    const subscriptionEnd = new Date(
      subscription.current_period_end * 1000
    ).toISOString();

    data.subscription.subscriptionStart = subscriptionStart;
    data.subscription.subscriptionEnd = subscriptionEnd;
    data.subscription.cost =
      subscription.items.data[0].price.unit_amount! / 100;
  }

  await db
    .collection(MEMBERSHIP_COLLECTION)
    .updateOne({ customerId: subscription.customer }, { $set: data });
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const db = await connectMongo();

  const data = {
    subscription: {
      status: "inactive",
    },
  };

  await db
    .collection(MEMBERSHIP_COLLECTION)
    .updateOne({ customerId: subscription.customer }, { $set: data });
}

export async function findUser(email: string) {
  try {
    const db = await connectMongo();
    const user = await db
      .collection(MEMBERSHIP_COLLECTION)
      .findOne({ email: email });

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return null;
    }

    return user;
  } catch (error: any) {
    console.error("Error in findUser:", error);
    throw error;
  }
}
