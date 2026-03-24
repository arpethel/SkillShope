import Link from "next/link";

export default function PublishingPage() {
  return (
    <>
      <h1 className="font-display mb-4 text-3xl font-bold">Publishing</h1>
      <p className="mb-6 leading-relaxed text-[var(--text-secondary)]">
        Three ways to publish a skill on Skill Shope.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">1. Web form</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Sign in and go to <Link href="/publish" className="text-[var(--accent)] hover:underline">/publish</Link>.
        Fill in the fields and submit. Best for one-off listings.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">2. JSON upload</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Prepare a <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">listing.json</code> file
        and upload it on the publish page. All fields auto-fill. See the{" "}
        <Link href="/docs/json-schema" className="text-[var(--accent)] hover:underline">JSON Schema</Link> for
        the field reference.
      </p>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">{`{
  "name": "My Skill",
  "description": "What it does in one line.",
  "category": "productivity",
  "type": "skill",
  "sourceUrl": "https://github.com/you/your-skill",
  "sourceType": "github",
  "installCmd": "npx skillshope install my-skill",
  "compatibility": "claude-code,codex,cursor",
  "tags": "tag1,tag2",
  "isFree": true,
  "skillContent": "---\\nname: my-skill\\n---\\n\\nYour skill content..."
}`}</pre>

      <h2 className="mb-3 mt-8 text-xl font-bold">3. API (CI/CD)</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Publish programmatically with an API key. Generate a key from your dashboard, then:
      </p>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">{`curl -X POST https://skillshope.com/api/publish \\
  -H "Authorization: Bearer sk_..." \\
  -H "Content-Type: application/json" \\
  -d @listing.json`}</pre>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        See the <Link href="/docs/api-reference" className="text-[var(--accent)] hover:underline">API Reference</Link> for details.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Listing types</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="py-2 pr-4 text-left font-medium text-[var(--text-secondary)]">Type</th>
              <th className="py-2 pr-4 text-left font-medium text-[var(--text-secondary)]">Description</th>
              <th className="py-2 text-left font-medium text-[var(--text-secondary)]">Pricing</th>
            </tr>
          </thead>
          <tbody className="text-[var(--text-secondary)]">
            <tr className="border-b border-[var(--border)]">
              <td className="py-2 pr-4 font-medium text-[var(--text)]">Original</td>
              <td className="py-2 pr-4">Your own skill</td>
              <td className="py-2">Free or paid</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-[var(--text)]">Community</td>
              <td className="py-2 pr-4">Curating a third-party open-source skill with attribution</td>
              <td className="py-2">Free only</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
