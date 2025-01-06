import connectMongo from "@Jetzy/app/lib/connectDB";
import Stripe from "stripe";


const MEMBERSHIP_COLLECTION = 'jetzyMembershipSubsSchema';

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const db = await connectMongo();

  const data = {
    user: session.customer_email,
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

  await db.collection(MEMBERSHIP_COLLECTION).updateOne(
    { customerId: data.customerId },
    { $set: data },
    { upsert: true }
  );

}

export async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const db = await connectMongo();

  const mappedStatus = subscription.status === "trialing" ? "trial" : subscription.status;

  const data = {
    user: subscription.metadata.userId, 
    customerId: subscription.customer as string,
    subscription: {
      subscriptionId: subscription.id,
      priceId: subscription.items.data[0].price.id,
      interval: subscription.items.data[0].price.recurring?.interval,
      status: mappedStatus,
      trialEndsOn: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      isTrialEnded: subscription.status !== "trialing", 
    },
  };

  await db.collection(MEMBERSHIP_COLLECTION).updateOne(
    { customerId: subscription.customer },
    { $set: data }
  );
}

export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const db = await connectMongo();

  const data = {
    subscription: {
      status: "active",
    },
  };

  await db.collection(MEMBERSHIP_COLLECTION).updateOne(
    { customerId: invoice.customer },
    { $set: data }
  );
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const db = await connectMongo();

  const data = {
    subscription: {
      status: "suspended",
    },
  };

  await db.collection(MEMBERSHIP_COLLECTION).updateOne(
    { customerId: invoice.customer },
    { $set: data }
  );
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const db = await connectMongo();

  const data = {
    subscription: {
      subscriptionId: subscription.id,
      priceId: subscription.items.data[0].price.id,
      interval: subscription.items.data[0].price.recurring?.interval || null,
      status: subscription.status,
      trialEndsOn: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      isTrialEnded: subscription.trial_end
        ? Date.now() >= subscription.trial_end * 1000
        : true,
    },
  };

  await db.collection(MEMBERSHIP_COLLECTION).updateOne(
    { customerId: subscription.customer },
    { $set: data }
  );
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const db = await connectMongo();

  const data = {
    subscription: {
      status: "inactive",
    },
  };

  await db.collection(MEMBERSHIP_COLLECTION).updateOne(
    { customerId: subscription.customer },
    { $set: data }
  );

}

export async function findUser(email: string) {
  const db = await connectMongo();
  const user = await db.collection(MEMBERSHIP_COLLECTION).findOne({ email: email });

  if (!user) {
    console.log("User not found");
    return null;
  }

  console.log("User found:", user);
  return user;
}