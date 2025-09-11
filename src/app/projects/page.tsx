import { getRepos } from "./data";
import Link from "next/link";
import { FaGitAlt } from "react-icons/fa";


export default async function ProjectsPage() {
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Ghaith00";
    const repos = await getRepos(username);
    const filtered = repos
        .filter((r) => !r.fork)
        .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0));

    return (
        <div>
            <span className="flex items-center gap-2">
                <FaGitAlt className="text-3xl" />
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    Projects
                </h2>
            </span>
            <p className="mt-2 opacity-80">Open‑source work from <Link href={`https://github.com/${username}`} className="underline" target="_blank">@{username}</Link>.</p>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((repo) => (
                    <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="border-gray-200 group block rounded-2xl border p-5 hover:shadow-md bg-white/70 dark:bg-zinc-900/50 backdrop-blur">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-lg font-semibold leading-tight">{repo.name}</h3>
                            <span className="text-sm opacity-60">★ {repo.stargazers_count}</span>
                        </div>
                        <p className="mt-2 text-sm opacity-80 leading-relaxed line-clamp-3">{repo.description || "No description."}</p>
                        <div className="mt-3 text-xs opacity-70 flex gap-3">
                            {repo.language && <span>{repo.language}</span>}
                            {repo.license?.spdx_id && <span>{repo.license.spdx_id}</span>}
                            <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}