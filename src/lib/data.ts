import fs from "node:fs/promises";
import path from "node:path";
import type { SiteData } from "@/lib/types";

export const MODE = (process.env.ENC ?? process.env.ENV ?? "").toLowerCase();

const DATA_DIR = path.join(process.cwd(), "content");

export async function readJsonLocal<T>(filename: string): Promise<T> {
	const raw = await fs.readFile(path.join(DATA_DIR, filename), "utf8");
	return JSON.parse(raw) as T;
}

export async function getSite(): Promise<SiteData> {
	return readJsonLocal<SiteData>("site.json");
}

