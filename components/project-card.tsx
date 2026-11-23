import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/profile";
import { cn } from "@/lib/utils";

const isExternal = (href: string) => !href.startsWith("/");
const linkProps = (href: string) => (isExternal(href) ? { target: "_blank", rel: "noreferrer" } : {});

// One project as a card. The whole card opens its first link; the other links sit above that hit area.
export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const [primary, ...secondary] = project.links ?? [];

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-xl border bg-background p-6 transition duration-300 ease-out",
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-18px_hsl(var(--foreground)/0.25)]",
        "focus-within:border-primary/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        featured && "md:grid md:grid-cols-[1fr_minmax(220px,0.6fr)] md:gap-10 md:p-10"
      )}
    >
      <div className="flex flex-1 flex-col">
        <h3 className={cn("font-bold leading-snug text-balance", featured ? "text-2xl sm:text-3xl" : "text-lg")}>
          {primary ? (
            <a href={primary.href} {...linkProps(primary.href)} className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:underline">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>

        {project.result && (
          <div className={cn(featured && "md:hidden")}>
            <Result result={project.result} />
          </div>
        )}

        <p className={cn("mt-3 leading-relaxed text-muted-foreground", featured ? "max-w-[62ch]" : "line-clamp-4 text-[15px]")}>
          {project.summary}
        </p>

        <ul className="mb-6 mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <li key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
              {s}
            </li>
          ))}
        </ul>

        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm font-semibold">
          {primary && (
            <a href={primary.href} {...linkProps(primary.href)} className="inline-flex items-center gap-1 text-primary">
              {primary.label === "Live demo" ? "Open live demo" : primary.label}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </a>
          )}
          {secondary.map((l) => (
            <a key={l.href} href={l.href} {...linkProps(l.href)} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              {l.label}
            </a>
          ))}
        </div>
      </div>

      {project.result && featured && (
        <div className="hidden flex-col justify-end border-l pl-10 md:flex">
          <Result result={project.result} large />
        </div>
      )}
    </article>
  );
}

function Result({ result, large = false }: { result: NonNullable<Project["result"]>; large?: boolean }) {
  return (
    <p className={cn("flex flex-col", large ? "gap-2" : "mt-4 gap-1")}>
      <span className={cn("font-extrabold tabular-nums tracking-tight text-primary", large ? "text-6xl sm:text-7xl" : "text-4xl")}>
        {result.value}
      </span>
      <span className={cn("text-muted-foreground", large ? "max-w-[26ch] text-[15px]" : "text-sm")}>{result.label}</span>
    </p>
  );
}
