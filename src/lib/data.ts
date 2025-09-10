import fs from "node:fs/promises";
import path from "node:path";
import type { ProfileContent, SiteData } from "@/lib/types";

const dataDir = (...p: string[]) => path.join(process.cwd(), "content", ...p);

export async function getSite(): Promise<SiteData> {
	const raw = await fs.readFile(dataDir("site.json"), "utf8");
	return JSON.parse(raw);
}

export async function getProfileContent(): Promise<ProfileContent> {
	const raw = await fs.readFile(dataDir("profile.json"), "utf8");
	const data = JSON.parse(raw) as ProfileContent;
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
	return (await res.json()) as Array<any>;
}
