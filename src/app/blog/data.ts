import path from "node:path";
import fs from "node:fs/promises";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import hljs from "highlight.js";
import { Frontmatter } from "./types";


const BLOG_DIR = path.join(process.cwd(), "content", "blog");

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

export async function listPosts() {
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

export async function getPost(slug: string) {
	// Local filesystem
	const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.md`), "utf8");
	const { data, content } = matter(raw);
	const html = md.render(content);
	return { slug, frontmatter: data as Frontmatter, html };
}
