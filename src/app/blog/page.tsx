import { FaBloggerB } from "react-icons/fa";
import ShowcaseIntro from "@/components/sections/ShowcaseIntro";
import { ShowcaseFeaturedCard, ShowcaseListCard } from "@/components/sections/ShowcaseCard";
import { formatDate } from "@/lib/format";
import { listPosts } from "./data";

export default async function BlogIndex() {
	const posts = await listPosts();
	const [featured, ...rest] = posts;
	const tags = new Set<string>();
	posts.forEach((post) => post.frontmatter.tags?.forEach((tag) => tags.add(tag)));

	return (
		<div className="space-y-10">
			<ShowcaseIntro
				icon={<FaBloggerB className="text-2xl" />}
				label="Writing & Notes"
				title="Blog"
				description="Deep dives into engineering lessons, architecture tradeoffs, and the stories behind the projects I've been learning lately."
			>
				{featured ? (
						<ShowcaseFeaturedCard href={`/blog/${featured.slug}`}>
							<div className="relative flex flex-col gap-3">
								<div className="flex flex-wrap items-center gap-3 text-sm text-indigo-600/90 dark:text-indigo-200">
									<time>{formatDate(featured.frontmatter.date)}</time>
									{featured.frontmatter.tags?.length ? (
										<div className="flex flex-wrap gap-2">
											{featured.frontmatter.tags.map((tag) => (
												<span
													key={tag}
													className="inline-flex items-center rounded-full border border-indigo-200/70 bg-indigo-50/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200"
												>
													{tag}
												</span>
											))}
										</div>
									) : null}
								</div>
								<h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
									{featured.frontmatter.title}
								</h2>
								<p className="text-sm text-zinc-600 line-clamp-3 dark:text-zinc-300">
									{featured.frontmatter.excerpt ?? "Click through to explore the full story and insights behind this post."}
								</p>
								<span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition group-hover:translate-x-1 dark:text-indigo-300">
									Read latest insight →
								</span>
							</div>
						</ShowcaseFeaturedCard>
					) : (
						<p className="text-zinc-500 dark:text-zinc-400">
							No posts yet — check back soon for fresh writing.
						</p>
					)}
			</ShowcaseIntro>

			{rest.length ? (
				<section className="space-y-6">
					<h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
						Archive
					</h2>
					<div className="grid gap-6 sm:grid-cols-2">
						{rest.map((post) => (
							<ShowcaseListCard
								key={post.slug}
								href={`/blog/${post.slug}`}
							>
								<div className="flex flex-col gap-3">
									<div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
										<time>{formatDate(post.frontmatter.date)}</time>
										<span className="transition text-indigo-600 group-hover:text-indigo-500 dark:text-indigo-300">
											Read →
										</span>
									</div>
									<h3 className="text-xl font-semibold text-zinc-900 transition group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-300">
										{post.frontmatter.title}
									</h3>
									<p className="text-sm text-zinc-600 line-clamp-3 dark:text-zinc-300">
										{post.frontmatter.excerpt ?? "Dive into the article for more context and takeaways."}
									</p>
								</div>
								{post.frontmatter.tags?.length ? (
									<div className="mt-4 flex flex-wrap gap-2">
										{post.frontmatter.tags.map((tag) => (
											<span
												key={`${post.slug}-${tag}`}
												className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
											>
												{tag}
											</span>
										))}
									</div>
								) : null}
							</ShowcaseListCard>
						))}
					</div>
				</section>
			) : null}
		</div>
	);
}
