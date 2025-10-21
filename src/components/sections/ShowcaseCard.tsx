import Link from "next/link";
import { ReactNode } from "react";


type ShowcaseLinkProps = {
	href: string;
	external?: boolean;
	children: ReactNode;
	className?: string;
};

function ShowcaseLink({ href, external, className, children }: ShowcaseLinkProps) {
	if (external) {
		return (
			<a href={href} target="_blank" rel="noreferrer" className={className}>
				{children}
			</a>
		);
	}
	return (
		<Link href={href} className={className}>
			{children}
		</Link>
	);
}

type ShowcaseFeaturedCardProps = ShowcaseLinkProps & {
	overlayClassName?: string;
};

export function ShowcaseFeaturedCard({
	href,
	external,
	className,
	children,
	overlayClassName = "bg-gradient-to-r from-indigo-500/10 to-purple-500/10",
}: ShowcaseFeaturedCardProps) {
	const base =
		"group relative overflow-hidden rounded-2xl border border-indigo-200/40 dark:border-indigo-500/20 bg-white/80 dark:bg-zinc-900/70 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl";
	const classes = className ? `${base} ${className}` : base;

	return (
		<ShowcaseLink href={href} external={external} className={classes}>
			<div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
				<div className={`absolute inset-0 ${overlayClassName}`} />
			</div>
			{children}
		</ShowcaseLink>
	);
}

type ShowcaseListCardProps = ShowcaseLinkProps;

export function ShowcaseListCard({ href, external, className, children }: ShowcaseListCardProps) {
	const base =
		"group flex h-full flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60";
	const classes = className ? `${base} ${className}` : base;

	return (
		<ShowcaseLink href={href} external={external} className={classes}>
			{children}
		</ShowcaseLink>
	);
}

type ShowcaseStatCardProps = {
	label: string;
	value: ReactNode;
	icon?: ReactNode;
};

export function ShowcaseStatCard({ label, value, icon }: ShowcaseStatCardProps) {
	return (
		<div className="rounded-2xl border border-indigo-200/40 bg-white/70 p-4 shadow-sm dark:border-indigo-500/20 dark:bg-zinc-900/70">
			{icon ? (
				<div className="flex items-center gap-3">
					<span className="rounded-full bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-300">
						{icon}
					</span>
					<div>
						<p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
							{label}
						</p>
						<p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
							{value}
						</p>
					</div>
				</div>
			) : (
				<div>
					<p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
						{label}
					</p>
					<p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
						{value}
					</p>
				</div>
			)}
		</div>
	);
}
