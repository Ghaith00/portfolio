import { ReactNode } from "react";


type ShowcaseIntroProps = {
	icon: ReactNode;
	label: string;
	title: string;
	description: ReactNode;
	children?: ReactNode;
	className?: string;
};

const baseSection =
	"relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to-br from-indigo-500/10 via-white to-purple-500/10 dark:from-indigo-600/10 dark:via-zinc-950 dark:to-purple-500/10 px-8 py-10 shadow-sm";

export default function ShowcaseIntro({
	icon,
	label,
	title,
	description,
	children,
	className,
}: ShowcaseIntroProps) {
	const sectionClass = className ? `${baseSection} ${className}` : baseSection;

	return (
		<section className={sectionClass}>
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute right-16 top-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />
				<div className="absolute left-24 bottom-4 h-24 w-24 rounded-full bg-purple-500/20 blur-3xl" />
			</div>
			<div className="relative flex flex-col gap-6">
				<div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-300">
					<span className="rounded-full bg-indigo-600/10 p-3">{icon}</span>
					<div>
						<p className="text-sm font-semibold uppercase tracking-widest text-indigo-600/80 dark:text-indigo-300/80">
							{label}
						</p>
						<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
							{title}
						</h1>
					</div>
				</div>
				<div className="max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
					{description}
				</div>
				{children}
			</div>
		</section>
	);
}
