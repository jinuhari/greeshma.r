import { useState } from "react";

const STUDIO_URL = "https://greeshma-portfolio.sanity.studio";

export function CmsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        style={{ margin: "2vh auto", maxHeight: "96vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <h2 className="font-display text-lg">Sanity CMS</h2>
          <div className="flex items-center gap-3">
            <a
              href={STUDIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-wide text-muted-foreground underline hover:text-foreground"
            >
              Open in new tab ↗
            </a>
            <button
              onClick={onClose}
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
            >
              Close ✕
            </button>
          </div>
        </div>
        <iframe
          src={STUDIO_URL}
          className="w-full flex-1 border-0"
          title="Sanity CMS"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          allow="clipboard-write"
        />
      </div>
    </div>
  );
}
