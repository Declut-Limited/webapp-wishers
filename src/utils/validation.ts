// Same rules as api-wishers' DTOs, checked before sending.

export const PASSWORD_HINT = "At least 8 characters, with a letter and a number.";

export function passwordError(password: string): string | null {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 64) return "Password must be at most 64 characters";
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Password must contain at least one letter and one number";
    return null;
}

export const errorMessage = (err: unknown, fallback: string) => (err instanceof Error && err.message) || fallback;
