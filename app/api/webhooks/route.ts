import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import {
  handleCheckoutSessionCompleted,
  handleInvoicePaymentFailed,
  handleInvoicePaymentSucceeded,
  handleSubscriptionCreated,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
} from "./events";

const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY as string;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    // Verify the event
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session
          );
          break;
        case "customer.subscription.created":
          await handleSubscriptionCreated(
            event.data.object as Stripe.Subscription
          );
          break;
        case "invoice.payment_succeeded":
          await handleInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice
          );
          break;
        case "invoice.payment_failed":
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        case "customer.subscription.updated":
          await handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription
          );
          break;
        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription
          );
          break;
        default:
          console.warn(`Unhandled event type: ${event.type}`);
      }

      return NextResponse.json({ received: true }, { status: 200 });
    } catch (err: any) {
      console.error(`Error processing webhook: ${err.message}`);
      return NextResponse.json(
        { error: `Internal server error: ${err.message}` },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error(`Webhook error: ${err.message}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
