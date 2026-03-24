#!/usr/bin/env node

import { install } from "./commands/install.js";
import { login } from "./commands/login.js";
import { whoami } from "./commands/whoami.js";
import { list } from "./commands/list.js";

const HELP = `
  skillshope — The AI Skills Registry CLI

  Usage:
    skillshope install <slug>     Install a skill by name
    skillshope login              Authenticate with Skill Shope
    skillshope whoami             Show current auth status
    skillshope list               List installed skills
    skillshope help               Show this help message

  Examples:
    skillshope install mcp-forge
    skillshope login
`;

async function main() {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "install":
    case "add":
      if (!args[0]) {
        console.error("Error: skill slug required\n  Usage: skillshope install <slug>");
        process.exit(1);
      }
      await install(args[0]);
      break;
    case "login":
      await login();
      break;
    case "whoami":
      await whoami();
      break;
    case "list":
    case "ls":
      await list();
      break;
    case "help":
    case "--help":
    case "-h":
    case undefined:
      console.log(HELP);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
