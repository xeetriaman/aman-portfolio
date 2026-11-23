import { type JobStatus } from "@/lib/admin/constants";
import { createClient } from "@/lib/supabase/server";

export { JOB_STATUSES, STATUS_LABEL, type JobStatus } from "@/lib/admin/constants";

export type Job = {
  id: number;
  role: string;
  company: string;
  location: string | null;
  source: string | null;
  link: string;
  apply_url: string | null;
  apply_method: "email" | "quick" | "company";
  posted_on: string | null;
  closes_on: string | null;
  found_on: string;
  status: JobStatus;
  chance: number | null;
  chance_reason: string | null;
  skills: string[];
  missing_skills: string[];
  summary: string | null;
  cover_letter: string | null;
  applied_on: string | null;
  notes: string | null;
};

export type Project = {
  id: number;
  slug: string;
  title: string;
  skill_focus: string[];
  status: "planned" | "analysis" | "published";
  week_of: string;
  repo_url: string | null;
  live_url: string | null;
  summary: string | null;
  resume_bullets: string[];
  interview_notes: string | null;
};

export type Recruiter = {
  id: number;
  name: string;
  firm: string;
  title: string | null;
  email: string | null;
  linkedin: string | null;
  status: "new" | "emailed" | "followed_up" | "replied" | "bounced" | "do_not_contact";
  first_emailed_on: string | null;
  followed_up_on: string | null;
  notes: string | null;
};

export type Course = {
  id: number;
  name: string;
  provider: string;
  total_parts: number;
  done_parts: number;
  target_date: string | null;
};

export type SkillDemand = { skill: string; ads: number; have: boolean };
export type Run = { kind: string; ran_at: string; summary: string | null };

// Every query throws on error so a broken page shows Next's error screen instead of empty data.
function rows<T>({ data, error }: { data: unknown; error: { message: string } | null }): T[] {
  if (error) throw new Error(error.message);
  return (data ?? []) as T[];
}

export async function getJobs(status?: JobStatus[]) {
  let query = (await createClient()).from("jobs").select("*").order("found_on", { ascending: false }).order("chance", { ascending: false, nullsFirst: false });
  if (status) query = query.in("status", status);
  return rows<Job>(await query);
}

export async function getJob(id: number) {
  return rows<Job>(await (await createClient()).from("jobs").select("*").eq("id", id)).at(0) ?? null;
}

export async function getProjects() {
  return rows<Project>(await (await createClient()).from("projects").select("*").order("week_of", { ascending: false }));
}

export async function getRecruiters() {
  return rows<Recruiter>(await (await createClient()).from("recruiters").select("*").order("created_at", { ascending: false }));
}

export async function getCourses() {
  return rows<Course>(await (await createClient()).from("courses").select("*").order("sort"));
}

export async function getSkillDemand() {
  return rows<SkillDemand>(await (await createClient()).from("skill_demand").select("*").order("ads", { ascending: false }).order("skill"));
}

export async function getLastRuns() {
  return rows<Run>(await (await createClient()).from("runs").select("kind, ran_at, summary").order("ran_at", { ascending: false }).limit(20));
}
