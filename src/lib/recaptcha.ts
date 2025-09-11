declare global {
    interface Window {
        grecaptcha?: {
            ready(cb: () => void): void;
            execute(siteKey: string, opts: { action: string }): Promise<string>;
        };
    }
}

/** Get a reCAPTCHA v3 token for a given action (e.g., "contact"). */
export async function getRecaptchaToken(action = "contact"): Promise<string> {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) throw new Error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set");

    if (!window.grecaptcha) throw new Error("reCAPTCHA script not loaded yet");

    return new Promise<string>((resolve, reject) => {
        window.grecaptcha!.ready(async () => {
            try {
                const token = await window.grecaptcha!.execute(siteKey, { action });
                resolve(token);
            } catch (err) {
                reject(err);
            }
        });
    });
}
