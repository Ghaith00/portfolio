"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import ThemeToggle from "@/components/theme-toggle";
import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { useSite } from "@/lib/site-context";


function isActive(pathname: string, href: string) {
    // exact for root, prefix for nested (e.g., /blog/[slug])
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
}

const highlightedClass = 'text-sm bg-indigo-600 hover:bg-indigo-500 text-white';
type IndicatorState = { left: number; top: number; width: number; height: number; opacity: number };

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { site } = useSite();
    const navRef = useRef<HTMLDivElement | null>(null);
    const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
    const [indicator, setIndicator] = useState<IndicatorState>({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        opacity: 0,
    });

    const close = useCallback(() => setOpen(false), []);
    const toggle = useCallback(() => setOpen((s) => !s), []);
    const updateIndicator = useCallback(() => {
        const navEl = navRef.current;
        if (!navEl) return;

        const activeItem = site.nav.find(
            (item) => !item.isHighlighted && isActive(pathname, item.href),
        );

        if (!activeItem) {
            setIndicator((prev) =>
                prev.opacity === 0 ? prev : { ...prev, opacity: 0 },
            );
            return;
        }

        const activeEl = linkRefs.current[activeItem.href];
        if (!activeEl) return;

        const navRect = navEl.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();

        const next = {
            left: activeRect.left - navRect.left,
            top: activeRect.top - navRect.top,
            width: activeRect.width,
            height: activeRect.height,
            opacity: 1,
        };

        setIndicator((prev) => {
            const unchanged =
                prev.left === next.left &&
                prev.top === next.top &&
                prev.width === next.width &&
                prev.height === next.height &&
                prev.opacity === next.opacity;

            return unchanged ? prev : next;
        });
    }, [pathname, site.nav]);

    // Close menu on route change
    useEffect(() => { close(); }, [pathname, close]);

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [close]);
    useEffect(() => {
        const raf = requestAnimationFrame(() => updateIndicator());
        const handleResize = () => updateIndicator();

        window.addEventListener("resize", handleResize);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", handleResize);
        };
    }, [updateIndicator]);

    return (
        <header className="site-navbar sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 border-gray-200">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="font-semibold tracking-tight">
                    {site.name}
                </Link>

                {/* Desktop nav */}
                <nav ref={navRef} className="hidden md:flex items-center gap-2 relative">
                    <span
                        aria-hidden="true"
                        className="absolute rounded-lg bg-zinc-200 dark:bg-zinc-700 transition-all duration-300 ease-out pointer-events-none"
                        style={{
                            left: `${indicator.left}px`,
                            top: `${indicator.top}px`,
                            width: `${indicator.width}px`,
                            height: `${indicator.height}px`,
                            opacity: indicator.opacity,
                        }}
                    />
                    {site.nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            ref={(el) => { linkRefs.current[item.href] = el; }}
                            className={`relative z-10 px-3 py-2 rounded-lg text-sm transition
                                ${isActive(pathname, item.href)
                                    ? item .isHighlighted ? highlightedClass : "bg-zinc-200 dark:bg-zinc-700 font-semibold"
                                    : item .isHighlighted ? highlightedClass : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}
                            `}
                            aria-current={isActive(pathname, item.href) ? "page" : undefined}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <a
                        href={site.resume}
                        target="_blank"
                        className="relative z-10 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-200 hover:shadow-sm"
                    >
                        Resume
                    </a>
                    <ThemeToggle />
                </nav>
                <ThemeToggle className="md:hidden" />
                {/* Mobile hamburger */}
                <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    className="md:hidden inline-flex items-center justify-center rounded-lg p-2 border hover:shadow-sm border-gray-200"
                >
                    <span className="sr-only">Toggle menu</span>
                    { open ? <IoCloseOutline /> :<FiMenu /> }
                </button>
            </div>

            {/* Mobile dropdown panel */}
            <div
                id="mobile-menu"
                className={`md:hidden border-gray-200 border-t overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-96" : "max-h-0"}`}
            >
                <nav className="px-4 py-2 flex flex-col gap-1">
                    {site.nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-3 py-2 rounded-lg text-sm
                                ${isActive(pathname, item.href)
                                    ? "bg-zinc-200 dark:bg-zinc-700 font-semibold"
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                            aria-current={isActive(pathname, item.href) ? "page" : undefined}
                            onClick={close}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <a
                        href={site.resume}
                        target="_blank"
                        className="block px-3 py-2 rounded-lg text-sm border hover:shadow-sm border-gray-200"
                        onClick={close}
                    >
                        Resume
                    </a>
                </nav>
            </div>
        </header>
    );
}
