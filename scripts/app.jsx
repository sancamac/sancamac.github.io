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
        <a href="#lab">lab</a>
        <a href="#verticals">verticals</a>
        <a href="#organic">organic</a>
        <a href="#slop">slop</a>
      </div>
    </nav>);

}

// ---------------- Work ----------------
// Four working tracks I can be hired for — each is a real practice with a body
// of finished work behind it. The OilBuoyDiagram leads the section; the
// DaVinciDiagram closes it; the list lives between them like a legend.
const WORK = [
{
  n: "01",
  title: "Agentic engineering",
  tagline: "HITL · AFK · process optimization",
  desc: "Building agents that take work off your plate without taking judgement off the table. Humans in the loop where it matters, machines running while you sleep."
},
{
  n: "02",
  title: "Buoy telemetry systems",
  tagline: "hardware + software for hostile environments",
  desc: "Sensor packages, link budgets, installation campaigns, procurement. Designed to survive the weather and the supply chain. Years of buoys still talking to shore."
},
{
  n: "03",
  title: "Industrial plant software",
  tagline: "critical processes · risk assessment",
  desc: "Software for places where a missed event has a smell. Process control, alarm hygiene, risk evaluation. Quiet code for loud rooms."
},
{
  n: "04",
  title: "Medical robotics",
  tagline: "da Vinci · 3D modeling · AR for laparoscopy",
  desc: "3D reconstructions and AR overlays for the surgeon's console. The goal is unromantic: a steadier hand and a clearer picture of what's under it."
}];


function Work() {
  return (
    <section className="block" id="work">
      <span className="block-eyebrow">01 · work</span>
      <h2 className="block-title">Things <em>built with hands</em>, mostly, and a few keystrokes.</h2>

      {/* opening blueprint — the offshore transfer, with live status cards.
          The cards used to live in the hero; they belong here, where the
          system they describe is on the page. */}
      <figure className="lab-figure" style={{ marginTop: 48 }}>
        <div className="diagram-with-nodes">
          <OilBuoyDiagram />

          {/* tanker — top-left corner, mirroring the shore console on the
              right. Was at top: 44% but that overlapped the hull. The
              vertex still sits on the hull; the edge now drops vertically
              from near the card down to it. */}
          <ToolNode
            style={{ top: "4%", left: "4%" }}
            icon="buoy"
            title="tanker · M/V SAN CAMAC"
            desc="loading · 78%"
            delay={120} />
          <span className="vertex" style={{ top: "60%", left: "22%" }} />
          <span className="edge v pulse" style={{ top: "16%", left: "22%", height: "44%" }} />

          {/* buoy — top-center, pointing at the mast */}
          <ToolNode
            style={{ top: "6%", left: "44%" }}
            icon="buoy"
            title="buoy · sncmc-04"
            desc="telemetry · 401.5 MHz"
            delay={250} />
          <span className="vertex" style={{ top: "20%", left: "58%" }} />
          <span className="edge v pulse" style={{ top: "14%", left: "58%", height: "18%" }} />

          {/* shore console — top-right */}
          <ToolNode
            style={{ top: "4%", right: "4%" }}
            icon="console"
            title="shore · console"
            desc="4 820 m³/h ▲"
            delay={400} />
          <span className="vertex" style={{ top: "18%", right: "14%" }} />
          <span className="edge h pulse" style={{ top: "18%", right: "14%", width: "10%" }} />

          {/* subsea PLEM — bottom-center, pointing at the pipeline */}
          <ToolNode
            style={{ bottom: "6%", left: "44%" }}
            icon="arm"
            title="subsea · PLEM"
            desc='Ø 36" · 22 bar'
            delay={550} />
          <span className="vertex" style={{ bottom: "22%", left: "58%" }} />
          <span className="edge v pulse" style={{ bottom: "22%", left: "58%", height: "12%" }} />
        </div>
        <figcaption className="legend">
          <span><span className="swatch" /> CALM buoy · sncmc-04</span>
          <span>— · — · — UHF telemetry · 401.5 MHz</span>
          <span>↳ shore console · 4 820 m³/h</span>
        </figcaption>
      </figure>

      {/* the four tracks */}
      <div className="work-list">
        {WORK.map((w) =>
        <div className="work-row" key={w.n}>
            <span className="when mono">{w.n}</span>
            <span className="what">
              {w.title}
              <span className="role">— {w.tagline}</span>
              <span className="work-desc">{w.desc}</span>
            </span>
          </div>
        )}
      </div>

      {/* closing blueprint — the surgical system */}
      <figure className="lab-figure" style={{ marginTop: 56 }}>
        <DaVinciDiagram />
        <figcaption className="legend">
          <span><span className="swatch" /> patient-side cart</span>
          <span>— · — · — stereo feed · 4K · 60 fps</span>
          <span>↳ haptic round-trip &lt; 2 ms</span>
        </figcaption>
      </figure>
    </section>);

}

// ---------------- Lab ----------------
// ioo — infinitoomega — the open-ended playground. Four bets about what's worth
// building over the next decade. Closed with the freedom diagram.
const LAB_BETS = [
{
  n: "ioo.01",
  title: "Agents for making humans more human",
  desc: "Personal, family, professional agents. Tools that hand back time and attention instead of trading them for engagement."
},
{
  n: "ioo.02",
  title: "Enterprise optimization",
  desc: "Decision-making, data democratization, security, safety. Helping the organism see itself, then act on what it sees."
},
{
  n: "ioo.03",
  title: "Digitalization",
  desc: "A first step toward agentification: process optimization, data acquisition, decision-making. You cannot automate what you have not yet measured."
},
{
  n: "ioo.04",
  title: "DDD as a safety net",
  desc: "Domain-driven design as the load-bearing structure for everything above. A shared language is the cheapest safety equipment ever invented."
}];


