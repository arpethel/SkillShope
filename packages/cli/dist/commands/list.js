"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
const fs_1 = require("fs");
const path_1 = require("path");
const SKILL_DIRS = [
    { type: "skill", dir: ".claude/skills" },
    { type: "mcp-server", dir: ".claude/mcp-servers" },
    { type: "agent", dir: ".claude/agents" },
];
async function list() {
    let found = 0;
    for (const { type, dir } of SKILL_DIRS) {
        const fullPath = (0, path_1.join)(process.cwd(), dir);
        if (!(0, fs_1.existsSync)(fullPath))
            continue;
        const entries = (0, fs_1.readdirSync)(fullPath, { withFileTypes: true })
            .filter((e) => e.isDirectory());
        for (const entry of entries) {
            if (found === 0) {
                console.log("  Installed skills:\n");
            }
            console.log(`  ${entry.name} (${type}) — ${dir}/${entry.name}/`);
            found++;
        }
    }
    if (found === 0) {
        console.log("  No skills installed in this directory.");
        console.log("  Run: skillshope install <slug>");
    }
}
