import { getToken, getRegistryUrl } from "../config.js";

export async function whoami(): Promise<void> {
  const token = getToken();

  if (!token) {
    console.log("\n  Not logged in. Run: skillshope login\n");
    return;
  }

  console.log(`\n  Registry: ${getRegistryUrl()}`);
  console.log(`  Token: ${token.slice(0, 8)}...${token.slice(-4)}`);
  console.log("  Status: authenticated\n");
}
