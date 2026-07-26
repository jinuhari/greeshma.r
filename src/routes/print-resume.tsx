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
      <div className="flex min-h-screen items-center justify-center bg-white font-sans text-gray-600">
        <p>Resume not found. Close this tab and try again.</p>
      </div>
    );
  }

  return (
    <div className="print-resume bg-white p-8 font-sans text-gray-900">
      <div className="mx-auto max-w-[210mm]">
        <div className="mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold">{data.name || "Name"}</h1>
          <p className="text-base text-gray-600">{data.title || ""}</p>
          <p className="mt-1 text-sm text-gray-500">{roleName}</p>
        </div>

        {data.summary && (
          <div className="mb-5">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">Summary</h2>
            <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div className="mb-5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Experience</h2>
            <div className="space-y-4">
              {data.experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-semibold">{exp.role}</p>
                    <p className="text-xs text-gray-500">{exp.period}</p>
                  </div>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  {exp.highlights && (
                    <ul className="ml-4 mt-1 list-disc text-sm text-gray-700">
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
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Education</h2>
            <div className="space-y-1">
              {data.education.map((edu: any, i: number) => (
                <p key={i} className="text-sm">
                  <span className="font-medium">{edu.degree}</span>
                  <span className="text-gray-600"> — {edu.school}</span>
                  <span className="text-gray-500"> ({edu.year})</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {data.skills && data.skills.length > 0 && (
          <div>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Skills</h2>
            <p className="text-sm text-gray-700">{data.skills.join(" · ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
