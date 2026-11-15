"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/admin/spinner";
import { cn } from "@/lib/utils";

/** A form button that shows a spinner and locks itself while its server action runs. */
export function SubmitButton({ className, children, disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  return (
    <button {...props} disabled={disabled || pending} aria-busy={pending} className={cn("relative", className)}>
      <span className={cn("contents", pending && "invisible")}>{children}</span>
      {pending && <Spinner className="absolute inset-0 m-auto" />}
    </button>
  );
}
