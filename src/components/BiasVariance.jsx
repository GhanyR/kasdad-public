import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');`;

// ══════════════════════════════════════════════════
// THEME
// ══════════════════════════════════════════════════
const themes = {
  dark: {
    bg: "#0a0a0f", bgCard: "#111118", bgCard2: "#16161f",
    bgAccent: "#1a1a28", border: "#222233", borderLight: "#2a2a3d",
    text: "#e8e8f0", textMuted: "#8888aa", textDim: "#555577",
    accent: "#7c6aef", accentSoft: "#7c6aef22", accentGlow: "#7c6aef44",
    warm: "#f0a050", warmSoft: "#f0a05022",
    red: "#ef5f6f", redSoft: "#ef5f6f18",
    green: "#50c878", greenSoft: "#50c87818",
    blue: "#5fa8ef", blueSoft: "#5fa8ef18",
    pink: "#e87cac", pinkSoft: "#e87cac18",
    yellow: "#e8c84a", yellowSoft: "#e8c84a18",
    gradient: "linear-gradient(135deg, #7c6aef, #5fa8ef)",
    shadow: "0 8px 32px rgba(0,0,0,0.4)",
    codeBg: "#0d0d16",
  },
  light: {
    bg: "#f5f3f0", bgCard: "#ffffff", bgCard2: "#faf8f5",
    bgAccent: "#f0ede8", border: "#e0ddd5", borderLight: "#e8e5dd",
    text: "#1a1a2e", textMuted: "#666680", textDim: "#999aaa",
    accent: "#5f4ad0", accentSoft: "#5f4ad015", accentGlow: "#5f4ad025",
    warm: "#d08030", warmSoft: "#d0803015",
    red: "#d04050", redSoft: "#d0405012",
    green: "#2a9858", greenSoft: "#2a985812",
    blue: "#3878c8", blueSoft: "#3878c812",
    pink: "#c05888", pinkSoft: "#c0588812",
    yellow: "#b89828", yellowSoft: "#b8982812",
    gradient: "linear-gradient(135deg, #5f4ad0, #3878c8)",
    shadow: "0 8px 32px rgba(0,0,0,0.08)",
    codeBg: "#f0ede8",
  },
};

// ══════════════════════════════════════════════════
// SECTIONS DATA
// ══════════════════════════════════════════════════
const sections = [
  { id: "overview", label: "Overview", icon: "◉" },
  { id: "fitting", label: "Curve Fitting", icon: "〰" },
  { id: "bias", label: "Bias & Variance", icon: "◎" },
  { id: "overunder", label: "Over / Underfit", icon: "⚖" },
  { id: "formula", label: "Error Formula", icon: "∑" },
  { id: "tradeoff", label: "Tradeoff Graph", icon: "📈" },
  { id: "solutions", label: "Solusi", icon: "🔧" },
  { id: "table", label: "Impact Table", icon: "📋" },
];

// ══════════════════════════════════════════════════
// SVG COMPONENTS
// ══════════════════════════════════════════════════

function CurveFittingSVG({ t, type }) {
  // Generate training data points (curved relationship)
  const pts = [
    [40, 280], [80, 240], [130, 200], [170, 220], [210, 160],
    [260, 140], [300, 120], [340, 130], [380, 90], [420, 80],
  ];
  const colors = { linear: "#ef5f6f", squiggly: "#f0a050", good: "#50c878" };

  // Linear path
  const linearPath = "M 20,290 L 440,60";

  // Squiggly (overfitting) path - passes through every point
  const squigglyPath = "M 20,300 C 30,290 35,285 40,280 C 55,260 65,230 80,240 C 95,250 110,210 130,200 C 150,230 155,230 170,220 C 185,180 195,155 210,160 C 230,165 245,150 260,140 C 275,130 285,115 300,120 C 315,135 325,140 340,130 C 355,105 365,85 380,90 C 395,95 410,75 420,80 C 430,60 435,40 440,50";

  // Good fit path
  const goodPath = "M 20,310 C 80,270 120,230 180,200 C 240,170 300,140 360,110 C 400,95 430,85 450,80";

  const pathMap = { linear: linearPath, squiggly: squigglyPath, good: goodPath };

  return (
    <svg viewBox="0 0 460 320" style={{ width: "100%", maxWidth: 460 }}>
      {/* Grid */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={`g${i}`} x1={0} y1={i * 80} x2={460} y2={i * 80}
          stroke={t.border} strokeWidth={0.5} strokeDasharray="4,4" />
      ))}
      {/* Axes */}
      <line x1={15} y1={10} x2={15} y2={310} stroke={t.textDim} strokeWidth={1.5} />
      <line x1={15} y1={310} x2={450} y2={310} stroke={t.textDim} strokeWidth={1.5} />
      <text x={8} y={160} fill={t.textMuted} fontSize={10} fontFamily="DM Sans"
        transform="rotate(-90,8,160)" textAnchor="middle">f(x)</text>
      <text x={230} y={308} fill={t.textMuted} fontSize={10} fontFamily="DM Sans" textAnchor="middle">x</text>

      {/* True relationship (faded) */}
      <path d={goodPath} fill="none" stroke={t.textDim} strokeWidth={1.5}
        strokeDasharray="6,4" opacity={0.4} />

      {/* Selected curve */}
      <path d={pathMap[type]} fill="none" stroke={colors[type]} strokeWidth={2.5}
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={6} fill={t.accent} opacity={0.2} />
          <circle cx={x} cy={y} r={4} fill={t.accent} />
        </g>
      ))}
    </svg>
  );
}

function DartboardSVG({ t, bias, variance, label }) {
  const cx = 100, cy = 100;
  const rings = [80, 60, 40, 20];
  // Generate dart positions
  const rng = (seed) => {
    let s = seed;
    return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  };
  const r = rng(bias === "high" ? 42 : 7);
  const darts = [];
  for (let i = 0; i < 8; i++) {
    const spread = variance === "high" ? 55 : 12;
    const offsetX = bias === "high" ? 35 : 0;
    const offsetY = bias === "high" ? -30 : 0;
    const dx = cx + offsetX + (r() - 0.5) * spread * 2;
    const dy = cy + offsetY + (r() - 0.5) * spread * 2;
    darts.push([dx, dy]);
  }

  const biasColor = bias === "high" ? t.red : t.green;
  const varColor = variance === "high" ? t.red : t.green;

  return (
    <div style={{ textAlign: "center" }}>
      <svg viewBox="0 0 200 200" style={{ width: 160, height: 160 }}>
        {rings.map((r, i) => (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={t.border} strokeWidth={1} />
        ))}
        {/* Bullseye */}
        <circle cx={cx} cy={cy} r={4} fill={t.accent} opacity={0.6} />
        {/* Darts */}
        {darts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={4} fill={t.warm} />
            <circle cx={x} cy={y} r={2} fill="#fff" opacity={0.6} />
          </g>
        ))}
      </svg>
      <div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: t.text, marginTop: 4 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 6 }}>
        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: biasColor, padding: "2px 8px", borderRadius: 6, background: bias === "high" ? t.redSoft : t.greenSoft }}>
          Bias: {bias === "high" ? "↑" : "↓"}
        </span>
        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: varColor, padding: "2px 8px", borderRadius: 6, background: variance === "high" ? t.redSoft : t.greenSoft }}>
          Var: {variance === "high" ? "↑" : "↓"}
        </span>
      </div>
    </div>
  );
}

