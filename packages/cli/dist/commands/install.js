"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = install;
const path_1 = require("path");
const fs_1 = require("fs");
const api_js_1 = require("../api.js");
const TYPE_DIRS = {
    skill: ".claude/skills",
    "mcp-server": ".claude/mcp-servers",
    agent: ".claude/agents",
};
async function install(slug) {
    if (!slug) {
        console.error("Usage: skillshope install <slug>");
        process.exit(1);
    }
    // 1. Fetch skill metadata
    process.stdout.write(`  Fetching ${slug}...`);
    const skill = await (0, api_js_1.fetchSkillMeta)(slug);
    console.log(` found (${skill.type})`);
    // 2. Handle paid skills — get download token
    let downloadToken;
    if (!skill.isFree) {
        process.stdout.write("  Verifying purchase...");
        downloadToken = await (0, api_js_1.fetchDownloadToken)(skill.id);
        console.log(" verified");
    }
    // 3. Download files
    process.stdout.write("  Downloading files...");
    const { files } = await (0, api_js_1.fetchFiles)(skill.id, downloadToken);
    if (!files || files.length === 0) {
        console.log("\n  No files available for this skill.");
        console.log(`  Visit: https://skillshope.com/skills/${slug}`);
        return;
    }
    console.log(` ${files.length} file${files.length !== 1 ? "s" : ""}`);
    // 4. Write files to disk
    const baseDir = TYPE_DIRS[skill.type] || ".claude/skills";
    const targetDir = (0, path_1.join)(process.cwd(), baseDir, slug);
    if ((0, fs_1.existsSync)(targetDir)) {
        console.log(`  Updating existing install at ${baseDir}/${slug}/`);
    }
    (0, fs_1.mkdirSync)(targetDir, { recursive: true });
    for (const file of files) {
        const filePath = (0, path_1.join)(targetDir, file.filename);
        (0, fs_1.writeFileSync)(filePath, file.content, "utf-8");
    }
    // 5. Success
    console.log(`  Installed to ${baseDir}/${slug}/`);
    console.log("  Done.");
}
