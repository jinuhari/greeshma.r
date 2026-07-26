import { Link, createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReveal, useTheme, toggleTheme } from "@/hooks/use-reveal";
import { AppShell } from "@/components/app/app-shell";
import { type CaseStudy } from "@/lib/cms";
import { loadWorks, loadWorksFromSanity, loadArchive, loadArchiveFromSanity, loadTimeline, loadTimelineFromSanity, defaultResumes } from "@/lib/data";
import type { Resume } from "@/lib/data";
import { CmsPanel } from "@/components/app/cms-panel";

import heroArt from "@/assets/hero-artwork.jpg";
import portrait from "@/assets/portrait.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const skills = {
  "Product Design": ["UI Design", "Interaction", "Prototyping", "Design Systems", "Accessibility"],
  "Visual Design": ["Editorial", "Layout", "Typography", "Color", "Iconography"],
  Research: ["Ethnography", "Participatory design", "Interviews", "Synthesis", "Journey mapping"],
  Branding: ["Identity", "Guidelines", "Naming", "Voice", "Wordmarks"],
  Illustration: ["Gouache", "Watercolour", "Digital", "Folk-inspired", "Botanical"],
  Motion: ["After Effects", "Lottie", "Rive", "Micro-interactions"],
  "AI Tools": ["Midjourney", "Figma AI", "ChatGPT", "Runway"],
  "Design Systems": ["Tokens", "Components", "Documentation", "Governance"],
};

function Home() {
  useTheme();
  useReveal();
  const [scrolled, setScrolled] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [cmsWorks, setCmsWorks] = useState(() => loadWorks());
  const [cmsArchive, setCmsArchive] = useState(() => loadArchive());
  const [cmsTimeline, setCmsTimeline] = useState(() => loadTimeline());
  const [cmsResumes, setCmsResumes] = useState(() => defaultResumes());
  const [cmsOpen, setCmsOpen] = useState(false);

  const refreshAll = useCallback(async () => {
    const [w, a, t] = await Promise.all([
      loadWorksFromSanity(),
      loadArchiveFromSanity(),
      loadTimelineFromSanity(),
    ]);
    if (w.length) setCmsWorks(w);
    if (a.length) setCmsArchive(a);
    if (t.length) setCmsTimeline(t);
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    const html = document.documentElement;
    if (cmsOpen) {
      html.classList.remove("has-custom-cursor");
    } else {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        html.classList.add("has-custom-cursor");
      }
    }
  }, [cmsOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? 0 : (i + 1) % cmsArchive.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? 0 : (i - 1 + cmsArchive.length) % cmsArchive.length));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  return (
    <div className="bg-background text-foreground">
      <Nav scrolled={scrolled} onCmsOpen={() => setCmsOpen(true)} />
      <Hero />
      <Marquee />
      <SelectedWork works={cmsWorks} />
      <Archive archive={cmsArchive} onOpen={setLightbox} />
      <Timeline items={cmsTimeline} />
      <Skills />
      <About />
      <Contact resumes={cmsResumes} />
      <Footer />
      {lightbox !== null && <Lightbox archive={cmsArchive} index={lightbox} onClose={() => setLightbox(null)} onNav={setLightbox} />}
      {cmsOpen && (
        <CmsPanel
          works={cmsWorks}
          setWorks={setCmsWorks}
          archive={cmsArchive}
          setArchive={setCmsArchive}
          timeline={cmsTimeline}
          setTimeline={setCmsTimeline}
          resumes={cmsResumes}
          setResumes={setCmsResumes}
          onRefresh={refreshAll}
          onClose={() => {
            setCmsOpen(false);
            refreshAll();
          }}
        />
      )}
      <AppShell />
    </div>
  );
}

