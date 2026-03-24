import { createInterface } from "readline";
import { saveConfig, getRegistryUrl } from "../config.js";

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function login(): Promise<void> {
  console.log("\n  Skill Shope Login\n");
  console.log("  To get your download token:");
  console.log(`  1. Go to ${getRegistryUrl()}/dashboard`);
  console.log("  2. Purchase a skill");
  console.log("  3. Click 'Get Download Token' on the skill page\n");

  const token = await prompt("  Paste your download token: ");

  if (!token) {
    console.log("  No token provided. Aborting.\n");
    process.exit(1);
  }

  saveConfig({ token });
  console.log("\n  ✓ Token saved to ~/.skillshope/config.json");
  console.log("  You can now install purchased skills.\n");
}
