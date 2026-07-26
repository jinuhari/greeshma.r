import { useEffect } from "react";

/**
 * Adds `reveal-in` class to any element with `reveal` when it enters viewport.
 * Idempotent — safe to mount once per page.
 */
export function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.reveal-in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("reveal-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function useTheme() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("gr-theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
  }, []);
}

export function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.classList.toggle("dark");
  localStorage.setItem("gr-theme", isDark ? "dark" : "light");
}
