"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSkillMeta = fetchSkillMeta;
exports.fetchDownloadToken = fetchDownloadToken;
exports.fetchFiles = fetchFiles;
const config_js_1 = require("./config.js");
async function fetchSkillMeta(slug) {
    const { registryUrl } = (0, config_js_1.loadConfig)();
    const res = await fetch(`${registryUrl}/api/registry/${slug}`, {
        headers: { "User-Agent": "skillshope-cli/0.1.0" },
    });
    if (res.status === 404) {
        throw new Error(`Skill "${slug}" not found in the registry.`);
    }
    if (!res.ok) {
        throw new Error(`Registry error: ${res.status}`);
    }
    return res.json();
}
async function fetchDownloadToken(skillId) {
    const { registryUrl } = (0, config_js_1.loadConfig)();
    const token = (0, config_js_1.getToken)();
    if (!token) {
        throw new Error("Not logged in. Run: skillshope login");
    }
    const res = await fetch(`${registryUrl}/api/deliver/token?skillId=${skillId}`, {
        headers: {
            "User-Agent": "skillshope-cli/0.1.0",
            Authorization: `Bearer ${token}`,
        },
    });
    if (res.status === 401) {
        throw new Error("Not logged in or session expired. Run: skillshope login");
    }
    if (res.status === 403) {
        throw new Error("You haven't purchased this skill. Visit the skill page to buy it.");
    }
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Token error: ${res.status}`);
    }
    const data = await res.json();
    return data.token;
}
async function fetchFiles(skillId, downloadToken) {
    const { registryUrl } = (0, config_js_1.loadConfig)();
    const params = new URLSearchParams({ source: "cli" });
    if (downloadToken)
        params.set("token", downloadToken);
    const headers = {
        "User-Agent": "skillshope-cli/0.1.0",
    };
    // For free skills, try without auth. For paid, use the download token.
    const token = (0, config_js_1.getToken)();
    if (token && !downloadToken) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${registryUrl}/api/deliver/${skillId}?${params}`, { headers });
    if (res.status === 403) {
        throw new Error("Access denied. This is a paid skill — purchase it first.");
    }
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Delivery error: ${res.status}`);
    }
    return res.json();
}
