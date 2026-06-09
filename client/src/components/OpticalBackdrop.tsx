import { useEffect, useRef, useState } from 'react';

type Theme = 'hero' | 'ecosystem' | 'certifications' | 'guarantee' | 'form';

const TRANSITION_MS = 500;
const PRIMARY_RGB = '0, 85, 255';
const MOUSE_LERP = 0.06;
const THEME_SCALE = 0.7;

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

// ────────────────────────────────────────────────────────
// MESH — ambient layer (always drawn, below themes)
// ────────────────────────────────────────────────────────

interface MeshBlob {
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
  alpha: number;
  speedX: number;
  speedY: number;
  phaseX: number;
  phaseY: number;
  ampX: number;
  ampY: number;
}

const MESH_BLOBS: MeshBlob[] = [
  {
    baseX: 0.22,
    baseY: 0.32,
    radius: 0.55,
    color: PRIMARY_RGB,
    alpha: 0.24,
    speedX: 0.000075,
    speedY: 0.00011,
    phaseX: 0,
    phaseY: 1.4,
    ampX: 0.08,
    ampY: 0.06,
  },
  {
    baseX: 0.78,
    baseY: 0.7,
    radius: 0.5,
    color: '255, 255, 255',
    alpha: 0.11,
    speedX: 0.00009,
    speedY: 0.00007,
    phaseX: 2.1,
    phaseY: 0.6,
    ampX: 0.06,
    ampY: 0.07,
  },
  {
    baseX: 0.5,
    baseY: 0.5,
    radius: 0.65,
    color: PRIMARY_RGB,
    alpha: 0.2,
    speedX: 0.00006,
    speedY: 0.00012,
    phaseX: 3.4,
    phaseY: 2.6,
    ampX: 0.05,
    ampY: 0.05,
  },
];

