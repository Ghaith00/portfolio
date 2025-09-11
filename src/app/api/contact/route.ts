import { makeTransport } from "./mailer";
import { z } from "zod";
import { ErrLike, RecaptchaResponse } from "./types";


export const runtime = "nodejs";

const ContactSchema = z.object({
    name: z.string().min(1).max(200),
    email: z.string().email(),
    message: z.string().min(10).max(5000),
    website: z.string().optional(),          // honeypot (should be hidden)
    recaptchaToken: z.string().optional(),   // v3 token from client
});

async function verifyRecaptcha(token?: string, remoteIp?: string | null) {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) return { ok: true as const, reason: "recaptcha_not_configured" };

    if (!token) return { ok: false as const, reason: "missing_token" };

    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);

    const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
    });
    const data = (await r.json()) as RecaptchaResponse;
    const score = data.score ?? 0;
    const ok = data.success && score >= Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.5);
    return { ok: !!ok, score, reason: ok ? "ok" : "low_score_or_failed" };
}

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const parsed = ContactSchema.parse(json);

        // Honeypot: bots often fill hidden fields
        if (parsed.website) return new Response("ok", { status: 200 });

        // Verify reCAPTCHA if configured
        const remoteIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
        const recaptcha = await verifyRecaptcha(parsed.recaptchaToken, remoteIp);
        if (!recaptcha.ok) {
            return Response.json(
                { ok: false, error: "recaptcha_failed", reason: recaptcha.reason },
                { status: 400 }
            );
        }

        const transporter = makeTransport();

        // Owner notification (uses emails/owner-notice.hbs)
        transporter.sendMail({
            from: process.env.CONTACT_FROM || `"Contact" <${process.env.SMTP_USER!}>`,
            to: process.env.CONTACT_TO!,
            subject: `New contact: ${parsed.name}`,
            template: "owner-notice",
            context: {
                name: parsed.name,
                email: parsed.email,
                message: parsed.message,
            },
            replyTo: parsed.email,
        });

        // Auto-reply (uses emails/contact-reply.hbs)
        transporter.sendMail({
            from: process.env.CONTACT_FROM || `"Contact" <${process.env.SMTP_USER!}>`,
            to: parsed.email,
            subject: "Thanks! Let’s connect",
            template: "contact-reply",
            context: {
                name: parsed.name,
                calendly: process.env.CALENDLY_URL,
            },
        });

        return Response.json({ ok: true });
    } catch (err: unknown) {
        console.error(err);
        const error: ErrLike = err as ErrLike;
        const msg = error?.issues?.[0]?.message || error?.message || "Bad request";
        return Response.json({ ok: false, error: msg }, { status: 400 });
    }
}
