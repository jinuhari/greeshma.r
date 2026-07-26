import { useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import { syncAllToSanity } from "@/sanity/lib/mutations";
import type { CaseStudy } from "@/lib/cms";
import type { ArchiveItem, TimelineItem } from "@/lib/data";

type Tab = "works" | "archive" | "experience";

export function CmsPanel({
  works: initialWorks,
  archive: initialArchive,
  timeline: initialTimeline,
  onClose,
}: {
  works: CaseStudy[];
  archive: ArchiveItem[];
  timeline: TimelineItem[];
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("works");
  const [works, setWorks] = useState(initialWorks);
  const [archive, setArchive] = useState(initialArchive);
  const [timeline, setTimeline] = useState(initialTimeline);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await syncAllToSanity(works, archive, timeline);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        style={{ margin: "4vh auto", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl">CMS</h2>
            <div className="flex gap-1 rounded-full border border-border p-0.5">
              {(["works", "archive", "experience"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-1 text-xs tracking-wide transition-all ${
                    tab === t ? "bg-foreground text-background" : "hover:bg-muted"
                  }`}
                >
                  {t === "works" ? "Case Studies" : t === "archive" ? "Archive" : "Experience"}
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
              {saving ? "Saving..." : saved ? "Saved ✓" : "Save to Sanity"}
            </button>
            <button onClick={onClose} className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground">
              Close ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "works" && (
            <div className="space-y-3">
              {works.length === 0 && <p className="text-sm text-muted-foreground">No case studies yet.</p>}
              {works.map((w: any, i) => (
                <div key={w._id || i} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <input
                        className="w-full bg-transparent text-lg font-display outline-none"
                        value={w.title || ""}
                        onChange={(e) => {
                          const next = [...works];
                          next[i] = { ...next[i], title: e.target.value };
                          setWorks(next);
                        }}
                      />
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>{w.year}</span>
                        <span>{w.kicker}</span>
                      </div>
                      <textarea
                        className="w-full bg-transparent text-sm outline-none resize-none"
                        rows={2}
                        value={w.summary || ""}
                        onChange={(e) => {
                          const next = [...works];
                          next[i] = { ...next[i], summary: e.target.value };
                          setWorks(next);
                        }}
                      />
                    </div>
                    {w.coverImage && (
                      <img
                        src={urlFor(w.coverImage).width(80).url()}
                        alt=""
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(w.tools || []).map((t: string, j: number) => (
                      <span key={j} className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] tracking-wide">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "archive" && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {archive.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No archive items yet.</p>}
              {archive.map((item: any, i) => (
                <div key={item._id || i} className="rounded-lg border border-border p-3">
                  {item.image && (
                    <img
                      src={urlFor(item.image).width(200).height(260).url()}
                      alt={item.label}
                      className="mb-2 w-full rounded-md object-cover"
                      style={{ aspectRatio: "3/4" }}
                    />
                  )}
                  <input
                    className="w-full bg-transparent text-sm font-medium outline-none"
                    value={item.label || ""}
                    onChange={(e) => {
                      const next = [...archive];
                      next[i] = { ...next[i], label: e.target.value };
                      setArchive(next);
                    }}
                  />
                  <div className="mt-1 flex gap-2 text-[10px] text-muted-foreground">
                    <span>{item.category}</span>
                    <span>{item.year}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "experience" && (
            <div className="space-y-3">
              {timeline.length === 0 && <p className="text-sm text-muted-foreground">No timeline items yet.</p>}
              {timeline.map((item: any, i) => (
                <div key={item._id || i} className="rounded-lg border border-border p-4">
                  <div className="flex gap-4">
                    <span className="mt-0.5 font-mono text-xs text-muted-foreground">{item.year}</span>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border px-6 py-3 text-center text-[10px] text-muted-foreground">
          Edits are saved directly to Sanity. Changes reflect globally within seconds.
        </div>
      </div>
    </div>
  );
}