function drawMesh(
  ctx: CanvasRenderingContext2D,
  now: number,
  w: number,
  h: number,
  mouseX: number,
  mouseY: number,
) {
  for (const blob of MESH_BLOBS) {
    const dx = Math.sin(now * blob.speedX + blob.phaseX) * blob.ampX;
    const dy = Math.sin(now * blob.speedY + blob.phaseY) * blob.ampY;
    const cx = (blob.baseX + dx) * w;
    const cy = (blob.baseY + dy) * h;
    const r = blob.radius * Math.max(w, h);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, `rgba(${blob.color}, ${blob.alpha})`);
    grad.addColorStop(0.55, `rgba(${blob.color}, ${blob.alpha * 0.32})`);
    grad.addColorStop(1, `rgba(${blob.color}, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  // Mouse-following blob (trailing) — desktop only path; mobile never enters tick
  const mr = 380;
  const mgrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, mr);
  mgrad.addColorStop(0, `rgba(${PRIMARY_RGB}, 0.18)`);
  mgrad.addColorStop(0.5, `rgba(${PRIMARY_RGB}, 0.06)`);
  mgrad.addColorStop(1, `rgba(${PRIMARY_RGB}, 0)`);
  ctx.fillStyle = mgrad;
  ctx.fillRect(0, 0, w, h);
}

// ────────────────────────────────────────────────────────
// ECOSYSTEM — drifting nodes + connecting lines
// ────────────────────────────────────────────────────────

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function createNodes(w: number, h: number, count: number): Node[] {
  const nodes: Node[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    });
  }
  return nodes;
}

function updateNodes(nodes: Node[], w: number, h: number) {
  for (const n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
    n.vx += (Math.random() - 0.5) * 0.006;
    n.vy += (Math.random() - 0.5) * 0.006;
    const speed = Math.hypot(n.vx, n.vy);
    if (speed > 0.28) {
      n.vx *= 0.28 / speed;
      n.vy *= 0.28 / speed;
    }
    if (n.x < -20) n.x = w + 20;
    if (n.x > w + 20) n.x = -20;
    if (n.y < -20) n.y = h + 20;
    if (n.y > h + 20) n.y = -20;
  }
}

// ────────────────────────────────────────────────────────
// THEMES — per-section character (rendered above mesh)
// ────────────────────────────────────────────────────────

function drawHero(
  ctx: CanvasRenderingContext2D,
  now: number,
  w: number,
  h: number,
  mx: number,
  my: number,
  alpha: number,
) {
  const parallaxX = (mx - w / 2) * 0.035;
  const parallaxY = (my - h / 2) * 0.035;
  const cx = w / 2 + parallaxX;
  const cy = h / 2 + parallaxY;
  const breathe = 1 + Math.sin(now * 0.0008) * 0.012;
  for (let i = 0; i < 3; i++) {
    const r = (220 + i * 110) * breathe;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${(0.05 - i * 0.012) * alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawEcosystem(
  ctx: CanvasRenderingContext2D,
  now: number,
  _w: number,
  _h: number,
  _mx: number,
  _my: number,
  alpha: number,
  nodes: Node[],
) {
  const maxDist = 150;
  const maxDistSq = maxDist * maxDist;

  ctx.lineWidth = 0.6;
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < maxDistSq) {
        const d = Math.sqrt(distSq);
        const lineAlpha = (1 - d / maxDist) * 0.08 * alpha;
        ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const isAccent = i % 5 === 0;
    ctx.fillStyle = isAccent
      ? `rgba(${PRIMARY_RGB}, ${0.45 * alpha})`
      : `rgba(255, 255, 255, ${0.22 * alpha})`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  void now;
}

function drawCertifications(
  ctx: CanvasRenderingContext2D,
  now: number,
  w: number,
  h: number,
  mx: number,
  my: number,
  alpha: number,
) {
  const spacing = 40;
  const lensRadius = 130;
  const lensRadiusSq = lensRadius * lensRadius;

  const startX = (w % spacing) / 2;
  const startY = (h % spacing) / 2;

  for (let x = startX; x < w; x += spacing) {
    for (let y = startY; y < h; y += spacing) {
      const dx = x - mx;
      const dy = y - my;
      const distSq = dx * dx + dy * dy;

      let drawX = x;
      let drawY = y;
      let extraAlpha = 0;

      if (distSq < lensRadiusSq) {
        const d = Math.sqrt(distSq);
        const t = 1 - d / lensRadius;
        const push = t * 12;
        const angle = Math.atan2(dy, dx);
        drawX += Math.cos(angle) * push;
        drawY += Math.sin(angle) * push;
        extraAlpha = t * 0.08;
      }

      ctx.fillStyle = `rgba(255, 255, 255, ${(0.05 + extraAlpha) * alpha})`;
      ctx.fillRect(drawX - 0.75, drawY - 0.75, 1.5, 1.5);
    }
  }
  void now;
}

function drawGuarantee(
  ctx: CanvasRenderingContext2D,
  now: number,
  w: number,
  h: number,
  _mx: number,
  _my: number,
  alpha: number,
) {
  const cx = w / 2;
  const cy = h / 2;
  const pulse = 1 + Math.sin(now * 0.0006) * 0.015;
  const rings = [160, 260, 360, 460, 560];

  for (let i = 0; i < rings.length; i++) {
    const r = rings[i] * pulse;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    if (i === 1) {
      ctx.strokeStyle = `rgba(${PRIMARY_RGB}, ${0.08 * alpha})`;
    } else {
      ctx.strokeStyle = `rgba(255, 255, 255, ${(0.05 - i * 0.006) * alpha})`;
    }
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawForm(
  ctx: CanvasRenderingContext2D,
  now: number,
  w: number,
  h: number,
  _mx: number,
  _my: number,
  alpha: number,
) {
  const cx = w / 2;
  const cy = h * 0.42;
  const breathe = 1 + Math.sin(now * 0.0005) * 0.01;
  ctx.beginPath();
  ctx.arc(cx, cy, 260 * breathe, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 * alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
}

// ────────────────────────────────────────────────────────
// Media query — mobile / reduced-motion → static mode
// ────────────────────────────────────────────────────────

function isCoarseOrReduced(): boolean {
  if (typeof window === 'undefined') return true;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = window.matchMedia('(max-width: 768px)').matches;
  return reduced || narrow;
}

// ────────────────────────────────────────────────────────
// Grain overlay — filmic noise (CSS-only, mobile-safe)
// ────────────────────────────────────────────────────────

function Grain() {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay"
      preserveAspectRatio="none"
    >
      <filter id="b2-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.33 0.33 0.33 0 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#b2-grain)" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────
// Static fallback — CSS-only mesh (mirrors blob positions)
// ────────────────────────────────────────────────────────

function StaticMesh() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(circle at 22% 32%, rgba(0, 85, 255, 0.24), transparent 55%),
          radial-gradient(circle at 78% 70%, rgba(255, 255, 255, 0.11), transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(0, 85, 255, 0.20), transparent 65%)
        `,
      }}
    />
  );
}

