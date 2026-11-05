import { profile } from "@/data/profile";

const K = ({ children }: { children: string }) => <span className="text-code-key">{children}</span>;
const S = ({ children }: { children: string }) => <span className="text-code-str">{children}</span>;
const N = ({ children }: { children: string }) => <span className="text-code-num">{children}</span>;

export function NotebookCell() {
  return (
    <div className="overflow-hidden rounded-lg border bg-code-bg font-mono text-[13px] leading-7" aria-label="Profile summary written as a notebook cell">
      <div className="flex justify-between border-b px-4 py-2 text-xs text-muted-foreground">
        <span>profile.ipynb</span>
        <span>Python 3</span>
      </div>
      <pre className="overflow-x-auto p-4">
        <span className="text-muted-foreground">In [1]:</span> aman.summary(){"\n"}
        <span className="text-muted-foreground">Out[1]:</span>{"\n"}
        {"{"}<K>&apos;role&apos;</K>:        <S>&apos;Data Analyst / Developer&apos;</S>,{"\n"}
        {" "}<K>&apos;study&apos;</K>:       <S>&apos;Master of Data Science, MQ&apos;</S>,{"\n"}
        {" "}<K>&apos;graduating&apos;</K>:  <S>&apos;Jun 2028&apos;</S>,{"\n"}
        {" "}<K>&apos;internships&apos;</K>: <N>3</N>,{"\n"}
        {" "}<K>&apos;stack&apos;</K>:       [<S>&apos;Python&apos;</S>, <S>&apos;SQL&apos;</S>, <S>&apos;R&apos;</S>, <S>&apos;React&apos;</S>],{"\n"}
        {" "}<K>&apos;based_in&apos;</K>:    <S>{`'${profile.location}'`}</S>,{"\n"}
        {" "}<K>&apos;open_to&apos;</K>:     <S>&apos;internships, grad roles&apos;</S>{"}"}
      </pre>
    </div>
  );
}
