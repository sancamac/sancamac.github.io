/* global React */
// ===========================================================
// diagrams.jsx — hi-fi blueprint SVG diagrams
//   <OilBuoyDiagram />  — oil tanker → CALM buoy → shore station
//   <DaVinciDiagram />  — surgical robot ↔ surgeon console
// Both are technical line-art "blueprints" on a cream ground.
// Common classes are defined in styles.css (bp-stroke, etc.).
// ===========================================================

var { useId } = React;

// ---------------- small helpers ----------------
function DimLine({ x1, y1, x2, y2, label, offset = 14, side = "top" }) {
  // a thin dimension line with end ticks + label
  const isHorizontal = y1 === y2;
  const tick = 5;
  if (isHorizontal) {
    const ly = side === "top" ? y1 - offset : y1 + offset;
    return (
      <g>
        <line x1={x1} y1={ly} x2={x2} y2={ly} className="bp-stroke-thin" />
        <line x1={x1} y1={ly - tick} x2={x1} y2={ly + tick} className="bp-stroke-thin" />
        <line x1={x2} y1={ly - tick} x2={x2} y2={ly + tick} className="bp-stroke-thin" />
        <text x={(x1 + x2) / 2} y={side === "top" ? ly - 6 : ly + 12} textAnchor="middle" className="bp-label-sm">{label}</text>
      </g>);

  }
  return null;
}

function NorthArrow({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="18" className="bp-stroke-thin" />
      <path d="M 0 -14 L 5 8 L 0 4 L -5 8 Z" className="bp-fill" />
      <text x="0" y="-22" textAnchor="middle" className="bp-label-sm">N</text>
    </g>);

}

