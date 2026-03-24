export default function PricingPage() {
  return (
    <>
      <h1 className="font-display mb-4 text-3xl font-bold">Pricing & Payouts</h1>
      <p className="mb-6 leading-relaxed text-[var(--text-secondary)]">
        Publish for free or set a price. You keep 85% of every sale.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Revenue split</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="py-2 pr-4 text-left font-medium text-[var(--text-secondary)]">Skill price</th>
              <th className="py-2 pr-4 text-left font-medium text-[var(--text-secondary)]">You receive (85%)</th>
              <th className="py-2 text-left font-medium text-[var(--text-secondary)]">Platform fee (15%)</th>
            </tr>
          </thead>
          <tbody className="text-[var(--text-secondary)]">
            <tr className="border-b border-[var(--border)]"><td className="py-2 pr-4">$4.99</td><td className="py-2 pr-4">$4.24</td><td className="py-2">$0.75</td></tr>
            <tr className="border-b border-[var(--border)]"><td className="py-2 pr-4">$9.99</td><td className="py-2 pr-4">$8.49</td><td className="py-2">$1.50</td></tr>
            <tr><td className="py-2 pr-4">$19.99</td><td className="py-2 pr-4">$16.99</td><td className="py-2">$3.00</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[var(--text-secondary)]">
        Stripe processing fees (~2.9% + $0.30) are absorbed by the platform, not the publisher.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Setting up payouts</h2>
      <ol className="ml-4 list-decimal space-y-2 text-sm text-[var(--text-secondary)]">
        <li>Go to your Dashboard</li>
        <li>Click &quot;Connect&quot; on the payout setup banner</li>
        <li>Complete Stripe Express onboarding (business type, bank details, tax info)</li>
        <li>Return to dashboard — you&apos;ll see &quot;Payouts enabled&quot;</li>
      </ol>

      <h2 className="mb-3 mt-8 text-xl font-bold">Payout schedule</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Funds are transferred to your connected Stripe account automatically after each sale.
        Stripe deposits to your bank on a rolling basis, typically within 2 business days.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Minimum price</h2>
      <p className="text-sm text-[var(--text-secondary)]">
        $0.99 for paid skills. No maximum. Free skills have no platform fee.
      </p>
    </>
  );
}