function Lab() {
  return (
    <section className="block" id="lab">
      <span className="block-eyebrow">02 · lab</span>
      <h2 className="block-title">
        <em>ioo</em> — infinitoomega, a playground.
      </h2>
      <p className="block-lede">
        Four bets I'm willing to spend years on, written out so I can be held to them.
      </p>

      <div className="work-list">
        {LAB_BETS.map((b) =>
        <div className="work-row" key={b.n}>
            <span className="when mono">{b.n}</span>
            <span className="what">
              {b.title}
              <span className="work-desc">{b.desc}</span>
            </span>
          </div>
        )}
      </div>

      <figure className="lab-figure" style={{ marginTop: 56 }}>
        <FreedomDiagram />
        <figcaption className="legend">
          <span><span className="swatch" /> human · free, on foot</span>
          <span>— · — · — multimodal events</span>
          <span>↳ db://sncmc · append-only</span>
        </figcaption>
      </figure>
    </section>);

}

// ---------------- Verticals ----------------
// Standing curiosities. More than four — laid out as a horizontal scrollable
// row so there is always room to add another one without redesigning anything.
const VERTICALS = [
{ n: "v.01", name: "Anthrotechnology", note: "tech optimization for a better humanity — robotics included" },
{ n: "v.02", name: "Quantum", note: "computing & physics. the theoretical minimum, slowly" },
{ n: "v.03", name: "Farm", note: "vertical, indoor, hydroponic, traditional — all of it" },
{ n: "v.04", name: "Unreal estate", note: "land use, planned for the future: nature · city · retreat · tech" },
{ n: "v.05", name: "Education", note: "systems we inherit and the ones we ought to design — Krishnamurti" },
{ n: "v.06", name: "Aerospace", note: "exploration, the tech underneath, the long view above" },
{ n: "v.07", name: "Energy", note: "sustainable, nuclear, everything that keeps the lights on" },
{ n: "v.08", name: "Frontier tech", note: "whatever isn't named yet but is already humming" }];


function Verticals() {
  return (
    <section className="block" id="verticals">
      <span className="block-eyebrow">03 · verticals</span>
      <h2 className="block-title">Standing <em>interests</em>. Each one a little workshop.</h2>
      <p className="block-lede" style={{ marginBottom: 8 }}>
        Scroll sideways — there is always room for one more.
      </p>
      <div className="verticals-scroll" role="list">
        {VERTICALS.map((v) =>
        <article className="vertical-card" role="listitem" key={v.n}>
            <span className="v-num">{v.n}</span>
            <span className="v-name">{v.name}</span>
            <span className="v-note">{v.note}</span>
          </article>
        )}
      </div>
    </section>);

}

// ---------------- Organic ----------------
// Writings with passion from the heart. The list is intentionally commented out
// in the source until the writing finds its courage; until then, this note.
function Organic() {
  return (
    <section className="block" id="organic">
      <span className="block-eyebrow">04 · organic</span>
      <h2 className="block-title">Writings with <em>passion</em>, from the heart.</h2>
      <p className="block-lede">
        Hand-written, slowly. No models in the room.
      </p>
      {/*
        ORGANIC list — kept in source, hidden in the page until ready.
        ---------------------------------------------------------------
        { date: "2026.04", title: "Buoys, before code." }
        { date: "2026.02", title: "What the night shift teaches you about latency." }
        { date: "2025.11", title: "On things you can hold." }
        { date: "2025.07", title: "Letters from a small workshop." }
      */}
      <div className="empty-note">
        <span className="empty-dot" aria-hidden="true" />
        <span className="empty-text">finding the courage</span>
      </div>
    </section>);

}

// ---------------- Slop ----------------
// Research, missions, public chats with LLMs. Same idea — list lives in source,
// hidden until the artifacts are publishable. For now: baking tokens.
function Slop() {
  return (
    <section className="block" id="slop">
      <span className="block-eyebrow">05 · slop</span>
      <h2 className="block-title"><em>Co-authored</em> with whatever's listening.</h2>
      <p className="block-lede">
        Research, missions, chats with LLMs — made public when they earn it.
      </p>
      {/*
        SLOP list — kept in source, hidden until ready to share.
        --------------------------------------------------------
        { date: "2026.05", title: "Notes I wrote with a model in the room.", tag: "co-written" }
        { date: "2026.03", title: "A reading list, dictated then pruned.",   tag: "dictated"   }
        { date: "2026.01", title: "Drafts, after the machine took a pass.",  tag: "edited"     }
      */}
      <div className="empty-note">
        <span className="empty-dot" aria-hidden="true" />
        <span className="empty-text">baking tokens</span>
      </div>
    </section>);

}

// ---------------- Footer ----------------
function Foot() {
  return (
    <footer className="foot">
      <div className="foot-row">
        <span>© sancamac · sncmc · {new Date().getFullYear()}</span>
        <span>moulded by hand · the backend is an agent</span>
        <span><a href="https://x.com/sancamac" target="_blank" rel="noopener noreferrer">@sancamac</a></span>
      </div>
      <FooterDisclaimer />
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
        <Lab />
        <Verticals />
        <Organic />
        <Slop />
      </main>
      <Foot />
      <TweaksUI t={t} setTweak={setTweak} />
    </React.Fragment>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);