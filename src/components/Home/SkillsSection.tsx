import { CiSettings } from "react-icons/ci"
import { SkillContent } from "@/lib/types";
import { Icon } from "@/components/DynamicIcon";


export default function SkillsSection({ skill = [] }: { skill?: SkillContent[] }) {
    return (
        <section>
            <span className="flex items-center gap-2">
                <CiSettings className="text-3xl" />
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    Technology
                </h2>
            </span>
            <p className="mt-2 text-sm opacity-80">
                Core tools & technologies I use day-to-day.
            </p>

            <div className="mt-6 grid gap-4 md:gap-6 md:grid-cols-2">
                {skill.map((g) => {
                    return (
                        <div
                            key={g.title}
                            className="rounded-2xl border border-gray-200 dark:border-gray-700 
                         bg-white/70 dark:bg-zinc-900/40 backdrop-blur"
                        >
                            <summary
                                className="list-none px-5 py-3 md:py-4 flex items-center justify-between font-medium"
                            >
                                <span className="flex items-center gap-2">
                                    <Icon name={g.icon} className="shrink-0" />
                                    {g.title}
                                </span>
                                <span className="text-sm opacity-60">({g.items.length})</span>
                            </summary>

                            <div className="px-5 pb-4">
                                <ul className="flex flex-wrap gap-2">
                                    {g.items.map((item) => (
                                        <li
                                            key={item}
                                            className="text-xs md:text-sm rounded-full border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 bg-white/60 dark:bg-zinc-900/40"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
