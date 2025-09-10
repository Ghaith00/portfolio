"use client";
import { FaGithub, FaLinkedin, FaTwitter, FaRegCopyright } from "react-icons/fa";
import { useSite } from "@/lib/site-context";


export default function Footer() {
    const { site } = useSite();
    return (
        <footer className="border-t py-10 border-gray-200">
            <div className="mx-auto max-w-6xl px-4 text-sm opacity-80 flex flex-wrap items-center justify-between gap-3">
                <p className="inline-flex items-center gap-1">
                    <FaRegCopyright className="w-4 h-4" />
                    {new Date().getFullYear()} {site.name}
                </p>
                <div className="flex gap-6 text-2xl">
                    <a href={site.socials.github} target="_blank" aria-label="GitHub">
                        <FaGithub className="hover:text-gray-600 dark:hover:text-gray-300" />
                    </a>
                    <a href={site.socials.linkedin} target="_blank" aria-label="LinkedIn">
                        <FaLinkedin className="hover:text-gray-600 dark:hover:text-gray-300" />
                    </a>
                    <a href={site.socials.x} target="_blank" aria-label="Twitter">
                        <FaTwitter className="hover:text-gray-600 dark:hover:text-gray-300" />
                    </a>
                </div>
            </div>
        </footer>

    );
}