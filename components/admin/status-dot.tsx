import { STATUS_DOT, type JobStatus } from "@/lib/admin/constants";
import { cn } from "@/lib/utils";

export function StatusDot({ status, className }: { status: JobStatus; className?: string }) {
  return <span aria-hidden className={cn("inline-block size-2 shrink-0 rounded-full", STATUS_DOT[status], className)} />;
}