// ────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────

export default function OpticalBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseLerpRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ w: 0, h: 0 });
  const nodesRef = useRef<Node[]>([]);
  const currentThemeRef = useRef<Theme>('hero');
  const prevThemeRef = useRef<Theme | null>(null);
  const transitionStartRef = useRef<number>(0);

  const [staticMode, setStaticMode] = useState<boolean>(() =>
    typeof window === 'undefined' ? true : isCoarseOrReduced(),
  );

  useEffect(() => {
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqNarrow = window.matchMedia('(max-width: 768px)');
    const update = () => setStaticMode(mqReduced.matches || mqNarrow.matches);
    mqReduced.addEventListener('change', update);
    mqNarrow.addEventListener('change', update);
    return () => {
      mqReduced.removeEventListener('change', update);
      mqNarrow.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (staticMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodesRef.current.length === 0) {
        nodesRef.current = createNodes(w, h, 16);
      }
    };
    resize();

    mouseRef.current.x = window.innerWidth / 2;
    mouseRef.current.y = window.innerHeight / 2;
    mouseLerpRef.current.x = mouseRef.current.x;
    mouseLerpRef.current.y = mouseRef.current.y;

    let resizeTimer: number | null = null;
    const onResize = () => {
      if (resizeTimer != null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };
    window.addEventListener('resize', onResize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const visibilities = new Map<HTMLElement, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibilities.set(
            entry.target as HTMLElement,
            entry.intersectionRect.height,
          );
        }
        let bestHeight = 0;
        let bestTheme: Theme | null = null;
        visibilities.forEach((vh, target) => {
          if (vh > bestHeight) {
            bestHeight = vh;
            bestTheme = target.getAttribute('data-backdrop-theme') as Theme;
          }
        });
        if (bestTheme && bestTheme !== currentThemeRef.current) {
          prevThemeRef.current = currentThemeRef.current;
          currentThemeRef.current = bestTheme;
          transitionStartRef.current = performance.now();
        }
      },
      { threshold: [0, 0.15, 0.4, 0.7, 1] },
    );

    const sections = document.querySelectorAll<HTMLElement>(
      '[data-backdrop-theme]',
    );
    sections.forEach((s) => observer.observe(s));

    const renderTheme = (theme: Theme, now: number, alpha: number) => {
      const { w, h } = sizeRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const a = alpha * THEME_SCALE;
      switch (theme) {
        case 'hero':
          drawHero(ctx, now, w, h, mx, my, a);
          break;
        case 'ecosystem':
          drawEcosystem(ctx, now, w, h, mx, my, a, nodesRef.current);
          break;
        case 'certifications':
          drawCertifications(ctx, now, w, h, mx, my, a);
          break;
        case 'guarantee':
          drawGuarantee(ctx, now, w, h, mx, my, a);
          break;
        case 'form':
          drawForm(ctx, now, w, h, mx, my, a);
          break;
      }
    };

    const tick = (now: number) => {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      updateNodes(nodesRef.current, w, h);

      // Mouse trailing lerp
      mouseLerpRef.current.x +=
        (mouseRef.current.x - mouseLerpRef.current.x) * MOUSE_LERP;
      mouseLerpRef.current.y +=
        (mouseRef.current.y - mouseLerpRef.current.y) * MOUSE_LERP;

      // Ambient mesh (always)
      drawMesh(
        ctx,
        now,
        w,
        h,
        mouseLerpRef.current.x,
        mouseLerpRef.current.y,
      );

      // Per-section theme (with crossfade)
      const tRaw =
        transitionStartRef.current > 0
          ? Math.min(1, (now - transitionStartRef.current) / TRANSITION_MS)
          : 1;
      const t = easeOutQuint(tRaw);

      if (prevThemeRef.current && tRaw < 1) {
        renderTheme(prevThemeRef.current, now, 1 - t);
      } else if (prevThemeRef.current && tRaw >= 1) {
        prevThemeRef.current = null;
      }
      renderTheme(currentThemeRef.current, now, prevThemeRef.current ? t : 1);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (resizeTimer != null) window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, [staticMode]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {staticMode ? (
        <StaticMesh />
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}
      <Grain />
    </div>
  );
}
