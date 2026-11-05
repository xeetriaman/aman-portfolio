import { ArrowUpRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { NotebookCell } from "@/components/notebook-cell";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { certifications, education, experience, profile, projects, skills } from "@/data/profile";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="container">
        {/* Hero */}
        <div className="grid items-center gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-wider text-crimson">{profile.role}</p>
            <h1 className="mt-3 font-display text-5xl font-extrabold leading-none tracking-tight sm:text-6xl md:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{profile.lede}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href={profile.resume} download>
                  <Download /> Download resume
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  <Github /> GitHub
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin /> LinkedIn
                </a>
              </Button>
            </div>
          </div>
          <div className="min-w-0">
            <NotebookCell />
          </div>
        </div>

        <Section id="about" title="About">
          <p className="max-w-[65ch] leading-relaxed">{profile.about}</p>
        </Section>

        <Section id="skills" title="Skills">
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((s) => (
              <div key={s.group}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.group}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map((i) => (
                    <Badge key={i}>{i}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience" tag={`${experience.length} internships`}>
          <ol className="grid gap-8">
            {experience.map((job) => (
              <li key={job.title} className="grid gap-1 sm:grid-cols-[150px_1fr] sm:gap-6">
                <span className="pt-0.5 font-mono text-sm text-muted-foreground">{job.when}</span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="mb-2 text-muted-foreground">{job.org}</p>
                  <ul className="grid list-disc gap-1 pl-5">
                    {job.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="projects" title="Projects" tag="github.com/xeetriaman">
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <Card key={p.title} className={p.status === "in-progress" ? "flex flex-col border-dashed bg-transparent" : "flex flex-col"}>
                <CardHeader>
                  {p.status === "in-progress" ? (
                    <Badge variant="status" className="self-start">In progress</Badge>
                  ) : null}
                  <CardTitle>{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <p className="text-[15px] text-muted-foreground">{p.summary}</p>
                  <p className="font-mono text-xs text-brand">{p.stack.join(" · ")}</p>
                </CardContent>
                {p.links && p.links.length > 0 ? (
                  <CardFooter>
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-brand underline-offset-4 hover:underline">
                        {l.label} <ArrowUpRight className="size-3.5" />
                      </a>
                    ))}
                  </CardFooter>
                ) : null}
              </Card>
            ))}
          </div>
        </Section>

        <Section id="education" title="Education">
          <div className="grid gap-6 sm:grid-cols-2">
            {education.map((e) => (
              <div key={e.degree}>
                <h3 className="font-semibold">{e.degree}</h3>
                <p className="text-muted-foreground">{e.school}</p>
                <p className="font-mono text-sm text-muted-foreground">{e.when}</p>
              </div>
            ))}
          </div>
          <ul className="mt-6 grid list-disc gap-1 pl-5">
            {certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Section>

        <Section id="contact" title="Contact">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
              { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/amanchhetri7", href: profile.linkedin },
              { icon: Github, label: "GitHub", value: "github.com/xeetriaman", href: profile.github },
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="rounded-lg border bg-card p-4 transition-colors hover:border-brand"
              >
                <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <Icon className="size-3.5" /> {label}
                </span>
                <span className="mt-1 block break-all">{value}</span>
              </a>
            ))}
          </div>
        </Section>
      </main>
      <footer className="border-t">
        <div className="container py-8 text-sm text-muted-foreground">© {new Date().getFullYear()} Aman Chhetri · Sydney, Australia</div>
      </footer>
    </>
  );
}
