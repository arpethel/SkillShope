export default function InstallingPage() {
  return (
    <>
      <h1 className="font-display mb-4 text-3xl font-bold">Installing Skills</h1>
      <p className="mb-6 leading-relaxed text-[var(--text-secondary)]">
        Install any skill from the registry using the Skill Shope CLI.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Basic install</h2>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">
        npx skillshope install &lt;slug&gt;
      </pre>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        The slug is the URL-friendly name shown on the skill detail page. For example:
      </p>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">
        npx skillshope install pdf-processing{"\n"}npx skillshope install mcp-forge
      </pre>

      <h2 className="mb-3 mt-8 text-xl font-bold">Where files are installed</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Skills install to <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-sm">.agents/skills/&lt;slug&gt;/</code> in
        your current working directory. This is the standard location for AI coding tool skills.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Paid skills</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Paid skills require a purchase and a download token:
      </p>
      <ol className="ml-4 list-decimal space-y-2 text-sm text-[var(--text-secondary)]">
        <li>Purchase the skill at <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">skillshope.com/skills/&lt;slug&gt;</code></li>
        <li>Click &quot;Get Download Token&quot; on the skill page after purchase</li>
        <li>Run <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">npx skillshope login</code> and paste your token</li>
        <li>Run <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">npx skillshope install &lt;slug&gt;</code></li>
      </ol>

      <h2 className="mb-3 mt-8 text-xl font-bold">Token storage</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Your token is stored at <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">~/.skillshope/config.json</code>.
        You only need to log in once.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">List installed skills</h2>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">
        npx skillshope list
      </pre>
    </>
  );
}
