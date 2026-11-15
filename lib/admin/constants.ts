export const JOB_STATUSES = ["queued", "applied", "replied", "interview", "offer", "rejected", "skipped", "closed"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const STATUS_LABEL: Record<JobStatus, string> = {
  queued: "To apply",
  applied: "Applied",
  replied: "Replied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  skipped: "Skipped",
  closed: "Closed",
};

export const STATUS_DOT: Record<JobStatus, string> = {
  queued: "bg-marigold",
  applied: "bg-primary",
  replied: "bg-positive",
  interview: "bg-positive",
  offer: "bg-positive",
  rejected: "bg-negative",
  skipped: "bg-muted-foreground/50",
  closed: "bg-muted-foreground/50",
};
