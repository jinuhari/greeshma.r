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
  const [latex, setLatex] = useState("");
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("gr-resumes");
    if (!raw) return;
    try {
      const resumes: Resume[] = JSON.parse(raw);
      const match = resumes.find((r) => r.role === role);
      if (match) {
        setRoleName(match.role);
        setLatex(match.latex);
      }
    } catch {
      // ignore
    }
  }, [role]);

  useEffect(() => {
    if (latex) {
      setTimeout(() => window.print(), 500);
    }
  }, [latex]);

  if (!latex) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-sans text-gray-600">
        <p>Resume not found. Close this tab and try again.</p>
      </div>
    );
  }

  const lines = latex.split("\n");

  const rendered = lines.map((line, i) => {
    const t = line.trim();
    if (!t) return <div key={i} className="h-2" />;

    if (t.startsWith("\\section*{")) {
      const title = t.replace("\\section*{", "").replace("}", "").trim();
      return <h2 key={i} className="mt-5 mb-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-500 first:mt-0">{title}</h2>;
    }

    if (t.startsWith("{\\Huge\\bfseries ")) {
      const name = t.replace("{\\Huge\\bfseries ", "").replace("}", "").trim();
      return <h1 key={i} className="text-center text-2xl font-bold">{name}</h1>;
    }

    if (t.startsWith("{\\large ")) {
      const title = t.replace("{\\large ", "").replace("}", "").trim();
      return <p key={i} className="text-center text-sm text-gray-500">{title}</p>;
    }

    const boldMatch = t.match(/^\\textbf\{(.+?)\}\s*\\hfill\s*(.+?)\s*\\\\$/);
    if (boldMatch) {
      return (
        <div key={i} className="flex items-baseline justify-between text-sm">
          <span className="font-semibold">{boldMatch[1]}</span>
          <span className="text-xs text-gray-500">{boldMatch[2]}</span>
        </div>
      );
    }

    const companyMatch = t.match(/^([A-Za-z].+?)\s*\\\\$/);
    if (companyMatch && !t.startsWith("\\")) {
      return <p key={i} className="text-sm text-gray-600">{companyMatch[1]}</p>;
    }

    if (t.startsWith("\\item ")) {
      return <li key={i} className="ml-4 text-sm text-gray-700 list-disc">{t.replace("\\item ", "")}</li>;
    }

    if (t.startsWith("\\begin{itemize}")) {
      return <ul key={i} className="mt-1 space-y-0.5" />;
    }

    if (t.startsWith("\\end{itemize}") || t.startsWith("\\begin{center}") || t.startsWith("\\end{center}")) {
      return null;
    }

    const eduMatch = t.match(/^\\textbf\{(.+?)\}\s*\\hfill\s*(.+?)\s*$/);
    if (eduMatch) {
      return (
        <p key={i} className="text-sm">
          <span className="font-medium">{eduMatch[1]}</span>
          <span className="text-gray-500"> \u2014 {eduMatch[2]}</span>
        </p>
      );
    }

    const schoolMatch = t.match(/^([A-Za-z].+?)$/);
    if (schoolMatch && !t.startsWith("\\") && !t.startsWith("\\rule")) {
      return <p key={i} className="text-sm text-gray-600">{schoolMatch[1]}</p>;
    }

    if (t.startsWith("\\rule{")) {
      return <hr key={i} className="my-4 border-gray-300" />;
    }

    return null;
  });

  return (
    <div className="bg-white font-sans text-gray-900">
      <div className="mx-auto max-w-[210mm] p-8">
        <div className="mb-4">
          {rendered}
        </div>
        <div className="mt-8 text-center">
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(latex)}`}
            download={`resume-${roleName.toLowerCase().replace(/[\s\/]+/g, "-")}.tex`}
            className="inline-block rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Download .tex source
          </a>
        </div>
      </div>
    </div>
  );
}
