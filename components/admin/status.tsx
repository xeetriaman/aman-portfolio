"use client";

import { useState, useTransition } from "react";
import { setJobStatus } from "@/app/admin/actions";
import { Spinner } from "@/components/admin/spinner";
import { StatusDot } from "@/components/admin/status-dot";
import { JOB_STATUSES, STATUS_LABEL, type JobStatus } from "@/lib/admin/constants";
import { cn } from "@/lib/utils";

/** A plain select that saves as soon as the status changes, showing the new status straight away. */
export function StatusSelect({ id, status }: { id: number; status: JobStatus }) {
  const [current, setCurrent] = useState(status);
  const [saving, startSaving] = useTransition();
  const [failed, setFailed] = useState(false);

  function save(next: JobStatus) {
    const previous = current;
    setCurrent(next);
    setFailed(false);
    const form = new FormData();
    form.set("id", String(id));
    form.set("status", next);
    startSaving(async () => {
      try {
        await setJobStatus(form);
      } catch {
        setCurrent(previous);
        setFailed(true);
      }
    });
  }

  return (
    <span className="relative inline-flex items-center">
      <StatusDot status={current} className="pointer-events-none absolute left-3" />
      <select
        value={current}
        aria-label="Application status"
        aria-busy={saving}
        aria-invalid={failed}
        title={failed ? "Couldn't save. Try again." : undefined}
        onChange={(e) => save(e.target.value as JobStatus)}
        className={cn(
          "h-9 cursor-pointer appearance-none rounded-md border bg-background pl-7 pr-8 text-sm font-medium transition-colors hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          saving && "text-muted-foreground",
          failed && "border-negative"
        )}
      >
        {JOB_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      {saving ? (
        <Spinner className="pointer-events-none absolute right-2.5 size-3.5 text-muted-foreground" />
      ) : (
        <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute right-3 size-3 text-muted-foreground">
          <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}
