import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-reveal";
import { type CaseStudy } from "@/lib/cms";
import { loadCaseStudyFromSanity, loadWorksFromSanity } from "@/lib/data";
import { AppShell } from "@/components/app/app-shell";
import { VideoPlayer } from "@/components/app/video-player";

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
  const [work, setWork] = useState<CaseStudy | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);
  const [allWorks, setAllWorks] = useState<CaseStudy[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    loadCaseStudyFromSanity(slug).then((result) => {
      if (cancelled) return;
      setWork(result);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    loadWorksFromSanity().then(setAllWorks);
  }, []);

  if (!loaded) {
    return <CaseStudyLoading />;
  }

  if (!work) throw notFound();

  return (
    <div className="redesign-page">
      <div className="redesign-callout">Case study view - editorial redesign</div>
      <CaseStudyNav work={work} allWorks={allWorks} />
      <CaseStudyHero work={work} />
      <CaseStudyContent work={work} />
      <CaseStudyFooter work={work} allWorks={allWorks} />
      <AppShell />
    </div>
  );
}

function CaseStudyLoading() {
  return (
    <div className="redesign-page">
      <div className="case-study-skeleton" aria-hidden="true">
        <div className="redesign-wrap">
          <div className="case-study-skeleton-line case-study-skeleton-eyebrow" />
          <div className="case-study-skeleton-line case-study-skeleton-title" />
          <div className="case-study-skeleton-hero" />
        </div>
      </div>
    </div>
  );
}

function CaseStudyNav({ work, allWorks }: { work: CaseStudy; allWorks: CaseStudy[] }) {
  return (
    <header className="redesign-header">
      <div className="redesign-wrap flex items-center justify-between gap-4">
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
  return (
    <section className="redesign-detail-hero">
      <div className="redesign-wrap redesign-detail-panel">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">
              {work.year} — {work.kicker}
            </p>
            <h1 className="editorial-h mt-6 text-5xl md:text-7xl lg:text-8xl">{work.title}</h1>
            <p className="mt-6 text-sm text-muted-foreground">{work.role}</p>
            <p className="mt-4 max-w-lg text-base leading-relaxed md:text-lg">{work.summary}</p>
          </div>
          <div className="hover-zoom">
            <img
              src={work.img}
              alt={work.title}
              className="w-full object-cover"
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
    <article className="redesign-wrap redesign-detail-content">
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
            <div className="overflow-hidden">
              <img src={img.src} alt={img.caption || ""} className="w-full object-cover" />
            </div>
            {section.video?.src && (
              <VideoPlayer
                src={section.video.src}
                autoplay={section.video.autoplay}
                loop={section.video.loop}
                poster={img.src}
                className="mt-4 w-full"
                alt={img.caption || ""}
              />
            )}
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
            <div className="overflow-hidden">
              <img src={img.src} alt={img.caption || ""} className="w-full object-cover" />
            </div>
            {section.video?.src && (
              <VideoPlayer
                src={section.video.src}
                autoplay={section.video.autoplay}
                loop={section.video.loop}
                poster={img.src}
                className="mt-4 w-full"
                alt={img.caption || ""}
              />
            )}
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
    return (
      <section className="mb-20 last:mb-0 w-full">
        {section.images?.[0] && (
          <div className="case-study-media mx-auto mb-10 overflow-hidden">
            <img src={section.images[0].src} alt="" className="w-full object-cover" />
          </div>
        )}
        {section.video?.src && (
          <VideoPlayer
            src={section.video.src}
            autoplay={section.video.autoplay}
            loop={section.video.loop}
            poster={section.images?.[0]?.src}
            className="case-study-media mx-auto mb-10 w-full"
            alt={section.title || ""}
          />
        )}
        <div className="mx-auto max-w-3xl">
          {section.title && (
            <h2 className="font-display text-3xl md:text-4xl">{section.title}</h2>
          )}
          {section.title && <div className="mt-4 h-px w-12 bg-accent" />}
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {section.content}
          </p>
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
      <div className="redesign-wrap">
        <div className="grid gap-12 md:grid-cols-2">
          <Link
            to="/work/$slug"
            params={{ slug: prev.slug }}
            className="group flex flex-col gap-2 border-r border-border pr-8 redesign-detail-link"
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
            className="group flex flex-col items-end gap-2 pl-8 text-right redesign-detail-link"
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
