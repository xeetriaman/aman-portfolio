"use client";

import { useRef } from "react";
import { setJobStatus } from "@/app/admin/actions";
import { JOB_STATUSES, STATUS_LABEL, type JobStatus } from "@/lib/admin/constants";
import { StatusDot } from "@/components/admin/status-dot";

/** A plain select that saves as soon as the status changes. */
export function StatusSelect({ id, status }: { id: number; status: JobStatus }) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <form ref={form} action={setJobStatus} className="relative inline-flex items-center">
      <input type="hidden" name="id" value={id} />
      <StatusDot status={status} className="pointer-events-none absolute left-3" />
      <select
        name="status"
        defaultValue={status}
        aria-label="Application status"
        onChange={() => form.current?.requestSubmit()}
        className="h-9 cursor-pointer appearance-none rounded-md border bg-background pl-7 pr-8 text-sm font-medium hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {JOB_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute right-3 size-3 text-muted-foreground">
        <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </form>
  );
}
