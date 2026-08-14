import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CustomCursorPointer } from "@/components/app/app-shell";
import { CmsPanel } from "@/components/app/cms-panel";
import { DotMatrixHero } from "@/components/app/dot-matrix-hero";
import heroArt from "@/assets/hero-artwork.jpg";
import workImage from "@/assets/greeshma bgremoved.png";
import { useTheme } from "@/hooks/use-reveal";
import { type CaseStudy } from "@/lib/cms";
import {
  defaultResumes,
  loadArchive,
  loadArchiveFromSanity,
  loadTimeline,
  loadTimelineFromSanity,
  loadWorksFromSanity,
} from "@/lib/data";
import type { Resume } from "@/lib/data";

export const Route = createFileRoute("/")({
  component: Home,
});

function getWorkCategories(work: CaseStudy): string[] {
  return (work.categories || []).map((category) => category.trim()).filter(Boolean);
}

const WORKS_PAGE_SIZE = 4;

function Home() {
  useTheme();
  const [activeCategory, setActiveCategory] = useState("All work");
  const [showAllWorks, setShowAllWorks] = useState(false);
  const [cmsWorks, setCmsWorks] = useState<CaseStudy[]>([]);
  const [worksLoading, setWorksLoading] = useState(true);
  const [cmsArchive, setCmsArchive] = useState(() => loadArchive());
  const [cmsTimeline, setCmsTimeline] = useState(() => loadTimeline());
  const [cmsResumes, setCmsResumes] = useState<Resume[]>(() => defaultResumes());
  const [cmsOpen, setCmsOpen] = useState(false);
  const cmsClicks = useRef(0);
  // Guards against out-of-order responses so a slow, stale fetch can never clobber a newer one.
  const refreshToken = useRef(0);

  const refreshAll = useCallback(async () => {
    const token = ++refreshToken.current;
    const [w, a, t] = await Promise.all([
      loadWorksFromSanity(),
      loadArchiveFromSanity(),
      loadTimelineFromSanity(),
    ]);
    if (token !== refreshToken.current) return;
    if (w.length) setCmsWorks(w);
    if (a.length) setCmsArchive(a);
    if (t.length) setCmsTimeline(t);
    setWorksLoading(false);
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
    if (!workCategories.includes(activeCategory)) {
      setActiveCategory("All work");
    }
  }, [activeCategory, workCategories]);

  useEffect(() => {
    setShowAllWorks(false);
  }, [activeCategory]);

  const visibleWorks = showAllWorks ? shownWorks : shownWorks.slice(0, WORKS_PAGE_SIZE);

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
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="redesign-hero" id="top">
        <div className="redesign-hero-bg">
          <img src={heroArt} alt="" width={1800} height={1200} />
        </div>
        <DotMatrixHero />
        <div className="redesign-wrap redesign-hero-grid">
          <div className="hero-copy">
            <p className="hero-intro">Design practice 2013 - present</p>
            <h1 className="headline editorial-h">
              Product interfaces shaped with an illustrator's eye and a research-led process.
            </h1>
            <p className="sub">
              Greeshma R. designs digital products, visual systems, and brand-sensitive surfaces
              with a focus on clarity, rhythm, and finish.
            </p>
            <div className="cta-row">
              <a href="#work" className="notch-btn">
                View selected work
              </a>
              <a
                href="/print-resume?role=Product%20Design"
                className="link-underline"
                target="_blank"
                rel="noreferrer"
              >
                Open resume
              </a>
            </div>
          </div>
          <figure className="hero-portrait-frame">
            <div className="hero-portrait">
              <img src={workImage} alt="Portrait of Greeshma R." width={1200} height={1500} />
            </div>
          </figure>
        </div>
      </section>

      <section className="redesign-block work-section" id="work">
        <div className="redesign-wrap">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">{categoryLabel}</p>
              <h2 className="editorial-h category-heading">
                Case studies arranged through category, not a gallery grid.
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="redesign-block work-curation">
        <div className="redesign-wrap">
          {worksLoading ? (
            <div className="work-grid work-grid-loading" aria-hidden="true">
              <div className="work-card-skeleton" />
              <div className="work-card-skeleton" />
            </div>
          ) : (
            <>
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

              <div className="work-grid">
                {visibleWorks.map((work) => (
                  <article className="work-card" key={work.slug}>
                    <a href={`/work/${work.slug}`} className="work-thumb">
                      <span className="idx">
                        {String(shownWorks.indexOf(work) + 1).padStart(2, "0")} /{" "}
                        {String(shownWorks.length).padStart(2, "0")}
                      </span>
                      <img
                        src={work.img || workImage}
                        alt={`${work.title} case study`}
                        width={1200}
                        height={900}
                        loading="lazy"
                      />
                    </a>
                    <div className="work-content">
                      <p className="work-meta">
                        {work.year} - {work.kicker}
                      </p>
                      <h3 className="editorial-h">{work.title}</h3>
                      <p className="role">{work.role}</p>
                      <p className="work-copy">{work.summary}</p>
                      <div className="tags">
                        {getWorkCategories(work)
                          .slice(0, 2)
                          .map((tag) => (
                            <span className="notch-tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                      </div>
                      <div className="work-actions">
                        <a href={`/work/${work.slug}`} className="notch-btn">
                          Read case study <span aria-hidden="true">-&gt;</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
                {shownWorks.length === 0 && (
                  <p className="work-empty">No case studies in this category yet.</p>
                )}
              </div>

              {!showAllWorks && shownWorks.length > WORKS_PAGE_SIZE && (
                <div className="work-more">
                  <button type="button" className="notch-btn" onClick={() => setShowAllWorks(true)}>
                    See more work
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="redesign-block timeline-section" id="experience">
        <div className="redesign-wrap">
          <div className="section-heading-row section-heading-compact">
            <div>
              <p className="section-kicker">Experience</p>
              <h2 className="editorial-h category-heading">A timeline of practice, not a CV dump.</h2>
            </div>
          </div>
          <div className="timeline-list">
            {cmsTimeline.map((item, i) => (
              <article key={`${item.year}-${i}`} className="timeline-item">
                <div className="timeline-rail" aria-hidden="true">
                  <span className="timeline-node" />
                </div>
                <p className="year">{item.year}</p>
                <div className="timeline-body">
                  <div className="timeline-topline">
                    <span className="timeline-step">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{item.title}</h3>
                  </div>
                  <p className="timeline-copy">{item.where}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="redesign-block about-section" id="about">
        <div className="redesign-wrap">
          <div className="about-grid">
            <div>
              <p className="section-kicker">About</p>
              <h2 className="editorial-h category-heading">A multidisciplinary practice with a fine-arts backbone.</h2>
            </div>
            <div />
          </div>
        </div>
      </section>

      <section className="redesign-block contact-section" id="contact">
        <div className="redesign-wrap">
          <div className="contact-panel">
            <div>
              <p className="section-kicker">Contact</p>
              <h2 className="editorial-h category-heading">For product roles, commissioned work, and thoughtful collaborations.</h2>
            </div>
            <div>
              <div className="cta-row contact-actions">
                <a className="notch-btn" href="mailto:hello@greeshma.design">
                  hello@greeshma.design
                </a>
                <a
                  className="link-underline"
                  href="/print-resume?role=Product%20Design"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open resume
                </a>
              </div>
            </div>
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

      <CustomCursorPointer />
    </div>
  );
}