// ===========================================================
// DIAGRAM 1 — Oil Tanker offloading to CALM buoy → Shore
// viewBox 1400 x 720
// ===========================================================
function OilBuoyDiagram({ animate = true }) {
  const seaY = 470;
  return (
    <svg className="blueprint" viewBox="0 0 1400 720" role="img" aria-label="Oil tanker offloading to a single-point mooring buoy, with a shore control station monitoring the transfer over a wireless network link.">
      {/* ------- grid background ------- */}
      <g className="bp-grid" aria-hidden="true">
        {Array.from({ length: 28 }).map((_, i) =>
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="720" />
        )}
        {Array.from({ length: 15 }).map((_, i) =>
        <line key={`h${i}`} x1="0" y1={i * 50} x2="1400" y2={i * 50} />
        )}
      </g>

      {/* corner frame ticks */}
      <g className="bp-stroke-thin">
        <path d="M 20 20 L 60 20 M 20 20 L 20 60" />
        <path d="M 1380 20 L 1340 20 M 1380 20 L 1380 60" />
        <path d="M 20 700 L 60 700 M 20 700 L 20 660" />
        <path d="M 1380 700 L 1340 700 M 1380 700 L 1380 660" />
      </g>
      <text x="40" y="46" className="bp-label-sm">FIG. 01 — OFFSHORE OIL TRANSFER</text>
      <text x="1360" y="46" textAnchor="end" className="bp-label-sm">SCALE 1:25,000 · DR. SC</text>
      <NorthArrow x={1340} y={680} />

      {/* ------- sea surface ------- */}
      <line x1="0" y1={seaY} x2="1400" y2={seaY} className="bp-stroke" />
      {/* wave hatching below sea */}
      <g className="bp-stroke-thin" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => {
          const y = seaY + 14 + i * 10;
          return (
            <path key={i} d={`M 0 ${y} Q 30 ${y - 3} 60 ${y} T 120 ${y} T 180 ${y} T 240 ${y} T 300 ${y} T 360 ${y} T 420 ${y} T 480 ${y} T 540 ${y} T 600 ${y} T 660 ${y} T 720 ${y} T 780 ${y} T 840 ${y} T 900 ${y} T 960 ${y} T 1020 ${y} T 1080 ${y} T 1140 ${y} T 1200 ${y} T 1260 ${y} T 1320 ${y} T 1400 ${y}`} />);

        })}
      </g>

      {/* ------- TANKER (left) ------- */}
      <g aria-label="VLCC tanker">
        {/* hull silhouette */}
        <path
          d="M 70 380
             L 460 380
             L 500 405
             L 500 460
             L 60 460
             Z"















          className="bp-fill-muted" />
        
        {/* hull waterline detail */}
        <line x1="70" y1="430" x2="500" y2="430" className="bp-stroke-thin" />
        {/* deck pipe manifold */}
        <line x1="100" y1="380" x2="430" y2="380" className="bp-stroke" />
        {/* deck details: tank lids (top view circles on the deck) */}
        {[140, 200, 260, 320, 380].map((cx) =>
        <g key={cx}>
            <circle cx={cx} cy="365" r="9" className="bp-stroke" />
            <circle cx={cx} cy="365" r="3" className="bp-fill" />
          </g>
        )}
        {/* superstructure / bridge */}
        <path d="M 75 380 L 75 320 L 130 320 L 130 380" className="bp-fill-muted" />
        <rect x="80" y="328" width="44" height="6" className="bp-stroke" />
        <rect x="80" y="342" width="44" height="6" className="bp-stroke" />
        <rect x="80" y="356" width="44" height="6" className="bp-stroke" />
        {/* funnel */}
        <path d="M 95 320 L 95 300 L 115 300 L 115 320" className="bp-fill-muted" />
        {/* mast */}
        <line x1="105" y1="300" x2="105" y2="270" className="bp-stroke" />
        <line x1="98" y1="278" x2="112" y2="278" className="bp-stroke" />
        {/* portholes */}
        {[180, 220, 260, 300, 340, 380, 420].map((cx) =>
        <circle key={cx} cx={cx} cy="440" r="4" className="bp-stroke" />
        )}
        {/* waterline */}
        <line x1="60" y1="460" x2="500" y2="460" className="bp-stroke-thick" />
        {/* depth lines under hull */}
        <line x1="70" y1="475" x2="500" y2="475" className="bp-stroke-thin bp-dash-fine" />

        {/* manifold output (bow side) */}
        <circle cx="500" cy="430" r="5" className="bp-fill" />
        <text x="285" y="320" textAnchor="middle" className="bp-label">VLCC TANKER · 320,000 DWT</text>
        <text x="285" y="495" textAnchor="middle" className="bp-label-sm">M/V «SAN CAMAC»</text>
      </g>

      {/* ------- floating hose (catenary, with float collars) ------- */}
      <g>
        <path
          d="M 500 430 Q 580 510 660 470 T 778 462"
          className="bp-stroke-thick" />
        
        {/* float collars */}
        {[
        { x: 540, y: 472 },
        { x: 580, y: 489 },
        { x: 620, y: 484 },
        { x: 660, y: 470 },
        { x: 700, y: 463 },
        { x: 740, y: 465 }].
        map((p, i) =>
        <g key={i}>
            <ellipse cx={p.x} cy={p.y} rx="9" ry="4" className="bp-fill-muted" />
            <line x1={p.x - 9} y1={p.y} x2={p.x + 9} y2={p.y} className="bp-stroke-thin" />
          </g>
        )}
        <text x="660" y="540" textAnchor="middle" className="bp-label-sm">FLOATING OIL HOSE · Ø 24"</text>
      </g>

      {/* ------- BUOY (CALM single-point mooring, side elevation) ------- */}
      <g aria-label="CALM single-point mooring buoy">
        {/* === MAIN FLOAT BODY (sitting on the waterline at y=470) === */}
        {/* float hull — wide, low cylindrical donut in side view */}
        <path d="M 776 460 L 776 482 L 904 482 L 904 460 Z" className="bp-fill-muted" />
        {/* deck plate (above water) */}
        <line x1="776" y1="460" x2="904" y2="460" className="bp-stroke-thick" />
        {/* hull keel line */}
        <line x1="776" y1="482" x2="904" y2="482" className="bp-stroke-thick" />
        {/* waterline mark across hull */}
        <line x1="776" y1="470" x2="904" y2="470" className="bp-stroke-thin bp-dash-fine" />
        {/* hull ring plating — horizontal seams */}
        <line x1="776" y1="466" x2="904" y2="466" className="bp-stroke-thin" />
        <line x1="776" y1="476" x2="904" y2="476" className="bp-stroke-thin" />
        {/* vertical hull stiffeners */}
        {[792, 808, 824, 840, 856, 872, 888].map((x) =>
        <line key={x} x1={x} y1="460" x2={x} y2="482" className="bp-stroke-thin" />
        )}

        {/* fender belt — rubber boat fenders riding the waterline at both ends */}
        <rect x="770" y="466" width="8" height="10" className="bp-fill" />
        <rect x="902" y="466" width="8" height="10" className="bp-fill" />

        {/* === SKIRT / KEEL CONE (below water, narrowing) === */}
        <path d="M 776 482 L 806 520 L 874 520 L 904 482 Z" className="bp-fill-muted" />
        <path d="M 776 482 L 806 520 L 874 520 L 904 482" className="bp-stroke" />
        {/* skirt ribs */}
        <line x1="820" y1="482" x2="816" y2="520" className="bp-stroke-thin" />
        <line x1="840" y1="482" x2="840" y2="520" className="bp-stroke-thin" />
        <line x1="860" y1="482" x2="864" y2="520" className="bp-stroke-thin" />

        {/* === BOARDING LADDER (right side) === */}
        <line x1="906" y1="456" x2="906" y2="482" className="bp-stroke" />
        <line x1="912" y1="456" x2="912" y2="482" className="bp-stroke" />
        {[460, 466, 472, 478].map((y) =>
        <line key={y} x1="906" y1={y} x2="912" y2={y} className="bp-stroke-thin" />
        )}

        {/* === HANDRAIL / WALKWAY on deck === */}
        <line x1="776" y1="452" x2="904" y2="452" className="bp-stroke-thin" />
        {[780, 794, 808, 822, 836, 858, 872, 886, 900].map((x) =>
        <line key={x} x1={x} y1="460" x2={x} y2="452" className="bp-stroke-thin" />
        )}

        {/* === HOSE PICKUP ARM (left side, lifts the floating hose to the manifold) === */}
        <path d="M 778 460 L 770 452 L 770 442 L 786 442" className="bp-stroke-thick" />
        <circle cx="770" cy="452" r="2" className="bp-fill" />
        {/* manifold piping crossing the deck */}
        <path d="M 786 442 L 836 442" className="bp-stroke-thick" />
        {/* valve wheel on manifold */}
        <circle cx="820" cy="442" r="3.5" className="bp-stroke" />
        <line x1="816" y1="442" x2="824" y2="442" className="bp-stroke-thin" />
        <line x1="820" y1="438.5" x2="820" y2="445.5" className="bp-stroke-thin" />

        {/* === TURNTABLE (rotating ring on top of float, smaller diameter) === */}
        {/* lower turntable plate */}
        <path d="M 800 452 L 798 444 L 882 444 L 880 452 Z" className="bp-fill-muted" />
        <path d="M 800 452 L 798 444 L 882 444 L 880 452" className="bp-stroke" />
        {/* upper turntable plate */}
        <rect x="804" y="438" width="72" height="6" className="bp-fill-muted" />
        <rect x="804" y="438" width="72" height="6" className="bp-stroke" />
        {/* turntable bearing seam */}
        <line x1="800" y1="448" x2="880" y2="448" className="bp-stroke-thin bp-dash-fine" />

        {/* bollards (mooring posts on top of turntable for the tanker hawser) */}
        {[816, 830, 850, 864].map((x) =>
        <g key={x}>
            <rect x={x - 2.5} y="432" width="5" height="6" className="bp-fill-muted" />
            <rect x={x - 2.5} y="432" width="5" height="6" className="bp-stroke" />
            <rect x={x - 3.5} y="430" width="7" height="3" className="bp-fill" />
          </g>
        )}

        {/* hawser (mooring line) leading off toward the tanker (left) */}
        <path d="M 816 432 Q 700 410 510 405" className="bp-stroke-thin" strokeDasharray="0" />
        <text x="620" y="395" className="bp-label-sm">HAWSER · 76 mm polyester</text>

        {/* === CENTRAL MAST / TOWER === */}
        {/* mast tube */}
        <rect x="837" y="318" width="6" height="116" className="bp-fill-muted" />
        <rect x="837" y="318" width="6" height="116" className="bp-stroke" />
        {/* mast cross-braces (every 25 px) */}
        {[346, 370, 394, 418].map((y) =>
        <g key={y}>
            <line x1="828" y1={y} x2="852" y2={y} className="bp-stroke-thin" />
            <path d={`M 828 ${y - 4} L 852 ${y + 4} M 828 ${y + 4} L 852 ${y - 4}`} className="bp-stroke-thin" opacity="0.6" />
          </g>
        )}

        {/* solar panel array (port side of mast) */}
        <g>
          <path d="M 808 376 L 828 372 L 828 396 L 808 400 Z" className="bp-fill-muted" />
          <path d="M 808 376 L 828 372 L 828 396 L 808 400 Z" className="bp-stroke" />
          {[379, 386, 393].map((y) =>
          <line key={y} x1="808" y1={y} x2="828" y2={y - 3} className="bp-stroke-thin" />
          )}
          <line x1="818" y1="374" x2="818" y2="398" className="bp-stroke-thin" />
        </g>
        {/* solar panel array (starboard side, mirrored) */}
        <g>
          <path d="M 852 372 L 872 376 L 872 400 L 852 396 Z" className="bp-fill-muted" />
          <path d="M 852 372 L 872 376 L 872 400 L 852 396 Z" className="bp-stroke" />
          {[376, 383, 390].map((y) =>
          <line key={y} x1="852" y1={y} x2="872" y2={y + 3} className="bp-stroke-thin" />
          )}
          <line x1="862" y1="374" x2="862" y2="398" className="bp-stroke-thin" />
        </g>

        {/* radar reflector — corner-cube X frame on top crossbar */}
        <g transform="translate(840 348)">
          <line x1="-10" y1="-10" x2="10" y2="10" className="bp-stroke" />
          <line x1="-10" y1="10" x2="10" y2="-10" className="bp-stroke" />
          <rect x="-10" y="-10" width="20" height="20" className="bp-stroke-thin" />
        </g>

        {/* satcom radome on side bracket */}
        <g>
          <line x1="843" y1="332" x2="858" y2="332" className="bp-stroke" />
          <ellipse cx="864" cy="332" rx="7" ry="5" className="bp-fill-muted" />
          <ellipse cx="864" cy="332" rx="7" ry="5" className="bp-stroke" />
          <path d="M 858 332 q 6 -4 12 0" className="bp-stroke-thin" />
        </g>

        {/* UHF whip antenna */}
        <line x1="840" y1="318" x2="840" y2="298" className="bp-stroke" />
        <circle cx="840" cy="298" r="1.5" className="bp-fill" />

        {/* === NAVIGATION LIGHT (top of mast, with cage) === */}
        <g>
          <rect x="833" y="305" width="14" height="12" className="bp-fill-muted" />
          <rect x="833" y="305" width="14" height="12" className="bp-stroke" />
          {/* lamp inside */}
          <circle cx="840" cy="311" r="3.5" className="bp-fill" />
          {/* protective cage bars */}
          <line x1="836" y1="305" x2="836" y2="317" className="bp-stroke-thin" />
          <line x1="844" y1="305" x2="844" y2="317" className="bp-stroke-thin" />
          {/* sun shield top */}
          <path d="M 831 305 L 840 300 L 849 305" className="bp-stroke" />
        </g>

        {/* === ANCHOR CHAINS (8-leg rosette to seabed, catenary curves) === */}
        <g>
          {[
          { sx: 776, sy: 488, ex: 600, ey: 678 },
          { sx: 786, sy: 492, ex: 660, ey: 690 },
          { sx: 806, sy: 510, ex: 720, ey: 700 },
          { sx: 826, sy: 518, ex: 790, ey: 706 },
          { sx: 854, sy: 518, ex: 890, ey: 706 },
          { sx: 874, sy: 510, ex: 960, ey: 700 },
          { sx: 894, sy: 492, ex: 1020, ey: 690 },
          { sx: 904, sy: 488, ex: 1080, ey: 678 }].
          map((c, i) => {
            const cpx = (c.sx + c.ex) / 2;
            const cpy = c.sy + (c.ey - c.sy) * 0.85;
            return (
              <g key={i}>
                <path d={`M ${c.sx} ${c.sy} Q ${cpx} ${cpy} ${c.ex} ${c.ey}`} className="bp-stroke-thin" />
                {/* chain link hashing — short ticks along the catenary */}
                {[0.25, 0.5, 0.75].map((t, j) => {
                  const x = (1 - t) * (1 - t) * c.sx + 2 * (1 - t) * t * cpx + t * t * c.ex;
                  const y = (1 - t) * (1 - t) * c.sy + 2 * (1 - t) * t * cpy + t * t * c.ey;
                  return <circle key={j} cx={x} cy={y} r="0.9" className="bp-fill" />;
                })}
              </g>);

          })}
          {/* anchor symbols at seabed */}
          {[
          { x: 600, y: 678 }, { x: 660, y: 690 }, { x: 720, y: 700 }, { x: 790, y: 706 },
          { x: 890, y: 706 }, { x: 960, y: 700 }, { x: 1020, y: 690 }, { x: 1080, y: 678 }].
          map((a, i) =>
          <g key={i}>
              <line x1={a.x - 5} y1={a.y} x2={a.x + 5} y2={a.y} className="bp-stroke-thick" />
              <path d={`M ${a.x - 5} ${a.y} q 5 9 5 0 q -5 9 -5 0`} className="bp-stroke" />
              <line x1={a.x} y1={a.y - 6} x2={a.x} y2={a.y + 8} className="bp-stroke" />
            </g>
          )}
        </g>

        {/* === LABELS === */}
        <text x="840" y="288" textAnchor="middle" className="bp-label">CALM BUOY · «sncmc-04»</text>
        <text x="840" y="540" textAnchor="middle" className="bp-label-sm">SINGLE-POINT MOORING · 14 m Ø · 8-leg catenary</text>
        {/* component leader lines + callouts on the right */}
        <g className="bp-label-sm">
          <line x1="852" y1="311" x2="920" y2="311" className="bp-stroke-thin" />
          <text x="924" y="314">nav light · Fl Y 4s</text>
          <line x1="852" y1="348" x2="920" y2="348" className="bp-stroke-thin" />
          <text x="924" y="351">radar reflector</text>
          <line x1="872" y1="384" x2="920" y2="384" className="bp-stroke-thin" />
          <text x="924" y="387">solar array · 240 W</text>
          <line x1="876" y1="442" x2="920" y2="442" className="bp-stroke-thin" />
          <text x="924" y="445">turntable · 360°</text>
          <line x1="884" y1="470" x2="938" y2="470" className="bp-stroke-thin" />
          <text x="942" y="473">main float</text>
          <line x1="874" y1="510" x2="940" y2="510" className="bp-stroke-thin" />
          <text x="944" y="513">skirt / keel cone</text>
        </g>
      </g>

      {/* ------- subsea pipeline from buoy to shore (PLEM) ------- */}
      <g>
        <path
          d="M 840 488 L 840 540 L 1180 540 L 1180 470"
          className="bp-stroke-thick bp-dash-fine" />
        
        <text x="1010" y="556" textAnchor="middle" className="bp-label-sm">SUBSEA PIPELINE · Ø 36"</text>
        {/* PLEM marker */}
        <rect x="832" y="536" width="16" height="10" className="bp-fill-muted" />
        <text x="822" y="555" className="bp-label-sm">PLEM</text>
      </g>

      {/* ------- wireless link ------- */}
      <g>
        {animate ?
        <path d="M 840 305 Q 1020 200 1200 340" className="bp-stroke bp-signal" /> :

        <path d="M 840 305 Q 1020 200 1200 340" className="bp-stroke bp-dash" />
        }
        {/* sonar pulse rings at buoy */}
        {animate &&
        <g>
            <circle cx="840" cy="311" r="4" className="bp-stroke bp-pulse" />
            <circle cx="840" cy="311" r="4" className="bp-stroke bp-pulse" style={{ animationDelay: "1s" }} />
          </g>
        }
        <text x="1020" y="210" textAnchor="middle" className="bp-label-sm">UHF · 401.5 MHz · TELEMETRY</text>
      </g>

      {/* ------- shore terrain ------- */}
      <g>
        <path d="M 1100 470 L 1140 460 L 1170 462 L 1210 458 L 1250 460 L 1290 464 L 1340 462 L 1380 466 L 1380 480 L 1100 480 Z" className="bp-fill-muted" />
        {/* terrain hatch */}
        <g className="bp-stroke-thin">
          {Array.from({ length: 12 }).map((_, i) =>
          <line key={i} x1={1110 + i * 22} y1="480" x2={1100 + i * 22} y2="500" />
          )}
        </g>
      </g>

      {/* ------- SHORE STATION ------- */}
      <g aria-label="Shore control station">
        {/* building */}
        <rect x="1150" y="370" width="180" height="92" className="bp-fill-muted" />
        <line x1="1150" y1="395" x2="1330" y2="395" className="bp-stroke" />
        {/* roof line */}
        <path d="M 1145 370 L 1240 340 L 1335 370" className="bp-stroke" />
        <line x1="1240" y1="340" x2="1240" y2="370" className="bp-stroke-thin" />
        {/* windows */}
        {[1170, 1200, 1230, 1260, 1290].map((x) =>
        <rect key={x} x={x} y="408" width="22" height="22" className="bp-stroke" />
        )}
        {/* door */}
        <rect x="1230" y="430" width="20" height="32" className="bp-stroke" />
        {/* antenna tower */}
        <path d="M 1196 370 L 1190 300 L 1202 300 L 1196 370" className="bp-stroke" />
        <line x1="1190" y1="320" x2="1202" y2="320" className="bp-stroke-thin" />
        <line x1="1192" y1="335" x2="1200" y2="335" className="bp-stroke-thin" />
        {/* dish */}
        <path d="M 1196 295 q -10 -8 -3 -16 q 14 -4 14 0 q 5 8 -3 16" className="bp-stroke" />
        <circle cx="1196" cy="290" r="2" className="bp-fill" />
        {/* monitoring screens floating callout */}
        <g transform="translate(1255 240)">
          <rect x="0" y="0" width="120" height="70" rx="4" className="bp-fill-muted" />
          <text x="6" y="14" className="bp-label-sm">CONSOLE · FLOW</text>
          {/* tiny waveform inside */}
          <polyline
            points="6,40 14,32 22,46 30,30 38,42 46,26 54,38 62,28 70,46 78,30 86,40 94,28 102,44 110,32 114,38"
            className="bp-stroke" />
          
          <text x="6" y="62" className="bp-label-sm">4 820 m³/h ▲</text>
        </g>
        {/* leader from console to building */}
        <line x1="1300" y1="310" x2="1280" y2="350" className="bp-stroke-thin" />

        <text x="1240" y="500" textAnchor="middle" className="bp-label">SHORE CONTROL · sncmc.ar</text>
      </g>

      {/* sea-level label */}
      <text x="40" y={seaY - 8} className="bp-label-sm">MSL ±0.00 m</text>

      {/* dimension line: tanker → buoy */}
      <DimLine x1={510} y1={395} x2={790} y2={395} label="≈ 1.5 km" side="top" offset={50} />
      {/* dimension line: buoy → shore */}
      <DimLine x1={895} y1={395} x2={1145} y2={395} label="≈ 4.2 km" side="top" offset={50} />
    </svg>);

}

