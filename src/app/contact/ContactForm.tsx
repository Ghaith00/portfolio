"use client";
import React from "react";


export default function ContactForm({ handleSubmit } : { handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
    return (
        <form
            className="rounded-2xl border p-5 bg-white/70 dark:bg-zinc-900/50 border-gray-200 backdrop-blur flex flex-col"
            onSubmit={handleSubmit}
        >
            <div className="grid gap-3">
                <input
                    name="name"
                    placeholder="Your name"
                    className="rounded-xl border px-3 py-2 border-gray-200"
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Your email"
                    className="rounded-xl border px-3 py-2 border-gray-200"
                    required
                />
                <textarea
                    name="message"
                    placeholder="Tell me about your project…"
                    rows={5}
                    className="rounded-xl border px-3 py-2 border-gray-200"
                    required
                />
                <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                <button
                    type="submit"
                    className="rounded-xl border px-4 py-2 text-sm font-medium hover:shadow-md border-gray-200"
                >
                    Send
                </button>
            </div>
        </form>
    );
}
