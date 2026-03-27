"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.saveConfig = saveConfig;
exports.getToken = getToken;
const os_1 = require("os");
const path_1 = require("path");
const fs_1 = require("fs");
const CONFIG_DIR = (0, path_1.join)((0, os_1.homedir)(), ".skillshope");
const CONFIG_PATH = (0, path_1.join)(CONFIG_DIR, "config.json");
const DEFAULT_REGISTRY = "https://skillshope.com";
function loadConfig() {
    if (!(0, fs_1.existsSync)(CONFIG_PATH)) {
        return { registryUrl: DEFAULT_REGISTRY };
    }
    try {
        const raw = (0, fs_1.readFileSync)(CONFIG_PATH, "utf-8");
        const data = JSON.parse(raw);
        return {
            registryUrl: data.registryUrl || DEFAULT_REGISTRY,
            token: data.token,
        };
    }
    catch {
        return { registryUrl: DEFAULT_REGISTRY };
    }
}
function saveConfig(updates) {
    const current = loadConfig();
    const merged = { ...current, ...updates };
    if (!(0, fs_1.existsSync)(CONFIG_DIR)) {
        (0, fs_1.mkdirSync)(CONFIG_DIR, { recursive: true });
    }
    (0, fs_1.writeFileSync)(CONFIG_PATH, JSON.stringify(merged, null, 2) + "\n");
}
function getToken() {
    return loadConfig().token;
}
