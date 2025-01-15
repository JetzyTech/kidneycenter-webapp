import connectMongo from "@Jetzy/app/lib/connectDB";
import { stripe } from "@Jetzy/app/lib/stripe";
import Stripe from "stripe";

const SUBS_PLAN_PRICING_COLLECTION = "subsplanpricing";
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
    const currentUser = await findUser(session.customer_email as string);

    console.log({ currentUser });

    const price = await stripe.prices.retrieve(
      session.metadata?.priceId as string
    );

    console.log({ price });

    const interval = price.recurring?.interval || "monthly";

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const status = subscription.status || "trial";

    const data = {
      user: currentUser?._id,
      customerId: session.customer as string,
      planId: session.metadata?.planId || null,
      subscription: {
        subscriptionId: session.subscription as string,
        priceId: session.metadata?.priceId || null,
        interval,
        status,
        trialEndsOn: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
        isTrialEnded: subscription.status !== "trialing",
      },
    };

    await db
      .collection(MEMBERSHIP_COLLECTION)
      .updateOne(
        { customerId: data.customerId },
        { $set: data },
        { upsert: true }
      );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(
      `Error handling checkout session completed for session: ${session.id}`,
      errorMessage
    );

    throw error;
  }
}

export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
) {
  try {
    const db = await connectMongo();
    const mappedStatus =
      subscription.status === "trialing" ? "trial" : subscription.status;

    await updateSubsPlanPricing();

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
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    console.error(`Error handling handleSubscriptionCreated`, errorMessage);
    throw error;
  }
}

export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const db = await connectMongo();

    const data = {
      subscription: {
        status: "active",
      },
    };

    await db
      .collection(MEMBERSHIP_COLLECTION)
      .updateOne({ customerId: invoice.customer }, { $set: data });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    console.error(`Error handling handleInvoicePaymentSucceeded`, errorMessage);
    throw error;
  }
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const db = await connectMongo();

    const data = {
      subscription: {
        status: "suspended",
      },
    };

    await db
      .collection(MEMBERSHIP_COLLECTION)
      .updateOne({ customerId: invoice.customer }, { $set: data });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    console.error(`Error handling handleInvoicePaymentFailed`, errorMessage);
    throw error;
  }
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  try {
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
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    console.error(`Error handling handleSubscriptionUpdated`, errorMessage);
    throw error;
  }
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  try {
    const db = await connectMongo();

    const data = {
      subscription: {
        status: "inactive",
      },
    };

    await db
      .collection(MEMBERSHIP_COLLECTION)
      .updateOne({ customerId: subscription.customer }, { $set: data });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    console.error(`Error handling handleSubscriptionDeleted`, errorMessage);
    throw error;
  }
}

export async function updateSubsPlanPricing() {
  try {
    const db = await connectMongo();

    // Fetch all pricing plans from Stripe
    const prices = await stripe.prices.list({
      active: true,
      expand: ["data.product"],
    });

    // Iterate through the pricing plans and update the database
    for (const price of prices.data) {
      const planData = {
        amount: price.unit_amount ? price.unit_amount / 100 : 0,
        type: price.recurring?.interval || "monthly",
        planName: price.nickname || "Unknown",
        priceId: price.id,
        isDeleted: false,
      };

      await db
        .collection(SUBS_PLAN_PRICING_COLLECTION)
        .updateOne(
          { priceId: "price_1Qh3ttB7XccR5GE09U8wGjVs" },
          { $set: planData },
          { upsert: true }
        );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Error updating subscription plan pricing`, errorMessage);
    throw error;
  }
}

export async function findUser(
  email: string,
  collection: string = MEMBERSHIP_COLLECTION
) {
  try {
    const db = await connectMongo();
    const user = await db.collection(collection).findOne({ email: email });

    if (!user) {
      console.log("User not found");
      return null;
    }

    return user;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    console.error(`Error handling findUser`, errorMessage);
    throw error;
  }
}
