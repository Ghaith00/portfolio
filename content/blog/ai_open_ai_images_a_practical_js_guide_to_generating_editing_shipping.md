---
title: "OpenAI Images: A Practical JS Guide to Generating, Editing & Shipping"
date: "2025-07-02"
tags: ["nodejs", "OpenAI"]
excerpt: "Kicking off my blog with a tiny Markdown‑powered setup."
---


> This is a **JavaScript‑first, production‑minded** guide for generating and editing images with OpenAI’s API. You’ll go from zero → first image, then level up to transparent PNGs, image edits with masks, and a sane deployment pattern. Examples target **Node 18+** using the official `openai` SDK.

---

## TL;DR
- Use model **`gpt-image-1`** with the **Images API** for high‑quality generation and editing.
- Return **`b64_json`** (default) and save to disk, or request a **`url`** (ephemeral ~60 min) and download it.
- For **transparent backgrounds**, request `output_format: "png"` and set `background: "transparent"` (or mention it in the prompt).
- For **image edits**, send `image` (and optional `mask`) along with a full prompt describing the final scene.
- Never ship API keys to the browser. Serve images through a small backend that calls OpenAI.

---

## 1) Setup
Install and configure the official SDK:

```bash
npm i openai
```

Create `.env` and set your key (never hardcode):

```bash
OPENAI_API_KEY="sk-..."
```

Bootstrap a client in Node:

```js
// lib/openai.js
import OpenAI from "openai";
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

---

## 2) Your first image (Node, 10 lines)

```js
import { writeFileSync } from "node:fs";
import { openai } from "./lib/openai.js";

const res = await openai.images.generate({
  model: "gpt-image-1",
  prompt: "isometric 3D city at dusk, neon signs, rainy streets, cinematic lighting",
  size: "1024x1024" // try 1024x1536 or 1536x1024 too
});

const b64 = res.data[0].b64_json; // default response format
writeFileSync("city.png", Buffer.from(b64, "base64"));
```

**Tip:** If you prefer a direct link, pass `response_format: "url"` and then download the file server‑side.

---

## 3) Transparent PNGs (stickers, die‑cuts, UI assets)
Two knobs matter: **format** and **background**.

```js
const res = await openai.images.generate({
  model: "gpt-image-1",
  prompt: "flat vector sticker of a corgi astronaut, thick white stroke, transparent background",
  size: "1024x1024",
  output_format: "png",
  background: "transparent" // explicit; also inferred if you say it in the prompt
});
```

**Pro tip:** PNG/WEBP support alpha. JPEG does **not**; you’ll lose transparency.

---

## 4) Control quality, size & compression
Useful params to keep handy:

- `quality`: `low` | `medium` | `high` | `auto` (default)
- `size`: `1024x1024` | `1536x1024` (portrait) | `1024x1536` (landscape) | `auto`
- `output_format`: `png` | `jpeg` | `webp`
- `output_compression`: `0–100` (affects JPEG/WEBP size)

```js
const res = await openai.images.generate({
  model: "gpt-image-1",
  prompt: "studio ghibli style poster of ocean whales, educational, clean typography",
  size: "1024x1536",
  quality: "high",
  output_format: "jpeg",
  output_compression: 80
});
```

---

## 5) Image‑to‑image & edits (with optional mask)
Send **reference images** to guide style/layout, and optionally a **mask** to limit where changes happen. The prompt should still describe the **entire** final image.

```js
import fs from "node:fs";

