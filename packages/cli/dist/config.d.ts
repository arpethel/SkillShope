export type Config = {
    registryUrl: string;
    token?: string;
};
export declare function loadConfig(): Config;
export declare function saveConfig(updates: Partial<Config>): void;
export declare function getToken(): string | undefined;
