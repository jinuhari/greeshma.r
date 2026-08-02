import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-reveal";
import { type CaseStudy } from "@/lib/cms";
import { loadWorks, loadCaseStudyFromSanity } from "@/lib/data";
import { AppShell } from "@/components/app/app-shell";

export const Route = createFileRoute("/work/$slug")({
  component: CaseStudyPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="editorial-h mt-4 text-6xl">Case study not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This case study hasn't been written yet.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center border-b border-foreground pb-1 text-sm tracking-wide hover:border-accent hover:text-accent"
        >
          Return to the gallery
        </Link>
      </div>
    </div>
  ),
});

function CaseStudyPage() {
  useTheme();
  const { slug } = Route.useParams();
  const [work, setWork] = useState<CaseStudy | undefined>(() =>
    loadWorks().find((w) => w.slug === slug),
  );
  const [allWorks, setAllWorks] = useState(() => loadWorks());

  useEffect(() => {
    loadCaseStudyFromSanity(slug).then((result) => {
      if (result) setWork(result);
    });
  }, [slug]);

  useEffect(() => {
    import("@/lib/data").then((m) => m.loadWorksFromSanity().then(setAllWorks));
  }, []);

  if (!work) throw notFound();

  return (
    <div className="bg-background text-foreground">
      <CaseStudyNav work={work} allWorks={allWorks} />
      <CaseStudyHero work={work} />
      <CaseStudyContent work={work} />
      <CaseStudyFooter work={work} allWorks={allWorks} />
      <AppShell />
    </div>
  );
}