function TradeoffGraphSVG({ t }) {
  const w = 440, h = 280;
  const px = 40, py = 20, pr = 20, pb = 40;
  const gw = w - px - pr, gh = h - py - pb;

  // Bias² curve (decreasing)
  const biasPoints = [];
  const varPoints = [];
  const totalPoints = [];
  for (let i = 0; i <= 40; i++) {
    const x = px + (i / 40) * gw;
    const t2 = i / 40;
    const bias = gh * 0.85 * Math.exp(-3 * t2) + gh * 0.05;
    const vari = gh * 0.8 * (1 - Math.exp(-2.5 * t2)) + gh * 0.02;
    const total = bias + vari * 0.5 + gh * 0.08;
    biasPoints.push([x, py + gh - bias]);
    varPoints.push([x, py + gh - vari]);
    totalPoints.push([x, py + Math.min(gh, total * 0.55 + gh * 0.15 * Math.pow(t2 - 0.35, 2))]);
  }

  const toPath = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");

  // Optimal point
  const optIdx = 14;
  const optX = totalPoints[optIdx][0];
  const optY = totalPoints[optIdx][1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: w }}>
      {/* Grid */}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1={px} y1={py + (i / 4) * gh} x2={w - pr} y2={py + (i / 4) * gh}
          stroke={t.border} strokeWidth={0.5} strokeDasharray="3,4" />
      ))}
      {/* Axes */}
      <line x1={px} y1={py} x2={px} y2={h - pb} stroke={t.textDim} strokeWidth={1.5} />
      <line x1={px} y1={h - pb} x2={w - pr} y2={h - pb} stroke={t.textDim} strokeWidth={1.5} />

      {/* Curves */}
      <path d={toPath(biasPoints)} fill="none" stroke={t.blue} strokeWidth={2.5} strokeLinecap="round" />
      <path d={toPath(varPoints)} fill="none" stroke={t.warm} strokeWidth={2.5} strokeLinecap="round" />
      <path d={toPath(totalPoints)} fill="none" stroke={t.red} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="6,3" />

      {/* Noise floor */}
      <line x1={px} y1={h - pb - 15} x2={w - pr} y2={h - pb - 15}
        stroke={t.textDim} strokeWidth={1} strokeDasharray="4,4" opacity={0.5} />
      <text x={w - pr - 5} y={h - pb - 20} fill={t.textDim} fontSize={9}
        fontFamily="JetBrains Mono" textAnchor="end">σ² (irreducible)</text>

      {/* Optimal line */}
      <line x1={optX} y1={py} x2={optX} y2={h - pb}
        stroke={t.green} strokeWidth={1} strokeDasharray="4,4" opacity={0.6} />
      <circle cx={optX} cy={optY} r={5} fill={t.green} />
      <text x={optX} y={py - 4} fill={t.green} fontSize={10}
        fontFamily="DM Sans" fontWeight={600} textAnchor="middle">Optimal</text>

      {/* Labels */}
      <text x={px - 5} y={h / 2} fill={t.textMuted} fontSize={10} fontFamily="DM Sans"
        transform={`rotate(-90,${px - 5},${h / 2})`} textAnchor="middle">Error</text>
      <text x={px + gw / 2} y={h - 8} fill={t.textMuted} fontSize={10}
        fontFamily="DM Sans" textAnchor="middle">Model Complexity →</text>

      {/* Legend */}
      <g transform={`translate(${w - pr - 120}, ${py + 10})`}>
        {[
          { label: "Bias²", color: t.blue },
          { label: "Variance", color: t.warm },
          { label: "Total Error", color: t.red },
        ].map((item, i) => (
          <g key={i} transform={`translate(0,${i * 18})`}>
            <line x1={0} y1={0} x2={16} y2={0} stroke={item.color} strokeWidth={2.5}
              strokeDasharray={item.label === "Total Error" ? "4,2" : "none"} />
            <text x={22} y={4} fill={t.textMuted} fontSize={10} fontFamily="DM Sans">{item.label}</text>
          </g>
        ))}
      </g>

      {/* Zones */}
      <text x={px + gw * 0.12} y={h - pb - gh * 0.02} fill={t.red} fontSize={9}
        fontFamily="JetBrains Mono" opacity={0.7} textAnchor="center">UNDERFIT</text>
      <text x={px + gw * 0.82} y={h - pb - gh * 0.02} fill={t.red} fontSize={9}
        fontFamily="JetBrains Mono" opacity={0.7} textAnchor="center">OVERFIT</text>
    </svg>
  );
}

function ModelComparisonSVG({ t, type }) {
  // type: "underfit", "good", "overfit"
  const pts = [
    [50, 200], [90, 170], [130, 140], [160, 160], [200, 110],
    [240, 100], [280, 80], [310, 95], [350, 60], [380, 55],
  ];

  const paths = {
    underfit: "M 30,210 L 400,50",
    good: "M 30,230 C 80,200 120,170 180,140 C 240,110 300,85 360,70 C 380,65 400,58 410,55",
    overfit: "M 30,220 C 40,215 45,210 50,200 C 55,185 70,165 90,170 C 100,172 115,150 130,140 C 140,155 148,162 160,160 C 170,135 185,108 200,110 C 215,112 228,105 240,100 C 252,90 265,75 280,80 C 290,100 298,100 310,95 C 320,70 335,55 350,60 C 360,65 370,50 380,55 C 390,40 395,35 400,42",
  };

  const colors = { underfit: t.red, good: t.green, overfit: t.warm };
  const labels = { underfit: "Underfitting", good: "Just Right", overfit: "Overfitting" };

  return (
    <div style={{ textAlign: "center" }}>
      <svg viewBox="0 0 420 240" style={{ width: "100%", maxWidth: 320 }}>
        <rect x={20} y={10} width={390} height={220} rx={8}
          fill={t.bgCard2} stroke={t.border} strokeWidth={1} />
        {/* Grid */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1={30} y1={30 + i * 55} x2={400} y2={30 + i * 55}
            stroke={t.border} strokeWidth={0.5} strokeDasharray="2,3" />
        ))}
        {/* True curve (faded) */}
        <path d={paths.good} fill="none" stroke={t.textDim} strokeWidth={1.5}
          strokeDasharray="4,4" opacity={0.3} />
        {/* Model curve */}
        <path d={paths[type]} fill="none" stroke={colors[type]}
          strokeWidth={2.5} strokeLinecap="round" />
        {/* Data points */}
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4} fill={t.accent} opacity={0.7} />
        ))}
      </svg>
      <div style={{
        fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 600,
        color: colors[type], marginTop: 6,
      }}>{labels[type]}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// HELPER COMPONENTS
