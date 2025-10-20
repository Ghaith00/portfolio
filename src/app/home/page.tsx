import Image from "next/image";
import { FiDownload, FiMail, FiMapPin } from "react-icons/fi";
import ExperienceSection from "./sections/ExperienceSection";
import SkillsSection from "./sections/SkillsSection";
import EducationSection from "./sections/EducationSection";
import { getProfileContent } from "./data";
import { SiteData } from "@/lib/types";
import { getSite } from "@/lib/data";


export default async function HomePage({ site }: { site?: SiteData } = {}) {
	const resolvedSite = site ?? (await getSite());
	const content = await getProfileContent();
	const hero = content.hero;
	const title = hero?.title ?? resolvedSite.tagline;
	const position = hero?.position ?? resolvedSite.tagline;
	const description = hero?.description;
	const heroButtons = hero?.buttons ?? [];
	const heroImage = hero?.image;

	const experienceYears = (() => {
		const allYears = (content.experience ?? [])
			.flatMap((exp) => Array.from(exp.range.matchAll(/\d{4}/g)))
			.map((match) => Number(match[0]))
			.filter((year) => !Number.isNaN(year));

		if (!allYears.length) return undefined;
		const earliest = Math.min(...allYears);
		const current = new Date().getFullYear();
		return Math.max(0, current - earliest);
	})();

	const totalCompanies = content.experience?.length ?? 0;
	const totalTools =
		content.skills?.reduce((acc, group) => acc + group.items.length, 0) ?? 0;

	const metrics = [
		experienceYears
			? {
					label: "Years shipping products",
					value: `${experienceYears}+`,
					helper: "Hands-on across the stack"
				}
			: null,
		totalCompanies
			? {
					label: "Product teams",
					value: `${totalCompanies}+`,
					helper: "Partnered with globally"
				}
			: null,
		totalTools
			? {
					label: "Tools in play",
					value: `${totalTools}`,
					helper: "Technologies delivered with"
				}
			: null,
	].filter(Boolean) as {
		label: string;
		value: string;
		helper?: string;
	}[];

	const techHighlights = Array.from(
		new Set(
			(content.skills ?? []).flatMap((group) => group.items)
		)
	).slice(0, 3);
	return (
		<div className="space-y-20">
			<section className="relative bg-white/80 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/40 dark:shadow-black/30">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute -left-10 top-[-35%] h-72 w-72 rounded-full bg-gradient-to-br from-indigo-400/40 via-transparent to-transparent blur-3xl dark:from-indigo-500/30" />
					<div className="absolute bottom-[-40%] right-[-20%] h-80 w-80 rounded-full bg-gradient-to-tr from-amber-300/40 via-transparent to-transparent blur-3xl dark:from-amber-400/25" />
				</div>

				<div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
					<div className="space-y-7">
						{position ? (
							<span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-4 py-1.5 text-sm font-medium text-zinc-600 dark:border-zinc-700/70 dark:bg-zinc-900/60 dark:text-zinc-300">
								<span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)] dark:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]" />
								{position}
							</span>
						) : null}
						<h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-5xl dark:text-zinc-50">
							{title}
						</h1>
						{description ? (
							<p className="text-base leading-relaxed text-zinc-600 md:text-lg dark:text-zinc-300">
								{description}
							</p>
						) : null}

						<div className="flex flex-wrap gap-3">
							{heroButtons.map((button, index) => (
								<a
									key={`${button.href}-${button.label}`}
									href={button.href}
									className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
										index === 0
											? "bg-zinc-900 text-white hover:bg-zinc-800 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
											: "border border-zinc-300/80 bg-white/70 text-zinc-700 hover:border-zinc-400 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 dark:border-zinc-700/70 dark:bg-transparent dark:text-zinc-200 dark:hover:border-zinc-500"
									}`}
								>
									{button.label}
								</a>
							))}
							{resolvedSite.resume ? (
								<a
									href={resolvedSite.resume}
									target="_blank"
									rel="noreferrer noopener"
									className="inline-flex items-center gap-2 rounded-full border border-zinc-300/80 bg-white/70 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 dark:border-zinc-700/70 dark:bg-transparent dark:text-zinc-200 dark:hover:border-zinc-500"
								>
									<FiDownload className="text-base" />
									Resume
								</a>
							) : null}
						</div>

						<div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-300">
							{resolvedSite.email ? (
								<a
									href={`mailto:${resolvedSite.email}`}
									className="inline-flex items-center gap-2 transition hover:text-zinc-900 dark:hover:text-zinc-100"
								>
									<FiMail className="text-base" />
									{resolvedSite.email}
								</a>
							) : null}
							{resolvedSite.address ? (
								<span className="inline-flex items-center gap-2">
									<FiMapPin className="text-base" />
									{resolvedSite.address}
								</span>
							) : null}
						</div>

						{metrics.length ? (
							<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{metrics.map((metric) => (
									<div
										key={metric.label}
										className="rounded-2xl border border-zinc-200/80 bg-white/75 px-4 py-4 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/10 dark:border-zinc-700/70 dark:bg-zinc-900/40 dark:hover:shadow-black/30"
									>
										<p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
											{metric.label}
										</p>
										<p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
											{metric.value}
										</p>
										{metric.helper ? (
											<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
												{metric.helper}
											</p>
										) : null}
									</div>
								))}
							</div>
						) : null}
					</div>

					{heroImage?.src ? (
						<div className="relative mx-auto w-full max-w-sm lg:max-w-md">
							<div className="relative aspect-[4/5] overflow-hidden rounded-[30px] border border-zinc-200/80 bg-gradient-to-br from-zinc-100 via-white to-zinc-100 shadow-2xl dark:border-zinc-800/70 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
								<Image
									src={heroImage.src}
									alt={heroImage.alt || title}
									fill
									sizes="(min-width: 1024px) 420px, (min-width: 768px) 360px, 280px"
									className="object-cover"
									priority
								/>
							</div>

							{experienceYears ? (
								<div className="absolute -top-6 right-4 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 text-zinc-900 shadow-lg shadow-amber-200/40 backdrop-blur-sm dark:border-zinc-800/70 dark:bg-zinc-900/70 dark:text-zinc-100">
									<p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
										Experience
									</p>
									<p className="mt-1 text-3xl font-semibold leading-none">
										{experienceYears}+
									</p>
									<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
										Years crafting digital products
									</p>
								</div>
							) : null}

							{techHighlights.length ? (
								<div className="absolute -bottom-8 left-4 right-4 flex flex-wrap gap-2 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 text-sm text-zinc-700 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/70 dark:text-zinc-200">
									<span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
										Currently building with
									</span>
									<div className="flex flex-wrap gap-2">
										{techHighlights.map((tech) => (
											<span
												key={tech}
												className="inline-flex items-center rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-medium dark:bg-zinc-100/10"
											>
												{tech}
											</span>
										))}
									</div>
								</div>
							) : null}
						</div>
					) : null}
				</div>
			</section>

			<ExperienceSection experience={content.experience} />
			<SkillsSection skill={content.skills} />
			<EducationSection education={content.education} />
		</div>
	);
}
