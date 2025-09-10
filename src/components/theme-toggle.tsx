"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CiLight, CiDark } from "react-icons/ci";


export default function ThemeToggle({ className = '' }: { className?: string }) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        // avoid hydration mismatch
        return (
            <button
                aria-label="Toggle theme"
                className="px-3 py-2 rounded-lg text-sm border opacity-70"
            >
                …
            </button>
        );
    }

    const isDark = (theme ?? resolvedTheme) === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            title={isDark ? "Switch to light" : "Switch to dark"}
            className={`flex items-center justify-center w-10 h-10 rounded-full 
                        text-xl hover:bg-zinc-100 dark:hover:bg-zinc-800
                        cursor-pointer transition ${className}`}
        >
            {isDark ? <CiLight /> : <CiDark />}
        </button>
    );
}