// ══════════════════════════════════════════════════

function Card({ t, children, style, glow }) {
  return (
    <div style={{
      background: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: 16, padding: 24, position: "relative",
      boxShadow: glow ? `0 0 40px ${t.accentGlow}` : t.shadow,
      ...style,
    }}>
      {children}
    </div>
  );
}

function FormulaBox({ t, formula, label, explanation }) {
  return (
    <div style={{
      background: t.codeBg, border: `1px solid ${t.border}`,
      borderRadius: 12, padding: "16px 20px", marginBottom: 12,
    }}>
      {label && (
        <div style={{
          fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 600,
          color: t.accent, letterSpacing: 2, textTransform: "uppercase",
          marginBottom: 8,
        }}>{label}</div>
      )}
      <div style={{
        fontFamily: "'JetBrains Mono'", fontSize: 15, color: t.text,
        lineHeight: 2, letterSpacing: 0.5,
      }}>{formula}</div>
      {explanation && (
        <div style={{
          fontFamily: "'DM Sans'", fontSize: 12, color: t.textMuted,
          marginTop: 8, lineHeight: 1.6, borderTop: `1px solid ${t.border}`,
          paddingTop: 8,
        }}>{explanation}</div>
      )}
    </div>
  );
}

function Tag({ t, color, bg, children }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 6,
      fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 500,
      color: color, background: bg,
    }}>{children}</span>
  );
}

function SectionTitle({ t, icon, title, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h2 style={{
          fontFamily: "'Playfair Display'", fontSize: 28, fontWeight: 600,
          color: t.text, margin: 0, lineHeight: 1.2,
        }}>{title}</h2>
      </div>
      {sub && (
        <p style={{
          fontFamily: "'DM Sans'", fontSize: 14, color: t.textMuted,
          marginTop: 6, marginLeft: 30, lineHeight: 1.5,
        }}>{sub}</p>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════
// SECTION RENDERERS
// ══════════════════════════════════════════════════

function OverviewSection({ t }) {
  return (
    <div>
      <SectionTitle t={t} icon="◉" title="Apa itu Bias-Variance Tradeoff?"
        sub="Konsep fundamental dalam machine learning tentang keseimbangan model" />

      <Card t={t} glow>
        <div style={{
          fontFamily: "'Playfair Display'", fontSize: 18, fontWeight: 600,
          color: t.accent, marginBottom: 12, fontStyle: "italic",
        }}>
          "Model yang bagus bukan yang paling akurat di training data, tapi yang paling bisa generalisasi ke data baru."
        </div>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 14, color: t.textMuted, lineHeight: 1.8 }}>
          Dalam supervised learning, kita punya training set berisi pasangan input-output. Tujuannya: cari fungsi h yang mendekati fungsi asli f yang tidak diketahui. Masalahnya — kalau model terlalu simpel, dia ga bisa tangkap pola data. Kalau terlalu kompleks, dia malah hafal noise.
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <Card t={t} style={{ borderLeft: `3px solid ${t.blue}` }}>
          <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14, color: t.blue, marginBottom: 6 }}>
            Training Error
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
            Rata-rata error model pada data yang dipakai untuk latihan. Bisa turun terus kalau model makin kompleks.
          </div>
        </Card>
        <Card t={t} style={{ borderLeft: `3px solid ${t.warm}` }}>
          <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14, color: t.warm, marginBottom: 6 }}>
            Generalization Error
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
            Error pada data baru yang belum pernah dilihat model. Ini yang sebenarnya penting — tujuan akhir kita.
          </div>
        </Card>
      </div>

      <Card t={t} style={{ marginTop: 16, background: t.bgAccent }}>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: t.accent, letterSpacing: 2, marginBottom: 10 }}>
          KONTEKS: SUPERVISED LEARNING
        </div>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.8 }}>
          Diberikan training set: (x₁, y₁), (x₂, y₂), ..., (xₙ, yₙ) dimana yᵢ dihasilkan dari fungsi y = f(x) yang <em style={{ color: t.text }}>tidak diketahui</em>. Supervised learning = cari fungsi hipotesis h yang mengaproksimasi f. Hypothesis space bisa berupa polinomial, decision tree, dll. Kalau space terlalu kecil → fungsi yang dicari ga ada. Kalau terlalu besar → terlalu banyak pilihan yang konsisten.
        </div>
      </Card>
    </div>
  );
}

