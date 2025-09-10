import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import markdownItAnchor from "markdown-it-anchor";
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
})
	.use(markdownItAnchor, { slugify: s => s.toLowerCase().replace(/\s+/g, "-") });

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export async function listPosts() {
	await fs.mkdir(BLOG_DIR, { recursive: true });
	const files = await fs.readdir(BLOG_DIR);
	const posts = await Promise.all(
		files.filter((f) => f.endsWith(".md")).map(async (file) => {
			const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
			const { data } = matter(raw);
			const slug = file.replace(/\.md$/, "");
			return { slug, frontmatter: data as Frontmatter };
		})
	);
	return posts.sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date));
}

export async function getPost(slug: string) {
	const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.md`), "utf8");
	const { data, content } = matter(raw);
	const html = md.render(content);
	return { slug, frontmatter: data as Frontmatter, html };
}