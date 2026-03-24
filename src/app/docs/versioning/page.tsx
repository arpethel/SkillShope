export default function VersioningPage() {
  return (
    <>
      <h1 className="font-display mb-4 text-3xl font-bold">Versioning</h1>
      <p className="mb-6 leading-relaxed text-[var(--text-secondary)]">
        Publish updates to your skills without breaking existing installs.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">How it works</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Every skill starts at version <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">1.0.0</code>.
        When you publish an update, you specify a new semver version and optional changelog.
        The CLI installs the latest version by default.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Publishing a new version</h2>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">{`curl -X POST https://skillshope.com/api/skills/<id>/versions \\
  -H "Authorization: Bearer sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "version": "1.1.0",
    "changelog": "Added support for CSV export",
    "files": [
      { "filename": "SKILL.md", "content": "..." }
    ]
  }'`}</pre>

      <h2 className="mb-3 mt-8 text-xl font-bold">Version rules</h2>
      <ul className="ml-4 list-disc space-y-2 text-sm text-[var(--text-secondary)]">
        <li>Versions must be unique per skill</li>
        <li>Use <a href="https://semver.org" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">semver</a> format (e.g., 1.0.0, 1.1.0, 2.0.0)</li>
        <li>Each version can have its own set of files</li>
        <li>The skill&apos;s <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">currentVersion</code> updates automatically</li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-bold">Version history</h2>
      <p className="text-sm text-[var(--text-secondary)]">
        The registry endpoint (<code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">GET /api/registry/&lt;slug&gt;</code>)
        returns the 5 most recent versions with changelogs.
      </p>
    </>
  );
}
