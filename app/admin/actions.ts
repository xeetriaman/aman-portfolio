"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { JOB_STATUSES, type JobStatus } from "@/lib/admin/constants";
import { createClient } from "@/lib/supabase/server";

export async function setJobStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as JobStatus;
  if (!Number.isInteger(id) || !JOB_STATUSES.includes(status)) throw new Error("Invalid job update");

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });
  const update = status === "applied" ? { status, applied_on: today } : { status };
  const { error } = await (await createClient()).from("jobs").update({ ...update, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

export async function stepCourse(formData: FormData) {
  const id = Number(formData.get("id"));
  const done = Number(formData.get("done"));
  if (!Number.isInteger(id) || !Number.isInteger(done)) throw new Error("Invalid course update");

  // The table's check constraint rejects values outside 0..total_parts.
  const { error } = await (await createClient()).from("courses").update({ done_parts: done }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

export async function signOut() {
  await (await createClient()).auth.signOut();
  redirect("/admin/login");
}
