import { useEffect, useRef } from "react";

const NUM_DOTS = 60;
const DOT_RADIUS = 1.8;
const DOT_ALPHA = 0.55;
const RING_RADIUS_FACTOR = 0.4; // ring radius as a fraction of the smaller orb dimension
const SPRING_K = 12; // Hooke's law: acceleration per px of displacement
const DAMPING = 3.0; // velocity damping coefficient (1/s)
const ATTRACT_RADIUS = 140; // px around the pointer that pulls dots in
const ATTRACT_STRENGTH = 2200; // acceleration injected at the pointer centre
const MAX_OFFSET = 30; // px a dot may travel from its rest seat
const SWAY_AMPLITUDE = 2; // gentle idle breathing of the ring

type Dot = {
  rx: number; // rest position on the ring
  ry: number;
  x: number; // live position
  y: number;
  vx: number; // velocity
  vy: number;
  phase: number; // per-dot offset for the idle sway
};

/**
 * Canvas-based ring of dots that sits behind the hero portrait.
 * The dots are seats on a circle and are simulated as a real spring-mass
 * system: the pointer attracts nearby dots toward it, and Hooke's law plus
 * viscous damping pulls them back onto the ring.
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
    let last = 0;
    let time = 0;
    let dots: Dot[] = [];
    const dotColor = "#f97316";

    const pointer = { x: -9999, y: -9999, active: false };

    const buildRing = () => {
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.max(24, Math.min(width, height) * RING_RADIUS_FACTOR);
      dots = Array.from({ length: NUM_DOTS }, (_, i) => {
        const angle = (i / NUM_DOTS) * Math.PI * 2;
        const rx = cx + Math.cos(angle) * radius;
        const ry = cy + Math.sin(angle) * radius;
        return { rx, ry, x: rx, y: ry, vx: 0, vy: 0, phase: Math.random() * Math.PI * 2 };
      });
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildRing();
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

    const physics = (dt: number) => {
      const dtFixed = Math.min(dt, 1 / 30);
      for (const dot of dots) {
        // The rest seat breathes slowly so the ring feels organic, not rigid.
        const rx = dot.rx + Math.sin(time * 1.4 + dot.phase) * SWAY_AMPLITUDE;
        const ry = dot.ry + Math.cos(time * 1.1 + dot.phase) * SWAY_AMPLITUDE;

        // Hooke's law: the spring pulls the dot back toward its seat.
        dot.vx += (rx - dot.x) * SPRING_K * dtFixed;
        dot.vy += (ry - dot.y) * SPRING_K * dtFixed;

        // Pointer attraction: dots lean toward the cursor as it hovers nearby.
        if (pointer.active) {
          const dx = pointer.x - dot.x;
          const dy = pointer.y - dot.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0.01 && distSq < ATTRACT_RADIUS * ATTRACT_RADIUS) {
            const dist = Math.sqrt(distSq);
            const falloff = 1 - dist / ATTRACT_RADIUS;
            dot.vx += (dx / dist) * ATTRACT_STRENGTH * falloff * falloff * dtFixed;
            dot.vy += (dy / dist) * ATTRACT_STRENGTH * falloff * falloff * dtFixed;
          }
        }

        // Viscous damping, then integrate velocity into position.
        const damp = Math.max(0, 1 - DAMPING * dtFixed);
        dot.vx *= damp;
        dot.vy *= damp;
        dot.x += dot.vx * dtFixed;
        dot.y += dot.vy * dtFixed;

        // Keep dots from tearing the ring apart while they wobble.
        const dx = dot.x - rx;
        const dy = dot.y - ry;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > MAX_OFFSET) {
          const scale = MAX_OFFSET / dist;
          dot.x = rx + dx * scale;
          dot.y = ry + dy * scale;
        }
      }
    };

    const draw = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      ctx.clearRect(0, 0, width, height);
      if (!prefersReducedMotion) {
        physics(dt);
        time += dt;
      }

      ctx.fillStyle = dotColor;
      ctx.globalAlpha = DOT_ALPHA;
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    last = performance.now();
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="dot-matrix-canvas" aria-hidden="true" />;
}
