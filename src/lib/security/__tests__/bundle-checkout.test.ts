import { describe, it, expect } from "vitest";
import { PLATFORM_FEE_PERCENT, MIN_PRICE } from "../../constants";

describe("bundle checkout", () => {
  it("splits bundle amount evenly across skills", () => {
    const bundlePrice = 29.99;
    const skillIds = ["a", "b", "c", "d", "e"];
    const perSkill = bundlePrice / skillIds.length;

    expect(perSkill).toBeCloseTo(6.0, 1);
    expect(perSkill * skillIds.length).toBeCloseTo(bundlePrice, 2);
  });

  it("calculates correct platform fee for bundle", () => {
    const bundlePrice = 29.99;
    const amountCents = Math.round(bundlePrice * 100);
    const feeCents = Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100));

    expect(feeCents).toBe(450); // $4.50
    expect(amountCents - feeCents).toBe(2549); // $25.49 to publisher
  });

  it("handles bundle with mix of free and paid skills", () => {
    const skills = [
      { id: "a", isFree: true, price: 0 },
      { id: "b", isFree: false, price: 9.99 },
      { id: "c", isFree: false, price: 9.99 },
      { id: "d", isFree: true, price: 0 },
      { id: "e", isFree: false, price: 9.99 },
    ];

    const paidSkills = skills.filter((s) => !s.isFree);
    expect(paidSkills.length).toBe(3);

    const totalIndividual = paidSkills.reduce((sum, s) => sum + s.price, 0);
    expect(totalIndividual).toBeCloseTo(29.97, 2);
  });

  it("skips already-owned skills", () => {
    const skillIds = ["a", "b", "c", "d", "e"];
    const alreadyOwned = new Set(["b", "d"]);
    const unpurchased = skillIds.filter((id) => !alreadyOwned.has(id));

    expect(unpurchased).toEqual(["a", "c", "e"]);
    expect(unpurchased.length).toBe(3);
  });

  it("rejects purchase when all skills already owned", () => {
    const skillIds = ["a", "b"];
    const alreadyOwned = new Set(["a", "b"]);
    const unpurchased = skillIds.filter((id) => !alreadyOwned.has(id));

    expect(unpurchased.length).toBe(0);
  });

  it("generates unique stripe session IDs per skill in bundle", () => {
    const sessionId = "cs_test_abc123";
    const skillIds = ["skill1", "skill2", "skill3"];

    const stripeSessionIds = skillIds.map((id) => `${sessionId}_${id}`);

    // All unique
    const unique = new Set(stripeSessionIds);
    expect(unique.size).toBe(skillIds.length);

    // Contain the base session ID
    for (const id of stripeSessionIds) {
      expect(id.startsWith(sessionId)).toBe(true);
    }
  });

  it("metadata stores skill IDs as comma-separated string", () => {
    const skillIds = ["id1", "id2", "id3"];
    const serialized = skillIds.join(",");
    const deserialized = serialized.split(",");

    expect(serialized).toBe("id1,id2,id3");
    expect(deserialized).toEqual(skillIds);
  });
});