// ===========================================================
// DIAGRAM 2 — da Vinci surgical system
// patient-side cart  ⇌  surgeon console
// viewBox 1400 x 720
// ===========================================================
function DaVinciDiagram({ animate = true }) {
  return (
    <svg className="blueprint" viewBox="0 0 1400 720" role="img" aria-label="A four-armed surgical robot operating on a patient on the left, networked over a stereoscopic feed to a surgeon at a console with twin viewfinders and a 3D anatomical display on the right.">
      {/* grid */}
      <g className="bp-grid" aria-hidden="true">
        {Array.from({ length: 28 }).map((_, i) =>
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="720" />
        )}
        {Array.from({ length: 15 }).map((_, i) =>
        <line key={`h${i}`} x1="0" y1={i * 50} x2="1400" y2={i * 50} />
        )}
      </g>
      <g className="bp-stroke-thin">
        <path d="M 20 20 L 60 20 M 20 20 L 20 60" />
        <path d="M 1380 20 L 1340 20 M 1380 20 L 1380 60" />
        <path d="M 20 700 L 60 700 M 20 700 L 20 660" />
        <path d="M 1380 700 L 1340 700 M 1380 700 L 1380 660" />
      </g>
      <text x="40" y="46" className="bp-label-sm">FIG. 02 — TELEOPERATED SURGICAL SYSTEM</text>
      <text x="1360" y="46" textAnchor="end" className="bp-label-sm">SCALE 1:30 · DR. SC</text>

      {/* floor line */}
      <line x1="40" y1="620" x2="1360" y2="620" className="bp-stroke" />
      <g className="bp-stroke-thin">
        {Array.from({ length: 40 }).map((_, i) =>
        <line key={i} x1={40 + i * 33} y1="620" x2={40 + i * 33 - 8} y2="640" />
        )}
      </g>

      {/* ===================== LEFT: PATIENT-SIDE CART ===================== */}
      <g aria-label="Patient-side cart">
        {/* base */}
        <rect x="120" y="580" width="240" height="40" rx="4" className="bp-fill-muted" />
        {/* wheels */}
        <circle cx="150" cy="630" r="14" className="bp-stroke" />
        <circle cx="150" cy="630" r="4" className="bp-fill" />
        <circle cx="330" cy="630" r="14" className="bp-stroke" />
        <circle cx="330" cy="630" r="4" className="bp-fill" />
        {/* central column */}
        <rect x="220" y="200" width="40" height="380" className="bp-fill-muted" />
        <line x1="220" y1="260" x2="260" y2="260" className="bp-stroke-thin" />
        <line x1="220" y1="320" x2="260" y2="320" className="bp-stroke-thin" />
        <line x1="220" y1="380" x2="260" y2="380" className="bp-stroke-thin" />
        <line x1="220" y1="440" x2="260" y2="440" className="bp-stroke-thin" />
        {/* top cap / illumination */}
        <rect x="200" y="180" width="80" height="20" rx="4" className="bp-fill" />
        <line x1="210" y1="180" x2="270" y2="180" className="bp-stroke-thick" />

        {/* spread arms — from a shared yoke at top */}
        {/* Arm definitions: angle from yoke, label */}
        {/* Yoke center at (240, 200) */}
        {/* arm 1 — far left */}
        <g aria-label="Arm 1">
          <line x1="240" y1="200" x2="120" y2="240" className="bp-stroke-thick" />
          <circle cx="120" cy="240" r="6" className="bp-fill" />
          <line x1="120" y1="240" x2="120" y2="360" className="bp-stroke-thick" />
          <circle cx="120" cy="360" r="6" className="bp-fill" />
          <line x1="120" y1="360" x2="170" y2="430" className="bp-stroke-thick" />
          <circle cx="170" cy="430" r="5" className="bp-fill" />
          <line x1="170" y1="430" x2="200" y2="500" className="bp-stroke" />
          <line x1="195" y1="498" x2="205" y2="502" className="bp-stroke-thick" />
          <text x="98" y="232" className="bp-label-sm">ARM 1</text>
        </g>
        {/* arm 2 */}
        <g aria-label="Arm 2">
          <line x1="240" y1="200" x2="180" y2="260" className="bp-stroke-thick" />
          <circle cx="180" cy="260" r="6" className="bp-fill" />
          <line x1="180" y1="260" x2="200" y2="400" className="bp-stroke-thick" />
          <circle cx="200" cy="400" r="6" className="bp-fill" />
          <line x1="200" y1="400" x2="230" y2="490" className="bp-stroke" />
          <text x="158" y="254" className="bp-label-sm">ARM 2 — CAMERA</text>
          {/* endoscope marker */}
          <circle cx="230" cy="490" r="3" className="bp-fill" />
        </g>
        {/* arm 3 */}
        <g aria-label="Arm 3">
          <line x1="240" y1="200" x2="300" y2="260" className="bp-stroke-thick" />
          <circle cx="300" cy="260" r="6" className="bp-fill" />
          <line x1="300" y1="260" x2="280" y2="400" className="bp-stroke-thick" />
          <circle cx="280" cy="400" r="6" className="bp-fill" />
          <line x1="280" y1="400" x2="255" y2="490" className="bp-stroke" />
          <text x="305" y="254" className="bp-label-sm">ARM 3</text>
        </g>
        {/* arm 4 — far right */}
        <g aria-label="Arm 4">
          <line x1="240" y1="200" x2="360" y2="240" className="bp-stroke-thick" />
          <circle cx="360" cy="240" r="6" className="bp-fill" />
          <line x1="360" y1="240" x2="360" y2="360" className="bp-stroke-thick" />
          <circle cx="360" cy="360" r="6" className="bp-fill" />
          <line x1="360" y1="360" x2="310" y2="430" className="bp-stroke-thick" />
          <circle cx="310" cy="430" r="5" className="bp-fill" />
          <line x1="310" y1="430" x2="280" y2="500" className="bp-stroke" />
          <text x="370" y="232" className="bp-label-sm">ARM 4</text>
        </g>

        {/* operating table */}
        <g>
          <rect x="60" y="510" width="440" height="14" className="bp-fill-muted" />
          <rect x="60" y="510" width="440" height="14" className="bp-stroke" />
          {/* table column */}
          <rect x="260" y="524" width="40" height="60" className="bp-fill-muted" />
          {/* patient under drape */}
          <path d="M 110 510 Q 280 470 450 510 L 450 510 L 110 510 Z" className="bp-fill-muted" />
          <path d="M 110 510 Q 280 470 450 510" className="bp-stroke" />
          {/* drape folds */}
          <path d="M 160 504 q 0 -6 6 -8" className="bp-stroke-thin" />
          <path d="M 220 494 q 0 -6 8 -8" className="bp-stroke-thin" />
          <path d="M 300 488 q 0 -6 10 -8" className="bp-stroke-thin" />
          <path d="M 380 494 q 0 -6 10 -8" className="bp-stroke-thin" />
          {/* incision marker */}
          <line x1="265" y1="490" x2="285" y2="478" className="bp-stroke-thick" />
          <text x="320" y="478" className="bp-label-sm">port site</text>

          {/* table dimension line */}
          <DimLine x1={60} y1={544} x2={500} y2={544} label="2.10 m" side="bottom" offset={14} />
        </g>

        <text x="240" y="170" textAnchor="middle" className="bp-label">PATIENT-SIDE CART</text>
      </g>

      {/* ===================== NETWORK BRIDGE (center) ===================== */}
      <g aria-label="Network bridge">
        {/* rack */}
        <g transform="translate(640 380)">
          <rect x="0" y="0" width="120" height="200" rx="3" className="bp-fill-muted" />
          <rect x="0" y="0" width="120" height="200" rx="3" className="bp-stroke" />
          {[18, 50, 82, 114, 146, 178].map((y) =>
          <g key={y}>
              <line x1="0" y1={y} x2="120" y2={y} className="bp-stroke-thin" />
              <circle cx="10" cy={y + 12} r="2" className="bp-fill" />
              <circle cx="18" cy={y + 12} r="2" className="bp-fill" />
              <rect x="60" y={y + 8} width="50" height="6" className="bp-stroke-thin" />
            </g>
          )}
          <text x="60" y="220" textAnchor="middle" className="bp-label">VIDEO BRIDGE · 4K · 60 fps</text>
        </g>

        {/* link from patient cart to bridge */}
        {animate ?
        <path d="M 380 460 C 500 460, 560 440, 640 450" className="bp-stroke bp-signal" /> :

        <path d="M 380 460 C 500 460, 560 440, 640 450" className="bp-stroke bp-dash" />
        }
        <text x="510" y="438" className="bp-label-sm">STEREO ENDOSCOPE FEED</text>
        <text x="510" y="478" className="bp-label-sm">↳ 12-bit · disparity map</text>

        {/* link from bridge to console */}
        {animate ?
        <path d="M 760 470 C 850 470, 880 470, 980 470" className="bp-stroke bp-signal" /> :

        <path d="M 760 470 C 850 470, 880 470, 980 470" className="bp-stroke bp-dash" />
        }
        <text x="870" y="458" className="bp-label-sm">MOTION COMMANDS</text>
        <text x="870" y="498" className="bp-label-sm">↳ haptic, &lt; 2 ms RTT</text>
      </g>

      {/* ===================== RIGHT: SURGEON CONSOLE ===================== */}
      <g aria-label="Surgeon console">
        {/* 3D display behind */}
        <g>
          <rect x="1080" y="180" width="260" height="160" rx="6" className="bp-fill-muted" />
          <rect x="1080" y="180" width="260" height="160" rx="6" className="bp-stroke-thick" />
          {/* stand */}
          <line x1="1210" y1="340" x2="1210" y2="380" className="bp-stroke-thick" />
          <line x1="1180" y1="380" x2="1240" y2="380" className="bp-stroke-thick" />
          {/* 3D anatomy hint — abstract topo lines */}
          <g transform="translate(1210 260)">
            <ellipse cx="0" cy="0" rx="80" ry="40" className="bp-stroke-thin" />
            <ellipse cx="0" cy="0" rx="62" ry="30" className="bp-stroke-thin" />
            <ellipse cx="-4" cy="-2" rx="44" ry="20" className="bp-stroke-thin" />
            <ellipse cx="-8" cy="-3" rx="26" ry="12" className="bp-stroke-thin" />
            <circle cx="-14" cy="-6" r="6" className="bp-fill" />
            {/* axes */}
            <line x1="-90" y1="40" x2="90" y2="40" className="bp-stroke-thin" />
            <line x1="-90" y1="40" x2="-60" y2="58" className="bp-stroke-thin" />
            <line x1="-90" y1="40" x2="-90" y2="-30" className="bp-stroke-thin" />
            <text x="-90" y="74" className="bp-label-sm">x</text>
            <text x="-58" y="64" className="bp-label-sm">y</text>
            <text x="-100" y="-26" className="bp-label-sm">z</text>
          </g>
          <text x="1090" y="200" className="bp-label-sm">3D ANATOMICAL VIEW · LIVE</text>
        </g>

        {/* console body */}
        <g>
          {/* base */}
          <rect x="1040" y="540" width="280" height="60" rx="6" className="bp-fill-muted" />
          {/* support column */}
          <path d="M 1140 540 L 1140 440 L 1220 440 L 1220 540" className="bp-fill-muted" />
          {/* viewfinder hood */}
          <path d="M 1100 440 Q 1180 380 1260 440 Z" className="bp-fill-muted" />
          <path d="M 1100 440 Q 1180 380 1260 440" className="bp-stroke-thick" />
          {/* twin eyepieces */}
          <circle cx="1160" cy="418" r="14" className="bp-stroke" />
          <circle cx="1160" cy="418" r="5" className="bp-fill" />
          <circle cx="1200" cy="418" r="14" className="bp-stroke" />
          <circle cx="1200" cy="418" r="5" className="bp-fill" />
          {/* control sticks (master tools) */}
          <line x1="1110" y1="500" x2="1085" y2="540" className="bp-stroke-thick" />
          <line x1="1080" y1="538" x2="1090" y2="544" className="bp-stroke-thick" />
          <line x1="1250" y1="500" x2="1275" y2="540" className="bp-stroke-thick" />
          <line x1="1270" y1="538" x2="1280" y2="544" className="bp-stroke-thick" />
          {/* foot pedals */}
          <rect x="1050" y="610" width="34" height="14" className="bp-stroke" />
          <rect x="1086" y="610" width="34" height="14" className="bp-stroke" />
          <rect x="1180" y="610" width="34" height="14" className="bp-stroke" />
          <rect x="1216" y="610" width="34" height="14" className="bp-stroke" />
          <line x1="1067" y1="624" x2="1067" y2="630" className="bp-stroke-thin" />
        </g>

        {/* surgeon silhouette */}
        <g aria-label="Surgeon">
          {/* head */}
          <circle cx="1180" cy="350" r="18" className="bp-stroke-thick" />
          {/* surgical cap */}
          <path d="M 1162 350 q 18 -22 36 0" className="bp-fill" />
          {/* neck */}
          <path d="M 1170 366 L 1170 380 L 1190 380 L 1190 366" className="bp-stroke" />
          {/* shoulders / torso, leaning into eyepieces */}
          <path d="M 1140 460 Q 1180 380 1220 460 L 1240 560 L 1120 560 Z" className="bp-fill-muted" />
          <path d="M 1140 460 Q 1180 380 1220 460" className="bp-stroke" />
          {/* arms toward control sticks */}
          <path d="M 1150 460 Q 1130 490 1110 500" className="bp-stroke-thick" />
          <path d="M 1210 460 Q 1230 490 1250 500" className="bp-stroke-thick" />
          {/* legs */}
          <line x1="1158" y1="560" x2="1140" y2="610" className="bp-stroke-thick" />
          <line x1="1202" y1="560" x2="1220" y2="610" className="bp-stroke-thick" />
        </g>

        <text x="1180" y="170" textAnchor="middle" className="bp-label">SURGEON CONSOLE</text>
        <text x="1180" y="660" textAnchor="middle" className="bp-label-sm">DR. SC · «sancamac»</text>
      </g>

      {/* sonar pulses on console output */}
      {animate &&
      <g>
          <circle cx="640" cy="450" r="4" className="bp-stroke bp-pulse" />
          <circle cx="640" cy="450" r="4" className="bp-stroke bp-pulse" style={{ animationDelay: "1.3s" }} />
        </g>
      }
    </svg>);

}

window.OilBuoyDiagram = OilBuoyDiagram;
window.DaVinciDiagram = DaVinciDiagram;