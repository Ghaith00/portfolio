import fs from "node:fs/promises";
import path from "node:path";
import type { GithubRepoList, ProfileContent, SiteData } from "@/lib/types";
import { list } from "@vercel/blob";


const MODE = (process.env.ENC ?? process.env.ENV ?? "").toLowerCase();
const USE_BLOB = MODE === "prod";

const DATA_DIR = path.join(process.cwd(), "content");
const DATA_BLOB_PREFIX = (process.env.DATA_BLOB_PREFIX || "data/").replace(/^\/+/, "");

/* ---------------- helpers ---------------- */

async function readJsonLocal<T>(filename: string): Promise<T> {
	const raw = await fs.readFile(path.join(DATA_DIR, filename), "utf8");
	return JSON.parse(raw) as T;
}

async function readJsonBlob<T>(filename: string): Promise<T> {
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

/* ---------------- public API ---------------- */

export async function getSite(): Promise<SiteData> {
	return USE_BLOB
		? readJsonBlob<SiteData>("site.json")
		: readJsonLocal<SiteData>("site.json");
}

export async function getProfileContent(): Promise<ProfileContent> {
	const data = USE_BLOB
		? await readJsonBlob<ProfileContent>("profile.json")
		: await readJsonLocal<ProfileContent>("profile.json");
	return data ?? {};
}

export async function getRepos(username: string) {
	const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=30&sort=updated`, {
		next: { revalidate: 3600 },
		headers: {
			Accept: "application/vnd.github+json",
		},
	});
	if (!res.ok) throw new Error("Failed to fetch repos");
	return (await res.json()) as GithubRepoList;
}
