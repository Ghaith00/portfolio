---
title: "Build a Markdown Blog on Next.js with Vercel Blob (No Images in Git)"
date: "2025-09-09"
tags: ["react", "nextjs", "vercel"]
excerpt: "Kicking off my blog with a tiny Markdown‑powered setup."
---

A practical guide to serving Markdown posts from **Vercel Blob** in production and from the **filesystem** in local dev—using **Next.js App Router**, **markdown-it**, and **Tailwind Typography**.

---

## Why this setup?

- **No repo bloat**: keep images and posts out of Git.
- **Fast authoring**: local `.md` files for dev; upload to Blob for production.
- **Simple toggle**: `ENV=dev` (local) → filesystem, `ENC=prod` (vercel) → blob.

---

## Prerequisites

- Next.js 13/14 (App Router)
- Tailwind + `@tailwindcss/typography`
- `markdown-it`, `markdown-it-anchor`, `highlight.js`
- Vercel Blob store connected to your project (gives `BLOB_READ_WRITE_TOKEN`)

```bash
npm i markdown-it markdown-it-anchor highlight.js @vercel/blob gray-matter
```

---

## Env vars

**Local (`.env.local`)**
```
ENV=dev
BLOG_BLOB_PREFIX=blog/
```

**Vercel → Project → Settings → Environment Variables**
```
ENC=prod
BLOG_BLOB_PREFIX=blog/
BLOB_READ_WRITE_TOKEN=***  # created automatically when you attach a Blob store
```

---

## Content loader (filesystem in dev, Blob in prod)

Create `lib/blog.ts`:

```ts
import path from "node:path";
import fs from "node:fs/promises";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import hljs from "highlight.js";
import { list } from "@vercel/blob";

export type Frontmatter = {
  title?: string;
  date?: string;       // ISO date
  excerpt?: string;
  cover?: string;      // optional image URL
  tags?: string[];
};

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs language-\${lang}">` +
          hljs.highlight(str, { language: lang }).value +
        `</code></pre>`;
      } catch {}
    }
    return `<pre><code class="hljs">` +
      hljs.highlightAuto(str).value +
    `</code></pre>`;
  },
}).use(markdownItAnchor, { slugify: (s) => s.toLowerCase().replace(/\s+/g, "-") });

const MODE = (process.env.ENC ?? process.env.ENV ?? "").toLowerCase();
const USE_BLOB = MODE === "prod";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const BLOG_BLOB_PREFIX = (process.env.BLOG_BLOB_PREFIX || "blog/").replace(/^\/+/, "");

export async function listPosts() {
  if (!USE_BLOB) {
    await fs.mkdir(BLOG_DIR, { recursive: true });
    const files = (await fs.readdir(BLOG_DIR)).filter(f => f.endsWith(".md"));
    const posts = await Promise.all(files.map(async (file) => {
      const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
      const { data } = matter(raw);
      const slug = file.replace(/\.md$/, "");
      return { slug, frontmatter: data as Frontmatter };
    }));
    return posts.sort((a, b) =>
      +new Date(b.frontmatter.date || 0) - +new Date(a.frontmatter.date || 0)
    );
  }

  const { blobs } = await list({ prefix: BLOG_BLOB_PREFIX });
  const mdBlobs = blobs.filter(b => b.pathname.endsWith(".md"));
  const posts = await Promise.all(mdBlobs.map(async (b) => {
    const raw = await fetch(b.url, { cache: "no-store" }).then(r => r.text());
    const { data } = matter(raw);
    const filename = b.pathname.slice(BLOG_BLOB_PREFIX.length);
    const slug = filename.replace(/\.md$/, "");
    return { slug, frontmatter: data as Frontmatter };
  }));
  return posts.sort((a, b) =>
    +new Date(b.frontmatter.date || 0) - +new Date(a.frontmatter.date || 0)
  );
}

export async function getPost(slug: string) {
  if (!USE_BLOB) {
    const raw = await fs.readFile(path.join(BLOG_DIR, `\${slug}.md`), "utf8");
    const { data, content } = matter(raw);
    return { slug, frontmatter: data as Frontmatter, html: md.render(content) };
  }

  const urlPath = `\${BLOG_BLOB_PREFIX}\${slug}.md`;
  const { blobs } = await list({ prefix: urlPath });
  const file = blobs.find(b => b.pathname === urlPath);
  if (!file) throw new Error(\`Blob not found: \${urlPath}\`);
  const raw = await fetch(file.url, { cache: "no-store" }).then(r => r.text());
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as Frontmatter, html: md.render(content) };
}
```

---

## Pages (App Router)

**Index page** – `app/blog/page.tsx`:

```tsx
import Link from "next/link";
import { listPosts } from "@/lib/blog";

export const metadata = { title: "Blog" };

export default async function BlogIndex() {
  const posts = await listPosts();
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Blog</h1>
      <ul className="space-y-6">
        {posts.map(p => (
          <li key={p.slug}>
            <Link href={\`/blog/\${p.slug}\`} className="text-lg font-medium hover:underline">
              {p.frontmatter.title ?? p.slug}
            </Link>
            {p.frontmatter.excerpt && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {p.frontmatter.excerpt}
              </p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

**Post page** – `app/blog/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getPost } from "@/lib/blog";

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params) {
  const post = await getPost(params.slug).catch(() => null);
  return {
    title: post?.frontmatter.title ?? params.slug,
    description: post?.frontmatter.excerpt ?? undefined,
  };
}

export default async function PostPage({ params }: Params) {
  const post = await getPost(params.slug).catch(() => null);
  if (!post) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <article className="prose dark:prose-invert">
        <h1>{post.frontmatter.title ?? post.slug}</h1>
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  );
}
```
