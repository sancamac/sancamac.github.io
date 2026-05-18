/* global React */
// ===========================================================
// hero.jsx — Hero with floating tool-node cards over the
// background blueprint diagram, plus the floating ticker.
// Defines: window.Hero
// ===========================================================

var { useEffect, useState, useRef } = React;

// little inline icons used inside tool nodes
const Icons = {
  buoy:
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M10 2v6" />
      <path d="M6 8h8l-1.5 4h-5z" />
      <path d="M5 14c2 1 3 1 5 1s3 0 5-1" />
      <path d="M4 16c2 1.2 3.5 1.2 6 1.2s4-0 6-1.2" />
    </svg>,

  console:
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="2.5" y="4" width="15" height="11" rx="1.5" />
      <path d="M5 8l2 1.5L5 11" />
      <path d="M9 11h4" />
    </svg>,

  arm:
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="6" cy="5" r="1.6" />
      <path d="M6 6.5L10 11" />
      <circle cx="10" cy="11" r="1.6" />
      <path d="M10 12.5L14 16" />
      <path d="M13 15.2l2 .8-.8 2" />
    </svg>,

  pen:
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 17l3-1L16 6l-2-2L4 14z" />
      <path d="M13 5l2 2" />
    </svg>

};

function ToolNode({ style, icon, title, desc, active = true, delay = 0 }) {
  return (
    <div className="tool-node" style={{ ...style, animationDelay: `${delay}ms` }}>
      <span className="ico" aria-hidden="true">{Icons[icon]}</span>
      <span className="title">{title}</span>
      <span className="desc">
        {active ? <span className="shimmer">{desc}</span> : desc}
      </span>
    </div>);

}

// ----- rotating multilingual tagline -----
const PHRASES = [
  { code: "es", label: "español",   text: "Las cosas más importantes no son cosas" },
  { code: "en", label: "english",   text: "The most important things are not things" },
  { code: "pt", label: "português", text: "As coisas mais importantes não são coisas" },
  { code: "fr", label: "français",  text: "Les choses les plus importantes ne sont pas des choses" },
  { code: "de", label: "deutsch",   text: "Die wichtigsten Dinge sind keine Dinge" },
  { code: "ja", label: "日本語",     text: "最も大切なものは、物ではない" },
  { code: "zh", label: "中文",      text: "最重要的事物，不是物品" },
  { code: "ko", label: "한국어",     text: "가장 중요한 것은 물건이 아니다" },
  { code: "hi", label: "हिन्दी",      text: "सबसे ज़रूरी चीज़ें, चीज़ें नहीं हैं" },
  { code: "ar", label: "العربية",   text: "أهم الأشياء ليست أشياء" }];


function RotatingTagline({ style, typeSpeed = 68, holdTime = 2600, autoRotate = true, showBadge = true }) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState("");
  const [phase, setPhase] = useState("typing"); // "typing" | "holding" | "erasing"

  useEffect(() => {
    if (!autoRotate && phase === "erasing") return; // freeze on current phrase
    const cur = PHRASES[i].text;
    let t;
    if (phase === "typing") {
      if (shown.length < cur.length) {
        t = setTimeout(() => setShown(cur.slice(0, shown.length + 1)), typeSpeed);
      } else if (autoRotate) {
        t = setTimeout(() => setPhase("holding"), holdTime);
      }
    } else if (phase === "holding") {
      t = setTimeout(() => setPhase("erasing"), holdTime);
    } else if (phase === "erasing") {
      if (shown.length > 0) {
        t = setTimeout(() => setShown(shown.slice(0, -1)), Math.max(8, typeSpeed * 0.45));
      } else {
        t = setTimeout(() => {
          setI((x) => (x + 1) % PHRASES.length);
          setPhase("typing");
        }, 250);
      }
    }
    return () => clearTimeout(t);
  }, [shown, phase, i, typeSpeed, holdTime, autoRotate]);

  const cur = PHRASES[i];
  const isRTL = cur.code === "ar";
  return (
    <React.Fragment>
      <h1
        lang={cur.code}
        dir={isRTL ? "rtl" : "ltr"}
        className="hero-title rotating"
        style={style}>
        <span className="typed">{shown}</span><span className="caret" aria-hidden="true"></span>
      </h1>
      {showBadge && (
        <span className="lang-badge" aria-hidden="true">
          <span className="dot"></span>
          <span>{cur.label}</span>
        </span>
      )}
    </React.Fragment>);

}

