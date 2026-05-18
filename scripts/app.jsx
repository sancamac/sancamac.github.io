/* global React, ReactDOM */
// ===========================================================
// app.jsx — sections + Tweaks panel + mount
// ===========================================================

var { useEffect, useState } = React;

// ---------------- TWEAK DEFAULTS ----------------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "notion",
  "density": "normal",
  "accent": "#1616ba",
  "heroFont": "Inter",
  "heroWeight": 600,
  "heroSize": 78,
  "taglineStyle": "type",
  "showHandle": true,
  "showBadge": true,
  "showNodes": true,
  "showTicker": true,
  "showAsset": true,
  "diagramFill": "muted",
  "showGrid": true,
  "showSignals": true,
  "showVertices": true,
  "typeSpeed": 68,
  "holdTime": 2600,
  "autoRotate": true
} /*EDITMODE-END*/;

// Apply theme to <html> data attributes (and CSS vars for palette).
function applyTheme(t) {
  const html = document.documentElement;
  html.dataset.density = t.density;
  html.dataset.fill = t.diagramFill;
  html.dataset.showGrid = t.showGrid ? "true" : "false";
  html.dataset.showSignals = t.showSignals ? "true" : "false";
  html.dataset.showVertices = t.showVertices ? "true" : "false";
  // palette — colors map to vars in styles/palette.css (ghostwhite/midnight/lavender family)
  const palettes = {
    notion: { bg: "#f6f6fc", bg2: "#ffffff", bg3: "#e8e8f4", fg: "#1313ba", fg2: "#3838c8", muted: "#7572c1", line: "#c3c3e0", line2: "#e8e8f3", node: "#ffffff" },
    cream:  { bg: "#ece2c8", bg2: "#ddcfac", bg3: "#cebd96", fg: "#2a261c", fg2: "#4c4636", muted: "#847b65", line: "#c4b791", line2: "#d4c9a6", node: "#f7f1de" },
    paper:  { bg: "#f1eee5", bg2: "#e7e3d5", bg3: "#dad5c4", fg: "#1c1a15", fg2: "#3b3830", muted: "#7a766b", line: "#c9c4b3", line2: "#dad5c4", node: "#fbf9f2" },
    bone:   { bg: "#ecebe6", bg2: "#e0ddd4", bg3: "#d3cfc2", fg: "#121110", fg2: "#35332f", muted: "#79766f", line: "#c4c0b6", line2: "#d3cfc2", node: "#f4f2ec" }
  };
  const p = palettes[t.palette] || palettes.notion;
  const s = html.style;
  s.setProperty("--bg", p.bg);
  s.setProperty("--bg-2", p.bg2);
  s.setProperty("--bg-3", p.bg3);
  s.setProperty("--fg", p.fg);
  s.setProperty("--fg-2", p.fg2);
  s.setProperty("--muted", p.muted);
  s.setProperty("--line", p.line);
  s.setProperty("--line-2", p.line2);
  s.setProperty("--node-bg", p.node);
  s.setProperty("--accent", t.accent || p.fg);
}

// ---------------- TopNav ----------------
function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className="topnav" data-scrolled={scrolled}>
      <a href="#top" className="brand">
        <span className="brand-dot" />
        <span>sancamac · sncmc</span>
      </a>
      <div className="links">
        <a href="#work">work</a>
        <a href="#verticals">verticals</a>
        <a href="#lab">lab</a>
        <a href="#organic">organic</a>
        <a href="#slop">slop</a>
      </div>
    </nav>);

}

// ---------------- Work ----------------
const WORK = [
{ when: "2024 —", what: "Independent", role: "robotics & systems consulting", meta: "Buenos Aires · remote" },
{ when: "2022 — 24", what: "Offshore Energy Co.", role: "lead systems engineer", meta: "telemetry · subsea" },
{ when: "2019 — 22", what: "Surgical Robotics Lab", role: "research engineer", meta: "stereo · haptics" },
{ when: "2016 — 19", what: "Atelier de software", role: "founding engineer", meta: "two people, one room" }];


