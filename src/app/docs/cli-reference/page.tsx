export default function CliReferencePage() {
  return (
    <>
      <h1 className="font-display mb-4 text-3xl font-bold">CLI Reference</h1>
      <p className="mb-6 leading-relaxed text-[var(--text-secondary)]">
        The <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-sm">skillshope</code> CLI
        installs skills from the registry.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Installation</h2>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">{`# Run without installing
npx skillshope <command>

# Or install globally
npm install -g skillshope`}</pre>

      <h2 className="mb-3 mt-8 text-xl font-bold">Commands</h2>

      <h3 className="mb-2 mt-6 font-semibold">install &lt;slug&gt;</h3>
      <p className="mb-2 text-sm text-[var(--text-secondary)]">
        Install a skill by its slug. Also accepts <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">add</code> as an alias.
      </p>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">{`npx skillshope install pdf-processing
npx skillshope add mcp-forge`}</pre>

      <h3 className="mb-2 mt-6 font-semibold">login</h3>
      <p className="mb-2 text-sm text-[var(--text-secondary)]">
        Save your download token for paid skills. Prompts for the token interactively.
      </p>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">
        npx skillshope login
      </pre>

      <h3 className="mb-2 mt-6 font-semibold">whoami</h3>
      <p className="mb-2 text-sm text-[var(--text-secondary)]">
        Show current auth status and registry URL.
      </p>

      <h3 className="mb-2 mt-6 font-semibold">list</h3>
      <p className="mb-2 text-sm text-[var(--text-secondary)]">
        List all installed skills in the current project. Also accepts <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">ls</code>.
      </p>

      <h3 className="mb-2 mt-6 font-semibold">help</h3>
      <p className="mb-2 text-sm text-[var(--text-secondary)]">
        Show help message.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Configuration</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Config is stored at <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">~/.skillshope/config.json</code>:
      </p>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">{`{
  "registryUrl": "https://skillshope.com",
  "token": "your-download-token"
}`}</pre>
      <p className="text-sm text-[var(--text-secondary)]">
        Override <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5">registryUrl</code> for testing against localhost or staging.
      </p>
    </>
  );
}
