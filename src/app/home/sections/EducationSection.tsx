import { EducationContent } from "../types";
import Image from "next/image";
import { FaGraduationCap } from "react-icons/fa";


export default function EducationSection({ education }: { education: EducationContent[] }) {
    return (
        <section>
            <span className="flex items-center gap-2">
                <FaGraduationCap className="text-3xl" />
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    Education
                </h2>
            </span>

            <div className="mt-6 grid gap-6">
                {education.map((it) => (
                    <div
                        key={it.degree}
                        className="rounded-2xl border border-gray-200 dark:border-gray-700 
                       p-5 bg-white/70 dark:bg-zinc-900/40 backdrop-blur"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 shrink-0">
                                <Image
                                    src={it.logo}
                                    alt={`${it.school} logo`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline justify-between flex-wrap gap-2">
                                    <p className="text-lg font-semibold">{it.degree}</p>
                                    <span className="text-sm opacity-70">
                                        {it.range} · {it.location}
                                    </span>
                                </div>
                                <p className="text-sm opacity-80">{it.school}</p>
                            </div>
                        </div>

                        <p className="mt-3 text-sm opacity-90">{it.details}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
