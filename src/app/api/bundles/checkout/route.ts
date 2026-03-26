// Bundle Checkout API
// POST /api/bundles/checkout — creates Stripe Checkout for a bundle
// On success, webhook creates Purchase + DownloadToken for EACH paid skill in bundle

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";
import { getSafeOrigin } from "@/lib/origin";
import { PLATFORM_FEE_PERCENT } from "@/lib/constants";
import { auditInfo, auditWarn } from "@/lib/audit";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    auditWarn("bundle.checkout.unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allowed } = rateLimit(`bundle-checkout:${session.user.id}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { bundleId } = await req.json();
  if (!bundleId) {
    return NextResponse.json({ error: "bundleId required" }, { status: 400 });
  }

  const bundle = await prisma.bundle.findUnique({
    where: { id: bundleId },
    include: {
      skills: {
        include: {
          skill: {
            select: { id: true, slug: true, name: true, isFree: true, price: true, authorId: true },
            include: { author: { select: { stripeAccountId: true } } },
          },
        },
      },
    },
  });

  if (!bundle) {
    return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
  }

  if (bundle.isFree) {
    return NextResponse.json({ error: "This bundle is free" }, { status: 400 });
  }

  // Check which skills in the bundle the user hasn't purchased yet
  const paidSkills = bundle.skills.filter((bs) => !bs.skill.isFree);
  const existingPurchases = await prisma.purchase.findMany({
    where: {
      userId: session.user.id,
      skillId: { in: paidSkills.map((bs) => bs.skill.id) },
    },
    select: { skillId: true },
  });
  const alreadyOwned = new Set(existingPurchases.map((p) => p.skillId));
  const unpurchased = paidSkills.filter((bs) => !alreadyOwned.has(bs.skill.id));

  if (unpurchased.length === 0) {
    return NextResponse.json({ error: "You already own all paid skills in this bundle" }, { status: 409 });
  }

  const origin = getSafeOrigin(req.headers.get("origin"));
  const amountCents = Math.round(bundle.price * 100);
  const feeCents = Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100));

  // Store skill IDs in metadata for the webhook
  const skillIds = unpurchased.map((bs) => bs.skill.id);

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${bundle.name} Bundle`,
            description: `${unpurchased.length} premium tools`,
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "bundle",
      bundleId: bundle.id,
      userId: session.user.id,
      skillIds: skillIds.join(","),
    },
    success_url: `${origin}/bundles/${bundle.slug}?purchased=true`,
    cancel_url: `${origin}/bundles/${bundle.slug}`,
  };

  // Route to first publisher's Connect account if available
  // For bundles with mixed publishers, platform handles distribution
  const firstPublisher = unpurchased[0]?.skill?.author?.stripeAccountId;
  if (firstPublisher && unpurchased.length === 1) {
    params.payment_intent_data = {
      application_fee_amount: feeCents,
      transfer_data: { destination: firstPublisher },
    };
  }

  const checkoutSession = await stripe.checkout.sessions.create(params);

  auditInfo("bundle.checkout.started", {
    userId: session.user.id,
    metadata: {
      bundleId: bundle.id,
      bundleName: bundle.name,
      amount: bundle.price,
      skillCount: unpurchased.length,
      sessionId: checkoutSession.id,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