function FittingSection({ t }) {
  const [curveType, setCurveType] = useState("linear");
  const types = [
    { key: "linear", label: "Linear (Terlalu Simpel)", color: t.red, desc: "Garis lurus — ga bisa tangkap pola melengkung dalam data. Training error tinggi." },
    { key: "squiggly", label: "Squiggly (Terlalu Kompleks)", color: t.warm, desc: "Kurva berliku-liku melewati SEMUA titik. Training error = 0, tapi overfitting." },
    { key: "good", label: "Medium Polynomial (Pas)", color: t.green, desc: "Kurva halus yang menangkap tren utama tanpa mengejar setiap noise. Sweet spot!" },
  ];
  const active = types.find(tp => tp.key === curveType);

  return (
    <div>
      <SectionTitle t={t} icon="〰" title="Curve Fitting"
        sub="Klik tombol di bawah untuk lihat perbedaan 3 model" />

      <Card t={t}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {types.map(tp => (
            <button key={tp.key} onClick={() => setCurveType(tp.key)} style={{
              padding: "8px 16px", borderRadius: 10, border: `1.5px solid ${curveType === tp.key ? tp.color : t.border}`,
              background: curveType === tp.key ? `${tp.color}15` : "transparent",
              color: curveType === tp.key ? tp.color : t.textMuted,
              fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, cursor: "pointer",
              transition: "all 0.3s ease",
            }}>{tp.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 300px" }}>
            <CurveFittingSVG t={t} type={curveType} />
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{
              padding: 16, borderRadius: 12, background: t.bgAccent,
              borderLeft: `3px solid ${active.color}`,
            }}>
              <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14, color: active.color, marginBottom: 8 }}>
                {active.label}
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
                {active.desc}
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {curveType === "linear" && <>
                  <Tag t={t} color={t.red} bg={t.redSoft}>MSE Train {'>'} 0</Tag>
                  <Tag t={t} color={t.red} bg={t.redSoft}>MSE Test {'>'} 0</Tag>
                  <Tag t={t} color={t.red} bg={t.redSoft}>High Bias</Tag>
                </>}
                {curveType === "squiggly" && <>
                  <Tag t={t} color={t.green} bg={t.greenSoft}>MSE Train = 0</Tag>
                  <Tag t={t} color={t.red} bg={t.redSoft}>MSE Test {'>'}{'>'}{'>'} 0</Tag>
                  <Tag t={t} color={t.red} bg={t.redSoft}>High Variance</Tag>
                </>}
                {curveType === "good" && <>
                  <Tag t={t} color={t.warm} bg={t.warmSoft}>MSE Train {'>'} 0</Tag>
                  <Tag t={t} color={t.green} bg={t.greenSoft}>MSE Test rendah</Tag>
                  <Tag t={t} color={t.green} bg={t.greenSoft}>Balanced!</Tag>
                </>}
              </div>
            </div>

            <div style={{
              marginTop: 12, padding: 12, borderRadius: 10,
              background: t.yellowSoft, border: `1px solid ${t.yellow}30`,
            }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.yellow, fontWeight: 600, marginBottom: 4 }}>
                💡 Occam's Razor
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.textMuted, lineHeight: 1.6 }}>
                Pilih model yang paling simpel yang masih bisa menjelaskan data — hindari kompleksitas yang tidak perlu!
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BiasVarianceSection({ t }) {
  return (
    <div>
      <SectionTitle t={t} icon="◎" title="Bias & Variance"
        sub="Dua sumber error utama yang saling berlawanan" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card t={t} style={{ borderTop: `3px solid ${t.blue}` }}>
          <div style={{ fontFamily: "'Playfair Display'", fontSize: 22, fontWeight: 600, color: t.blue, marginBottom: 12 }}>
            Bias
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.8, marginBottom: 16 }}>
            Seberapa <strong style={{ color: t.text }}>jauh rata-rata prediksi model dari nilai sebenarnya</strong>. Ibaratnya, kalau kamu nembak terus tapi selalu meleset ke kanan, itu bias tinggi.
          </div>
          <div style={{ background: t.codeBg, padding: "10px 14px", borderRadius: 8, fontFamily: "'JetBrains Mono'", fontSize: 12, color: t.blue, marginBottom: 12 }}>
            Bias = E[g(x̂)] − f(x̂)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "Model terlalu simpel → bias tinggi",
              "Gagal tangkap pola data → simplifying assumptions",
              "Training error TINGGI, test error TINGGI",
              "Contoh: Linear Regression untuk data nonlinear",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: t.blue, fontWeight: 700, fontSize: 12, marginTop: 1 }}>→</span>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card t={t} style={{ borderTop: `3px solid ${t.warm}` }}>
          <div style={{ fontFamily: "'Playfair Display'", fontSize: 22, fontWeight: 600, color: t.warm, marginBottom: 12 }}>
            Variance
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.8, marginBottom: 16 }}>
            Seberapa <strong style={{ color: t.text }}>berubah-ubahnya prediksi model</strong> kalau training data-nya berbeda. Ibaratnya, setiap kali nembak hasilnya beda-beda jauh, itu variance tinggi.
          </div>
          <div style={{ background: t.codeBg, padding: "10px 14px", borderRadius: 8, fontFamily: "'JetBrains Mono'", fontSize: 12, color: t.warm, marginBottom: 12 }}>
            Var = E[(g(x̂) − E[g(x̂)])²]
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "Model terlalu kompleks → variance tinggi",
              "Terlalu sensitif terhadap training data tertentu",
              "Training error RENDAH, test error TINGGI",
              "Contoh: Polynomial derajat tinggi, deep tree",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: t.warm, fontWeight: 700, fontSize: 12, marginTop: 1 }}>→</span>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Dartboard Analogy */}
      <Card t={t} style={{ marginTop: 16 }}>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: 2, color: t.accent, marginBottom: 16 }}>
          ANALOGI: GAME OF DARTS 🎯
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <DartboardSVG t={t} bias="low" variance="low" label="Low Bias, Low Var" />
          <DartboardSVG t={t} bias="low" variance="high" label="Low Bias, High Var" />
          <DartboardSVG t={t} bias="high" variance="low" label="High Bias, Low Var" />
          <DartboardSVG t={t} bias="high" variance="high" label="High Bias, High Var" />
        </div>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.textMuted, marginTop: 12, textAlign: "center", lineHeight: 1.6 }}>
          Bullseye = nilai sebenarnya. Bias = seberapa jauh pusat tembakan dari bullseye. Variance = seberapa menyebar tembakannya.
        </div>
      </Card>
    </div>
  );
}

