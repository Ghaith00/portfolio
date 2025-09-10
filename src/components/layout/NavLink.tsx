"use client"
import { usePathname } from "next/navigation";
import Link from "next/link";


export default function NavLink({ href, label }: { href: string; label: string }) {
    const pathname = usePathname();
    const active = pathname === href;
    return (
        <Link
            href={href}
            className={`px-3 py-2 rounded-lg text-sm transition border hover:shadow-sm
                ${active ? "border-zinc-400/60 dark:border-zinc-600/60" : "border-transparent"}
            `}
        >
            {label}
        </Link>
    );
}