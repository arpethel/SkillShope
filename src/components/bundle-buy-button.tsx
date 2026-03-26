"use client";

import { useState } from "react";
import { Loader2, Package } from "lucide-react";

type Props = {
  bundleId: string;
  price: number;
  isFree: boolean;
  isSignedIn: boolean;
  allOwned: boolean;
};

export function BundleBuyButton({ bundleId, price, isFree, isSignedIn, allOwned }: Props) {
  const [loading, setLoading] = useState(false);

  if (isFree) return null;

  if (allOwned) {
    return (
      <button
        disabled
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--green)]/15 py-3 text-sm font-semibold text-[var(--green)]"
      >
        <Package className="h-4 w-4" />
        All skills owned
      </button>
    );
  }

  if (!isSignedIn) {
    return (
      <a
        href="/auth/signin"
        className="flex w-full items-center justify-center rounded-lg bg-[var(--accent)] py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors"
      >
        Sign in to purchase
      </a>
    );
  }

  const handlePurchase = async () => {
    setLoading(true);
    const res = await fetch("/api/bundles/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bundleId }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Redirecting to checkout...
        </>
      ) : (
        `Buy Bundle — $${price.toFixed(2)}`
      )}
    </button>
  );
}