function OverUnderSection({ t }) {
  return (
    <div>
      <SectionTitle t={t} icon="⚖" title="Overfitting vs Underfitting"
        sub="Dua kondisi ekstrem yang harus dihindari" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          {
            type: "underfit", title: "Underfitting",
            symptoms: ["Training error: TINGGI", "Test error: TINGGI (mirip train)", "Bias: TINGGI", "Variance: RENDAH"],
            desc: "Model terlalu simpel, ga bisa tangkap hubungan antar data.",
            color: t.red, icon: "📉",
          },
          {
            type: "good", title: "Just Right",
            symptoms: ["Training error: sedikit > 0", "Test error: sedikit > train", "Bias: BALANCED", "Variance: BALANCED"],
            desc: "Sweet spot! Tangkap pola tanpa hafal noise.",
            color: t.green, icon: "✅",
          },
          {
            type: "overfit", title: "Overfitting",
            symptoms: ["Training error: SANGAT RENDAH", "Test error: JAUH lebih tinggi", "Bias: RENDAH", "Variance: TINGGI"],
            desc: "Model belajar pola + noise sekaligus, ga bisa generalisasi.",
            color: t.warm, icon: "📈",
          },
        ].map((item, idx) => (
          <Card key={idx} t={t} style={{ borderTop: `3px solid ${item.color}` }}>
            <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 16, color: item.color, marginBottom: 8 }}>
              {item.icon} {item.title}
            </div>
            <ModelComparisonSVG t={t} type={item.type} />
            <div style={{
              fontFamily: "'DM Sans'", fontSize: 12, color: t.textMuted,
              lineHeight: 1.6, margin: "10px 0",
            }}>{item.desc}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {item.symptoms.map((s, i) => (
                <div key={i} style={{
                  fontFamily: "'JetBrains Mono'", fontSize: 10,
                  color: t.textMuted, padding: "3px 8px", borderRadius: 4,
                  background: t.bgAccent,
                }}>{s}</div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FormulaSection({ t }) {
  return (
    <div>
      <SectionTitle t={t} icon="∑" title="Error Decomposition"
        sub="Secara matematis, MSE bisa didekomposisi menjadi 3 komponen" />

      <Card t={t} glow>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: 2, color: t.accent, marginBottom: 16 }}>
          SETUP DASAR
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ padding: 14, borderRadius: 10, background: t.bgAccent }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: t.blue, marginBottom: 6 }}>Data Model</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, color: t.text }}>y = f(x) + ε</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: t.textMuted, marginTop: 6, lineHeight: 1.6 }}>
              y = output, f = model ideal, ε = noise (mean 0, variance σ²)
            </div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: t.bgAccent }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: t.warm, marginBottom: 6 }}>Aproksimasi</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, color: t.text }}>ŷ = g(x̂)</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: t.textMuted, marginTop: 6, lineHeight: 1.6 }}>
              g = model yang kita latih dari training data (aproksimasi dari f)
            </div>
          </div>
        </div>
      </Card>

      {/* Step by step derivation */}
      <Card t={t} style={{ marginTop: 16 }}>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: 2, color: t.accent, marginBottom: 16 }}>
          DERIVASI MSE → 3 KOMPONEN
        </div>

        {/* Step 1 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: t.accentSoft, border: `1px solid ${t.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono'", fontSize: 11, color: t.accent }}>1</span>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: t.text }}>Mulai dari definisi MSE</span>
          </div>
          <FormulaBox t={t}
            formula="MSE = E[(y − g(x̂))²]"
            explanation="Expected squared difference antara nilai sebenarnya (y) dan prediksi model (g(x̂))"
          />
        </div>

        {/* Step 2 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: t.accentSoft, border: `1px solid ${t.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono'", fontSize: 11, color: t.accent }}>2</span>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: t.text }}>Substitusi y = f(x̂) + ε</span>
          </div>
          <FormulaBox t={t}
            formula="= E[(f(x̂) + ε − g(x̂))²]"
            explanation="Karena ε independen terhadap f dan g, dan E[ε] = 0, kita bisa pisahkan:"
          />
          <FormulaBox t={t}
            formula="= E[(f(x̂) − g(x̂))²] + E[ε²]"
            explanation={<span>Cross-term 2·E[(f−g)·ε] = 2·E[(f−g)]·E[ε] = 0 karena E[ε]=0. Dan E[ε²] = σ² (variance noise)</span>}
          />
        </div>

        {/* Step 3 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: t.accentSoft, border: `1px solid ${t.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono'", fontSize: 11, color: t.accent }}>3</span>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: t.text }}>Dekomposisi E[(f − g)²] pakai trik "tambah-kurang E[g]"</span>
          </div>
          <FormulaBox t={t}
            formula="E[(f(x̂) − g(x̂))²] = (E[g(x̂)] − f(x̂))² + E[(g(x̂) − E[g(x̂)])²]"
            explanation={<span>
              Ini mirip rumus Var(X) = E[X²] − (E[X])². Kita pisahkan jadi dua:
              <br />• <strong style={{ color: t.blue }}>(E[g(x̂)] − f(x̂))²</strong> = Bias² — seberapa jauh rata-rata prediksi dari nilai benar
              <br />• <strong style={{ color: t.warm }}>E[(g(x̂) − E[g(x̂)])²]</strong> = Variance — seberapa berubah-ubah prediksi
            </span>}
          />
        </div>
      </Card>

      {/* Final Result */}
      <Card t={t} style={{ marginTop: 16, border: `2px solid ${t.accent}40`, background: `${t.accent}08` }}>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: 2, color: t.accent, marginBottom: 12 }}>
          HASIL AKHIR ★
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono'", fontSize: 16, color: t.text,
          textAlign: "center", padding: "16px 0", lineHeight: 2,
        }}>
          <span style={{ color: t.red }}>MSE</span> = <span style={{ color: t.blue }}>Bias²</span> + <span style={{ color: t.warm }}>Variance</span> + <span style={{ color: t.textDim }}>σ²</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 8 }}>
          <div style={{ textAlign: "center", padding: 12, borderRadius: 10, background: t.blueSoft }}>
            <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 13, color: t.blue }}>Bias²</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: t.textMuted, marginTop: 4 }}>Reducible error — bisa dikurangi dengan model lebih kompleks</div>
          </div>
          <div style={{ textAlign: "center", padding: 12, borderRadius: 10, background: t.warmSoft }}>
            <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 13, color: t.warm }}>Variance</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: t.textMuted, marginTop: 4 }}>Reducible error — bisa dikurangi dengan model lebih simpel / lebih data</div>
          </div>
          <div style={{ textAlign: "center", padding: 12, borderRadius: 10, background: t.bgAccent }}>
            <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 13, color: t.textDim }}>σ² (Noise)</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: t.textMuted, marginTop: 4 }}>Irreducible error — batas bawah error, ga bisa dihilangkan</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TradeoffSection({ t }) {
  return (
    <div>
      <SectionTitle t={t} icon="📈" title="The Tradeoff Graph"
        sub="Visualisasi hubungan antara kompleksitas model dan error" />

      <Card t={t}>
        <TradeoffGraphSVG t={t} />
        <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.8, marginTop: 16 }}>
          Saat model makin kompleks, <strong style={{ color: t.blue }}>Bias² turun</strong> karena model makin bisa tangkap pola.
          Tapi <strong style={{ color: t.warm }}>Variance naik</strong> karena model makin sensitif terhadap training data spesifik.
          <strong style={{ color: t.red }}> Total error</strong> turun dulu (bias turun lebih cepat dari variance naik), sampai titik optimal, lalu naik lagi (variance dominan).
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <Card t={t} style={{ borderLeft: `3px solid ${t.red}` }}>
          <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14, color: t.red, marginBottom: 8 }}>
            🔴 Overfitting Detected!
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
            MSE training <strong style={{ color: t.green }}>kecil</strong>, tapi MSE testing <strong style={{ color: t.red }}>besar</strong> → Model hafal training data termasuk noise-nya. Terlalu fleksibel!
          </div>
        </Card>
        <Card t={t} style={{ borderLeft: `3px solid ${t.blue}` }}>
          <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14, color: t.blue, marginBottom: 8 }}>
            🔵 Underfitting Detected!
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
            MSE training <strong style={{ color: t.red }}>besar</strong> DAN MSE testing <strong style={{ color: t.red }}>besar</strong> → Model terlalu simpel, ga bisa tangkap pola dasar sekalipun.
          </div>
        </Card>
      </div>
    </div>
  );
}

