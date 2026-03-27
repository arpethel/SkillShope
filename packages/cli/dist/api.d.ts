type SkillMeta = {
    id: string;
    slug: string;
    name: string;
    type: string;
    isFree: boolean;
    price: number;
    installCmd: string | null;
    description: string;
};
type DeliverResponse = {
    files: {
        filename: string;
        content: string;
    }[];
};
export declare function fetchSkillMeta(slug: string): Promise<SkillMeta>;
export declare function fetchDownloadToken(skillId: string): Promise<string>;
export declare function fetchFiles(skillId: string, downloadToken?: string): Promise<DeliverResponse>;
export {};
