import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CustomCursorPointer } from "@/components/app/app-shell";
import { CmsPanel } from "@/components/app/cms-panel";
import { DotMatrixHero } from "@/components/app/dot-matrix-hero";
import heroArt from "@/assets/hero-artwork.jpg";
import linkedinLogo from "@/assets/linkedin.png";
import behanceLogo from "@/assets/social.png";
import workImage from "@/assets/greeshma bgremoved.png";
import { useTheme } from "@/hooks/use-reveal";
import { type CaseStudy } from "@/lib/cms";
import {
  defaultContact,
  defaultHero,
  defaultResumes,
  loadArchive,
  loadArchiveFromSanity,
  loadContactFromSanity,
  loadHeroFromSanity,
  loadResumesFromSanity,
  loadTimeline,
  loadTimelineFromSanity,
  loadWorksFromSanity,
} from "@/lib/data";
import type { ContactItem, ContactSection, HeroSection, Resume } from "@/lib/data";

export const Route = createFileRoute("/")({
  component: Home,
});

function getWorkCategories(work: CaseStudy): string[] {
  return (work.categories || []).map((category) => category.trim()).filter(Boolean);
}

const WORKS_PAGE_SIZE = 4;

function contactHref(item: ContactItem, resumeHref: string): string {
  if (item.type === "resume") return resumeHref;
  if (contactPlatform(item) === "email") {
    if (item.url) return item.url;
    return item.value ? `mailto:${item.value}` : "#contact";
  }
  return item.url || "#contact";
}

function contactPlatform(item: ContactItem): ContactItem["type"] {
  const text = `${item.type} ${item.label} ${item.value} ${item.url}`.toLowerCase();
  if (text.includes("linkedin")) return "linkedin";
  if (text.includes("behance")) return "behance";
  if (item.type === "email" || text.includes("mailto:") || text.includes("@")) return "email";
  return item.type;
}

function ContactLogo({ item }: { item: ContactItem }) {
  const platform = contactPlatform(item);
  if (platform === "email") return <Mail className="contact-link-icon" aria-hidden="true" />;
  if (platform === "linkedin") return <img className="contact-link-icon" src={linkedinLogo} alt="" aria-hidden="true" />;
  if (platform === "behance") return <img className="contact-link-icon" src={behanceLogo} alt="" aria-hidden="true" />;
  return null;
}

