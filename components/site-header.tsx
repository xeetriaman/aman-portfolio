import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <a href="#top" className="text-lg font-extrabold tracking-tight">
          {profile.name}
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-6 text-[15px] text-muted-foreground md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Button asChild size="sm">
            <a href={profile.resume} download>
              Resume
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
