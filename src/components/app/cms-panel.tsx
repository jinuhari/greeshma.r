import { useEffect, useRef, useState } from "react";
import { type CaseStudy, type CaseStudySection, type SectionType } from "@/lib/cms";
import type { ArchiveItem, TimelineItem } from "@/lib/data";

type Tab = "works" | "archive" | "experience";

interface Props {
  works: CaseStudy[];
  archive: ArchiveItem[];
  timeline: TimelineItem[];
  onSaveWorks: (works: CaseStudy[]) => void;
  onSaveArchive: (items: ArchiveItem[]) => void;
  onSaveTimeline: (items: TimelineItem[]) => void;
  onClose: () => void;
}

export function CmsPanel({ works, archive, timeline, onSaveWorks, onSaveArchive, onSaveTimeline, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("works");
  const [editing, setEditing] = useState<CaseStudy | ArchiveItem | TimelineItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (editing) { setEditing(null); setIsNew(false); }
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        style={{ margin: "4vh auto", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Header tab={tab} onSetTab={setTab} onClose={onClose} />

        <div className="flex flex-1 overflow-hidden">
          {editing ? (
            <EditorPanel
              item={editing}
              isNew={isNew}
              type={tab}
              onSave={(updated) => {
                if (tab === "works") {
                  const updatedWork = updated as CaseStudy;
                  const idx = isNew ? -1 : works.findIndex((w) => w.slug === (editing as CaseStudy).slug);
                  const next = [...works];
                  if (idx >= 0) next[idx] = updatedWork;
                  else next.push(updatedWork);
                  onSaveWorks(next);
                } else {
                  const updatedItem = updated as ArchiveItem;
                  const idx = isNew ? -1 : archive.indexOf(editing as ArchiveItem);
                  const next = [...archive];
                  if (idx >= 0) next[idx] = updatedItem;
                  else next.push(updatedItem);
                  onSaveArchive(next);
                }
                setEditing(null);
                setIsNew(false);
              }}
              onDelete={() => {
                if (tab === "works") {
                  const next = works.filter((w) => w.slug !== (editing as CaseStudy).slug);
                  onSaveWorks(next);
                } else {
                  const next = archive.filter((a) => a !== editing);
                  onSaveArchive(next);
                }
                setEditing(null);
                setIsNew(false);
              }}
              onCancel={() => { setEditing(null); setIsNew(false); }}
            />
          ) : (
            <ListPanel
              tab={tab}
              works={works}
              archive={archive}
              timeline={timeline}
              onEdit={(item) => { setEditing(item); setIsNew(false); }}
              onReorder={(from, to) => {
                if (tab === "works") {
                  const list = [...works];
                  const [moved] = list.splice(from, 1);
                  list.splice(to, 0, moved);
                  onSaveWorks(list);
                } else if (tab === "archive") {
                  const list = [...archive];
                  const [moved] = list.splice(from, 1);
                  list.splice(to, 0, moved);
                  onSaveArchive(list);
                } else {
                  const list = [...timeline];
                  const [moved] = list.splice(from, 1);
                  list.splice(to, 0, moved);
                  onSaveTimeline(list);
                }
              }}
              onAdd={() => {
                if (tab === "works") {
                  setEditing({
                    slug: "", n: String(works.length + 1).padStart(2, "0"), year: "", title: "",
                    kicker: "", img: "", role: "", summary: "", outcomes: [], tone: "terracotta",
                    sections: [], client: "", timeline: "", tools: [],
                  });
                } else if (tab === "archive") {
                  setEditing({ src: "", label: "", cat: "", year: "", medium: "", ratio: "aspect-[3/4]" });
                } else {
                  setEditing({ year: "", title: "", where: "" });
                }
                setIsNew(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Header({ tab, onSetTab, onClose }: { tab: Tab; onSetTab: (t: Tab) => void; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-4">
        <h2 className="font-display text-xl">CMS</h2>
        <div className="flex gap-1 rounded-full border border-border p-0.5">
          {(["works", "archive", "experience"] as const).map((t) => (
            <button
              key={t}
              onClick={() => onSetTab(t)}
              className={`rounded-full px-4 py-1 text-xs tracking-wide transition-all ${
                tab === t ? "bg-foreground text-background" : "hover:bg-muted"
              }`}
            >
              {t === "works" ? "Case Studies" : t === "archive" ? "Archive" : "Experience"}
            </button>
          ))}
        </div>
      </div>
      <button onClick={onClose} className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground">
        Close ✕
      </button>
    </div>
  );
}

function ListPanel({
  tab, works, archive, timeline, onEdit, onAdd, onReorder,
}: {
  tab: Tab; works: CaseStudy[]; archive: ArchiveItem[]; timeline: TimelineItem[];
  onEdit: (item: any) => void; onAdd: () => void;
  onReorder: (from: number, to: number) => void;
}) {
  const dragIdx = useRef<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const list = tab === "works" ? works : tab === "archive" ? archive : timeline;

  const handleDragStart = (i: number) => {
    dragIdx.current = i;
  };

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === i) return;
    setOverIdx(i);
  };

  const handleDrop = (i: number) => {
    if (dragIdx.current === null || dragIdx.current === i) return;
    onReorder(dragIdx.current, i);
    dragIdx.current = null;
    setOverIdx(null);
  };

  const handleDragEnd = () => {
    dragIdx.current = null;
    setOverIdx(null);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <p className="text-xs text-muted-foreground">
          {tab === "works" ? `${list.length} case studies` : `${list.length} items`}
          {list.length > 1 && <span className="ml-2 opacity-50">· drag to reorder</span>}
        </p>
        <button
          onClick={onAdd}
          className="rounded-full border border-foreground bg-foreground px-4 py-1 text-xs tracking-wide text-background transition-all hover:bg-accent hover:text-background"
        >
          + Add new
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-4">
        {list.map((item: any, i: number) => {
          const isOver = overIdx === i;
          const isDragging = dragIdx.current === i;
          const label = tab === "works" ? item.title : tab === "archive" ? item.label : item.title;
          const sub = tab === "works" ? item.kicker : tab === "archive" ? `${item.cat} · ${item.year}` : item.year;
          const src = item.img || item.src;

          return (
            <div
              key={tab === "works" ? (item as CaseStudy).slug : i}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={() => handleDrop(i)}
              onDragEnd={handleDragEnd}
              onClick={() => onEdit(item)}
              className={`group flex w-full cursor-grab items-center gap-3 rounded-lg border p-3 text-left transition-all active:cursor-grabbing ${
                isDragging ? "opacity-30 border-accent" : isOver ? "border-accent bg-accent/5 translate-y-1" : "border-border hover:border-accent hover:bg-accent/5"
              }`}
            >
              <span className="cursor-grab text-muted-foreground active:cursor-grabbing" title="Drag to reorder">⠿</span>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-muted text-xs text-muted-foreground">
                {src ? (
                  <img src={src} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span>{label.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm">{label}</p>
                <p className="truncate text-xs text-muted-foreground">{sub}</p>
              </div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                Edit →
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditorPanel({
  item, isNew, type, onSave, onDelete, onCancel,
}: {
  item: any; isNew: boolean; type: Tab;
  onSave: (item: any) => void; onDelete: () => void; onCancel: () => void;
}) {
  if (type === "works") {
    return <WorkEditor work={item as CaseStudy} isNew={isNew} onSave={onSave} onDelete={onDelete} onCancel={onCancel} />;
  }
  if (type === "archive") {
    return <ArchiveEditor item={item as ArchiveItem} isNew={isNew} onSave={onSave} onDelete={onDelete} onCancel={onCancel} />;
  }
  return <TimelineEditor item={item as TimelineItem} isNew={isNew} onSave={onSave} onDelete={onDelete} onCancel={onCancel} />;
}

function ImageUpload({ value, onChange, label }: { value: string; onChange: (src: string) => void; label: string }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p className="mb-1.5 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted-foreground">No image</span>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-full border border-border px-4 py-1.5 text-xs tracking-wide transition-all hover:border-foreground"
          >
            Choose file
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[10px] text-muted-foreground underline hover:text-destructive"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkEditor({
  work, isNew, onSave, onDelete, onCancel,
}: {
  work: CaseStudy; isNew: boolean; onSave: (w: CaseStudy) => void; onDelete: () => void; onCancel: () => void;
}) {
  const [form, setForm] = useState<CaseStudy>(work);

  const update = <K extends keyof CaseStudy>(key: K, value: CaseStudy[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <p className="font-display text-sm">{isNew ? "New case study" : `Editing: ${work.title}`}</p>
        <div className="flex gap-2">
          {!isNew && (
            <button
              onClick={() => { if (confirm("Delete this case study?")) onDelete(); }}
              className="rounded-full border border-destructive/30 px-4 py-1 text-xs tracking-wide text-destructive transition-all hover:bg-destructive/10"
            >
              Delete
            </button>
          )}
          <button
            onClick={onCancel}
            className="rounded-full border border-border px-4 py-1 text-xs tracking-wide transition-all hover:border-foreground"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="rounded-full border border-foreground bg-foreground px-4 py-1 text-xs tracking-wide text-background transition-all hover:bg-accent"
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <ImageUpload value={form.img} onChange={(src) => update("img", src)} label="Cover image" />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Title" value={form.title} onChange={(v) => update("title", v)} />
          <Field label="Slug" value={form.slug} onChange={(v) => update("slug", v)} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Number (n)" value={form.n} onChange={(v) => update("n", v)} />
          <Field label="Year" value={form.year} onChange={(v) => update("year", v)} />
          <div>
            <p className="mb-1.5 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Tone</p>
            <select
              value={form.tone}
              onChange={(e) => update("tone", e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-accent"
            >
              {["terracotta", "coral", "forest", "indigo"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <Field label="Kicker" value={form.kicker} onChange={(v) => update("kicker", v)} />
        <Field label="Role" value={form.role} onChange={(v) => update("role", v)} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Client" value={form.client || ""} onChange={(v) => update("client", v || undefined)} />
          <Field label="Timeline" value={form.timeline || ""} onChange={(v) => update("timeline", v || undefined)} />
        </div>
        <TextArea label="Summary" value={form.summary} onChange={(v) => update("summary", v)} />

        <SectionList
          sections={form.sections}
          onChange={(sections) => update("sections", sections)}
        />

        <ToolsEditor tools={form.tools || []} onChange={(tools) => update("tools", tools)} />

        <OutcomeList
          outcomes={form.outcomes}
          onChange={(outcomes) => update("outcomes", outcomes)}
        />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background p-2.5 text-sm outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-border bg-background p-2.5 text-sm outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}

function SectionList({ sections, onChange }: { sections: CaseStudySection[]; onChange: (s: CaseStudySection[]) => void }) {
  const add = () => onChange([...sections, { type: "text", title: "", content: "" }]);
  const remove = (i: number) => onChange(sections.filter((_, idx) => idx !== i));
  const updateSec = (i: number, patch: Partial<CaseStudySection>) => {
    const next = sections.map((s, idx) => idx === i ? { ...s, ...patch } : s);
    onChange(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const addImage = (i: number) => {
    const section = sections[i];
    const images = section.images ? [...section.images, { src: "" }] : [{ src: "" }];
    updateSec(i, { images });
  };
  const removeImage = (secIdx: number, imgIdx: number) => {
    const section = sections[secIdx];
    const images = (section.images || []).filter((_, idx) => idx !== imgIdx);
    updateSec(secIdx, { images: images.length > 0 ? images : undefined });
  };
  const updateImage = (secIdx: number, imgIdx: number, src: string) => {
    const section = sections[secIdx];
    const images = (section.images || []).map((img, idx) => idx === imgIdx ? { ...img, src } : img);
    updateSec(secIdx, { images });
  };

  const typeLabels: Record<SectionType, string> = {
    text: "Text",
    image: "Image",
    "image-text": "Image + Text",
    "full-bleed": "Full-bleed Image",
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Case study sections</p>
        <button
          type="button"
          onClick={add}
          className="rounded-full border border-border px-3 py-1 text-[10px] tracking-wide transition-all hover:border-foreground"
        >
          + Add section
        </button>
      </div>
      <div className="space-y-4">
        {sections.map((s, i) => (
          <div key={i} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">Section {i + 1}</span>
              <div className="flex items-center gap-2">
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">{typeLabels[s.type]}</span>
                <button onClick={() => move(i, -1)} disabled={i === 0}
                  className="rounded px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-muted disabled:opacity-30">↑</button>
                <button onClick={() => move(i, 1)} disabled={i === sections.length - 1}
                  className="rounded px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-muted disabled:opacity-30">↓</button>
                <button onClick={() => remove(i)}
                  className="rounded px-2 py-0.5 text-[10px] text-destructive hover:bg-destructive/10">✕</button>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Layout</label>
              <div className="mt-1 flex flex-wrap gap-1">
                {(["text", "image", "image-text", "full-bleed"] as SectionType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateSec(i, { type: t })}
                    className={`rounded-full border px-2.5 py-1 text-[10px] tracking-wide transition-all ${
                      s.type === t ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
                    }`}
                  >
                    {typeLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            {(s.type === "text" || s.type === "image-text") && (
              <input
                value={s.title || ""}
                onChange={(e) => updateSec(i, { title: e.target.value })}
                placeholder="Section title"
                className="mb-2 w-full rounded border border-border bg-background p-2 text-sm outline-none focus:border-accent"
              />
            )}

            {(s.type === "text" || s.type === "image-text") && (
              <textarea
                value={s.content || ""}
                onChange={(e) => updateSec(i, { content: e.target.value })}
                placeholder="Section content"
                rows={4}
                className="mb-2 w-full rounded border border-border bg-background p-2 text-sm outline-none focus:border-accent"
              />
            )}

            {(s.type === "image" || s.type === "image-text" || s.type === "full-bleed") && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Images</span>
                  <button
                    type="button"
                    onClick={() => addImage(i)}
                    className="rounded-full border border-border px-2.5 py-0.5 text-[10px] tracking-wide hover:border-foreground"
                  >
                    + Add image
                  </button>
                </div>
                {(s.images || []).map((img, imgIdx) => (
                  <SectionImageRow
                    key={imgIdx}
                    img={img}
                    onChange={(src) => updateImage(i, imgIdx, src)}
                    onRemove={() => removeImage(i, imgIdx)}
                  />
                ))}
                {(!s.images || s.images.length === 0) && (
                  <p className="text-[10px] text-muted-foreground">No images yet.</p>
                )}
              </div>
            )}

            {s.type === "image-text" && (
              <div className="mt-3">
                <label className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Image position</label>
                <div className="mt-1 flex gap-1">
                  {(["left", "right"] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => updateSec(i, { imagePosition: pos })}
                      className={`rounded-full border px-3 py-1 text-[10px] tracking-wide transition-all ${
                        (s.imagePosition || "left") === pos ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
                      }`}
                    >
                      {pos === "left" ? "← Image left" : "Image right →"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {sections.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">No sections yet. Click "+ Add section" to begin.</p>
        )}
      </div>
    </div>
  );
}

function SectionImageRow({ img, onChange, onRemove }: { img: { src: string; caption?: string }; onChange: (src: string) => void; onRemove: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-3 rounded border border-border p-2">
      <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
        {img.src ? (
          <img src={img.src} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-[8px] text-muted-foreground">No img</span>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <button type="button" onClick={() => fileRef.current?.click()} className="rounded border border-border px-2 py-1 text-[10px] hover:border-foreground">
        Choose
      </button>
      <input
        value={img.src}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL or upload"
        className="min-w-0 flex-1 rounded border border-border bg-background p-1.5 text-[10px] outline-none focus:border-accent"
      />
      <button type="button" onClick={onRemove} className="text-[10px] text-destructive hover:text-destructive/70">✕</button>
    </div>
  );
}

function ToolsEditor({ tools, onChange }: { tools: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !tools.includes(trimmed)) {
      onChange([...tools, trimmed]);
      setInput("");
    }
  };

  return (
    <div>
      <p className="mb-1.5 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Tools & Technologies</p>
      <div className="mb-2 flex flex-wrap gap-2">
        {tools.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs">
            {t}
            <button onClick={() => onChange(tools.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">✕</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Type a tool and press Enter"
          className="flex-1 rounded-lg border border-border bg-background p-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-border px-3 text-xs transition-all hover:border-foreground"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function OutcomeList({ outcomes, onChange }: { outcomes: { k: string; v: string }[]; onChange: (o: { k: string; v: string }[]) => void }) {
  const add = () => onChange([...outcomes, { k: "", v: "" }]);
  const remove = (i: number) => onChange(outcomes.filter((_, idx) => idx !== i));
  const updateOut = (i: number, key: "k" | "v", val: string) => {
    const next = outcomes.map((o, idx) => idx === i ? { ...o, [key]: val } : o);
    onChange(next);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Outcomes</p>
        <button
          type="button"
          onClick={add}
          className="rounded-full border border-border px-3 py-1 text-[10px] tracking-wide transition-all hover:border-foreground"
        >
          + Add outcome
        </button>
      </div>
      <div className="space-y-2">
        {outcomes.map((o, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={o.k}
              onChange={(e) => updateOut(i, "k", e.target.value)}
              placeholder="Label (e.g. Retail partners)"
              className="flex-1 rounded-lg border border-border bg-background p-2 text-sm outline-none focus:border-accent"
            />
            <input
              value={o.v}
              onChange={(e) => updateOut(i, "v", e.target.value)}
              placeholder="Value (e.g. 3M+)"
              className="w-28 rounded-lg border border-border bg-background p-2 text-sm outline-none focus:border-accent"
            />
            <button onClick={() => remove(i)} className="shrink-0 text-muted-foreground hover:text-destructive">✕</button>
          </div>
        ))}
        {outcomes.length === 0 && (
          <p className="py-2 text-center text-xs text-muted-foreground">No outcomes added.</p>
        )}
      </div>
    </div>
  );
}

function ArchiveEditor({ item, isNew, onSave, onDelete, onCancel }: {
  item: ArchiveItem; isNew: boolean; onSave: (a: ArchiveItem) => void; onDelete: () => void; onCancel: () => void;
}) {
  const [form, setForm] = useState<ArchiveItem>(item);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <p className="font-display text-sm">{isNew ? "New archive item" : `Editing: ${item.label}`}</p>
        <div className="flex gap-2">
          {!isNew && (
            <button
              onClick={() => { if (confirm("Delete this item?")) onDelete(); }}
              className="rounded-full border border-destructive/30 px-4 py-1 text-xs tracking-wide text-destructive transition-all hover:bg-destructive/10"
            >
              Delete
            </button>
          )}
          <button onClick={onCancel} className="rounded-full border border-border px-4 py-1 text-xs tracking-wide transition-all hover:border-foreground">Cancel</button>
          <button onClick={() => onSave(form)} className="rounded-full border border-foreground bg-foreground px-4 py-1 text-xs tracking-wide text-background transition-all hover:bg-accent">Save</button>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <ImageUpload value={form.src} onChange={(src) => setForm((f) => ({ ...f, src }))} label="Image" />
        <Field label="Label" value={form.label} onChange={(v) => setForm((f) => ({ ...f, label: v }))} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category" value={form.cat} onChange={(v) => setForm((f) => ({ ...f, cat: v }))} />
          <Field label="Year" value={form.year} onChange={(v) => setForm((f) => ({ ...f, year: v }))} />
        </div>
        <Field label="Medium" value={form.medium} onChange={(v) => setForm((f) => ({ ...f, medium: v }))} />
        <Field label="Aspect ratio" value={form.ratio} onChange={(v) => setForm((f) => ({ ...f, ratio: v }))} />
      </div>
    </div>
  );
}

function TimelineEditor({ item, isNew, onSave, onDelete, onCancel }: {
  item: TimelineItem; isNew: boolean; onSave: (a: TimelineItem) => void; onDelete: () => void; onCancel: () => void;
}) {
  const [form, setForm] = useState<TimelineItem>(item);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <p className="font-display text-sm">{isNew ? "New experience item" : `Editing: ${item.title}`}</p>
        <div className="flex gap-2">
          {!isNew && (
            <button
              onClick={() => { if (confirm("Delete this item?")) onDelete(); }}
              className="rounded-full border border-destructive/30 px-4 py-1 text-xs tracking-wide text-destructive transition-all hover:bg-destructive/10"
            >
              Delete
            </button>
          )}
          <button onClick={onCancel} className="rounded-full border border-border px-4 py-1 text-xs tracking-wide transition-all hover:border-foreground">Cancel</button>
          <button onClick={() => onSave(form)} className="rounded-full border border-foreground bg-foreground px-4 py-1 text-xs tracking-wide text-background transition-all hover:bg-accent">Save</button>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Year" value={form.year} onChange={(v) => setForm((f) => ({ ...f, year: v }))} />
          <Field label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
        </div>
        <TextArea label="Description" value={form.where} onChange={(v) => setForm((f) => ({ ...f, where: v }))} />
      </div>
    </div>
  );
}
