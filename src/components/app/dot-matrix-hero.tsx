import { useEffect, useRef } from "react";

const GAP = 34; // px between dots
const DOT_RADIUS = 1.6;
const DOT_ALPHA = 0.24;
const RIPPLE_RADIUS = 130; // how far the pointer's push reaches
const PUSH_STRENGTH = 2.4; // force applied to dots caught in the ripple
const SPRING = 0.055; // how eagerly a dot returns to its resting spot
const DAMPING = 0.88; // friction that settles the motion, like water calming down

type DotState = { ox: number; oy: number; vx: number; vy: number };

/**
 * Canvas-based grid of dots that drifts in a slow wave and gives way to the
 * pointer like water — dots get pushed aside and spring back to rest, rather
 * than changing size. Purely decorative — sits behind the hero copy.
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
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let t = 0;
    let dotColor = "#1c1c1a";
    let dots: DotState[] = [];

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
      cols = Math.ceil(width / GAP) + 1;
      rows = Math.ceil(height / GAP) + 1;
      dots = Array.from({ length: cols * rows }, () => ({ ox: 0, oy: 0, vx: 0, vy: 0 }));
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

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;
          const dot = dots[index];
          const restX = col * GAP;
          const restY = row * GAP + Math.sin(t + col * 0.35 + row * 0.22) * 5;
          const x = restX + dot.ox;
          const y = restY + dot.oy;

          if (pointer.active) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < RIPPLE_RADIUS && dist > 0.01) {
              const push = (1 - dist / RIPPLE_RADIUS) * PUSH_STRENGTH;
              dot.vx += (dx / dist) * push;
              dot.vy += (dy / dist) * push;
            }
          }

          // Spring back toward the resting position, damped like settling water.
          dot.vx += -dot.ox * SPRING;
          dot.vy += -dot.oy * SPRING;
          dot.vx *= DAMPING;
          dot.vy *= DAMPING;
          dot.ox += dot.vx;
          dot.oy += dot.vy;

          ctx.beginPath();
          ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.globalAlpha = DOT_ALPHA;
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
