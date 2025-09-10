import { getPost } from "@/lib/blog";
import "./post.css";


export default async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);
    return (
        <article className="prose prose-slate dark:prose-invert sm:prose-base lg:prose-lg xl:prose-xl">
            <h1>{post.frontmatter.title}</h1>
            <p className="opacity-60 text-sm">{new Date(post.frontmatter.date).toLocaleDateString()} · {post.frontmatter.tags?.join(", ")}</p>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
    );
}