const res = await openai.images.edit({
  model: "gpt-image-1",
  // one or more reference images (max ~10)
  image: [
    fs.createReadStream("./input/product.png"),
    fs.createReadStream("./input/background.jpg")
  ],
  // Optional: apply changes only where mask is transparent
  mask: fs.createReadStream("./input/mask.png"),
  prompt: "compose a polished ecommerce hero: the product centered on a soft studio backdrop, subtle shadow, add clean headline text top-left",
  size: "1024x1024",
  output_format: "png"
});
```

**Mask rules:**
- Must match the **exact dimensions** of the first `image`.
- **Transparent** pixels = regions to change; opaque = keep.
- Include an **alpha channel** (RGBA) or it’ll be ignored.

---

## 6) Browser vs server: the safe architecture
**Never** expose your API key in the browser. A simple pattern:

1. Frontend POST → `/api/images` with `{ prompt, size, options }`.
2. Your Node server calls `openai.images.generate(...)`.
3. Server returns a **signed CDN URL** or directly streams the image bytes.

This keeps keys off the client, lets you add **business rules** (size caps, prompt filters), and enables caching.

---

## 7) Prompt patterns that work
- **Camera & lens**: “35mm, shallow depth of field, rim light”
- **Composition**: “rule of thirds, negative space for copy top‑left”
- **Material & finish**: “brushed aluminum, subsurface scattering, volumetric fog”
- **Style words**: “art deco poster”, “pixel‑art”, “photoreal, color‑graded”
- **Constraints**: “no watermark, clean background, packshot, centered”

Write like a creative brief; short bullets beat a single long sentence.

---

## 8) Caching, costs & performance
- **Token‑based pricing**: text in, image in, image out. Generation cost scales with **quality** and **size**.
- **Cache** repeated prompts (hash normalized prompts + params) and store the resulting asset; re‑use on your CDN.
- For **thumbnails**, generate once at full res, then **downscale** yourself. Don’t pay for multiple sizes.
- Constrain throughput: queue requests and set a per‑user rate to avoid surprises.

---

## 9) Error handling & troubleshooting
- **400 / invalid image**: check mask dimensions and alpha channel.
- **403 / org not verified**: verify the API org and model access.
- **429 / rate limits**: exponential backoff; trim concurrency.
- **URL expired**: URLs are short‑lived—download and persist immediately.
- **Inconsistent edits**: strengthen your prompt and simplify the mask edges.

---

## 10) Policy & safety quick‑check
- The Images API enforces content safety. If a prompt is blocked, surface a **friendly message** and offer a safer reword.
- You can opt between standard and less restrictive moderation (e.g., `moderation: "auto" | "low"`). Choose wisely for your UX.
- Respect third‑party IP: avoid prompts that could generate trademarked logos or celebrity likeness without permission.

---

## 11) Minimal Express endpoint

```js
// server/images.route.js
import { Router } from "express";
import { openai } from "../lib/openai.js";

export const router = Router();

router.post("/generate", async (req, res) => {
  const { prompt, size = "1024x1024" } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });
  try {
    const out = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size,
      output_format: "png"
    });
    const b64 = out.data[0].b64_json;
    res.status(200).json({ b64 }); // or stream Buffer.from(b64, 'base64')
  } catch (err) {
    res.status(500).json({ error: err?.message || "Image generation failed" });
  }
});
```

---

## 12) Production checklist
- [ ] Keep keys server‑side; rotate regularly; least‑privilege secrets.
- [ ] Normalize prompts + params; dedupe with a cache key.
- [ ] Enforce size/quality caps per user/plan.
- [ ] Store a **source of truth** (S3/GCS) + serve via CDN.
- [ ] Log prompt + model + image hash for auditability.
- [ ] Add retries with jitter; monitor latency & failure rates.

---

## 13) Quick reference (copy, tweak, ship)

**Generate**
```js
openai.images.generate({ model: "gpt-image-1", prompt, size: "1024x1024" });
```

**Transparent PNG**
```js
openai.images.generate({ model: "gpt-image-1", prompt, output_format: "png", background: "transparent" });
```

**Edit with mask**
```js
openai.images.edit({ model: "gpt-image-1", image, mask, prompt, size: "1024x1024" });
```

**Return URL instead of b64**
```js
openai.images.generate({ model: "gpt-image-1", prompt, response_format: "url" });
```

---

### You’re ready to build
Start on **Fuji** or a staging environment, keep everything behind a server, and iterate on prompts like you would a creative brief. When the assets look right and the numbers make sense, push to production.

