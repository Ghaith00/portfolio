import { GithubRepoList } from "./types";


export async function getRepos(username: string) {
	const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=30&sort=pushed`, {
		next: { revalidate: 3600 },
		headers: {
			Accept: "application/vnd.github+json",
		},
	});
	if (!res.ok) throw new Error("Failed to fetch repos");
	return (await res.json()) as GithubRepoList;
}