function Nav({ scrolled, onCmsOpen }: { scrolled: boolean; onCmsOpen: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cmsClicks = useRef(0);
  const links = [
    { href: "#work", label: "Work" },
    { href: "#archive", label: "Archive" },
    { href: "#experience", label: "Experience" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12">
        <a href="#top" className="flex items-center gap-3">
          <span
            className="font-display text-xl tracking-tight cursor-pointer"
            onClick={() => {
              cmsClicks.current += 1;
              if (cmsClicks.current >= 6) {
                cmsClicks.current = 0;
                onCmsOpen();
              }
            }}
          >
            Greeshma R.
          </span>
          <span className="hidden text-[10px] tracking-[0.25em] text-muted-foreground uppercase md:inline">
            — Designer, Illustrator
          </span>
        </a>
        <nav className="hidden gap-8 text-sm md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative pb-1 tracking-wide transition-colors hover:text-accent after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-accent after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-50 flex h-6 w-6 flex-col items-center justify-center md:hidden"
        >
          <span className={`h-px w-5 bg-foreground transition-all ${menuOpen ? 'translate-y-[4px] rotate-45' : ''}`} />
          <span className={`h-px w-5 bg-foreground transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-px w-5 bg-foreground transition-all ${menuOpen ? '-translate-y-[4px] -rotate-45' : ''}`} />
        </button>
      </div>
      {menuOpen && (
        <nav className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-background md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-4xl tracking-tight transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[100dvh] overflow-hidden pt-32 md:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.22]">
        <img
          src={heroArt}
          alt=""
          className="h-full w-full object-cover animate-drift"
          width={1600}
          height={1200}
        />
      </div>
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <p className="eyebrow reveal">A digital exhibition · 2013 — Present</p>
        <h1 className="editorial-h reveal mt-8 text-[13vw] leading-[0.9] md:text-[9vw] lg:text-[8rem]">
          Designing
          <br />
          <span className="italic text-accent">thoughtful</span> digital
          <br />
          products through
          <br />
          research, storytelling
          <br />
          <span className="text-muted-foreground">&amp; craft.</span>
        </h1>

        <div className="reveal mt-16 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Greeshma R. is a multidisciplinary designer working at the seam of
            product, brand, illustration and research — an artist first,
            trained through fine arts, film and interaction design.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#work"
              className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-4 text-sm text-background transition-all hover:bg-accent"
            >
              View Selected Work
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#contact"
              className="border-b border-foreground pb-1 text-sm tracking-wide hover:border-accent hover:text-accent"
            >
              Download Résumé
            </a>
          </div>
        </div>

        <div className="reveal mt-24 grid grid-cols-2 gap-8 border-t border-border pt-8 text-sm md:grid-cols-4">
          {[
            ["11", "years of practice"],
            ["40+", "projects shipped"],
            ["3", "research residencies"],
            ["1", "very long conversation with craft"],
          ].map(([k, v]) => (
            <div key={v}>
              <div className="font-display text-3xl">{k}</div>
              <div className="mt-2 text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Product Design",
    "Visual Design",
    "Illustration",
    "Interaction Design",
    "UX Research",
    "Branding",
    "Motion",
    "Typography",
  ];
  const row = [...items, ...items];
  return (
    <div className="mt-28 overflow-hidden border-y border-border py-8">
      <div className="marquee flex w-max gap-16 whitespace-nowrap">
        {row.map((t, i) => (

          <span key={i} className="font-display text-4xl md:text-6xl">
            {t} <span className="text-accent">✦</span>
          </span>

        ))}
      </div>
    </div>
  );
}

function SelectedWork({ works: worksProp }: { works: CaseStudy[] }) {
  return (
    <section id="work" className="mx-auto max-w-[1440px] px-6 py-32 md:px-12 md:py-48">
      <div className="reveal grid grid-cols-1 items-end gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="eyebrow">Selected Work · 2020 — 2024</p>
          <h2 className="editorial-h mt-6 text-5xl md:text-7xl">
            {worksProp.length === 4 ? "Four exhibits" : `${worksProp.length} exhibits`}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Each piece here is a study in restraint — a product, an identity, a
          field study — presented as it was made, not as a card in a grid.
        </p>
      </div>

      <div className="mt-24 space-y-40">
        {worksProp.map((w, i) => (
          <article
            key={w.slug}
            className={`reveal grid grid-cols-1 items-center gap-12 md:grid-cols-12 ${
              i % 2 === 1 ? "md:[direction:rtl]" : ""
            }`}
          >
            <div className="hover-zoom md:col-span-7 md:[direction:ltr]">
              <div className="relative">
                <img
                  src={w.img}
                  alt={w.title}
                  loading="lazy"
                  width={1600}
                  height={1100}
                  className="w-full object-cover"
                />
                <span
                  className="absolute -top-4 -left-2 font-mono text-xs tracking-[0.2em] text-muted-foreground md:-left-8"
                >
                    {w.n} / {String(worksProp.length).padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="md:col-span-5 md:[direction:ltr] md:px-6">
              <p className="eyebrow">
                {w.year} — {w.kicker}
              </p>
              <h3 className="editorial-h mt-4 text-4xl md:text-6xl">{w.title}</h3>
              <p className="mt-6 text-sm text-muted-foreground">{w.role}</p>
              <p className="mt-6 text-base leading-relaxed md:text-lg">{w.summary}</p>

              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6">
                {w.outcomes.map((o) => (
                  <div key={o.k}>
                    <dt className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                      {o.k}
                    </dt>
                    <dd className="mt-2 font-display text-2xl">{o.v}</dd>
                  </div>
                ))}
              </dl>

              <Link
                to="/work/$slug"
                params={{ slug: w.slug || w.title.toLowerCase().replace(/\s+/g, "-") }}
                className="mt-10 inline-flex items-center gap-3 border-b border-foreground pb-1 text-sm hover:border-accent hover:text-accent"
              >
                Read the case study
                <span>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Archive({ archive: archiveProp, onOpen }: { archive: import("@/lib/data").ArchiveItem[]; onOpen: (i: number) => void }) {
  const [filter, setFilter] = useState<string>("All");
  const cats = ["All", ...Array.from(new Set(archiveProp.map((a) => a.cat)))];
  const shown = archiveProp
    .map((a, i) => ({ ...a, i }))
    .filter((a) => filter === "All" || a.cat === filter);

  return (
    <section id="archive" className="bg-warm-gray py-32 md:py-48">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="reveal flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Creative Archive</p>
            <h2 className="editorial-h mt-6 text-5xl md:text-7xl">
              A room for
              <br />
              <span className="italic">everything else.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-4 py-2 text-xs tracking-wide transition-all ${
                  filter === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {shown.map((a) => (
            <button
              key={`${a.label}-${a.i}`}
              onClick={() => onOpen(a.i)}
              className="hover-zoom group relative block w-full break-inside-avoid text-left"
            >
              <div className={`${a.ratio} w-full overflow-hidden bg-muted`}>
                <img
                  src={a.src}
                  alt={a.label}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <p className="font-display text-lg">{a.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.cat} · {a.year}
                  </p>
                </div>
                <span className="text-xs opacity-0 transition-opacity group-hover:opacity-100">
                  View →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Lightbox({
  archive: archiveProp,
  index,
  onClose,
  onNav,
}: {
  archive: import("@/lib/data").ArchiveItem[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}) {
  const a = archiveProp[index];
  if (!a) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-6 top-6 text-xs tracking-[0.2em] uppercase"
        aria-label="Close"
      >
        Close ✕
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNav((index - 1 + archiveProp.length) % archiveProp.length);
        }}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl"
        aria-label="Previous"
      >
        ←
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNav((index + 1) % archiveProp.length);
        }}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl"
        aria-label="Next"
      >
        →
      </button>
      <div
        className="mx-auto flex max-h-[85vh] max-w-[1100px] flex-col items-center gap-6 px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={a.src} alt={a.label} className="max-h-[70vh] w-auto object-contain" />
        <div className="w-full max-w-2xl text-center">
          <p className="eyebrow">{a.cat} · {a.year}</p>
          <h3 className="font-display mt-3 text-3xl">{a.label}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{a.medium}</p>
        </div>
      </div>
    </div>
  );
}

function Timeline({ items }: { items: import("@/lib/data").TimelineItem[] }) {
  return (
    <section id="experience" className="mx-auto max-w-[1440px] px-6 py-32 md:px-12 md:py-48">
      <div className="reveal max-w-2xl">
        <h2 className="editorial-h mt-6 text-5xl md:text-7xl">
          A slow crossing
          <br />
          <span className="italic">from canvas to code.</span>
        </h2>
      </div>

      <ol className="relative mt-24 border-l border-border pl-8 md:mx-auto md:max-w-3xl md:pl-12">
        {items.map((t, i) => (
          <li key={i} className="reveal relative pb-16 last:pb-0">
            <span className="absolute -left-[41px] top-2 h-3 w-3 rounded-full bg-accent md:-left-[49px]" />
            <div className="grid grid-cols-[auto_1fr] items-baseline gap-6">
              <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                {t.year}
              </span>
              <div>
                <h3 className="font-display text-2xl md:text-3xl">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">{t.where}</p>
              </div>
            </div>
            {i < items.length - 1 && (
              <span className="absolute -left-[35px] top-6 h-full w-px md:-left-[43px]" />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Skills() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (group: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };
  return (
    <section className="bg-warm-gray py-32 md:py-48">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="reveal max-w-2xl">
          <h2 className="editorial-h text-5xl md:text-7xl">
            Tools of the trade.
          </h2>
        </div>
        <div className="mt-20 grid gap-x-16 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group} className="reveal">
              <button
                onClick={() => toggle(group)}
                className="flex w-full items-center justify-between gap-3 text-left font-display text-xl transition-colors hover:text-accent"
              >
                {group}
                <span className={`text-xs text-muted-foreground transition-transform duration-300 ${expanded.has(group) ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              <div className="mt-4 h-px w-8 bg-accent" />
              {expanded.has(group) && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {items.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs tracking-wide transition-colors hover:border-accent hover:text-accent"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-[1440px] px-6 py-32 md:px-12 md:py-48">
      <div className="grid gap-16 md:grid-cols-12">
        <div className="reveal md:col-span-5">
          <div className="hover-zoom aspect-[4/5] w-full overflow-hidden bg-muted">
            <img
              src={portrait}
              alt="Portrait of Greeshma R."
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Studio, Bengaluru — 2024
          </p>
        </div>
        <div className="reveal md:col-span-7 md:pt-16">
          <h2 className="editorial-h mt-6 text-4xl md:text-6xl">
            I started as an artist —
            <br />
            <span className="italic text-accent">then everything else followed.</span>
          </h2>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              My hands learned pigment before pixels. Fine arts gave me the
              discipline of the long look; visual communication taught me to
              hold an audience; film production taught me to hold a frame.
            </p>
            <p>
              Interaction design at IIT Hyderabad — followed by residencies at
              Suzuki Innovation Centre and the IISc National Design Innovation
              Network — gave me the vocabulary to bring all of it to digital
              products.
            </p>
            <p className="text-foreground">
              Today, at Udaan, I design mobile experiences, campaigns and the
              visual systems that hold them together — trying to keep the
              craft of the studio inside the discipline of the product.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact({ resumes }: { resumes?: Resume[] }) {
  const rs = resumes || defaultResumes();
  const items: { k: string; v: string; href: string; dl?: string }[] = [
    { k: "Email", v: "greeshma@studio.in", href: "mailto:greeshma@studio.in" },
    { k: "LinkedIn", v: "/in/greeshma-r", href: "https://linkedin.com" },
    { k: "Behance", v: "/greeshma", href: "https://behance.net" },
  ];
  if (rs.length > 0) {
    items.push({
      k: "Résumé — " + rs[0].role,
      v: "Download JSON",
      href: `data:application/json;charset=utf-8,${encodeURIComponent(rs[0].json)}`,
      dl: `resume-${rs[0].role.toLowerCase().replace(/[\s\/]+/g, "-")}.json`,
    });
  }
  return (
    <section id="contact" className="border-t border-border py-32 md:py-48">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="reveal">
          <h2 className="editorial-h mt-6 text-[12vw] leading-[0.95] md:text-[9rem]">
            Let's make
            <br />
            something
            <br />
            <span className="italic text-accent">worth keeping.</span>
          </h2>
        </div>

        <div className="reveal mt-24 grid gap-12 border-t border-border pt-12 md:grid-cols-4">
          {items.map((c) => (
            <a
              key={c.k}
              href={c.href}
              download={c.dl}
              className="group block"
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                {c.k}
              </p>
              <p className="font-display mt-3 text-2xl transition-colors group-hover:text-accent">
                {c.v} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}



function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 px-6 text-xs text-muted-foreground md:flex-row md:items-center md:px-12">
        <p>© {new Date().getFullYear()} Greeshma R. — All work shown with permission.</p>
        <p className="tracking-[0.2em] uppercase">Designed &amp; built with care · Bengaluru</p>
      </div>
    </footer>
  );
}
