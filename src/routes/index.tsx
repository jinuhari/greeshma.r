import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { CmsPanel } from "@/components/app/cms-panel";
import heroArt from "@/assets/hero-artwork.jpg";
import workImage from "@/assets/portrait.jpg";
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
  const [activeCategory, setActiveCategory] = useState("All work");
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

  useEffect(() => {
    const html = document.documentElement;
    if (cmsOpen) {
      html.classList.remove("has-custom-cursor");
    } else if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      html.classList.add("has-custom-cursor");
    }
  }, [cmsOpen]);

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
    if (!workCategories.includes(activeCategory)) {
      setActiveCategory("All work");
    }
  }, [activeCategory, workCategories]);

  const featuredWork: CaseStudy | undefined = shownWorks[0] || cmsWorks[0];
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

  return (
    <div className="redesign-page">
      <div className="redesign-callout">Static preview of the redesigned UI - now applied to the live app</div>

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
          <div className="redesign-stats">
            <div>
              <div className="k">11</div>
              <div className="v">years of practice</div>
            </div>
            <div>
              <div className="k">40+</div>
              <div className="v">projects shipped</div>
            </div>
            <div>
              <div className="k">3</div>
              <div className="v">research residencies</div>
            </div>
            <div>
              <div className="k">1</div>
              <div className="v">very long conversation with craft</div>
            </div>
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
              <span className="idx">01 / 04</span>
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
                <a href="#" className="link-underline">
                  Read the case study -&gt;
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <footer className="dock-wrap" id="contact">
        <div className="dock">
          <span className="dot" />
          <span className="now">Now</span>
          <span>Selected Work</span>
          <span className="percent">- 24%</span>
          <span className="divider" />
          <button type="button">Search <kbd>Cmd+K</kbd></button>
          <button type="button">Sketch</button>
          <button type="button" aria-label="Toggle view">
            O
          </button>
        </div>
      </footer>

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
