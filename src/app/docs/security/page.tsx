export default function SecurityPage() {
  return (
    <>
      <h1 className="font-display mb-4 text-3xl font-bold">Security</h1>
      <p className="mb-6 leading-relaxed text-[var(--text-secondary)]">
        How Skill Shope protects publishers and users.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Source verification</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        When a skill is published, we automatically verify the source URL:
      </p>
      <ul className="ml-4 list-disc space-y-2 text-sm text-[var(--text-secondary)]">
        <li><strong>GitHub</strong> — confirms repo exists, is public, and accessible via GitHub API</li>
        <li><strong>npm</strong> — confirms package exists on the npm registry</li>
        <li><strong>Other URLs</strong> — confirms the URL is reachable</li>
      </ul>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        Verification status is shown in the admin panel. Admins can re-verify at any time.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Payment security</h2>
      <ul className="ml-4 list-disc space-y-2 text-sm text-[var(--text-secondary)]">
        <li>Payments processed via Stripe Checkout — we never see or store card numbers</li>
        <li>Webhook signatures verified on every event</li>
        <li>Download tokens generated server-side with cryptographic randomness</li>
        <li>Constant-time token comparison to prevent timing attacks</li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-bold">Infrastructure</h2>
      <ul className="ml-4 list-disc space-y-2 text-sm text-[var(--text-secondary)]">
        <li>HTTPS everywhere (Vercel automatic TLS)</li>
        <li>Security headers: CSP, X-Frame-Options, HSTS, X-Content-Type-Options</li>
        <li>Origin whitelist on redirect URLs (prevents open redirects)</li>
        <li>Rate limiting on all POST endpoints</li>
        <li>Input validation and HTML sanitization on all user-submitted content</li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-bold">Content policy</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        The following are prohibited:
      </p>
      <ul className="ml-4 list-disc space-y-2 text-sm text-[var(--text-secondary)]">
        <li>Malware, backdoors, or intentionally harmful code</li>
        <li>Skills that facilitate illegal activity, harassment, or abuse</li>
        <li>Spam, duplicate, or misleading listings</li>
        <li>Content that infringes on intellectual property</li>
        <li>Skills that collect user data without disclosure</li>
        <li>Fake reviews or manipulated ratings</li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-bold">Your responsibility</h2>
      <p className="text-sm text-[var(--text-secondary)]">
        Skill Shope is a registry — we link to tools, we don&apos;t execute them. Always review
        source code before installing any third-party skill. Install at your own risk.
      </p>
    </>
  );
}
