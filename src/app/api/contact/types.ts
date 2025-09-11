export type RecaptchaResponse = {
    success: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
};

export type IssueLike = { message?: string };
export type ErrorWithIssues = { issues?: IssueLike[]; message?: string };
export type ErrLike = ErrorWithIssues;
