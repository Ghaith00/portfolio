"use client";
import ContactForm from "./ContactForm";
import React from "react";
import { FiLoader, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { useContact } from "./ContactContext";


export default function ContactPage() {
    const { status, errorMsg, handleSubmit } = useContact();

    return (
        <div className="relative">
            {/* Loading overlay */}
            {status === "loading" && (
                <div
                    className="absolute inset-0 z-10 rounded-lg bg-black/5 dark:bg-white/5 backdrop-blur-[2px] flex items-center justify-center"
                    aria-live="polite"
                    aria-busy="true"
                >
                    <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-200">
                        <FiLoader className="animate-spin text-xl" />
                        <span>Sending your message…</span>
                    </div>
                </div>
            )}

            {/* Form (dim when loading) */}
            <div className={status === "loading" ? "opacity-60 pointer-events-none" : ""}>
                <ContactForm handleSubmit={handleSubmit} />
            </div>

            {/* Alerts */}
            <div className="mt-4 space-y-3" aria-live="polite">
                {status === "ok" && (
                    <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200">
                        <FiCheckCircle className="mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium">Message sent</p>
                            <p className="text-xs opacity-80">
                                Thanks! Please check your inbox—if you don&apos;t see it, look in spam.
                            </p>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                        <FiAlertTriangle className="mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium">Couldn&apos;t send your message</p>
                            <p className="text-xs opacity-80">{errorMsg ?? "Please try again in a moment."}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