function CaseStudyNav({ work, allWorks }: { work: CaseStudy; allWorks: CaseStudy[] }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12">
        <Link to="/" className="flex items-center gap-2 text-sm hover:text-accent">
          <span>←</span>
          <span className="font-mono text-xs tracking-[0.2em] uppercase">Back</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-display text-sm">{work.title}</span>
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            {work.n} / {String(allWorks.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </header>
  );
}

function CaseStudyHero({ work }: { work: CaseStudy }) {
  const toneMap: Record<string, string> = {
    terracotta: "bg-terracotta/10",
    coral: "bg-coral/10",
    forest: "bg-forest/10",
    indigo: "bg-indigo/10",
  };

  const badgeMap: Record<string, string> = {
    terracotta: "bg-terracotta/15 text-terracotta border-terracotta/30",
    coral: "bg-coral/15 text-coral border-coral/30",
    forest: "bg-forest/15 text-forest border-forest/30",
    indigo: "bg-indigo/15 text-indigo border-indigo/30",
  };

  return (
    <section className="pt-28 md:pt-36">
      <div
        className={`${toneMap[work.tone] || "bg-muted"} mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24`}
      >
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">
              {work.year} — {work.kicker}
            </p>
            <h1 className="editorial-h mt-6 text-5xl md:text-7xl lg:text-8xl">{work.title}</h1>
            <p className="mt-6 text-sm text-muted-foreground">{work.role}</p>
            <p className="mt-4 max-w-lg text-base leading-relaxed md:text-lg">{work.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {work.client && (
                <span
                  className={`rounded-full border px-3 py-1.5 text-xs tracking-wide ${badgeMap[work.tone] || "border-border text-muted-foreground"}`}
                >
                  {work.client}
                </span>
              )}
              {work.timeline && (
                <span className="rounded-full border border-border px-3 py-1.5 text-xs tracking-wide text-muted-foreground">
                  {work.timeline}
                </span>
              )}
            </div>
          </div>
          <div className="hover-zoom rounded-lg">
            <img
              src={work.img}
              alt={work.title}
              className="w-full rounded-lg object-cover"
              width={1600}
              height={1100}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseStudyContent({ work }: { work: CaseStudy }) {
  return (
    <article className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-3xl">
        <dl className="mb-20 grid grid-cols-2 gap-8 border-b border-border pb-12 md:grid-cols-4">
          {work.outcomes.map((o) => (
            <div key={o.k}>
              <dt className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                {o.k}
              </dt>
              <dd className="mt-2 font-display text-3xl">{o.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Keep the editorial copy easy to read, while letting every visual use the
          full case-study canvas. */}
      <div className="case-study-sections">
        {work.sections.map((section, i) => (
          <SectionRenderer key={i} section={section} />
        ))}
      </div>

      <div className="mx-auto max-w-3xl">
        {work.tools && work.tools.length > 0 && (
          <div className="border-t border-border pt-12">
            <h3 className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Tools & technologies
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {work.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs tracking-wide"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function SectionRenderer({ section }: { section: import("@/lib/cms").CaseStudySection }) {
  if (section.type === "image") {
    return (
      <section className="case-study-media mb-20 last:mb-0">
        {section.images?.map((img, i) => (
          <figure key={i} className="relative">
            <div className="overflow-hidden rounded-lg bg-muted">
              <img src={img.src} alt={img.caption || ""} className="w-full object-cover" />
            </div>
            {img.caption && (
              <figcaption className="mt-3 px-6 text-center text-xs text-muted-foreground md:px-12">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </section>
    );
  }

  if (section.type === "full-bleed") {
    return (
      <section className="case-study-media mb-20 last:mb-0">
        {section.images?.map((img, i) => (
          <figure key={i} className="relative">
            <div className="overflow-hidden rounded-lg bg-muted">
              <img src={img.src} alt={img.caption || ""} className="w-full object-cover" />
            </div>
            {img.caption && (
              <figcaption className="mt-3 px-6 text-center text-xs text-muted-foreground md:px-12">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </section>
    );
  }

  if (section.type === "image-text") {
    const pos = section.imagePosition || "left";
    return (
      <section className="mb-20 last:mb-0 w-full">
        <div className={`grid items-center gap-10 md:grid-cols-2 ${pos === "right" ? "" : ""}`}>
          {pos === "right" ? (
            <>
              <div>
                {section.title && (
                  <h2 className="font-display text-3xl md:text-4xl">{section.title}</h2>
                )}
                {section.title && <div className="mt-4 h-px w-12 bg-accent" />}
                <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {section.content}
                </p>
              </div>
              {section.images?.[0] && (
                <div className="overflow-hidden rounded-lg bg-muted">
                  <img src={section.images[0].src} alt="" className="w-full object-cover" />
                </div>
              )}
            </>
          ) : (
            <>
              {section.images?.[0] && (
                <div className="overflow-hidden rounded-lg bg-muted">
                  <img src={section.images[0].src} alt="" className="w-full object-cover" />
                </div>
              )}
              <div>
                {section.title && (
                  <h2 className="font-display text-3xl md:text-4xl">{section.title}</h2>
                )}
                {section.title && <div className="mt-4 h-px w-12 bg-accent" />}
                <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {section.content}
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-20 last:mb-0 mx-auto max-w-3xl">
      {section.title && <h2 className="font-display text-3xl md:text-4xl">{section.title}</h2>}
      {section.title && <div className="mt-6 h-px w-12 bg-accent" />}
      {section.content && (
        <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          {section.content}
        </p>
      )}
    </section>
  );
}

function CaseStudyFooter({
  work,
  allWorks: _allWorks,
}: {
  work: CaseStudy;
  allWorks: CaseStudy[];
}) {
  const allWorks = _allWorks;
  const currentIndex = allWorks.findIndex((w) => w.slug === work.slug);
  const prev = currentIndex > 0 ? allWorks[currentIndex - 1] : allWorks[allWorks.length - 1];
  const next = currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : allWorks[0];

  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-2">
          <Link
            to="/work/$slug"
            params={{ slug: prev.slug }}
            className="group flex flex-col gap-2 border-r border-border pr-8"
          >
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              ← Previous
            </span>
            <span className="font-display text-2xl transition-colors group-hover:text-accent md:text-3xl">
              {prev.title}
            </span>
            <span className="text-xs text-muted-foreground">{prev.kicker}</span>
          </Link>

          <Link
            to="/work/$slug"
            params={{ slug: next.slug }}
            className="group flex flex-col items-end gap-2 pl-8 text-right"
          >
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Next →
            </span>
            <span className="font-display text-2xl transition-colors group-hover:text-accent md:text-3xl">
              {next.title}
            </span>
            <span className="text-xs text-muted-foreground">{next.kicker}</span>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm tracking-wide hover:border-accent hover:text-accent"
          >
            ← Back to all work
          </Link>
        </div>
      </div>
    </section>
  );
}
