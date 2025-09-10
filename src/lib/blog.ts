import path from "node:path";
import fs from "node:fs/promises";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import hljs from "highlight.js";
import { list } from "@vercel/blob";
import { Frontmatter } from "./types";


const md = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
	highlight: (str, lang) => {
		if (lang && hljs.getLanguage(lang)) {
			try {
				const out = hljs.highlight(str, { language: lang }).value;
				return `<pre><code class="hljs language-${lang}">${out}</code></pre>`;
			} catch { }
		}
		const auto = hljs.highlightAuto(str).value;
		return `<pre><code class="hljs">${auto}</code></pre>`;
	},
}).use(markdownItAnchor, { slugify: s => s.toLowerCase().replace(/\s+/g, "-") });

// ENV=dev  => local (default)
// ENC=prod => blob (also supports ENV=prod)
const MODE = (process.env.ENC ?? process.env.ENV ?? "").toLowerCase();
const USE_BLOB = MODE === "prod";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const BLOG_BLOB_PREFIX = (process.env.BLOG_BLOB_PREFIX || "blog/").replace(/^\/+/, ""); // e.g. "blog/"

/* ---------- Public API ---------- */
export async function listPosts() {
	if (!USE_BLOB) {
		// Local filesystem
		await fs.mkdir(BLOG_DIR, { recursive: true });
		const files = (await fs.readdir(BLOG_DIR)).filter(f => f.endsWith(".md"));

		const posts = await Promise.all(
			files.map(async (file) => {
				const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
				const { data } = matter(raw);
				const slug = file.replace(/\.md$/, "");
				return { slug, frontmatter: data as Frontmatter };
			})
		);

		return posts.sort((a, b) =>
			+new Date(b.frontmatter.date || 0) - +new Date(a.frontmatter.date || 0)
		);
	}

	// Blob (prod)
	const { blobs } = await list({ prefix: BLOG_BLOB_PREFIX });
	const mdBlobs = blobs.filter(b => b.pathname.endsWith(".md"));

	const posts = await Promise.all(
		mdBlobs.map(async (b) => {
			const raw = await fetch(b.url, { cache: "no-store" }).then(r => r.text());
			const { data } = matter(raw);
			const filename = b.pathname.slice(BLOG_BLOB_PREFIX.length); // remove prefix
			const slug = filename.replace(/\.md$/, "");
			return { slug, frontmatter: data as Frontmatter };
		})
	);

	return posts.sort((a, b) =>
		+new Date(b.frontmatter.date || 0) - +new Date(a.frontmatter.date || 0)
	);
}

export async function getPost(slug: string) {
	if (!USE_BLOB) {
		// Local filesystem
		const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.md`), "utf8");
		const { data, content } = matter(raw);
		const html = md.render(content);
		return { slug, frontmatter: data as Frontmatter, html };
	}

	// Blob (prod)
	const urlPath = `${BLOG_BLOB_PREFIX}${slug}.md`;
	const { blobs } = await list({ prefix: urlPath });
	const file = blobs.find(b => b.pathname === urlPath);
	if (!file) throw new Error(`Blob not found: ${urlPath}`);

	const raw = await fetch(file.url, { cache: "no-store" }).then(r => r.text());
	const { data, content } = matter(raw);
	const html = md.render(content);
	return { slug, frontmatter: data as Frontmatter, html };
}