function Work() {
  return (
    <section className="block" id="work">
      <span className="block-eyebrow">01 · work</span>
      <h2 className="block-title">Things <em>built with hands</em>, mostly, and a few keystrokes.</h2>
      <div className="work-list">
        {WORK.map((w, i) =>
        <div className="work-row" key={i}>
            <span className="when mono">{w.when}</span>
            <span className="what">
              {w.what}
              <span className="role">— {w.role}</span>
            </span>
            <span className="meta">{w.meta}</span>
          </div>
        )}
      </div>
    </section>);

}

// ---------------- Verticals ----------------
const VERTICALS = [
{ n: "v.01", name: "Offshore robotics", note: "buoys, hoses, weather windows" },
{ n: "v.02", name: "Surgical systems", note: "stereo, haptics, sub-2 ms" },
{ n: "v.03", name: "Quiet software", note: "small tools, long-lived" },
{ n: "v.04", name: "Field literature", note: "notes from where the cable goes" }];


function Verticals() {
  return (
    <section className="block" id="verticals">
      <span className="block-eyebrow">02 · verticals</span>
      <h2 className="block-title">Four <em>standing interests</em>. Each one a little workshop.</h2>
      <div className="verticals-grid">
        {VERTICALS.map((v) =>
        <article className="vertical-card" key={v.n}>
            <span className="v-num">{v.n}</span>
            <span className="v-name">{v.name}</span>
            <span className="v-note">{v.note}</span>
          </article>
        )}
      </div>
    </section>);

}

// ---------------- Lab (with second diagram) ----------------
function Lab() {
  return (
    <section className="block" id="lab">
      <span className="block-eyebrow">03 · exploration lab</span>
      <h2 className="block-title">A <em>second blueprint</em>: a doctor's hands, miles from the room.</h2>
      <p className="block-lede">
        Most of what I make is a way for one person to feel a thing happening somewhere they aren't.
        A buoy floating. A wrist turning. A tide coming in.
      </p>
      <figure className="lab-figure">
        <DaVinciDiagram />
        <figcaption className="legend">
          <span><span className="swatch" /> patient-side cart</span>
          <span>— · — · — stereo feed · 4K · 60 fps</span>
          <span>↳ haptic round-trip &lt; 2 ms</span>
        </figcaption>
      </figure>
    </section>);

}

// ---------------- Writing (organic + slop) ----------------
const ORGANIC = [
{ date: "2026.04", title: "Buoys, before code." },
{ date: "2026.02", title: "What the night shift teaches you about latency." },
{ date: "2025.11", title: "On things you can hold." },
{ date: "2025.07", title: "Letters from a small workshop." }];

const SLOP = [
{ date: "2026.05", title: "Notes I wrote with a model in the room.", tag: "co-written" },
{ date: "2026.03", title: "A reading list, dictated then pruned.", tag: "dictated" },
{ date: "2026.01", title: "Drafts, after the machine took a pass.", tag: "edited" }];