function Ticker() {
  return (
    <aside className="ticker" aria-label="Recent thought">
      <span className="thumb" aria-hidden="true">
        <span className="play">
          <svg width="14" height="14" viewBox="0 0 20 20"><path d="M6 4l11 6-11 6z" fill="currentColor" /></svg>
        </span>
      </span>
      <span className="label">A field note from the lab.</span>
      <a className="cta" href="#organic">
        <span>read «buoys, before code»</span>
        <span className="arrow" aria-hidden="true">→</span>
      </a>
    </aside>);

}

function Hero({ t = {} }) {
  const heroFont = t.heroFont || "Inter";
  const heroFamily =
    heroFont === "Source Serif 4" ? "'Source Serif 4', serif" :
    heroFont === "JetBrains Mono" ? "'JetBrains Mono', ui-monospace, monospace" :
    "Inter, system-ui, sans-serif";
  const heroSize = t.heroSize ? `${t.heroSize}px` : "clamp(34px, 6.6vw, 92px)";
  const heroWeight = t.heroWeight || 600;
  return (
    <section className="hero" id="top">
      <header className="hero-header">
        {t.showHandle !== false && (
          <span className="hero-handle">~/sancamac</span>
        )}
        <RotatingTagline
          style={{ fontSize: heroSize, fontFamily: heroFamily, fontWeight: heroWeight }}
          typeSpeed={t.typeSpeed ?? 68}
          holdTime={t.holdTime ?? 2600}
          autoRotate={t.autoRotate !== false}
          showBadge={t.showBadge !== false} />
        <p className="hero-tagline">
           <em></em>
        </p>
        <nav className="hero-nav" aria-label="sections">
          <a href="#work">work</a>
          <a href="#verticals">verticals</a>
          <a href="#lab">lab</a>
          <a href="#organic">organic</a>
          <a href="#slop">slop</a>
        </nav>
      </header>

      {t.showAsset !== false && (
        <div className="universe-wrap" aria-hidden="false">
          <UniverseDiagram />
        </div>
      )}

      {t.showAsset !== false && (
        <div className="hero-asset" role="group" aria-label="A blueprint of an offshore oil-transfer system fading downward into the page, overlaid with status cards for each component running on the network.">
          <div className="diagram-frame">
            <OilBuoyDiagram />
          </div>

          {t.showNodes !== false && (
            <React.Fragment>
              <ToolNode
                style={{ top: "8%", left: "6%" }}
                icon="buoy"
                title="buoy · sncmc-04"
                desc="Streaming telemetry…"
                delay={150} />
              <span className="vertex" style={{ top: "16%", left: "18%" }} />
              <span className="edge h pulse" style={{ top: "16%", left: "18%", width: "10%" }} />
              <span className="edge v pulse" style={{ top: "16%", left: "28%", height: "30%" }} />

              <ToolNode
                style={{ top: "4%", right: "6%" }}
                icon="console"
                title="shore · console"
                desc="Reading 4 820 m³/h…"
                delay={350} />
              <span className="vertex" style={{ top: "14%", right: "18%" }} />
              <span className="edge h pulse" style={{ top: "14%", right: "18%", width: "10%" }} />
              <span className="edge v pulse" style={{ top: "14%", right: "28%", height: "20%" }} />

              <ToolNode
                style={{ bottom: "12%", left: "32%" }}
                icon="arm"
                title="arm · 3"
                desc="Calibrating wrist…"
                delay={550} />
              <span className="vertex" style={{ bottom: "26%", left: "42%" }} />
              <span className="edge h pulse" style={{ bottom: "26%", left: "32%", width: "10%" }} />

              <ToolNode
                style={{ bottom: "8%", right: "10%" }}
                icon="pen"
                title="organic"
                desc="Drafting field note…"
                delay={750} />
              <span className="vertex" style={{ bottom: "22%", right: "22%" }} />
              <span className="edge h pulse" style={{ bottom: "22%", right: "22%", width: "8%" }} />
            </React.Fragment>
          )}
        </div>
      )}

      {t.showTicker !== false && <Ticker />}
    </section>);

}

window.Hero = Hero;