export type Status = "idle" | "loading" | "ok" | "error";

export interface ContactContextValue {
    status: Status;
    errorMsg: string | null;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}