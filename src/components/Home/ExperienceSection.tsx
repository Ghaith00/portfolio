"use client";
import { useId, useState, KeyboardEvent } from "react";
import { FaStarOfLife } from "react-icons/fa";
import Image from "next/image";
import { ExperienceContent } from "@/lib/types";


export default function ExperienceSection({ experience = [] }: { experience?: ExperienceContent[] }) {
    const [active, setActive] = useState(0);
    const baseId = useId();

    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowDown") setActive((i) => (i + 1) % experience.length);
        if (e.key === "ArrowUp") setActive((i) => (i - 1 + experience.length) % experience.length);
    };

    return (
        <section aria-labelledby={`${baseId}-heading`} className="w-full">
            <span className="flex items-center gap-2">
                <FaStarOfLife className="text-2xl" />
                <h2 id={`${baseId}-heading`} className="text-2xl md:text-3xl font-semibold tracking-tight">
                    Work Experience
                </h2>
            </span>

            <p className="mt-2 text-sm opacity-80">
                Here's my professional journey so far.
            </p>

            <div className="mt-5 grid gap-6 md:grid-cols-[240px_1fr]">
                {/* LEFT: vertical menu */}
                <div
                    role="tablist"
                    aria-label="Companies"
                    onKeyDown={onKey}
                    className="rounded-2xl h-full border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-zinc-900/40 p-2 md:p-3 sticky top-20"
                >
                    {experience.map((it, i) => {
                        const selected = i === active;
                        return (
                            <button
                                key={it.company}
                                role="tab"
                                aria-selected={selected}
                                aria-controls={`${baseId}-panel-${i}`}
                                id={`${baseId}-tab-${i}`}
                                onClick={() => setActive(i)}
                                className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg text-sm transition mb-1
                                    ${selected
                                        ? "bg-zinc-200 dark:bg-zinc-700 font-semibold"
                                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                            >
                                <div className="relative w-6 h-6">
                                <Image src={it.logo} alt={`${it.company} logo`} fill className="object-contain" />
                                </div>
                                {it.company}
                            </button>
                        );
                    })}
                </div>

                {/* RIGHT: content panel */}
                <div
                    role="tabpanel"
                    id={`${baseId}-panel-${active}`}
                    aria-labelledby={`${baseId}-tab-${active}`}
                    className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 bg-white/70 dark:bg-zinc-900/40 backdrop-blur"
                >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-lg font-semibold">
                            {experience[active].role} · {experience[active].company}
                        </p>
                        <span className="text-sm opacity-70">{experience[active].range}</span>
                    </div>

                    {/* Details */}
                    <h3 className="mt-4 text-sm font-semibold opacity-80">Details</h3>
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-sm opacity-90">
                        {experience[active].details.map((d) => (
                            <li key={d}>{d}</li>
                        ))}
                    </ul>

                    {/* Stack */}
                    <h3 className="mt-4 text-sm font-semibold opacity-80">Stack</h3>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {experience[active].stack.map((tech) => (
                            <span
                                key={tech}
                                className="rounded-full border border-gray-200 dark:border-gray-700 px-2 py-1 bg-white/60 dark:bg-zinc-900/40"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
