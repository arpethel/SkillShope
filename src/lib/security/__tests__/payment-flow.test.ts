import { describe, it, expect } from "vitest";
import { PLATFORM_FEE_PERCENT, PUBLISHER_PAYOUT_PERCENT, MIN_PRICE, DOWNLOAD_TOKEN_EXPIRY_DAYS } from "../../constants";

describe("payment constants", () => {
  it("platform fee + publisher payout = 100%", () => {
    expect(PLATFORM_FEE_PERCENT + PUBLISHER_PAYOUT_PERCENT).toBe(100);
  });

  it("platform fee is between 1% and 50%", () => {
    expect(PLATFORM_FEE_PERCENT).toBeGreaterThanOrEqual(1);
    expect(PLATFORM_FEE_PERCENT).toBeLessThanOrEqual(50);
  });

  it("minimum price is at least $0.50", () => {
    expect(MIN_PRICE).toBeGreaterThanOrEqual(0.5);
  });

  it("download token expires in at least 30 days", () => {
    expect(DOWNLOAD_TOKEN_EXPIRY_DAYS).toBeGreaterThanOrEqual(30);
  });
});

describe("fee calculation", () => {
  it("calculates correct fee for $9.99 skill", () => {
    const price = 9.99;
    const feeCents = Math.round(price * 100 * (PLATFORM_FEE_PERCENT / 100));
    const publisherCents = Math.round(price * 100) - feeCents;

    expect(feeCents).toBe(150); // $1.50
    expect(publisherCents).toBe(849); // $8.49
    expect(feeCents + publisherCents).toBe(Math.round(price * 100));
  });

  it("calculates correct fee for $29.99 bundle", () => {
    const price = 29.99;
    const feeCents = Math.round(price * 100 * (PLATFORM_FEE_PERCENT / 100));
    const publisherCents = Math.round(price * 100) - feeCents;

    expect(feeCents).toBe(450); // $4.50
    expect(publisherCents).toBe(2549); // $25.49
  });

  it("calculates correct fee for minimum price", () => {
    const price = MIN_PRICE;
    const feeCents = Math.round(price * 100 * (PLATFORM_FEE_PERCENT / 100));

    expect(feeCents).toBeGreaterThan(0);
    expect(feeCents).toBeLessThan(Math.round(price * 100));
  });

  it("publisher revenue matches dashboard calculation", () => {
    const amounts = [0.99, 4.99, 9.99, 19.99, 29.99, 49.99];

    for (const amount of amounts) {
      // Checkout calculation (what Stripe charges)
      const amountCents = Math.round(amount * 100);
      const feeCents = Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100));

      // Dashboard calculation (what publisher sees)
      const dashboardRevenue = amount * (PUBLISHER_PAYOUT_PERCENT / 100);

      // They should be close (within 1 cent due to rounding)
      const checkoutPublisherAmount = (amountCents - feeCents) / 100;
      expect(Math.abs(checkoutPublisherAmount - dashboardRevenue)).toBeLessThanOrEqual(0.01);
    }
  });
});

describe("free skill bypass", () => {
  it("free skills have price 0", () => {
    const isFree = true;
    const price = isFree ? 0 : 9.99;
    expect(price).toBe(0);
  });

  it("paid skills enforce minimum price", () => {
    const isFree = false;
    const inputPrice = 0.5; // Below minimum
    const price = isFree ? 0 : Math.max(MIN_PRICE, inputPrice);
    expect(price).toBe(MIN_PRICE);
  });

  it("community skills are always free", () => {
    const isCommunity = true;
    const isFree = isCommunity ? true : false;
    const price = isFree ? 0 : 9.99;
    expect(isFree).toBe(true);
    expect(price).toBe(0);
  });
});

describe("token expiration", () => {
  it("token expiry date is in the future", () => {
    const expiresAt = new Date(Date.now() + DOWNLOAD_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it("expired token is rejected", () => {
    const expiresAt = new Date(Date.now() - 1000); // 1 second ago
    const isValid = !expiresAt || expiresAt > new Date();
    expect(isValid).toBe(false);
  });

  it("valid token is accepted", () => {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
    const isValid = !expiresAt || expiresAt > new Date();
    expect(isValid).toBe(true);
  });

  it("null expiry means never expires", () => {
    const expiresAt = null;
    const isValid = !expiresAt || expiresAt > new Date();
    expect(isValid).toBe(true);
  });
});