function SolutionsSection({ t }) {
  const [activeSol, setActiveSol] = useState("reg");

  return (
    <div>
      <SectionTitle t={t} icon="🔧" title="Solusi: Mengurangi Error"
        sub="Teknik-teknik untuk menyeimbangkan bias dan variance" />

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { key: "reg", label: "Regularization", icon: "🎛" },
          { key: "bag", label: "Bagging", icon: "📦" },
          { key: "boost", label: "Boosting", icon: "🚀" },
          { key: "data", label: "More Data", icon: "📊" },
        ].map(s => (
          <button key={s.key} onClick={() => setActiveSol(s.key)} style={{
            padding: "10px 18px", borderRadius: 12,
            border: `1.5px solid ${activeSol === s.key ? t.accent : t.border}`,
            background: activeSol === s.key ? t.accentSoft : "transparent",
            color: activeSol === s.key ? t.accent : t.textMuted,
            fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "all 0.3s ease",
          }}>{s.icon} {s.label}</button>
        ))}
      </div>

      {activeSol === "reg" && (
        <Card t={t}>
          <div style={{ fontFamily: "'Playfair Display'", fontSize: 22, fontWeight: 600, color: t.accent, marginBottom: 12 }}>
            Regularization
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.8, marginBottom: 16 }}>
            Teknik untuk membatasi kompleksitas model supaya ga overfitting. Intinya: tambahkan "hukuman" (penalty) kalau model terlalu rumit.
          </div>

          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: 2, color: t.warm, marginBottom: 12 }}>
            CONTOH: DECISION TREE REGULARIZATION
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: 14, borderRadius: 10, background: t.bgAccent }}>
              <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 13, color: t.text, marginBottom: 6 }}>
                Strategi 1: Early Stopping
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.textMuted, lineHeight: 1.7 }}>
                Hentikan tree learning berdasarkan kriteria: min data per node, max leaf nodes, max depth.
              </div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: t.bgAccent }}>
              <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 13, color: t.text, marginBottom: 6 }}>
                Strategi 2: Pruning
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.textMuted, lineHeight: 1.7 }}>
                Bangun tree full dulu, lalu potong (merge subtree ke parent) sampai memenuhi kriteria. Lebih lambat tapi lebih akurat.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: t.accentSoft, border: `1px solid ${t.accent}30` }}>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.accent, fontWeight: 600, marginBottom: 4 }}>
              Efek pada Bias-Variance:
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.textMuted }}>
              Regularization <strong style={{ color: t.blue }}>menaikkan bias sedikit</strong> tapi <strong style={{ color: t.green }}>menurunkan variance banyak</strong>. Net effect: total error turun.
            </div>
          </div>
        </Card>
      )}

      {activeSol === "bag" && (
        <Card t={t}>
          <div style={{ fontFamily: "'Playfair Display'", fontSize: 22, fontWeight: 600, color: t.accent, marginBottom: 12 }}>
            Bagging (Bootstrap Aggregating)
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.8, marginBottom: 16 }}>
            Latih banyak model secara <strong style={{ color: t.text }}>paralel</strong> pada subset data yang berbeda (random sampling with replacement), lalu gabungkan hasilnya.
          </div>

          {/* Flow diagram */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", padding: "16px 0" }}>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: t.blueSoft, border: `1px solid ${t.blue}30`, fontFamily: "'JetBrains Mono'", fontSize: 11, color: t.blue, textAlign: "center" }}>
              Dataset<br />Original
            </div>
            <span style={{ color: t.textDim, fontSize: 18 }}>→</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ padding: "6px 12px", borderRadius: 6, background: t.warmSoft, border: `1px solid ${t.warm}30`, fontFamily: "'JetBrains Mono'", fontSize: 10, color: t.warm }}>
                  Subset {i} (bootstrap)
                </div>
              ))}
            </div>
            <span style={{ color: t.textDim, fontSize: 18 }}>→</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ padding: "6px 12px", borderRadius: 6, background: t.pinkSoft, border: `1px solid ${t.pink}30`, fontFamily: "'JetBrains Mono'", fontSize: 10, color: t.pink }}>
                  Model {i}
                </div>
              ))}
            </div>
            <span style={{ color: t.textDim, fontSize: 18 }}>→</span>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: t.greenSoft, border: `1px solid ${t.green}30`, fontFamily: "'JetBrains Mono'", fontSize: 11, color: t.green, textAlign: "center" }}>
              Averaging /<br />Majority Vote
            </div>
          </div>

          <FormulaBox t={t}
            label="VARIANCE REDUCTION"
            formula="Var(rata-rata k prediksi i.i.d.) = σ² / k"
            explanation="Kalau variance 1 model = σ², maka rata-rata dari k model independen variancenya turun jadi σ²/k. Makin banyak model, makin stabil!"
          />

          <div style={{ padding: 14, borderRadius: 10, background: t.accentSoft, border: `1px solid ${t.accent}30` }}>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.accent, fontWeight: 600, marginBottom: 4 }}>
              Contoh: Random Forest = Bagging + Decision Trees
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.textMuted }}>
              Bias ≈ sama seperti base model, tapi Variance TURUN signifikan. Cocok untuk model yang high variance (deep trees).
            </div>
          </div>
        </Card>
      )}

      {activeSol === "boost" && (
        <Card t={t}>
          <div style={{ fontFamily: "'Playfair Display'", fontSize: 22, fontWeight: 600, color: t.accent, marginBottom: 12 }}>
            Boosting
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.8, marginBottom: 16 }}>
            Latih model secara <strong style={{ color: t.text }}>sekuensial</strong> — setiap model berikutnya fokus memperbaiki kesalahan model sebelumnya. Tujuan utama: <strong style={{ color: t.blue }}>mengurangi bias</strong>.
          </div>

          {/* Sequential flow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap", padding: "16px 0" }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ padding: "8px 12px", borderRadius: 8, background: t.warmSoft, border: `1px solid ${t.warm}30`, fontFamily: "'JetBrains Mono'", fontSize: 10, color: t.warm, textAlign: "center" }}>
                  Model {i}<br />
                  <span style={{ fontSize: 9, opacity: 0.7 }}>fix error {i - 1 || "awal"}</span>
                </div>
                {i < 4 && <span style={{ color: t.textDim, fontSize: 14 }}>→</span>}
              </div>
            ))}
            <span style={{ color: t.textDim, fontSize: 14 }}>→</span>
            <div style={{ padding: "8px 14px", borderRadius: 8, background: t.greenSoft, border: `1px solid ${t.green}30`, fontFamily: "'JetBrains Mono'", fontSize: 11, color: t.green }}>
              Σ Weighted
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
            <div style={{ padding: 14, borderRadius: 10, background: t.bgAccent }}>
              <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 13, color: t.text, marginBottom: 6 }}>
                AdaBoost
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.textMuted, lineHeight: 1.6 }}>
                Update <strong style={{ color: t.warm }}>bobot data</strong> — data yang salah diprediksi dapat bobot lebih besar di iterasi berikutnya. Tiap base learner juga dapat bobot sesuai performanya.
              </div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: t.bgAccent }}>
              <div style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 13, color: t.text, marginBottom: 6 }}>
                Gradient Boosting
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: t.textMuted, lineHeight: 1.6 }}>
                Setiap model baru dilatih pada <strong style={{ color: t.warm }}>residual</strong> (selisih prediksi-aktual) dari model sebelumnya. Minimisasi loss function secara bertahap.
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeSol === "data" && (
        <Card t={t}>
          <div style={{ fontFamily: "'Playfair Display'", fontSize: 22, fontWeight: 600, color: t.accent, marginBottom: 12 }}>
            More Training Data
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.8, marginBottom: 16 }}>
            Cara paling "brute force" untuk mengurangi variance: tambah data training. Semakin banyak data, semakin stabil model.
          </div>

          {/* Learning curve visual */}
          <svg viewBox="0 0 400 200" style={{ width: "100%", maxWidth: 400 }}>
            <line x1={40} y1={10} x2={40} y2={180} stroke={t.textDim} strokeWidth={1} />
            <line x1={40} y1={180} x2={380} y2={180} stroke={t.textDim} strokeWidth={1} />
            <text x={35} y={100} fill={t.textMuted} fontSize={9} fontFamily="DM Sans" textAnchor="end" transform="rotate(-90,35,100)">Accuracy</text>
            <text x={210} y={198} fill={t.textMuted} fontSize={9} fontFamily="DM Sans" textAnchor="middle">Training Set Size</text>

            {/* Realizable curve */}
            <path d="M 50,170 C 100,100 150,60 200,40 C 250,25 300,18 380,15" fill="none" stroke={t.green} strokeWidth={2} />
            <text x={385} y={15} fill={t.green} fontSize={9} fontFamily="JetBrains Mono">realizable</text>

            {/* Redundant curve */}
            <path d="M 50,170 C 100,120 150,80 200,65 C 250,55 300,50 380,48" fill="none" stroke={t.blue} strokeWidth={2} />
            <text x={385} y={48} fill={t.blue} fontSize={9} fontFamily="JetBrains Mono">redundant</text>

            {/* Non-realizable curve */}
            <path d="M 50,170 C 100,130 150,95 200,80 C 250,70 300,65 380,62" fill="none" stroke={t.red} strokeWidth={2} />
            <text x={385} y={62} fill={t.red} fontSize={9} fontFamily="JetBrains Mono">non-realizable</text>
          </svg>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
            {[
              { label: "Realizable", color: t.green, desc: "f(x) bisa dinyatakan oleh model → accuracy bisa → 100%" },
              { label: "Redundant", color: t.blue, desc: "Banyak fitur noise → bisa menyesatkan, accuracy terbatas" },
              { label: "Non-realizable", color: t.red, desc: "f(x) ga bisa dinyatakan (kurang fitur) → accuracy terbatas" },
            ].map((item, i) => (
              <div key={i} style={{ padding: 10, borderRadius: 8, background: t.bgAccent, borderTop: `2px solid ${item.color}` }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: item.color, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: t.textMuted, marginTop: 4, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function ImpactTableSection({ t }) {
  const data = [
    { tech: "Simple Models", bias: "Tinggi — oversimplifikasi", variance: "Rendah — ga overfit", bColor: t.red, vColor: t.green },
    { tech: "Complex Models", bias: "Rendah — boundary kompleks", variance: "Tinggi — sensitif terhadap data", bColor: t.green, vColor: t.red },
    { tech: "Shallow Decision Tree", bias: "Tinggi — abaikan split penting", variance: "Rendah — top split stabil", bColor: t.red, vColor: t.green },
    { tech: "Deep Decision Tree", bias: "Rendah — boundary detail", variance: "Tinggi — overfit di level bawah", bColor: t.green, vColor: t.red },
    { tech: "Linear Models", bias: "Tinggi — bisa jadi non-linear", variance: "Rendah — robust", bColor: t.red, vColor: t.green },
    { tech: "Kernel SVM", bias: "Lebih rendah dari linear SVM", variance: "Lebih tinggi dari linear SVM", bColor: t.green, vColor: t.warm },
    { tech: "k-NN (k kecil)", bias: "Rendah", variance: "Tinggi — local discriminant", bColor: t.green, vColor: t.red },
    { tech: "k-NN (k besar)", bias: "Tinggi", variance: "Rendah", bColor: t.red, vColor: t.green },
    { tech: "Naive Bayes", bias: "Tinggi — asumsi independence", variance: "Rendah estimasi parameter", bColor: t.red, vColor: t.green },
    { tech: "Regularization", bias: "↑ Naik sedikit", variance: "↓ Turun signifikan", bColor: t.warm, vColor: t.green },
  ];

  return (
    <div>
      <SectionTitle t={t} icon="📋" title="Impact Table"
        sub="Bagaimana berbagai teknik mempengaruhi bias dan variance" />

      <Card t={t} style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.bgAccent }}>
                <th style={{ padding: "14px 16px", textAlign: "left", fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 700, color: t.textMuted, borderBottom: `1px solid ${t.border}` }}>Technique</th>
                <th style={{ padding: "14px 16px", textAlign: "left", fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 700, color: t.blue, borderBottom: `1px solid ${t.border}` }}>Bias</th>
                <th style={{ padding: "14px 16px", textAlign: "left", fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 700, color: t.warm, borderBottom: `1px solid ${t.border}` }}>Variance</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? t.bgCard : t.bgCard2 }}>
                  <td style={{ padding: "12px 16px", fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: t.text, borderBottom: `1px solid ${t.border}` }}>
                    {row.tech}
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "'DM Sans'", fontSize: 12, color: row.bColor, borderBottom: `1px solid ${t.border}` }}>
                    {row.bias}
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "'DM Sans'", fontSize: 12, color: row.vColor, borderBottom: `1px solid ${t.border}` }}>
                    {row.variance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Key takeaway */}
      <Card t={t} style={{ marginTop: 16, background: t.accentSoft, border: `1px solid ${t.accent}40` }}>
        <div style={{ fontFamily: "'Playfair Display'", fontSize: 18, fontWeight: 600, color: t.accent, marginBottom: 8 }}>
          💡 Key Takeaway
        </div>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: t.textMuted, lineHeight: 1.8 }}>
          Tidak ada satu model yang terbaik untuk semua kasus (<em style={{ color: t.text }}>No Free Lunch Theorem</em>). Kuncinya:
          pahami data kamu, mulai dari model simpel, evaluasi dengan test set, dan tingkatkan kompleksitas secara bertahap.
          Bagging turunkan variance, Boosting turunkan bias, Regularization cegah overfitting. Tujuan akhir: <strong style={{ color: t.green }}>Low Bias + Low Variance</strong> = generalisasi terbaik!
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════
export default function BiasVarianceApp() {
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const t = isDark ? themes.dark : themes.light;

  const renderSection = () => {
    switch (activeSection) {
      case "overview": return <OverviewSection t={t} />;
      case "fitting": return <FittingSection t={t} />;
      case "bias": return <BiasVarianceSection t={t} />;
      case "overunder": return <OverUnderSection t={t} />;
      case "formula": return <FormulaSection t={t} />;
      case "tradeoff": return <TradeoffSection t={t} />;
      case "solutions": return <SolutionsSection t={t} />;
      case "table": return <ImpactTableSection t={t} />;
      default: return null;
    }
  };

  const currentIdx = sections.findIndex(s => s.id === activeSection);

  return (
    <div style={{
      minHeight: "100vh", background: t.bg, color: t.text,
      fontFamily: "'DM Sans', sans-serif",
      transition: "background 0.5s ease, color 0.5s ease",
    }}>
      <style>{FONTS}</style>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 3px; }
        button { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        button:hover { filter: brightness(1.1); }
        table { font-size: 13px; }
      `}</style>

      {/* Background decoration */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-15%", right: "-8%",
          width: 500, height: 500, borderRadius: "50%",
          background: `radial-gradient(circle, ${t.accentGlow}, transparent 70%)`,
        }} />
        <div style={{
          position: "absolute", bottom: "-15%", left: "-8%",
          width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, ${isDark ? "rgba(95,168,239,0.04)" : "rgba(95,168,239,0.06)"}, transparent 70%)`,
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 920, margin: "0 auto", padding: "0 16px" }}>
        {/* ═══ HEADER ═══ */}
        <header style={{ padding: "32px 0 0", animation: "fadeIn 0.6s both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: t.accent, animation: "pulse 2s infinite",
              }} />
              <span style={{
                fontFamily: "'JetBrains Mono'", fontSize: 10,
                color: t.textDim, letterSpacing: 3, textTransform: "uppercase",
              }}>MATERI 10 · CSGE603130</span>
            </div>
            <button onClick={() => setIsDark(!isDark)} style={{
              padding: "6px 14px", borderRadius: 8,
              border: `1px solid ${t.border}`, background: t.bgCard,
              color: t.textMuted, fontFamily: "'DM Sans'", fontSize: 12,
              cursor: "pointer",
            }}>
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display'", fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em",
            color: t.text,
          }}>
            Bias-Variance Tradeoff
          </h1>
          <p style={{
            fontFamily: "'DM Sans'", fontSize: 15, color: t.textMuted,
            marginTop: 6, fontWeight: 300,
          }}>
            Konsep paling fundamental di ML — <span style={{ color: t.accent, fontWeight: 500 }}>pahami ini, pahami semua model</span>
          </p>

          {/* Navigation */}
          <div style={{
            display: "flex", gap: 4, overflowX: "auto",
            paddingBottom: 2, marginTop: 20,
            borderBottom: `1px solid ${t.border}`,
          }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                padding: "10px 14px 12px", whiteSpace: "nowrap",
                background: activeSection === s.id ? t.bgCard : "transparent",
                border: "none",
                borderBottom: activeSection === s.id ? `2px solid ${t.accent}` : "2px solid transparent",
                borderRadius: "8px 8px 0 0", cursor: "pointer",
                color: activeSection === s.id ? t.text : t.textDim,
                fontFamily: "'DM Sans'", fontSize: 12, fontWeight: activeSection === s.id ? 600 : 400,
              }}>
                <span style={{ marginRight: 4, opacity: 0.6 }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </header>

        {/* ═══ CONTENT ═══ */}
        <main style={{ padding: "28px 0 40px", minHeight: "60vh", animation: "fadeIn 0.4s both" }} key={activeSection}>
          {renderSection()}
        </main>

        {/* ═══ NAV BUTTONS ═══ */}
        <div style={{
          display: "flex", justifyContent: "space-between", padding: "0 0 40px",
        }}>
          {currentIdx > 0 ? (
            <button onClick={() => setActiveSection(sections[currentIdx - 1].id)} style={{
              padding: "10px 20px", borderRadius: 10,
              border: `1px solid ${t.border}`, background: t.bgCard,
              color: t.textMuted, fontFamily: "'DM Sans'", fontSize: 13,
              cursor: "pointer",
            }}>
              ← {sections[currentIdx - 1].label}
            </button>
          ) : <div />}
          {currentIdx < sections.length - 1 ? (
            <button onClick={() => setActiveSection(sections[currentIdx + 1].id)} style={{
              padding: "10px 20px", borderRadius: 10,
              border: `1px solid ${t.accent}`, background: t.accentSoft,
              color: t.accent, fontFamily: "'DM Sans'", fontSize: 13,
              fontWeight: 600, cursor: "pointer",
            }}>
              {sections[currentIdx + 1].label} →
            </button>
          ) : <div />}
        </div>

        {/* Progress */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          height: 3, background: t.border, zIndex: 100,
        }}>
          <div style={{
            height: "100%", background: t.gradient,
            width: `${((currentIdx + 1) / sections.length) * 100}%`,
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>
    </div>
  );
}
