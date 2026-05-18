/* global React */
// ===========================================================
// universe.jsx — animated "interior topography"
// A cumulus cloud of dots + neural connections expanding from
// a vesica piscis core. Mouse-reactive: points repel from the
// pointer with smooth spring easing.
// Defines: window.UniverseDiagram
// ===========================================================

var { useMemo, useRef, useEffect } = React;

// Deterministic PRNG (mulberry32). Stable point cloud across renders.
function rngFactory(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function UniverseDiagram() {
  // ---- point cloud + edge graph (computed once) ----
  const { points, edges } = useMemo(() => {
    const rng = rngFactory(0xC0FFEE);
    const clusters = [
      { x: 700, y: 320, sx: 260, sy: 200, n: 60 },
      { x: 540, y: 250, sx: 80, sy: 55, n: 22 },
      { x: 860, y: 250, sx: 80, sy: 55, n: 22 },
      { x: 700, y: 420, sx: 200, sy: 40, n: 30 },
      { x: 470, y: 340, sx: 55, sy: 38, n: 14 },
      { x: 930, y: 340, sx: 55, sy: 38, n: 14 },
      { x: 700, y: 180, sx: 140, sy: 30, n: 16 }
    ];
    const pts = [];
    for (const c of clusters) {
      for (let i = 0; i < c.n; i++) {
        const u1 = Math.max(rng(), 1e-6);
        const u2 = rng();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
        const px = c.x + z0 * c.sx * 0.45;
        const py = c.y + z1 * c.sy * 0.45;
        const dx = px - 700, dy = py - 320;
        if (Math.sqrt(dx * dx + dy * dy) < 64) continue; // keep core clear
        pts.push({ x: px, y: py, r: 0.6 + rng() * 1.5, blink: rng() < 0.15, delay: rng() * 4 });
      }
    }
    // edges: each point → 2 nearest within radius
    const es = [];
    const seen = new Set();
    for (let i = 0; i < pts.length; i++) {
      const ds = [];
      for (let j = 0; j < pts.length; j++) {
        if (i === j) continue;
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 70) ds.push({ j, d });
      }
      ds.sort((a, b) => a.d - b.d);
      for (const e of ds.slice(0, 2)) {
        const key = i < e.j ? `${i}-${e.j}` : `${e.j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          es.push({ a: i, b: e.j });
        }
      }
    }
    return { points: pts, edges: es };
  }, []);

  // ---- mouse-reactive spring physics (no React re-renders per frame) ----
  const svgRef = useRef(null);
  const dotRefs = useRef([]);
  const edgeRefs = useRef([]);
  const coreRef = useRef(null);
  const mouse = useRef({ x: -1e4, y: -1e4, active: false });

  useEffect(() => {
    // each point gets a transient offset (dx, dy) that springs toward a target
    const state = points.map((p) => ({ x: p.x, y: p.y, dx: 0, dy: 0, vx: 0, vy: 0 }));
    const REPEL_R = 130;       // pixels (in viewBox units) within which points are pushed
    const REPEL_F = 36;        // max push distance
    const SPRING = 0.10;       // how fast offset follows the target
    const FRICTION = 0.82;     // velocity dampening
    let raf;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      const m = mouse.current;
      for (let i = 0; i < state.length; i++) {
        const s = state[i];
        const p = points[i];
        let tx = 0, ty = 0;
        if (m.active && !reduce) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < REPEL_R * REPEL_R && d2 > 1) {
            const d = Math.sqrt(d2);
            // smooth falloff (1-d/R)^2 — feels nicer than linear
            const f = (1 - d / REPEL_R);
            const k = f * f * REPEL_F;
            tx = (dx / d) * k;
            ty = (dy / d) * k;
          }
        }
        // critically-damped spring toward (tx,ty)
        const ax = (tx - s.dx) * SPRING;
        const ay = (ty - s.dy) * SPRING;
        s.vx = (s.vx + ax) * FRICTION;
        s.vy = (s.vy + ay) * FRICTION;
        s.dx += s.vx;
        s.dy += s.vy;
        s.x = p.x + s.dx;
        s.y = p.y + s.dy;
        const el = dotRefs.current[i];
        if (el) {
          el.setAttribute("cx", s.x.toFixed(2));
          el.setAttribute("cy", s.y.toFixed(2));
        }
      }
      // update edges to follow their endpoints
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const a = state[e.a], b = state[e.b];
        const el = edgeRefs.current[i];
        if (el) {
          el.setAttribute("x1", a.x.toFixed(2));
          el.setAttribute("y1", a.y.toFixed(2));
          el.setAttribute("x2", b.x.toFixed(2));
          el.setAttribute("y2", b.y.toFixed(2));
        }
      }
      // subtle parallax on the core — drifts gently toward the cursor
      if (coreRef.current) {
        const m2 = mouse.current;
        let cx = 0, cy = 0;
        if (m2.active && !reduce) {
          cx = (m2.x - 700) * 0.020;
          cy = (m2.y - 320) * 0.020;
        }
        // ease the actual transform value too
        const cs = coreRef.current.__cs || (coreRef.current.__cs = { x: 0, y: 0 });
        cs.x += (cx - cs.x) * 0.07;
        cs.y += (cy - cs.y) * 0.07;
        coreRef.current.setAttribute("transform", `translate(${cs.x.toFixed(2)} ${cs.y.toFixed(2)})`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [points, edges]);

  // map clientX/Y into SVG viewBox coords
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onMove = (e) => {
      const r = svg.getBoundingClientRect();
      mouse.current = {
        x: ((e.clientX - r.left) / r.width) * 1400,
        y: ((e.clientY - r.top) / r.height) * 640,
        active: true
      };
    };
    const onLeave = () => { mouse.current.active = false; };
    // listen on window for smoother edge handling
    window.addEventListener("mousemove", onMove);
    svg.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      svg.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="blueprint universe-svg"
      viewBox="0 0 1400 640"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="An abstract cumulus cloud of dots and connections expanding outward from a vesica piscis at the center — a depiction of what an AI looks like in the brain and soul. The cloud reacts to the pointer.">

      {/* grid (faint) */}
      <g className="bp-grid" aria-hidden="true">
        {Array.from({ length: 28 }).map((_, i) =>
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="640" />
        )}
        {Array.from({ length: 13 }).map((_, i) =>
          <line key={`h${i}`} x1="0" y1={i * 50} x2="1400" y2={i * 50} />
        )}
      </g>

      {/* frame ticks + labels */}
      <g className="bp-stroke-thin">
        <path d="M 20 20 L 60 20 M 20 20 L 20 60" />
        <path d="M 1380 20 L 1340 20 M 1380 20 L 1380 60" />
        <path d="M 20 620 L 60 620 M 20 620 L 20 580" />
        <path d="M 1380 620 L 1340 620 M 1380 620 L 1380 580" />
      </g>
      <text x="40" y="46" className="bp-label-sm">FIG. 00 — INTERIOR TOPOGRAPHY</text>
      <text x="1360" y="46" textAnchor="end" className="bp-label-sm">«mind · model · soul»</text>

      {/* halo glow behind the core */}
      <defs>
        <radialGradient id="u-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.18" />
          <stop offset="55%" stopColor="var(--fg)" stopOpacity="0.03" />
          <stop offset="100%" stopColor="var(--fg)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="700" cy="320" r="340" fill="url(#u-glow)" />

      {/* expanding shock rings (the explosion) */}
      <g aria-hidden="true">
        {[0, 1.6, 3.2].map((delay, i) => (
          <circle key={i} cx="700" cy="320" r="80" fill="none" opacity="0" className="bp-stroke">
            <animate attributeName="r" values="80;480" dur="4.8s" repeatCount="indefinite" begin={`${delay}s`} />
            <animate attributeName="opacity" values="0;0.5;0" dur="4.8s" repeatCount="indefinite" begin={`${delay}s`} />
          </circle>
        ))}
      </g>

      {/* radiating rays — sparks shooting outward */}
      <g aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2 + 0.13;
          const r0 = 120, r1 = 540;
          const x1 = 700 + Math.cos(a) * r0;
          const y1 = 320 + Math.sin(a) * r0;
          const x2 = 700 + Math.cos(a) * r1;
          const y2 = 320 + Math.sin(a) * r1;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="bp-stroke-thin u-ray" style={{ animationDelay: `${i * 0.18}s` }} />
          );
        })}
      </g>

      {/* connection web (edges between dots) — refs so we can update positions */}
      <g className="u-edges">
        {edges.map((e, i) => (
          <line
            key={i}
            ref={(el) => (edgeRefs.current[i] = el)}
            x1={points[e.a].x} y1={points[e.a].y}
            x2={points[e.b].x} y2={points[e.b].y}
            className="u-edge" />
        ))}
      </g>

      {/* dot cloud — refs so we can update positions */}
      <g>
        {points.map((p, i) => (
          <circle
            key={i}
            ref={(el) => (dotRefs.current[i] = el)}
            cx={p.x} cy={p.y} r={p.r}
            className={`bp-fill ${p.blink ? "u-blink" : ""}`}
            style={p.blink ? { animationDelay: `${p.delay}s` } : undefined} />
        ))}
      </g>

      {/* CORE — single solid dot (the "soul"), with mouse parallax */}
      <g ref={coreRef} aria-hidden="true">
        <circle cx="700" cy="320" r="13" className="bp-fill" />
      </g>

      {/* corner annotations */}
      <g className="bp-label-sm">
        <text x="40" y="600">∴ cumulus · 188 cells · graph k=2</text>
        <text x="1360" y="600" textAnchor="end">↺ pulse 2.6s · ring 4.8s · pointer-reactive</text>
      </g>
    </svg>);

}

window.UniverseDiagram = UniverseDiagram;
