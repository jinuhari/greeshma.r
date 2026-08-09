import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Resume } from "@/lib/data";

interface PrintResumeSearch {
  role?: string;
}

export const Route = createFileRoute("/print-resume")({
  validateSearch: (search: Record<string, unknown>): PrintResumeSearch => ({
    role: typeof search.role === "string" ? search.role : "",
  }),
  component: PrintResume,
});

function PrintResume() {
  const { role } = useSearch({ from: Route.id });
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("gr-resumes");
    if (!raw) return;
    try {
      const resumes: Resume[] = JSON.parse(raw);
      const match = resumes.find((r) => r.role === role);
      if (match) {
        setRoleName(match.role);
        setData(JSON.parse(match.json));
      }
    } catch {
      // ignore
    }
  }, [role]);

  useEffect(() => {
    if (data) {
      setTimeout(() => window.print(), 500);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background font-sans text-muted-foreground">
        <p>Resume not found. Close this tab and try again.</p>
      </div>
    );
  }

  return (
    <div className="print-resume redesign-page p-8 font-sans text-foreground">
      <div className="mx-auto max-w-[210mm]">
        <div className="mb-6 border-b border-border pb-4">
          <h1 className="font-display text-3xl">{data.name || "Name"}</h1>
          <p className="text-base text-muted-foreground">{data.title || ""}</p>
          <p className="mt-1 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">{roleName}</p>
        </div>

        {data.summary && (
          <div className="mb-5">
            <h2 className="eyebrow mb-1">Summary</h2>
            <p className="text-sm leading-relaxed text-foreground">{data.summary}</p>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div className="mb-5">
            <h2 className="eyebrow mb-2">Experience</h2>
            <div className="space-y-4">
              {data.experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-semibold text-foreground">{exp.role}</p>
                    <p className="text-xs text-muted-foreground">{exp.period}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  {exp.highlights && (
                    <ul className="ml-4 mt-1 list-disc text-sm text-foreground">
                      {exp.highlights.map((h: string, j: number) => (
                        <li key={j}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education && data.education.length > 0 && (
          <div className="mb-5">
            <h2 className="eyebrow mb-2">Education</h2>
            <div className="space-y-1">
              {data.education.map((edu: any, i: number) => (
                <p key={i} className="text-sm">
                  <span className="font-medium">{edu.degree}</span>
                  <span className="text-muted-foreground"> - {edu.school}</span>
                  <span className="text-muted-foreground"> ({edu.year})</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {data.skills && data.skills.length > 0 && (
          <div>
            <h2 className="eyebrow mb-2">Skills</h2>
            <p className="text-sm text-foreground">{data.skills.join(" - ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
