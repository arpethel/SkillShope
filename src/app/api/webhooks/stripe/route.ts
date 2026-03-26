import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { randomBytes } from "crypto";
import Stripe from "stripe";
import { DOWNLOAD_TOKEN_EXPIRY_DAYS } from "@/lib/constants";
import { auditInfo, auditCritical } from "@/lib/audit";

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    auditCritical("webhook.signature_failed", { metadata: { ip: req.headers.get("x-forwarded-for") } });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  auditInfo("webhook.received", { metadata: { eventType: event.type, eventId: event.id } });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { skillId, userId } = session.metadata || {};

    if (skillId && userId && session.payment_status === "paid") {
      // Idempotent: upsert to handle duplicate webhook deliveries
      const purchase = await prisma.purchase.upsert({
        where: { userId_skillId: { userId, skillId } },
        create: {
          userId,
          skillId,
          stripeSessionId: session.id,
          amount: (session.amount_total || 0) / 100,
        },
        update: {},
      });

      // Generate download token for CLI access
      await prisma.downloadToken.upsert({
        where: { purchaseId: purchase.id },
        create: {
          purchaseId: purchase.id,
          token: generateToken(),
          expiresAt: new Date(Date.now() + DOWNLOAD_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
        },
        update: {},
      });

      auditInfo("checkout.completed", {
        userId,
        skillId,
        metadata: { amount: (session.amount_total || 0) / 100, sessionId: session.id },
      });
    }
  }

  return NextResponse.json({ received: true });
}
