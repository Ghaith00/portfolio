import Link from "next/link";
import { listPosts } from "@/lib/blog";
import { FaGitAlt } from "react-icons/fa";


export default async function BlogIndex() {
    const posts = await listPosts();
    return (
        <div>
            <span className="flex items-center gap-2">
                <FaGitAlt className="text-3xl" />
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    Blog
                </h2>
            </span>
            <div className="mt-6 grid gap-4">
                {posts.map((p) => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-xl border border-gray-200 p-4 hover:shadow-sm">
                        <p className="text-lg font-semibold">{p.frontmatter.title}</p>
                        <p className="text-sm opacity-70">{new Date(p.frontmatter.date).toLocaleDateString()} · {p.frontmatter.tags?.join(", ")}</p>
                        <p className="mt-1 text-sm opacity-80 line-clamp-2">{p.frontmatter.excerpt}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}