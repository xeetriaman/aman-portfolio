import * as React from "react";

export function Section({ id, title, tag, children }: { id: string; title: string; tag?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 border-t py-12">
      <div className="mb-6 flex flex-wrap items-baseline gap-3">
        <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
        {tag ? <span className="font-mono text-xs text-muted-foreground">{tag}</span> : null}
      </div>
      {children}
    </section>
  );
}
