export default function ApiReferencePage() {
  return (
    <>
      <h1 className="font-display mb-4 text-3xl font-bold">API Reference</h1>
      <p className="mb-6 leading-relaxed text-[var(--text-secondary)]">
        All endpoints use JSON. Auth via session cookie (browser) or API key (CI/CD).
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Authentication</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        For programmatic access, generate an API key from your dashboard and pass it as a Bearer token:
      </p>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">
        Authorization: Bearer sk_...
      </pre>

      <h2 className="mb-3 mt-10 text-xl font-bold">POST /api/publish</h2>
      <p className="mb-2 text-sm text-[var(--text-secondary)]">Create a new skill listing. Auth: API key.</p>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">{`curl -X POST https://skillshope.com/api/publish \\
  -H "Authorization: Bearer sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{"name":"My Skill","description":"...","category":"productivity"}'`}</pre>
      <p className="text-xs text-[var(--text-secondary)]">Returns: 201 with skill object. Rate limit: 5/min.</p>

      <h2 className="mb-3 mt-10 text-xl font-bold">GET /api/registry/&lt;slug&gt;</h2>
      <p className="mb-2 text-sm text-[var(--text-secondary)]">Look up skill metadata. No auth required. Used by the CLI.</p>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">{`curl https://skillshope.com/api/registry/pdf-processing`}</pre>
      <p className="text-xs text-[var(--text-secondary)]">Returns: skill metadata, files, versions, dependencies, formats.</p>

      <h2 className="mb-3 mt-10 text-xl font-bold">GET /api/deliver/&lt;skillId&gt;</h2>
      <p className="mb-2 text-sm text-[var(--text-secondary)]">Download skill content. Free skills: open. Paid skills: token or session required.</p>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">{`# Free skill
curl https://skillshope.com/api/deliver/<id>

# Paid skill with token
curl https://skillshope.com/api/deliver/<id>?token=<download-token>`}</pre>
      <p className="text-xs text-[var(--text-secondary)]">Returns: {"{ files: [{ filename, content }] }"}. Increments download count.</p>

      <h2 className="mb-3 mt-10 text-xl font-bold">POST /api/api-keys</h2>
      <p className="mb-2 text-sm text-[var(--text-secondary)]">Create an API key. Auth: session.</p>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">{`curl -X POST https://skillshope.com/api/api-keys \\
  -H "Content-Type: application/json" \\
  -d '{"name":"github-actions"}'`}</pre>
      <p className="text-xs text-[var(--text-secondary)]">Returns: {"{ key: 'sk_...', name }"}. The key is shown once and cannot be retrieved again.</p>

      <h2 className="mb-3 mt-10 text-xl font-bold">POST /api/skills/&lt;id&gt;/versions</h2>
      <p className="mb-2 text-sm text-[var(--text-secondary)]">Publish a new version of an existing skill. Auth: session or API key. Must be the skill author.</p>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">{`curl -X POST https://skillshope.com/api/skills/<id>/versions \\
  -H "Authorization: Bearer sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{"version":"1.1.0","changelog":"Bug fixes","files":[...]}'`}</pre>

      <h2 className="mb-3 mt-10 text-xl font-bold">GET /api/analytics/&lt;skillId&gt;</h2>
      <p className="mb-2 text-sm text-[var(--text-secondary)]">Install analytics for your skill. Auth: session. Must be the skill author.</p>
      <p className="text-xs text-[var(--text-secondary)]">Returns: {"{ total, last7d, last30d, bySource: { cli, web, api } }"}.</p>

      <h2 className="mb-3 mt-10 text-xl font-bold">GET /.well-known/skills.json</h2>
      <p className="mb-2 text-sm text-[var(--text-secondary)]">Full catalog for external CLI discovery. No auth. 5-minute cache.</p>
    </>
  );
}
