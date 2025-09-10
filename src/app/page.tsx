import Image from "next/image";
import ExperienceSection from "@/components/Home/ExperienceSection";
import SkillsSection from "@/components/Home/SkillsSection";
import EducationSection from "@/components/Home/EducationSection";
import { getProfileContent } from "@/lib/data";
import { SiteData } from "@/lib/types";


export default async function HomePage({ site }: { site: SiteData }) {
	const content = await getProfileContent();
	return (
		<div className="space-y-16">
			{/* Hero */}
			<section className="grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
				<div>
					<h1 className="text-3xl md:text-5xl font-bold leading-tight">{content.hero?.title ?? site.tagline}</h1>
					<p className="mt-2 text-base md:text-xl opacity-80 leading-relaxed">
						{content.hero?.position ?? site.tagline}
					</p>
					<p className="mt-4 text-base md:text-lg opacity-80 leading-relaxed">
						{content.hero?.description ?? site.tagline}
					</p>
					<div className="mt-6 flex flex-wrap gap-3">
						{
							content.hero?.buttons && content.hero?.buttons.map((value, index) => (
								<a key={index} href={value.href} className="rounded-xl border px-4 py-2 text-sm font-medium hover:shadow-md">{value.label}</a>
							))
						}
					</div>
				</div>
				{/* Photo */}
				<div className="justify-self-center md:justify-self-end">
					<div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden  bg-white/60 dark:bg-zinc-900/50 shadow-sm">
						<Image
							src={content.hero?.image.src}
							alt={content.hero?.image.alt}
							fill
							sizes="(min-width: 1200px) 640px, 512px"
							className="object-cover"
							priority
						/>
					</div>
				</div>
			</section>
			<ExperienceSection experience={content.experience}/>
			<SkillsSection skill={content.skills}/>
			<EducationSection education={content.education}/>
		</div>
	);
}