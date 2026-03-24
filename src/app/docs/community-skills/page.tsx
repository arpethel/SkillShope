export default function CommunitySkillsPage() {
  return (
    <>
      <h1 className="font-display mb-4 text-3xl font-bold">Community Skills</h1>
      <p className="mb-6 leading-relaxed text-[var(--text-secondary)]">
        Curate existing open-source skills with proper attribution. Help developers
        discover great tools they wouldn&apos;t find otherwise.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">What are community listings?</h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Community listings are curated entries for third-party open-source skills, MCP servers,
        and agents. You link to the original source and credit the original author.
        Skill Shope acts as the discovery layer — the original creator retains full ownership.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Rules</h2>
      <ul className="ml-4 list-disc space-y-2 text-sm text-[var(--text-secondary)]">
        <li><strong>Always free</strong> — you cannot charge for someone else&apos;s open-source work</li>
        <li><strong>Attribution required</strong> — original author name and URL must be provided</li>
        <li><strong>Source URL must be public</strong> — link to the actual repo or package</li>
        <li><strong>No duplicates</strong> — check if the skill is already listed before submitting</li>
        <li><strong>Accurate descriptions</strong> — describe what the skill actually does, don&apos;t oversell</li>
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-bold">How to publish a community listing</h2>
      <ol className="ml-4 list-decimal space-y-2 text-sm text-[var(--text-secondary)]">
        <li>Go to the publish page</li>
        <li>Select <strong>Community</strong> as the listing type</li>
        <li>Fill in the original author&apos;s name and profile URL</li>
        <li>Set the source URL to their GitHub repo or npm package</li>
        <li>Write a clear description and add relevant tags</li>
        <li>Submit — the listing is automatically free</li>
      </ol>

      <h2 className="mb-3 mt-8 text-xl font-bold">Via JSON</h2>
      <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">{`{
  "name": "Cool Skill",
  "description": "What it does.",
  "category": "productivity",
  "listingType": "community",
  "originalAuthor": "Jane Doe",
  "originalUrl": "https://github.com/janedoe",
  "sourceUrl": "https://github.com/janedoe/cool-skill",
  "sourceType": "github",
  "installCmd": "npx skills add https://github.com/janedoe/cool-skill",
  "compatibility": "claude-code",
  "tags": "cool,skill"
}`}</pre>

      <h2 className="mb-3 mt-8 text-xl font-bold">Takedown requests</h2>
      <p className="text-sm text-[var(--text-secondary)]">
        If you are the original author and want your skill removed from Skill Shope,
        contact us at <a href="mailto:ryan@skillshope.com" className="text-[var(--accent)] hover:underline">ryan@skillshope.com</a>.
        We will remove it promptly.
      </p>
    </>
  );
}
