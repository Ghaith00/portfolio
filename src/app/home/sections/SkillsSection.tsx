import { CiSettings } from "react-icons/ci";
import { SkillContent } from "../types";
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
                            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/70 p-px shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/10 dark:border-gray-700 dark:bg-zinc-900/40 dark:hover:shadow-black/30"
                        >
                            <div className="rounded-[16px] bg-white/90 px-5 py-4 md:py-5 dark:bg-zinc-950/60">
                                <div className="flex items-center justify-between font-medium">
                                <span className="flex items-center gap-2">
                                    <Icon name={g.icon} className={`text-xl ${g.color}`} />
                                    {g.title}
                                </span>
                                <span className="text-sm opacity-60">({g.items.length})</span>
                                </div>

                                <div className="mt-4">
                                    <ul className="flex flex-wrap gap-2">
                                        {g.items.map((item) => (
                                            <li
                                                key={item}
                                                className="text-xs md:text-sm inline-flex items-center rounded-full border border-gray-200 bg-white/70 px-2.5 py-1.5 font-medium text-gray-700 transition group-hover:border-gray-300 dark:border-gray-700 dark:bg-zinc-900/50 dark:text-zinc-200 dark:group-hover:border-zinc-600"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