function Writing() {
  return (
    <section className="block" id="writing">
      <div className="writing-grid">
        <div className="writing-col" id="organic">
          <h3><span>04 · organic</span><span className="tag">no models in the room</span></h3>
          <h2 className="block-title" style={{ fontSize: "clamp(28px, 3.4vw, 40px)" }}>
            Hand-written, <em>slowly</em>.
          </h2>
          <div style={{ marginTop: 28 }}>
            {ORGANIC.map((p, i) =>
            <article className="post" key={i}>
                <span className="date">{p.date}</span>
                <span className="title">{p.title}</span>
              </article>
            )}
          </div>
        </div>
        <div className="writing-col" id="slop">
          <h3><span>05 · slop</span><span className="tag">machine-assisted</span></h3>
          <h2 className="block-title" style={{ fontSize: "clamp(28px, 3.4vw, 40px)" }}>
            <em>Co-authored</em> with whatever's listening.
          </h2>
          <div style={{ marginTop: 28 }}>
            {SLOP.map((p, i) =>
            <article className="post" key={i}>
                <span className="date">{p.date}</span>
                <span className="title">
                  {p.title} <em style={{ color: "var(--muted)", fontSize: 13, fontFamily: "var(--mono)" }}>· {p.tag}</em>
                </span>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>);

}

// ---------------- Footer ----------------
function Foot() {
  return (
    <footer className="foot">
      <span>© sancamac · sncmc · {new Date().getFullYear()}</span>
      <span>moulded by hand · the backend is an agent</span>
      <span><a href="https://x.com/sancamac" target="_blank" rel="noopener noreferrer">@sancamac</a></span>
    </footer>);

}

// ---------------- Tweaks ----------------
function TweaksUI({ t, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Surface" />
      <TweakRadio
        label="Palette"
        value={t.palette}
        onChange={(v) => setTweak("palette", v)}
        options={[
          { value: "notion", label: "Notion" },
          { value: "cream",  label: "Cream" },
          { value: "paper",  label: "Paper" },
          { value: "bone",   label: "Bone" }
        ]} />
      <TweakRadio
        label="Density"
        value={t.density}
        onChange={(v) => setTweak("density", v)}
        options={[
          { value: "compact", label: "Compact" },
          { value: "normal",  label: "Normal" },
          { value: "roomy",   label: "Roomy" }
        ]} />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={["#1616ba", "#21207a", "#7237ae", "#2a261c"]}
        onChange={(v) => setTweak("accent", v)} />

      <TweakSection label="Typography" />
      <TweakSelect
        label="Display"
        value={t.heroFont}
        options={[
          { value: "Inter",            label: "Inter" },
          { value: "Source Serif 4",   label: "Source Serif" },
          { value: "JetBrains Mono",   label: "JetBrains Mono" }
        ]}
        onChange={(v) => setTweak("heroFont", v)} />
      <TweakSlider
        label="Weight"
        value={t.heroWeight}
        min={300} max={800} step={100}
        onChange={(v) => setTweak("heroWeight", v)} />
      <TweakSlider
        label="Size"
        value={t.heroSize}
        min={32} max={140} step={2} unit="px"
        onChange={(v) => setTweak("heroSize", v)} />

      <TweakSection label="Hero" />
      <TweakToggle label="Handle"  value={t.showHandle} onChange={(v) => setTweak("showHandle", v)} />
      <TweakToggle label="Language badge" value={t.showBadge} onChange={(v) => setTweak("showBadge", v)} />
      <TweakToggle label="Diagram" value={t.showAsset}  onChange={(v) => setTweak("showAsset", v)} />
      <TweakToggle label="Tool nodes" value={t.showNodes} onChange={(v) => setTweak("showNodes", v)} />
      <TweakToggle label="Ticker"   value={t.showTicker} onChange={(v) => setTweak("showTicker", v)} />

      <TweakSection label="Diagrams" />
      <TweakRadio
        label="Fill"
        value={t.diagramFill}
        onChange={(v) => setTweak("diagramFill", v)}
        options={[
          { value: "line",   label: "Line" },
          { value: "muted",  label: "Muted" },
          { value: "filled", label: "Filled" }
        ]} />
      <TweakToggle label="Grid"     value={t.showGrid}     onChange={(v) => setTweak("showGrid", v)} />
      <TweakToggle label="Signals"  value={t.showSignals}  onChange={(v) => setTweak("showSignals", v)} />
      <TweakToggle label="Vertices" value={t.showVertices} onChange={(v) => setTweak("showVertices", v)} />

      <TweakSection label="Motion" />
      <TweakToggle label="Auto-rotate" value={t.autoRotate} onChange={(v) => setTweak("autoRotate", v)} />
      <TweakSlider
        label="Type speed"
        value={t.typeSpeed}
        min={10} max={120} step={2} unit="ms"
        onChange={(v) => setTweak("typeSpeed", v)} />
      <TweakSlider
        label="Hold"
        value={t.holdTime}
        min={400} max={4000} step={100} unit="ms"
        onChange={(v) => setTweak("holdTime", v)} />
      <TweakButton label="Reset" onClick={() => Object.entries(TWEAK_DEFAULTS).forEach(([k, v]) => setTweak(k, v))}>
        Restore defaults
      </TweakButton>
    </TweaksPanel>);

}

// ---------------- App ----------------
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => {applyTheme(t);}, [t]);
  return (
    <React.Fragment>
      <TopNav />
      <main>
        <Hero t={t} />
        <Work />
        <Verticals />
        <Lab />
        <Writing />
      </main>
      <Foot />
      <TweaksUI t={t} setTweak={setTweak} />
    </React.Fragment>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);