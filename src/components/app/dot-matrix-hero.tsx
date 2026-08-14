import { useEffect, useRef } from "react";

const GAP = 34; // px between dots
const BASE_RADIUS = 1.3;
const MAX_RADIUS = 3.6;
const RIPPLE_RADIUS = 170;
const BASE_ALPHA = 0.16;
const MAX_ALPHA = 0.7;

/**
 * Canvas-based grid of dots that drifts in a slow wave and ripples
 * outward from the pointer. Purely decorative — sits behind the hero copy.
 */
export function DotMatrixHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let raf = 0;
    let t = 0;
    let dotColor = "#1c1c1a";

    const pointer = { x: -9999, y: -9999, active: false };

    const readDotColor = () => {
      dotColor =
        getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() ||
        dotColor;
    };
    readDotColor();

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / GAP) + 1;
      const rows = Math.ceil(height / GAP) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = col * GAP;
          const baseY = row * GAP;
          const wave = Math.sin(t + col * 0.35 + row * 0.22) * 5;
          const x = baseX;
          const y = baseY + wave;

          let radius = BASE_RADIUS;
          let alpha = BASE_ALPHA;

          if (pointer.active) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < RIPPLE_RADIUS) {
              const proximity = 1 - dist / RIPPLE_RADIUS;
              radius = BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * proximity;
              alpha = BASE_ALPHA + (MAX_ALPHA - BASE_ALPHA) * proximity;
            }
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = dotColor;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      if (!prefersReducedMotion) {
        t += 0.018;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const themeObserver = new MutationObserver(readDotColor);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("resize", resize);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="dot-matrix-canvas" aria-hidden="true" />;
}
