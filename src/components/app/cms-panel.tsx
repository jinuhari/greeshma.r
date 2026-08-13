import { useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { syncAllToSanity, uploadImage } from "@/sanity/lib/mutations";
import type { CaseStudy, CaseStudySection, Outcome, SectionType } from "@/lib/cms";
import type { ArchiveItem, TimelineItem, Resume } from "@/lib/data";

type Tab = "works" | "archive" | "experience" | "resumes";

export function CmsPanel({
  works,
  setWorks,
  archive,
  setArchive,
  timeline,
  setTimeline,
  resumes,
  setResumes,
  onRefresh,
  onClose,
}: {
  works: CaseStudy[];
  setWorks: (w: CaseStudy[]) => void;
  archive: ArchiveItem[];
  setArchive: (a: ArchiveItem[]) => void;
  timeline: TimelineItem[];
  setTimeline: (t: TimelineItem[]) => void;
  resumes: Resume[];
  setResumes: (r: Resume[]) => void;
  onRefresh?: () => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("works");
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [newBucketName, setNewBucketName] = useState("");
  const [dragSlug, setDragSlug] = useState<string | null>(null);
  const [dragOverBucket, setDragOverBucket] = useState<string | null>(null);
  const [customBuckets, setCustomBuckets] = useState<string[]>([]);
  const [renamingBucket, setRenamingBucket] = useState<string | null>(null);
  const [renameBucketName, setRenameBucketName] = useState("");

  const availableCategories = useMemo(
    () =>
      Array.from(
        new Set(
          works.flatMap((work) =>
            (work.categories || []).map((category) => category.trim()).filter(Boolean),
          ),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [works],
  );

  const allCategories = useMemo(
    () => Array.from(new Set([...availableCategories, ...customBuckets])).sort((a, b) => a.localeCompare(b)),
    [availableCategories, customBuckets],
  );

  const getPrimaryCategory = (work: CaseStudy) =>
    (work.categories || []).map((category) => category.trim()).filter(Boolean)[0] || "";

  const worksByBucket = useMemo(() => {
    const grouped: Record<string, CaseStudy[]> = { Uncategorized: [] };
    allCategories.forEach((category) => {
      grouped[category] = [];
    });

    works.forEach((work) => {
      const primary = getPrimaryCategory(work);
      if (!primary) {
        grouped.Uncategorized.push(work);
        return;
      }
      if (!grouped[primary]) grouped[primary] = [];
      grouped[primary].push(work);
    });

    return grouped;
  }, [allCategories, works]);

  const assignToBucket = (slug: string, bucket: string | null) => {
    setWorks(
      works.map((work) =>
        work.slug === slug
          ? {
              ...work,
              categories: bucket ? [bucket] : [],
            }
          : work,
      ),
    );
    if (editing?.slug === slug) {
      setEditing((prev) => (prev ? { ...prev, categories: bucket ? [bucket] : [] } : prev));
    }
  };

  const addBucket = () => {
    const name = newBucketName.trim();
    if (!name) return;
    if (allCategories.includes(name)) {
      setNewBucketName("");
      return;
    }
    setCustomBuckets((prev) => [...prev, name]);
    setNewBucketName("");
  };

  const removeBucket = (bucket: string) => {
    setWorks(
      works.map((work) => {
        if (!work.categories?.includes(bucket)) return work;
        return { ...work, categories: work.categories.filter((category) => category !== bucket) };
      }),
    );
    setCustomBuckets((prev) => prev.filter((category) => category !== bucket));
  };

  const startBucketRename = (bucket: string) => {
    if (bucket === "Uncategorized") return;
    setRenamingBucket(bucket);
    setRenameBucketName(bucket);
  };

  const commitBucketRename = () => {
    if (!renamingBucket) return;
    const nextName = renameBucketName.trim();

    if (!nextName || nextName === renamingBucket) {
      setRenamingBucket(null);
      setRenameBucketName("");
      return;
    }

    if (allCategories.includes(nextName)) {
      setRenamingBucket(null);
      setRenameBucketName("");
      return;
    }

    setWorks(
      works.map((work) => ({
        ...work,
        categories: (work.categories || []).map((category) =>
          category === renamingBucket ? nextName : category,
        ),
      })),
    );
    setCustomBuckets((prev) => prev.map((category) => (category === renamingBucket ? nextName : category)));
    setRenamingBucket(null);
    setRenameBucketName("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await syncAllToSanity(works, archive, timeline, resumes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onRefresh?.();
    } catch (e: any) {
      setError(e?.message || "Save failed. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const updateWork = (i: number, patch: Partial<CaseStudy>) => {
    const next = [...works];
    next[i] = { ...next[i], ...patch };
    setWorks(next);
    if (editing && editing.slug === next[i].slug) setEditing(next[i]);
  };

  return (
    <div
      className="cms-panel fixed inset-0 z-[80] flex bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        style={{ margin: "4vh auto", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl">CMS</h2>
            <div className="flex gap-1 rounded-full border border-border p-0.5">
              {(["works", "archive", "experience", "resumes"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setEditing(null);
                  }}
                  className={`rounded-full px-4 py-1 text-xs tracking-wide transition-all ${
                    tab === t ? "bg-foreground text-background" : "hover:bg-muted"
                  }`}
                >
                  {t === "works"
                    ? "Case Studies"
                    : t === "archive"
                      ? "Archive"
                      : t === "experience"
                        ? "Experience"
                        : "Resumes"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-foreground px-4 py-1.5 text-xs text-background transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {saving ? "Saving..." : saved ? "Saved \u2713" : "Save to Sanity"}
            </button>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-3 rounded-md bg-red-50 px-4 py-2 text-xs text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "works" &&
            (editing ? (
              <WorkEditor
                work={editing}
                availableCategories={allCategories}
                onChange={(p) => {
                  const idx = works.findIndex((w) => w.slug === editing.slug);
                  if (idx !== -1) updateWork(idx, p);
                }}
                onBack={() => setEditing(null)}
              />
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    {works.length} case studies · {allCategories.length} categories
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      value={newBucketName}
                      onChange={(e) => setNewBucketName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addBucket();
                        }
                      }}
                      placeholder="New category bucket"
                      className="w-40"
                    />
                    <button
                      onClick={addBucket}
                      className="rounded-md border border-border px-3 py-1 text-[10px] tracking-wide hover:bg-muted"
                    >
                      + Category
                    </button>
                    <button
                      onClick={() => {
                        const n = String(works.length + 1).padStart(2, "0");
                        const cs: CaseStudy = {
                          slug: `case-${Date.now()}`,
                          n,
                          year: "",
                          title: "New Case Study",
                          kicker: "",
                          img: "",
                          role: "",
                          summary: "",
                          categories: [],
                          outcomes: [],
                          tone: "terracotta",
                          sections: [],
                          tools: [],
                        };
                        setWorks([...works, cs]);
                        setEditing(cs);
                      }}
                      className="rounded-md bg-foreground px-3 py-1 text-[10px] tracking-wide text-background"
                    >
                      + New
                    </button>
                  </div>
                </div>
                {works.length === 0 && (
                  <p className="text-sm text-muted-foreground">No case studies yet.</p>
                )}

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {["Uncategorized", ...allCategories].map((bucket) => {
                    const bucketWorks = worksByBucket[bucket] || [];
                    const bucketKey = bucket === "Uncategorized" ? "__none__" : bucket;
                    const isDropActive = dragOverBucket === bucketKey;

                    return (
                      <div
                        key={bucketKey}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOverBucket(bucketKey);
                        }}
                        onDragLeave={() => setDragOverBucket((prev) => (prev === bucketKey ? null : prev))}
                        onDrop={(e) => {
                          e.preventDefault();
                          const slug = e.dataTransfer.getData("text/plain") || dragSlug;
                          if (!slug) return;
                          assignToBucket(slug, bucket === "Uncategorized" ? null : bucket);
                          setDragSlug(null);
                          setDragOverBucket(null);
                        }}
                        className={`rounded-lg border p-3 transition-colors ${
                          isDropActive ? "border-accent bg-accent/5" : "border-border"
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <div>
                            {renamingBucket === bucket ? (
                              <input
                                autoFocus
                                value={renameBucketName}
                                onChange={(e) => setRenameBucketName(e.target.value)}
                                onBlur={commitBucketRename}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    commitBucketRename();
                                  }
                                  if (e.key === "Escape") {
                                    setRenamingBucket(null);
                                    setRenameBucketName("");
                                  }
                                }}
                                className="h-6 w-36 font-mono text-[10px] tracking-[0.2em] uppercase"
                              />
                            ) : (
                              <p
                                className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
                                onDoubleClick={() => startBucketRename(bucket)}
                                title={bucket === "Uncategorized" ? undefined : "Double-click to rename category"}
                              >
                                {bucket}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">{bucketWorks.length} projects</p>
                          </div>
                          {bucket !== "Uncategorized" && (
                            <button
                              type="button"
                              onClick={() => removeBucket(bucket)}
                              className="rounded-md border border-red-500/30 px-2 py-1 text-[10px] text-red-500 hover:bg-red-500/10"
                              title="Delete bucket"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {bucketWorks.length === 0 && (
                            <div className="rounded-md border border-dashed border-border p-2 text-center text-[10px] text-muted-foreground">
                              Drop case studies here
                            </div>
                          )}

                          {bucketWorks.map((w) => (
                            <div
                              key={w.slug}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData("text/plain", w.slug);
                                setDragSlug(w.slug);
                              }}
                              onDragEnd={() => {
                                setDragSlug(null);
                                setDragOverBucket(null);
                              }}
                              className="group rounded-md border border-border bg-background p-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-display text-sm">{w.title || "Untitled"}</p>
                                  <p className="truncate text-[10px] text-muted-foreground">{w.year} · {w.kicker}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setEditing(w)}
                                  className="rounded border border-border px-1.5 py-0.5 text-[10px] hover:bg-muted"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          {tab === "archive" && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {archive.length === 0 && (
                <p className="col-span-full text-sm text-muted-foreground">No archive items yet.</p>
              )}
              {archive.map((item: any, i) => (
                <div key={item._id || i} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <input
                        className="w-full bg-transparent text-sm font-medium outline-none"
                        value={item.label || ""}
                        onChange={(e) => {
                          const next = [...archive];
                          next[i] = { ...next[i], label: e.target.value };
                          setArchive(next);
                        }}
                      />
                      <input
                        className="mt-1 w-full bg-transparent text-[10px] text-muted-foreground outline-none"
                        value={item.category || ""}
                        onChange={(e) => {
                          const next = [...archive];
                          next[i] = { ...next[i], cat: e.target.value };
                          setArchive(next);
                        }}
                      />
                    </div>
                    <button
                      onClick={() => setArchive(archive.filter((_, j) => j !== i))}
                      className="ml-2 text-xs text-muted-foreground hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                  <ImageUploader
                    value={item.src}
                    onUpload={(url, _ref) => {
                      const next = [...archive];
                      next[i] = { ...next[i], src: url, imageRef: _ref || undefined };
                      setArchive(next);
                    }}
                    label="Upload image"
                  />
                </div>
              ))}
            </div>
          )}

          {tab === "experience" && (
            <div className="space-y-3">
              {timeline.length === 0 && (
                <p className="text-sm text-muted-foreground">No timeline items yet.</p>
              )}
              {timeline.map((item: any, i) => (
                <div key={item._id || i} className="rounded-lg border border-border p-4">
                  <div className="flex gap-4">
                    <span className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {item.year}
                    </span>
                    <div className="flex-1 space-y-1">
                      <input
                        className="w-full bg-transparent font-medium outline-none"
                        value={item.title || ""}
                        onChange={(e) => {
                          const next = [...timeline];
                          next[i] = { ...next[i], title: e.target.value };
                          setTimeline(next);
                        }}
                      />
                      <input
                        className="w-full bg-transparent text-sm text-muted-foreground outline-none"
                        value={item.where || ""}
                        onChange={(e) => {
                          const next = [...timeline];
                          next[i] = { ...next[i], where: e.target.value };
                          setTimeline(next);
                        }}
                      />
                    </div>
                    <button
                      onClick={() => setTimeline(timeline.filter((_, j) => j !== i))}
                      className="mt-0.5 text-xs text-muted-foreground hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "resumes" && <ResumesEditor resumes={resumes} setResumes={setResumes} />}
        </div>

        <div className="border-t border-border px-6 py-3 text-center text-[10px] text-muted-foreground">
          Edits are saved directly to Sanity. Changes reflect globally within seconds.
        </div>
      </div>
    </div>
  );
}

function ResumesEditor({
  resumes,
  setResumes,
}: {
  resumes: Resume[];
  setResumes: (r: Resume[]) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [jsonInput, setJsonInput] = useState(resumes[0]?.json || "{}");
  const [parseError, setParseError] = useState("");

  const active = resumes[activeIdx];

  const updateJson = (val: string) => {
    setJsonInput(val);
    try {
      JSON.parse(val);
      setParseError("");
    } catch {
      setParseError("Invalid JSON");
    }
  };

  const saveJson = () => {
    try {
      JSON.parse(jsonInput);
      const next = [...resumes];
      next[activeIdx] = { ...next[activeIdx], json: jsonInput };
      setResumes(next);
      setParseError("");
    } catch {
      setParseError("Cannot save — invalid JSON");
    }
  };

  const setGlobal = () => {
    const next = resumes.map((r, i) => ({ ...r, global: i === activeIdx }));
    setResumes(next);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {resumes.map((r, i) => (
          <button
            key={r.role}
            onClick={() => {
              setActiveIdx(i);
              setJsonInput(resumes[i].json);
              setParseError("");
            }}
            className={`rounded-full px-4 py-1.5 text-xs tracking-wide transition-all ${
              i === activeIdx
                ? "bg-foreground text-background"
                : "border border-border hover:bg-muted"
            }`}
          >
            {r.global ? "\u2605 " : ""}
            {r.role}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          {active?.global ? "\u2605 Global resume" : "Select a global resume"}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              localStorage.setItem("gr-resumes", JSON.stringify(resumes));
              window.open(`/print-resume?role=${encodeURIComponent(active?.role || "")}`, "_blank");
            }}
            className="rounded-md border border-border px-3 py-1 text-[10px] tracking-wide transition-colors hover:bg-muted"
          >
            Download PDF
          </button>
          {!active?.global && (
            <button
              onClick={setGlobal}
              className="rounded-md bg-foreground px-3 py-1 text-[10px] text-background transition-opacity hover:opacity-80"
            >
              Set as Global
            </button>
          )}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-4 overflow-hidden">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              JSON Editor
            </span>
            <button
              onClick={saveJson}
              className="rounded-md bg-foreground px-3 py-1 text-[10px] text-background transition-opacity hover:opacity-80"
            >
              Apply
            </button>
          </div>
          <textarea
            className="flex-1 resize-none rounded-md border border-border bg-muted/30 p-3 font-mono text-xs leading-relaxed outline-none focus:border-foreground"
            value={jsonInput}
            onChange={(e) => updateJson(e.target.value)}
            spellCheck={false}
          />
          {parseError && <p className="text-xs text-red-500">{parseError}</p>}
        </div>

        <div className="flex flex-col gap-2 overflow-hidden">
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            Preview
          </span>
          <div className="flex-1 overflow-y-auto rounded-md border border-border bg-muted/30 p-4">
            <ResumePreview json={jsonInput} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumePreview({ json }: { json: string }) {
  let data: any;
  try {
    data = JSON.parse(json);
  } catch {
    return (
      <p className="text-xs text-muted-foreground">Invalid JSON — fix errors to see preview</p>
    );
  }

  return (
    <div className="space-y-4 text-xs">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <SectionLabel>{key}</SectionLabel>
          {renderValue(value)}
        </div>
      ))}
    </div>
  );
}

function renderValue(value: any): React.ReactNode {
  if (Array.isArray(value)) {
    if (value.length === 0) return <p className="text-muted-foreground italic">(empty)</p>;
    return (
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i}>
            {typeof item === "object" && item !== null ? (
              <div className="rounded-md border border-border p-2">
                {Object.entries(item).map(([k, v]) => (
                  <div key={k} className="flex items-baseline gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground min-w-16">
                      {k}
                    </span>
                    <span className="text-foreground">{String(v ?? "")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground">- {String(item)}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div className="rounded-md border border-border p-2 space-y-1">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground min-w-16">
              {k}
            </span>
            <span className="text-foreground">{String(v ?? "")}</span>
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "string" && !value)
    return <p className="text-muted-foreground italic">(empty)</p>;

  return <p className="text-foreground">{String(value)}</p>;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-1 text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
      {children}
    </div>
  );
}

function WorkEditor({
  work,
  availableCategories,
  onChange,
  onBack,
}: {
  work: CaseStudy;
  availableCategories: string[];
  onChange: (patch: Partial<CaseStudy>) => void;
  onBack: () => void;
}) {
  const [newCategory, setNewCategory] = useState("");
  const set = (patch: Partial<CaseStudy>) => onChange(patch);

  const addOutcome = () => set({ outcomes: [...work.outcomes, { k: "", v: "" }] });
  const updOutcome = (i: number, k: string, v: string) => {
    const next = [...work.outcomes];
    next[i] = { k, v };
    set({ outcomes: next });
  };
  const delOutcome = (i: number) => set({ outcomes: work.outcomes.filter((_, j) => j !== i) });

  const addSection = (type: SectionType) => {
    const base: CaseStudySection = { type, title: "", content: "", images: [] };
    if (type === "image-text") base.imagePosition = "left";
    set({ sections: [...work.sections, base] });
  };
  const updSection = (i: number, patch: Partial<CaseStudySection>) => {
    const next = [...work.sections];
    next[i] = { ...next[i], ...patch };
    set({ sections: next });
  };
  const delSection = (i: number) => set({ sections: work.sections.filter((_, j) => j !== i) });
  const moveSection = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= work.sections.length) return;
    const next = [...work.sections];
    [next[i], next[j]] = [next[j], next[i]];
    set({ sections: next });
  };

  const workCategories = (work.categories || []).map((category) => category.trim()).filter(Boolean);

  const setCategories = (nextCategories: string[]) => {
    set({
      categories: Array.from(new Set(nextCategories.map((category) => category.trim()).filter(Boolean))),
    });
  };

  const toggleCategory = (category: string) => {
    if (workCategories.includes(category)) {
      setCategories(workCategories.filter((c) => c !== category));
      return;
    }
    setCategories([...workCategories, category]);
  };

  const addNewCategory = () => {
    const category = newCategory.trim();
    if (!category) return;
    setCategories([...workCategories, category]);
    setNewCategory("");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <button
        onClick={onBack}
        className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
      >
        \u2190 Back to list
      </button>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Title">
          <input value={work.title} onChange={(e) => set({ title: e.target.value })} />
        </Field>
        <Field label="Slug">
          <input value={work.slug} className="bg-muted/50" readOnly />
        </Field>
        <Field label="Year">
          <input value={work.year} onChange={(e) => set({ year: e.target.value })} />
        </Field>
        <Field label="Number">
          <input value={work.n} onChange={(e) => set({ n: e.target.value })} />
        </Field>
        <Field label="Kicker" className="col-span-2">
          <input value={work.kicker} onChange={(e) => set({ kicker: e.target.value })} />
        </Field>
      </div>

      <Field label="Cover Image">
        <ImageUploader
          value={work.img}
          onUpload={(url, _ref) => set({ img: url, imgRef: _ref || undefined })}
          label="Upload cover image"
        />
      </Field>

      <Field label="Role">
        <input value={work.role} onChange={(e) => set({ role: e.target.value })} />
      </Field>
      <Field label="Summary">
        <textarea
          rows={3}
          value={work.summary}
          onChange={(e) => set({ summary: e.target.value })}
        />
      </Field>

      <Field label="Categories">
        <div className="space-y-2 rounded-md border border-border p-3">
          <div className="flex flex-wrap gap-1.5">
            {workCategories.length === 0 && (
              <span className="text-xs text-muted-foreground">No categories assigned</span>
            )}
            {workCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className="inline-flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-[10px] tracking-wide text-background"
                title="Remove category"
              >
                {category}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>

          {availableCategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] tracking-wide transition-colors ${
                    workCategories.includes(category)
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addNewCategory();
                }
              }}
            />
            <button
              type="button"
              onClick={addNewCategory}
              className="rounded-md border border-border px-3 py-1 text-[10px] tracking-wide hover:bg-muted"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setCategories([])}
              className="rounded-md border border-red-500/30 px-3 py-1 text-[10px] tracking-wide text-red-500 hover:bg-red-500/10"
            >
              Clear
            </button>
          </div>
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Categories create the groups and filters shown in Selected Work.
        </p>
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Client">
          <input value={work.client || ""} onChange={(e) => set({ client: e.target.value })} />
        </Field>
        <Field label="Timeline">
          <input value={work.timeline || ""} onChange={(e) => set({ timeline: e.target.value })} />
        </Field>
        <Field label="Tone">
          <select
            value={work.tone}
            onChange={(e) => set({ tone: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
          >
            {["terracotta", "coral", "forest", "indigo", "warm"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Tools (comma-separated)">
        <input
          value={(work.tools || []).join(", ")}
          onChange={(e) =>
            set({
              tools: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </Field>

      <Field label="Live URL">
        <input value={work.liveUrl || ""} onChange={(e) => set({ liveUrl: e.target.value })} />
      </Field>

      <div>
        <div className="flex items-center justify-between">
          <Label>Outcomes</Label>
          <button
            onClick={addOutcome}
            className="rounded-md bg-muted px-3 py-1 text-[10px] tracking-wide hover:bg-muted/70"
          >
            + Add
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {work.outcomes.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                placeholder="Label"
                className="w-1/3"
                value={o.k}
                onChange={(e) => updOutcome(i, e.target.value, o.v)}
              />
              <input
                placeholder="Value"
                className="flex-1"
                value={o.v}
                onChange={(e) => updOutcome(i, o.k, e.target.value)}
              />
              <button
                onClick={() => delOutcome(i)}
                className="text-xs text-muted-foreground hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Sections</Label>
          <div className="flex gap-1">
            {(["text", "image", "image-text", "full-bleed"] as SectionType[]).map((t) => (
              <button
                key={t}
                onClick={() => addSection(t)}
                className="rounded-md bg-muted px-2 py-1 text-[10px] tracking-wide hover:bg-muted/70"
              >
                + {t}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 space-y-4">
          {work.sections.map((s, i) => (
            <SectionEditor
              key={i}
              section={s}
              index={i}
              onChange={(p) => updSection(i, p)}
              onDelete={() => delSection(i)}
              onMove={(d) => moveSection(i, d)}
              isFirst={i === 0}
              isLast={i === work.sections.length - 1}
            />
          ))}
          {work.sections.length === 0 && (
            <p className="text-xs text-muted-foreground">No sections yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ImageUploader({
  value,
  onUpload,
  label,
}: {
  value?: string;
  onUpload: (url: string, _ref?: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const result = await uploadImage(file);
      onUpload(result.url, result._ref);
    } catch (err) {
      console.error("Upload failed", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        {value && (
          <img src={value} alt="" className="h-14 w-20 flex-shrink-0 rounded-md object-cover" />
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-md bg-muted px-3 py-1.5 text-[10px] tracking-wide transition-colors hover:bg-muted/70 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : label || "Upload from device"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onUpload("")}
            className="rounded-md bg-red-500/10 px-2 py-1 text-[10px] text-red-500 hover:bg-red-500/20"
          >
            Remove
          </button>
        )}
      </div>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}

function SectionEditor({
  section,
  index,
  onChange,
  onDelete,
  onMove,
  isFirst,
  isLast,
}: {
  section: CaseStudySection;
  index: number;
  onChange: (patch: Partial<CaseStudySection>) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-wide text-muted-foreground">
          Section {index + 1} \u00b7 {section.type}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMove(-1)}
            disabled={isFirst}
            className="text-xs text-muted-foreground disabled:opacity-30"
          >
            \u2191
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={isLast}
            className="text-xs text-muted-foreground disabled:opacity-30"
          >
            \u2193
          </button>
          <button
            onClick={onDelete}
            className="ml-2 text-xs text-muted-foreground hover:text-red-500"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      <select
        value={section.type}
        onChange={(e) =>
          onChange({
            type: e.target.value as SectionType,
            images: e.target.value === "text" ? undefined : section.images,
          })
        }
        className="mb-2 w-full rounded-md border border-border bg-background px-2 py-1 text-xs outline-none"
      >
        <option value="text">Text</option>
        <option value="image">Image</option>
        <option value="full-bleed">Full Bleed</option>
        <option value="image-text">Image + Text</option>
      </select>

      {(section.type === "text" || section.type === "image-text") && (
        <>
          <input
            placeholder="Section title (optional)"
            className="mb-2"
            value={section.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
          />
          <textarea
            placeholder="Content"
            rows={4}
            value={section.content || ""}
            onChange={(e) => onChange({ content: e.target.value })}
          />
        </>
      )}

      {section.type === "image-text" && (
        <select
          value={section.imagePosition || "left"}
          onChange={(e) => onChange({ imagePosition: e.target.value as "left" | "right" })}
          className="mt-2 w-full rounded-md border border-border bg-background px-2 py-1 text-xs outline-none"
        >
          <option value="left">Image left</option>
          <option value="right">Image right</option>
        </select>
      )}

      {(section.type === "image" ||
        section.type === "full-bleed" ||
        section.type === "image-text") && (
        <div className="mt-2 space-y-2">
          {(section.images || []).map((img, j) => (
            <div key={j} className="rounded-md border border-border p-2">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">Image {j + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = (section.images || []).filter((_, k) => k !== j);
                    onChange({ images: next.length > 0 ? next : [] });
                  }}
                  className="text-xs text-muted-foreground hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="mt-1">
                <ImageUploader
                  value={img.src}
                  onUpload={(url, _ref) => {
                    const next = [...(section.images || [])];
                    next[j] = { ...next[j], src: url, _ref: _ref || undefined };
                    onChange({ images: next });
                  }}
                  label="Upload"
                />
              </div>
              <input
                placeholder="Caption (optional)"
                className="mt-1 text-xs"
                value={img.caption || ""}
                onChange={(e) => {
                  const next = [...(section.images || [])];
                  next[j] = { ...next[j], caption: e.target.value };
                  onChange({ images: next });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({ images: [...(section.images || []), { src: "", caption: "" }] })
            }
            className="w-full rounded-md border border-dashed border-border px-3 py-2 text-[10px] tracking-wide text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            + Add image
          </button>
          {(section.images || []).length === 0 && (
            <div className="rounded-md border border-dashed border-border p-3 text-center">
              <p className="mb-2 text-[10px] text-muted-foreground">No images yet</p>
              <ImageUploader
                value=""
                onUpload={(url, _ref) =>
                  onChange({ images: [{ src: url, caption: "", _ref: _ref || undefined }] })
                }
                label="Upload from device"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
      {children}
    </div>
  );
}
