import { REGEXP_ONLY_DIGITS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const CODE_LENGTH = 6;

// The 6-digit email code; pasting a whole code works.
export function CodeInput({ value, onChange, onComplete, disabled }: { value: string; onChange: (v: string) => void; onComplete?: (v: string) => void; disabled?: boolean }) {
    return (
        <InputOTP
            maxLength={CODE_LENGTH}
            pattern={REGEXP_ONLY_DIGITS}
            value={value}
            onChange={onChange}
            onComplete={onComplete}
            disabled={disabled}
            autoFocus
            aria-label="6-digit code"
            containerClassName="justify-center"
        >
            <InputOTPGroup className="gap-2">
                {Array.from({ length: CODE_LENGTH }, (_, i) => (
                    <InputOTPSlot key={i} index={i} className="size-12 rounded-lg border text-lg font-bold first:rounded-lg last:rounded-lg sm:size-13" />
                ))}
            </InputOTPGroup>
        </InputOTP>
    );
}