function Home() {
  useTheme();
  const [activeCategory, setActiveCategory] = useState("All work");
  const [showAllWorks, setShowAllWorks] = useState(false);
  const [cmsWorks, setCmsWorks] = useState<CaseStudy[]>([]);
  const [worksLoading, setWorksLoading] = useState(true);
  const [cmsArchive, setCmsArchive] = useState(() => loadArchive());
  const [cmsTimeline, setCmsTimeline] = useState(() => loadTimeline());
  const [cmsResumes, setCmsResumes] = useState<Resume[]>(() => defaultResumes());
  const [cmsContact, setCmsContact] = useState<ContactSection>(() => defaultContact);
  const [cmsHero, setCmsHero] = useState<HeroSection>(() => defaultHero);
  const [cmsOpen, setCmsOpen] = useState(false);
  const cmsClicks = useRef(0);
  // Guards against out-of-order responses so a slow, stale fetch can never clobber a newer one.
  const refreshToken = useRef(0);

  const refreshAll = useCallback(async () => {
    const token = ++refreshToken.current;
    const [w, a, t, r, c, h] = await Promise.all([
      loadWorksFromSanity(),
      loadArchiveFromSanity(),
      loadTimelineFromSanity(),
      loadResumesFromSanity(),
      loadContactFromSanity(),
      loadHeroFromSanity(),
    ]);
    if (token !== refreshToken.current) return;
    if (w.length) setCmsWorks(w);
    if (a.length) setCmsArchive(a);
    if (t.length) setCmsTimeline(t);
    if (r.length) setCmsResumes(r);
    setCmsContact(c);
    setCmsHero(h);
    setWorksLoading(false);
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const cmsCategories = useMemo(
    () => Array.from(new Set(cmsWorks.flatMap((work) => getWorkCategories(work)))),
    [cmsWorks],
  );

  const workCategories = useMemo(() => ["All work", ...cmsCategories], [cmsCategories]);

  const shownWorks = useMemo(
    () =>
      cmsWorks.filter(
        (work) =>
          activeCategory === "All work" || getWorkCategories(work).includes(activeCategory),
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
  const starredResumeUrl = useMemo(
    () => cmsResumes.find((resume) => resume.global && resume.pdfUrl)?.pdfUrl || "",
    [cmsResumes],
  );
  const resumeHref = starredResumeUrl || "/print-resume?role=Product%20Design";

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
          <a href="#archive">Archive</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="redesign-hero" id="top">
        <div className="redesign-hero-bg">
          <img src={cmsHero.backgroundImageUrl || heroArt} alt="" width={1800} height={1200} />
        </div>
        <DotMatrixHero />
        <div className="redesign-wrap redesign-hero-grid">
          <div className="hero-copy">
            <p className="hero-intro">{cmsHero.eyebrow}</p>
            <h1 className="headline editorial-h">{cmsHero.heading}</h1>
            <p className="sub">{cmsHero.description}</p>
            <div className="cta-row">
              <a href={cmsHero.ctaHref || "#work"} className="notch-btn">
                {cmsHero.ctaLabel || "View selected work"}
              </a>
              <a
                href={resumeHref}
                className="link-underline"
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>
            </div>
          </div>
          <figure className="hero-portrait-frame">
            <div className="hero-portrait">
              <img
                src={cmsHero.portraitImageUrl || workImage}
                alt="Portrait of Greeshma R."
                width={1200}
                height={1500}
              />
            </div>
          </figure>
        </div>
      </section>

      <section className="redesign-block work-section" id="work">
        <div className="redesign-wrap">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Selected Work</p>
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
                      <div className="work-actions">
                        <a href={`/work/${work.slug}`} className="notch-btn">
                          Read case study <span aria-hidden="true">-&gt;</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
                {shownWorks.length === 0 && <p className="work-empty">No case studies yet.</p>}
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
              <article
                key={`${item.year}-${i}`}
                className={`timeline-entry ${i % 2 === 0 ? "is-left" : "is-right"}`}
              >
                <span className="timeline-entry-node" aria-hidden="true" />
                <div className="timeline-entry-card">
                  <span className="timeline-entry-step">{String(i + 1).padStart(2, "0")}</span>
                  <span className="timeline-entry-year editorial-h">{item.year}</span>
                  <h3 className="font-display">{item.title}</h3>
                  <p>{item.where}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="redesign-block archive-section" id="archive">
        <div className="redesign-wrap">
          <div className="section-heading-row section-heading-compact">
            <div>
              <p className="section-kicker">Art / Other Work</p>
            </div>
          </div>

          <div className="archive-scroll" aria-label="Automatically scrolling art and other work">
            <div className="archive-track">
              {[...cmsArchive, ...cmsArchive].map((item, index) => (
                <article
                  className="archive-card"
                  key={`${item.label}-${index}`}
                  aria-hidden={index >= cmsArchive.length}
                >
                  <figure className="archive-thumb">
                    <img src={item.src} alt={index >= cmsArchive.length ? "" : item.label} loading="lazy" />
                  </figure>
                  <div className="archive-meta">
                    <p>{item.cat || item.medium || "Archive"}</p>
                    <h3>{item.label}</h3>
                    <span>{item.year}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="redesign-block contact-section" id="contact">
        <div className="redesign-wrap">
          <div className="contact-panel">
            <div>
              <p className="section-kicker">Contact</p>
              <p className="contact-copy">{cmsContact.heading}</p>
            </div>
            <div>
              <div className="cta-row contact-actions">
                {cmsContact.items.map((item, index) => (
                  <a
                    key={`${item.label}-${index}`}
                    className={contactPlatform(item) === "email" ? "notch-btn" : "link-underline"}
                    href={contactHref(item, resumeHref)}
                    target={contactPlatform(item) === "email" ? undefined : "_blank"}
                    rel={contactPlatform(item) === "email" ? undefined : "noreferrer"}
                  >
                    <ContactLogo item={item} />
                    {item.value || item.label}
                  </a>
                ))}
                {!cmsContact.items.some((item) => item.type === "resume") && (
                  <a className="link-underline" href={resumeHref} target="_blank" rel="noreferrer">
                    View Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {cmsOpen && (
        <CmsPanel
          hero={cmsHero}
          setHero={setCmsHero}
          works={cmsWorks}
          setWorks={setCmsWorks}
          archive={cmsArchive}
          setArchive={setCmsArchive}
          timeline={cmsTimeline}
          setTimeline={setCmsTimeline}
          resumes={cmsResumes}
          setResumes={setCmsResumes}
          contact={cmsContact}
          setContact={setCmsContact}
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
