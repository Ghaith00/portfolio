import { getRecaptchaToken } from "@/lib/recaptcha";
import React, { createContext, useContext, useState } from "react";
import { ContactContextValue, Status } from "./types";


const ContactContext = createContext<ContactContextValue | undefined>(undefined);

export function ContactProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg(null);

        const form = e.currentTarget;

        try {
            const fd = new FormData(form);
            const token = await getRecaptchaToken("contact");

            const body = {
                name: String(fd.get("name") ?? ""),
                email: String(fd.get("email") ?? ""),
                message: String(fd.get("message") ?? ""),
                website: String(fd.get("website") ?? ""), // honeypot
                recaptchaToken: token,
            };

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setStatus("error");
                setErrorMsg(
                    data?.error === "recaptcha_failed"
                        ? "Bot check failed. Please refresh and try again."
                        : data?.error || "Something went wrong. Please try again."
                );
                return;
            }

            setStatus("ok");
            form.reset();

            setTimeout(() => setStatus("idle"), 4000);
        } catch {
            setStatus("error");
            setErrorMsg("Network error. Please try again.");
        }
    }

    return (
        <ContactContext.Provider value={{ status, errorMsg, handleSubmit }}>
            {children}
        </ContactContext.Provider>
    );
}

export function useContact() {
    const ctx = useContext(ContactContext);
    if (!ctx) throw new Error("useContact must be used within a ContactProvider");
    return ctx;
}
