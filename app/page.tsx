import { FileText, Github, Linkedin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { certifications, education, experience, profile, projects, skills } from "@/data/profile";

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-3xl font-extrabold tracking-tight sm:text-4xl">
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        {/* Hero: who, what, and the one action a recruiter needs */}
        <section className="container pb-16 pt-14 sm:pt-20">
          <h1 className="max-w-[17ch] text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.035em] sm:text-6xl md:text-[4.25rem]">
            I analyse data and build the apps that show it.
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {profile.lede}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href={profile.resume} download>
                Download resume
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`mailto:${profile.email}`}>Email me</a>
            </Button>
            <p className="text-[15px] text-muted-foreground sm:ml-3">
              {profile.location}. Open to internships and entry-level roles.
            </p>
          </div>

        </section>

        {/* Projects */}
        <section className="border-t bg-secondary/60 py-20">
          <div className="container">
            <SectionHeading id="projects">Projects</SectionHeading>
            <p className="mt-3 max-w-[60ch] text-muted-foreground">
              Data analysis with live dashboards, and full-stack apps you can try for yourself.
            </p>
            <ul className="mt-10 divide-y border-y">
              {projects.map((p) => (
                <li key={p.title} className="grid gap-5 py-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
                  <div>
                    <h3 className="flex flex-wrap items-center gap-3 text-xl font-bold">
                      {p.title}
                      {p.status === "in-progress" && (
                        <span className="rounded-full border border-marigold px-2.5 py-0.5 text-xs font-semibold">
                          In progress
                        </span>
                      )}
                    </h3>
                    <p className="mt-2 max-w-[62ch] leading-relaxed text-muted-foreground">{p.summary}</p>
                    <p className="mt-3 text-sm font-medium">{p.stack.join(", ")}</p>
                  </div>
                  {p.links && (
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {p.links.map((l, i) => (
                        <Button key={l.href} asChild size="sm" variant={i === 0 ? "default" : "outline"}>
                          <a href={l.href} {...(l.href.startsWith("/") ? {} : { target: "_blank", rel: "noreferrer" })}>
                            {l.label === "Live demo" ? "Open live demo" : l.label}
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Experience */}
        <section className="container py-20">
          <SectionHeading id="experience">Experience</SectionHeading>
          <ol className="mt-10 space-y-10">
            {experience.map((job) => (
              <li key={job.title} className="grid gap-2 md:grid-cols-[200px_1fr] md:gap-10">
                <p className="pt-1 text-[15px] text-muted-foreground">{job.when}</p>
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-muted-foreground">{job.org}</p>
                  <ul className="mt-3 max-w-[66ch] list-disc space-y-1.5 pl-5 leading-relaxed marker:text-primary">
                    {job.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Skills */}
        <section className="border-t py-20">
          <div className="container">
            <SectionHeading id="skills">Skills</SectionHeading>
            <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {skills.map((s) => (
                <div key={s.group}>
                  <dt className="font-bold">{s.group}</dt>
                  <dd className="mt-1.5 leading-relaxed text-muted-foreground">{s.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Education and certifications */}
        <section className="border-t py-20">
          <div className="container grid gap-12 md:grid-cols-2">
            <div>
              <SectionHeading id="education">Education</SectionHeading>
              <ul className="mt-8 space-y-6">
                {education.map((e) => (
                  <li key={e.degree}>
                    <h3 className="text-lg font-bold">{e.degree}</h3>
                    <p className="text-muted-foreground">{e.school}</p>
                    <p className="text-sm text-muted-foreground">{e.when}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Certifications</h2>
              <ul className="mt-8 space-y-3">
                {certifications.map((c) => (
                  <li key={c} className="leading-relaxed">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="container">
            <h2 id="contact" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Hiring for a data or developer role?
            </h2>
            <p className="mt-3 max-w-[55ch] text-lg opacity-90">
              Email is the quickest way to reach me. I'm based in Hurstville, Sydney.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-8 inline-block break-all text-2xl font-bold underline decoration-2 underline-offset-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground sm:text-4xl"
            >
              {profile.email}
            </a>
            <div className="mt-8 flex flex-wrap gap-6 text-[15px] font-semibold">
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
                <Linkedin className="size-4" /> LinkedIn
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
                <Github className="size-4" /> GitHub
              </a>
              <a href={profile.resume} download className="flex items-center gap-2 hover:underline">
                <FileText className="size-4" /> Resume (PDF)
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="container py-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  );
}
