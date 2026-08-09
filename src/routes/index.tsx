import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CmsPanel } from "@/components/app/cms-panel";
import heroArt from "@/assets/hero-artwork.jpg";
import workImage from "@/assets/portrait.jpg";
import { useTheme } from "@/hooks/use-reveal";
import { type CaseStudy } from "@/lib/cms";
import {
  defaultResumes,
  loadArchive,
  loadArchiveFromSanity,
  loadTimeline,
  loadTimelineFromSanity,
  loadWorks,
  loadWorksFromSanity,
} from "@/lib/data";
import type { Resume } from "@/lib/data";

export const Route = createFileRoute("/")({
  component: Home,
});

function getWorkCategories(work: CaseStudy): string[] {
  return (work.categories || []).map((category) => category.trim()).filter(Boolean);
}

function Home() {
  useTheme();
  const [activeCategory, setActiveCategory] = useState("All work");
  const [workCursor, setWorkCursor] = useState(0);
  const [cmsWorks, setCmsWorks] = useState(() => loadWorks());
  const [cmsArchive, setCmsArchive] = useState(() => loadArchive());
  const [cmsTimeline, setCmsTimeline] = useState(() => loadTimeline());
  const [cmsResumes, setCmsResumes] = useState<Resume[]>(() => defaultResumes());
  const [cmsOpen, setCmsOpen] = useState(false);
  const cmsClicks = useRef(0);

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

  const categoryLabel = useMemo(() => {
    if (activeCategory === "All work") return "Selected Work";
    return activeCategory;
  }, [activeCategory]);

  const cmsCategories = useMemo(
    () => Array.from(new Set(cmsWorks.flatMap((work) => getWorkCategories(work)))),
    [cmsWorks],
  );

  const workCategories = useMemo(() => {
    return ["All work", ...cmsCategories];
  }, [cmsCategories]);

  const shownWorks = useMemo(
    () =>
      cmsWorks.filter(
        (work) =>
          activeCategory === "All work" ||
          getWorkCategories(work).includes(activeCategory),
      ),
    [activeCategory, cmsWorks],
  );

  useEffect(() => {
    setWorkCursor(0);
  }, [activeCategory]);

  useEffect(() => {
    if (shownWorks.length === 0) {
      setWorkCursor(0);
      return;
    }
    if (workCursor > shownWorks.length - 1) {
      setWorkCursor(shownWorks.length - 1);
    }
  }, [shownWorks, workCursor]);

  useEffect(() => {
    if (!workCategories.includes(activeCategory)) {
      setActiveCategory("All work");
    }
  }, [activeCategory, workCategories]);

  const featuredWork: CaseStudy | undefined = shownWorks[workCursor] || shownWorks[0] || cmsWorks[0];
  const featuredImage = featuredWork?.img || workImage;
  const featuredYear = featuredWork?.year || "2023";
  const featuredKicker = featuredWork?.kicker || "Mobile commerce";
  const featuredTitle = featuredWork?.title || "Udaan";
  const featuredRole = featuredWork?.role || "Lead Product Designer";
  const featuredSummary =
    featuredWork?.summary ||
    "Designing mobile experiences and the visual systems that hold campaigns together for 3M+ retail partners.";
  const featuredTags =
    (featuredWork ? getWorkCategories(featuredWork).slice(0, 2) : null) ||
    ["UI Design", "Design Systems"];
  const shownTotal = shownWorks.length || (featuredWork ? 1 : 0);
  const shownIndex = shownWorks.length > 0 ? workCursor + 1 : featuredWork ? 1 : 0;

  return (
    <div className="redesign-page">
      <header className="redesign-header">
        <div className="redesign-logo">
          <span
            className="name"
            onClick={() => {
              cmsClicks.current += 1;
              if (cmsClicks.current >= 6) {
                cmsClicks.current = 0;
                setCmsOpen(true);
              }
            }}
          >
            Greeshma R.
          </span>
          <span className="tag">- Designer, Illustrator</span>
        </div>
        <nav>
          <a href="#work">Work</a>
          <a href="#archive">Archive</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="redesign-hero" id="top">
        <div className="redesign-hero-bg">
          <img src={heroArt} alt="" width={1800} height={1200} />
        </div>
        <div className="redesign-wrap">
          <p className="eyebrow">A multidisciplinary design practice - 2013 - Present</p>
          <h1 className="headline editorial-h">
            Designing
            <br />
            <span className="italic text-accent">thoughtful</span> digital
            <br />
            products through
            <br />
            research &amp; craft.
          </h1>
          <p className="sub">
            Greeshma R. is a multidisciplinary designer working at the seam of product, brand,
            illustration and research.
          </p>
          <div className="cta-row">
            <a href="#work" className="notch-btn">
              View Selected Work <span aria-hidden="true">-&gt;</span>
            </a>
            <a href="#contact" className="link-underline">
              Download Resume
            </a>
          </div>
        </div>
      </section>

      <section className="redesign-block" id="work">
        <div className="redesign-wrap">
          <p className="eyebrow">{categoryLabel} - 2020 - 2024</p>
          <h2 className="editorial-h category-heading">
            Browse by <span className="italic text-accent">category.</span>
          </h2>

          <div className="filters">
            {workCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`notch-tag ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>

          <article className="work-card" id="archive">
            <div>
              <span className="idx">
                {String(shownIndex).padStart(2, "0")} / {String(shownTotal).padStart(2, "0")}
              </span>
              <img src={featuredImage} alt={`${featuredTitle} case study`} width={1500} height={1000} />
            </div>
            <div>
              <p className="eyebrow">
                {featuredYear} - {featuredKicker}
              </p>
              <h3 className="editorial-h">{featuredTitle}</h3>
              <p className="role">{featuredRole}</p>
              <p className="work-copy">{featuredSummary}</p>
              <div className="tags">
                {featuredTags.map((tag) => (
                  <span className="notch-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="work-link-wrap">
                <a href={featuredWork ? `/work/${featuredWork.slug}` : "#"} className="link-underline">
                  Read the case study -&gt;
                </a>
              </div>
              {shownWorks.length > 1 && (
                <div className="carousel-controls" aria-label="Case study carousel controls">
                  <button
                    type="button"
                    className="carousel-btn"
                    onClick={() =>
                      setWorkCursor((prev) =>
                        shownWorks.length === 0 ? 0 : (prev - 1 + shownWorks.length) % shownWorks.length,
                      )
                    }
                    aria-label="Previous case study"
                  >
                    ←
                  </button>
                  <span className="carousel-counter">
                    {shownIndex} / {shownTotal}
                  </span>
                  <button
                    type="button"
                    className="carousel-btn"
                    onClick={() =>
                      setWorkCursor((prev) =>
                        shownWorks.length === 0 ? 0 : (prev + 1) % shownWorks.length,
                      )
                    }
                    aria-label="Next case study"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </article>
        </div>
      </section>

      <section className="redesign-block" id="experience">
        <div className="redesign-wrap">
          <p className="eyebrow">Experience</p>
          <h2 className="editorial-h category-heading">Selected timeline.</h2>
          <div className="timeline-list">
            {cmsTimeline.map((item, i) => (
              <article key={`${item.year}-${i}`} className="timeline-item">
                <p className="year">{item.year}</p>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.where}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="redesign-block" id="about">
        <div className="redesign-wrap">
          <p className="eyebrow">About</p>
          <h2 className="editorial-h category-heading">A multidisciplinary design practice.</h2>
          <p className="work-copy max-w-3xl">
            Greeshma works across product, brand, illustration, and research with a craft-first
            approach to digital experiences. Her practice bridges systems thinking with editorial
            sensitivity, turning insights into tangible products and visual narratives.
          </p>
        </div>
      </section>

      <section className="redesign-block" id="contact">
        <div className="redesign-wrap">
          <p className="eyebrow">Contact</p>
          <h2 className="editorial-h category-heading">Let us work together.</h2>
          <p className="work-copy max-w-2xl">For collaborations, product work, and design consulting.</p>
          <div className="cta-row">
            <a className="notch-btn" href="mailto:hello@greeshma.design">
              hello@greeshma.design
            </a>
            <a className="link-underline" href="/print-resume?role=Product%20Design" target="_blank" rel="noreferrer">
              Open Resume
            </a>
          </div>
        </div>
      </section>

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
    </div>
  );
}
