#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const install_js_1 = require("./commands/install.js");
const login_js_1 = require("./commands/login.js");
const whoami_js_1 = require("./commands/whoami.js");
const list_js_1 = require("./commands/list.js");
const VERSION = "0.1.0";
function help() {
    console.log(`
  skillshope v${VERSION} — Install AI skills from Skill Shope

  Usage:
    skillshope install <slug>   Install a skill, MCP server, or agent
    skillshope login            Authenticate with your API key
    skillshope whoami           Show current logged-in user
    skillshope list             List installed skills in this directory
    skillshope help             Show this help message

  Examples:
    skillshope install code-reviewer-pro
    skillshope install codebase-memory-mcp
    skillshope login

  Docs: https://skillshope.com/docs/cli-reference
`);
}
async function main() {
    const [command, ...args] = process.argv.slice(2);
    try {
        switch (command) {
            case "install":
            case "add":
            case "i":
                await (0, install_js_1.install)(args[0]);
                break;
            case "login":
                await (0, login_js_1.login)();
                break;
            case "whoami":
                await (0, whoami_js_1.whoami)();
                break;
            case "list":
            case "ls":
                await (0, list_js_1.list)();
                break;
            case "help":
            case "--help":
            case "-h":
                help();
                break;
            case "--version":
            case "-v":
                console.log(`skillshope v${VERSION}`);
                break;
            default:
                if (!command) {
                    help();
                }
                else {
                    console.error(`  Unknown command: ${command}`);
                    console.error("  Run: skillshope help");
                    process.exit(1);
                }
        }
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`\n  Error: ${message}`);
        process.exit(1);
    }
}
main();
