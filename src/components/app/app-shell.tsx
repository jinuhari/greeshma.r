import { useEffect, useMemo, useRef, useState } from "react";
import { toggleTheme } from "@/hooks/use-reveal";

const SECTIONS = [
  { id: "top", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "archive", label: "Archive" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

function useActiveSection() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (e): e is HTMLElement => !!e
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        // pick the entry closest to the top that's intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return p;
}

function useClock() {
  const [t, setT] = useState<string>("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ---------------- Cursor + Spotlight ---------------- */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 0, y: 0, rx: 0, ry: 0, hover: false });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      state.current.x = e.clientX;
      state.current.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (spot.current) {
        spot.current.style.setProperty("--x", `${e.clientX}px`);
        spot.current.style.setProperty("--y", `${e.clientY}px`);
      }
    };
    const tick = () => {
      const s = state.current;
      s.rx += (s.x - s.rx) * 0.18;
      s.ry += (s.y - s.ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) scale(${
          s.hover ? 1.6 : 1
        })`;
      }
      raf = requestAnimationFrame(tick);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [data-cursor='hover'], input, textarea");
      state.current.hover = !!interactive;
      if (ring.current) {
        ring.current.dataset.hover = interactive ? "1" : "0";
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);
    document.documentElement.classList.add("has-custom-cursor");
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={spot}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] hidden md:block"
        style={{
          background:
            "radial-gradient(260px circle at var(--x, -200px) var(--y, -200px), color-mix(in oklab, var(--color-accent) 10%, transparent), transparent 62%), radial-gradient(140px circle at calc(var(--x, -200px) + 72px) calc(var(--y, -200px) - 44px), color-mix(in oklab, white 5%, transparent), transparent 64%), conic-gradient(from 220deg at var(--x, -200px) var(--y, -200px), transparent 0deg, color-mix(in oklab, var(--color-accent) 4%, transparent) 70deg, transparent 145deg, color-mix(in oklab, var(--color-foreground) 3%, transparent) 220deg, transparent 320deg, transparent 360deg)",
          mixBlendMode: "screen",
          opacity: 0.55,
        }}
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[110] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/70 transition-[background,border-color,opacity] duration-200 md:block data-[hover='1']:bg-accent/15 data-[hover='1']:border-accent"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[110] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent md:block"
      />
    </>
  );
}

/* ---------------- Scroll progress bar ---------------- */
function ScrollProgressBar() {
  const p = useScrollProgress();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px] bg-transparent">
      <div
        className="h-full bg-accent transition-[width] duration-75"
        style={{ width: `${p * 100}%` }}
      />
    </div>
  );
}

/* ---------------- Side scroll dots ---------------- */
function SectionDots({ active }: { active: string }) {
  return (
    <nav
      aria-label="Sections"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 md:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            className="group relative flex items-center justify-end"
          >
            <span
              className={`mr-3 whitespace-nowrap font-mono text-[10px] tracking-[0.25em] uppercase transition-all ${
                isActive
                  ? "opacity-100 text-foreground"
                  : "opacity-0 text-muted-foreground group-hover:opacity-100"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block rounded-full transition-all ${
                isActive
                  ? "h-2.5 w-2.5 bg-accent"
                  : "h-1.5 w-1.5 bg-foreground/25 group-hover:bg-foreground/60"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}

/* ---------------- Status bar (bottom dock) ---------------- */
function StatusBar({
  active,
  onOpenCmd,
  sketchOn,
  onToggleSketch,
}: {
  active: string;
  onOpenCmd: () => void;
  sketchOn: boolean;
  onToggleSketch: () => void;
}) {
  const time = useClock();
  const p = useScrollProgress();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-3">
      <div className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full border border-border bg-background/85 px-2 py-1.5 pl-4 text-[11px] backdrop-blur-md">
        <span className="hidden items-center gap-2 sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-muted-foreground">{Math.round(p * 100)}%</span>
        </span>
        <span className="hidden h-4 w-px bg-border sm:block" />
        <button
          onClick={onOpenCmd}
          data-cursor="hover"
          className="flex items-center gap-2 rounded-full px-3 py-1 hover:bg-muted"
        >
          <span className="font-mono tracking-wide text-muted-foreground">Search</span>
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>
        <button
          onClick={onToggleSketch}
          data-cursor="hover"
          aria-pressed={sketchOn}
          className={`rounded-full px-3 py-1 font-mono tracking-wide transition-colors ${
            sketchOn ? "bg-accent text-accent-foreground" : "hover:bg-muted"
          }`}
        >
          {sketchOn ? "Sketching…" : "Sketch"}
        </button>
        <button
          onClick={toggleTheme}
          data-cursor="hover"
          aria-label="Toggle theme"
          className="rounded-full px-3 py-1 font-mono tracking-wide hover:bg-muted"
        >
          ◐
        </button>
        <span className="hidden font-mono text-muted-foreground sm:inline">·</span>
        <span className="hidden pr-2 font-mono text-muted-foreground sm:inline">
          BLR {time}
        </span>
      </div>
    </div>
  );
}

/* ---------------- Command palette ---------------- */
type CmdItem = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  run: () => void;
};

function CommandPalette({
  open,
  onClose,
  onToggleSketch,
}: {
  open: boolean;
  onClose: () => void;
  onToggleSketch: () => void;
}) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<CmdItem[]>(
    () => [
      ...SECTIONS.map((s) => ({
        id: `go-${s.id}`,
        label: `Go to ${s.label}`,
        hint: `#${s.id}`,
        group: "Navigate",
        run: () => {
          document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
        },
      })),
      {
        id: "toggle-theme",
        label: "Toggle light / dark",
        hint: "◐",
        group: "Actions",
        run: () => toggleTheme(),
      },
      {
        id: "toggle-sketch",
        label: "Toggle sketch mode",
        hint: "Draw on the page",
        group: "Actions",
        run: onToggleSketch,
      },
      {
        id: "copy-email",
        label: "Copy email address",
        hint: "greeshma@studio.in",
        group: "Actions",
        run: () => {
          navigator.clipboard?.writeText("greeshma@studio.in");
        },
      },
      {
        id: "open-linkedin",
        label: "Open LinkedIn",
        hint: "↗",
        group: "Links",
        run: () => window.open("https://linkedin.com", "_blank"),
      },
      {
        id: "open-behance",
        label: "Open Behance",
        hint: "↗",
        group: "Links",
        run: () => window.open("https://behance.net", "_blank"),
      },
    ],
    [onToggleSketch]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(s) ||
        it.hint?.toLowerCase().includes(s) ||
        it.group.toLowerCase().includes(s)
    );
  }, [q, items]);

  useEffect(() => {
    if (open) {
      setQ("");
      setI(0);
      setTimeout(() => inputRef.current?.focus(), 10);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => setI(0), [q]);

  if (!open) return null;

  const groups = filtered.reduce<Record<string, CmdItem[]>>((acc, it) => {
    (acc[it.group] ||= []).push(it);
    return acc;
  }, {});
  const flat = filtered;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-background/50 px-4 pt-[16vh] backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background animate-scale-in"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
            ⌘K
          </span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setI((v) => Math.min(v + 1, flat.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setI((v) => Math.max(v - 1, 0));
              }
              if (e.key === "Enter") {
                e.preventDefault();
                const it = flat[i];
                if (it) {
                  it.run();
                  onClose();
                }
              }
            }}
            placeholder="Jump to a section, run a command…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            esc
          </kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {flat.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nothing matches "{q}".
            </p>
          )}
          {Object.entries(groups).map(([group, list]) => (
            <div key={group} className="mb-2">
              <p className="px-3 pb-1 pt-2 font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                {group}
              </p>
              {list.map((it) => {
                const idx = flat.indexOf(it);
                const isSel = idx === i;
                return (
                  <button
                    key={it.id}
                    onMouseEnter={() => setI(idx)}
                    onClick={() => {
                      it.run();
                      onClose();
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      isSel ? "bg-muted text-foreground" : "text-foreground/80"
                    }`}
                  >
                    <span>{it.label}</span>
                    {it.hint && (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {it.hint}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
          <span>↑ ↓ navigate · ↵ select</span>
          <span>Greeshma R. · v1.0</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Sketch overlay (canvas doodle) ---------------- */
function SketchOverlay({ on, onClear }: { on: boolean; onClear: () => void }) {
  const cvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!on) return;
    const canvas = cvs.current!;
    const dpr = window.devicePixelRatio || 1;
    let fadeRaf: number;

    const getBg = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--background").trim() ||
      "oklch(0.982 0.006 85)";

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };
    resize();

    const ctx = canvas.getContext("2d")!;
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#C96C4A";
    ctx.strokeStyle = accent;

    let drawing = false;
    let last = { x: 0, y: 0 };
    const start = (e: PointerEvent) => {
      drawing = true;
      last = { x: e.clientX, y: e.clientY };
    };
    const move = (e: PointerEvent) => {
      if (!drawing) return;
      const speed = Math.hypot(e.clientX - last.x, e.clientY - last.y);
      ctx.lineWidth = Math.max(1.2, 6 - speed * 0.12);
      ctx.globalAlpha = 0.98;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      ctx.globalAlpha = 1;
      last = { x: e.clientX, y: e.clientY };
    };
    const end = () => {
      drawing = false;
    };

    const fade = () => {
      ctx.fillStyle = getBg();
      ctx.globalAlpha = 0.035;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      fadeRaf = requestAnimationFrame(fade);
    };
    fadeRaf = requestAnimationFrame(fade);

    canvas.addEventListener("pointerdown", start);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(fadeRaf);
      canvas.removeEventListener("pointerdown", start);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("resize", resize);
    };
  }, [on]);

  if (!on) return null;
  return (
    <>
      <canvas
        ref={cvs}
        className="fixed inset-0 z-[45] cursor-crosshair touch-none"
        aria-label="Sketch canvas"
      />
      <div className="fixed left-1/2 top-6 z-[46] -translate-x-1/2 rounded-full border border-border bg-background/90 px-4 py-2 text-xs font-mono tracking-[0.2em] uppercase backdrop-blur-md">
        Sketch mode ·{" "}
        <button
          onClick={() => {
            const c = cvs.current;
            if (c) c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
          }}
          className="underline hover:text-accent"
        >
          clear
        </button>{" "}
        ·{" "}
        <button onClick={onClear} className="underline hover:text-accent">
          exit
        </button>
      </div>
    </>
  );
}

/* ---------------- Composed shell ---------------- */
export function CustomCursorPointer() {
  return <Cursor />;
}

export function AppShell() {
  const active = useActiveSection();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [sketch, setSketch] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setCmdOpen(false);
      }
      // Easter egg: press "d" (not typing) to toggle sketch
      const tag = (e.target as HTMLElement | null)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if (!typing && e.key.toLowerCase() === "d" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setSketch((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <ScrollProgressBar />
      <Cursor />
      <SectionDots active={active} />
      <StatusBar
        active={active}
        onOpenCmd={() => setCmdOpen(true)}
        sketchOn={sketch}
        onToggleSketch={() => setSketch((v) => !v)}
      />
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onToggleSketch={() => setSketch((v) => !v)}
      />
      <SketchOverlay on={sketch} onClear={() => setSketch(false)} />
    </>
  );
}
