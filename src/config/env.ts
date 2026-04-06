import fs from "fs";
import path from "path";
import dotenv from "dotenv";

let isEnvLoaded = false;

const envFileCandidates = () => {
    if (process.env.NODE_ENV === "production") {
        return [".env.production", ".env"];
    }

    return [".env.development", ".env"];
};

export const loadEnv = () => {
    if (isEnvLoaded) {
        return;
    }

    for (const file of envFileCandidates()) {
        const fullPath = path.resolve(process.cwd(), file);

        if (fs.existsSync(fullPath)) {
            dotenv.config({ path: fullPath });
            isEnvLoaded = true;
            return;
        }
    }

    dotenv.config();
    isEnvLoaded = true;
};

export const getEnv = (key: string): string => {
    loadEnv();

    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing environment variable ${key}`);
    }

    return value;
};
