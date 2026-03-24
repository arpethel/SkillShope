import { readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";

export async function list(): Promise<void> {
  const skillsDir = join(process.cwd(), ".agents", "skills");

  if (!existsSync(skillsDir)) {
    console.log("\n  No skills installed in this project.\n");
    return;
  }

  const entries = readdirSync(skillsDir, { withFileTypes: true });
  const skills = entries.filter((e) => e.isDirectory() || e.isSymbolicLink());

  if (skills.length === 0) {
    console.log("\n  No skills installed in this project.\n");
    return;
  }

  console.log(`\n  Installed skills (${skills.length}):\n`);

  for (const skill of skills) {
    const skillPath = join(skillsDir, skill.name, "SKILL.md");
    let description = "";

    if (existsSync(skillPath)) {
      const content = readFileSync(skillPath, "utf-8");
      // Extract description from frontmatter
      const match = content.match(/description:\s*>-?\s*\n([\s\S]*?)(?:\n---|\n\w+:)/);
      if (match) {
        description = match[1].trim().split("\n").map((l) => l.trim()).join(" ").slice(0, 80);
      }
    }

    console.log(`  ${skill.name}${description ? ` — ${description}` : ""}`);
  }

  console.log();
}
