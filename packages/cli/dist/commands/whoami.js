"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whoami = whoami;
const config_js_1 = require("../config.js");
async function whoami() {
    const token = (0, config_js_1.getToken)();
    if (!token) {
        console.log("  Not logged in. Run: skillshope login");
        return;
    }
    const { registryUrl } = (0, config_js_1.loadConfig)();
    const res = await fetch(`${registryUrl}/api/auth/verify-key`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "skillshope-cli/0.1.0",
        },
        body: JSON.stringify({ key: token }),
    });
    if (!res.ok) {
        console.log("  Session expired or invalid. Run: skillshope login");
        return;
    }
    const data = await res.json();
    console.log(`  Logged in as: ${data.name || "user"}`);
    if (data.email)
        console.log(`  Email: ${data.email}`);
}
