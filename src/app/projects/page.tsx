import { getRepos } from "./data";
import Link from "next/link";
import { FaGitAlt } from "react-icons/fa";
import { FiExternalLink, FiStar, FiGitBranch } from "react-icons/fi";
import ShowcaseIntro from "@/components/sections/ShowcaseIntro";
import { ShowcaseFeaturedCard, ShowcaseListCard } from "@/components/sections/ShowcaseCard";
import { formatDate, formatNumber } from "@/lib/format";

export default async function ProjectsPage() {
	const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Ghaith00";
	const repos = await getRepos(username);
	const filtered = repos
		.filter((r) => !r.fork)

	const [featured, ...rest] = filtered;
	const showcase = rest.slice(0, 8);

	return (
		<div className="space-y-10">
			<ShowcaseIntro
				icon={<FaGitAlt className="text-2xl" />}
				label="Open Source"
				title="Projects"
				description={
					<>
						Experiments, tools, and long-term libraries I've published while exploring product ideas and better developer workflows.
						{" "}
						Follow along on{" "}
						<Link
							href={`https://github.com/${username}`}
							target="_blank"
							className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
						>
							@{username}
						</Link>
						.
					</>
				}
			>
				{featured ? (
						<ShowcaseFeaturedCard
							href={featured.html_url}
							external
							overlayClassName="bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10"
						>
							<div className="relative flex flex-col gap-4">
								<div className="flex items-start justify-between gap-3">
									<div className="space-y-1">
										<p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
											Featured Repository
										</p>
										<h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
											{featured.name}
										</h2>
									</div>
									<span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
										Updated {formatDate(featured.updated_at)}
									</span>
								</div>
								<p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">
									{featured.description ?? "Peek under the hood to see how it works and why I built it."}
								</p>
								<div className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
									<span className="inline-flex items-center gap-2">
										<FiStar className="text-indigo-500" />
										{formatNumber(featured.stargazers_count)} stars
									</span>
									<span className="inline-flex items-center gap-2">
										<FiGitBranch className="text-indigo-500" />
										{formatNumber(featured.forks_count)} forks
									</span>
									{featured.language ? (
										<span className="inline-flex items-center gap-2">
											<span className="h-2 w-2 rounded-full bg-indigo-500" />
											{featured.language}
										</span>
									) : null}
								</div>
								<span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition group-hover:translate-x-1 dark:text-indigo-300">
									View on GitHub <FiExternalLink />
								</span>
							</div>
						</ShowcaseFeaturedCard>
					) : (
						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							No repositories found just yet. Come back soon to see what I've been hacking on.
						</p>
					)}
			</ShowcaseIntro>

			{showcase.length ? (
				<section className="space-y-6">
					<h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
						Repository Highlights
					</h2>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{showcase.map((repo) => (
							<ShowcaseListCard
								key={repo.id}
								href={repo.html_url}
								external
							>
								<div className="flex flex-col gap-3">
									<div className="flex items-start justify-between gap-3">
										<h3 className="text-xl font-semibold text-zinc-900 transition group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-300">
											{repo.name}
										</h3>
										<span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
											<FiStar />
											{formatNumber(repo.stargazers_count)}
										</span>
									</div>
									<p className="text-sm text-zinc-600 line-clamp-3 dark:text-zinc-300">
										{repo.description ?? "Dive into the repo to read more about this build."}
									</p>
								</div>
								<div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
									<div className="flex flex-wrap gap-2">
										{repo.language ? (
											<span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
												<span className="h-2 w-2 rounded-full bg-indigo-500" />
												{repo.language}
											</span>
										) : null}
										{repo.license?.spdx_id ? (
											<span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
												{repo.license.spdx_id}
											</span>
										) : null}
									</div>
									<span>Updated {formatDate(repo.updated_at)}</span>
								</div>
							</ShowcaseListCard>
						))}
					</div>
				</section>
			) : null}
		</div>
	);
}
