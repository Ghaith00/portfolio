import fs from "node:fs/promises";
import path from "node:path";
import type { SiteData } from "@/lib/types";
import { list } from "@vercel/blob";


export const MODE = (process.env.ENC ?? process.env.ENV ?? "").toLowerCase();
export const USE_BLOB = MODE === "prod";

const DATA_DIR = path.join(process.cwd(), "content");
const DATA_BLOB_PREFIX = (process.env.DATA_BLOB_PREFIX || "data/").replace(/^\/+/, "");

export async function readJsonLocal<T>(filename: string): Promise<T> {
	const raw = await fs.readFile(path.join(DATA_DIR, filename), "utf8");
	return JSON.parse(raw) as T;
}

export async function readJsonBlob<T>(filename: string): Promise<T> {
	const blobPath = `${DATA_BLOB_PREFIX}${filename}`;

	// Find exact match under the prefix
	const { blobs } = await list({ prefix: blobPath });
	// Prefer exact pathname; if you ever uploaded with random suffix, fall back to newest
	const file =
		blobs.find(b => b.pathname === blobPath) ||
		blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];

	if (!file) {
		throw new Error(`Blob not found: ${blobPath}`);
	}

	const res = await fetch(file.url, { cache: "no-store" });
	if (!res.ok) throw new Error(`Failed to fetch ${blobPath}: ${res.status}`);
	return (await res.json()) as T;
}

export async function getSite(): Promise<SiteData> {
	return USE_BLOB
		? readJsonBlob<SiteData>("site.json")
		: readJsonLocal<SiteData>("site.json");
}

