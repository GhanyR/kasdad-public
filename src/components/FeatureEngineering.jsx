import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// MATERI 5 — FEATURE ENGINEERING & SELECTION
// Visualisasi Interaktif  |  KASDD Genap 2025/2026
// ═══════════════════════════════════════════════════════════

const T = {
  dark: {
    bg: "#0c0f1a", bg2: "#111527", bg3: "#181d33",
    card: "rgba(22,27,52,0.85)", cardBorder: "rgba(255,255,255,0.06)",
    text: "#e8ecf4", text2: "#94a0b8", text3: "#636d84",
    accent: "#60d4a0", accent2: "#3ecf8e", accent3: "#2ab77d",
    warm: "#f5a623", warm2: "#e8943a",
    blue: "#5b8af5", purple: "#a78bfa", pink: "#f472b6", red: "#ef6060",
    cyan: "#22d3ee", orange: "#fb923c",
    glow: "rgba(96,212,160,0.08)", glowStrong: "rgba(96,212,160,0.15)",
    shadow: "0 8px 40px rgba(0,0,0,0.4)",
    divider: "rgba(255,255,255,0.05)",
  },
  light: {
    bg: "#f5f3ee", bg2: "#ebe8e0", bg3: "#e0ddd4",
    card: "rgba(255,255,255,0.9)", cardBorder: "rgba(0,0,0,0.08)",
    text: "#1a1a2e", text2: "#4a4a5e", text3: "#8a8a9e",
    accent: "#16a06a", accent2: "#12925e", accent3: "#0f7d52",
    warm: "#d48820", warm2: "#c07a18",
    blue: "#3b6de0", purple: "#7c5cbf", pink: "#d4508a", red: "#d04040",
    cyan: "#0891b2", orange: "#e87020",
    glow: "rgba(22,160,106,0.06)", glowStrong: "rgba(22,160,106,0.12)",
    shadow: "0 8px 40px rgba(0,0,0,0.08)",
    divider: "rgba(0,0,0,0.06)",
  }
};

// ═══ MINI COMPONENTS ═══

const Badge = ({ children, color, t }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px", borderRadius: 20,
    background: color + "18", color, fontSize: 11, fontWeight: 700,
    letterSpacing: 0.5, border: `1px solid ${color}30`,
  }}>{children}</span>
);

const Formula = ({ children, t }) => (
  <div style={{
    display: "inline-block", padding: "8px 16px", borderRadius: 10,
    background: t.glow, border: `1px solid ${t.accent}25`,
    fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
    fontSize: 14, color: t.accent, fontWeight: 600, margin: "4px 0",
  }}>{children}</div>
);

const Arrow = ({ t }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 0" }}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 6v16m0 0l-6-6m6 6l6-6" stroke={t.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const MiniTable = ({ headers, rows, t, highlightCol }) => (
  <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${t.cardBorder}` }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{
              padding: "10px 14px", textAlign: "left", color: t.accent,
              fontWeight: 700, fontSize: 11, letterSpacing: 0.8,
              background: t.glow, borderBottom: `2px solid ${t.accent}30`,
              textTransform: "uppercase",
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : t.glow }}>
            {row.map((cell, j) => (
              <td key={j} style={{
                padding: "9px 14px", color: j === highlightCol ? t.warm : t.text2,
                fontWeight: j === highlightCol ? 700 : 400,
                fontFamily: typeof cell === "number" || (typeof cell === "string" && !isNaN(cell)) ? "'IBM Plex Mono', monospace" : "inherit",
                borderBottom: `1px solid ${t.divider}`,
              }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const VisualCard = ({ title, icon, children, t, color, delay = 0 }) => (
  <div style={{
    background: t.card, border: `1px solid ${t.cardBorder}`,
    borderRadius: 16, padding: 24, position: "relative", overflow: "hidden",
    backdropFilter: "blur(20px)", boxShadow: t.shadow,
    animation: `slideUp 0.6s ${delay}s both ease-out`,
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 3,
      background: `linear-gradient(90deg, ${color || t.accent}, ${color || t.accent}40)`,
    }}/>
    {(title || icon) && (
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        {icon && <span style={{ fontSize: 22 }}>{icon}</span>}
        {title && <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: t.text, letterSpacing: -0.3 }}>{title}</h3>}
      </div>
    )}
    {children}
  </div>
);

// ═══ VISUAL ENCODING DEMO ═══
const OneHotDemo = ({ t }) => {
  const [step, setStep] = useState(0);
  const devices = ["iPhone", "Macbook", "Macbook", "Android", "iPhone"];
  const categories = ["iPhone", "Macbook", "Android"];
  
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[0, 1].map(s => (
          <button key={s} onClick={() => setStep(s)} style={{
            padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer",
            background: step === s ? t.accent : t.bg3, color: step === s ? "#000" : t.text2,
            fontWeight: 700, fontSize: 12, transition: "all 0.3s",
          }}>{s === 0 ? "Before" : "After"}</button>
        ))}
      </div>
      {step === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {devices.map((d, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "8px 14px",
              borderRadius: 10, background: t.glow,
            }}>
              <span style={{ fontSize: 12, color: t.text3, fontFamily: "monospace", width: 20 }}>{i + 1}</span>
              <span style={{
                padding: "4px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: d === "iPhone" ? t.blue + "20" : d === "Macbook" ? t.purple + "20" : t.orange + "20",
                color: d === "iPhone" ? t.blue : d === "Macbook" ? t.purple : t.orange,
              }}>{d}</span>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            <div style={{ width: 30 }}/>
            {categories.map(c => (
              <div key={c} style={{
                flex: 1, textAlign: "center", fontSize: 10, fontWeight: 700,
                color: c === "iPhone" ? t.blue : c === "Macbook" ? t.purple : t.orange,
                letterSpacing: 0.5,
              }}>{c}</div>
            ))}
          </div>
          {devices.map((d, i) => (
            <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
              <span style={{ width: 30, fontSize: 12, color: t.text3, fontFamily: "monospace", lineHeight: "32px" }}>{i + 1}</span>
              {categories.map(c => (
                <div key={c} style={{
                  flex: 1, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  background: d === c ? t.accent + "25" : t.bg3,
                  border: d === c ? `2px solid ${t.accent}` : `1px solid ${t.cardBorder}`,
                  color: d === c ? t.accent : t.text3, fontWeight: 800, fontSize: 15,
                  fontFamily: "monospace",
                }}>
                  {d === c ? "1" : "0"}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══ VISUAL SCALING DEMO ═══
const ScalingDemo = ({ t }) => {
  const [method, setMethod] = useState("minmax");
  const raw = [1000000, 2000000, 1500000, 2500000, 4000000, 2200000];
  const min = Math.min(...raw);
  const max = Math.max(...raw);
  
  const scale = (v) => {
    if (method === "minmax") return ((v - min) / (max - min)).toFixed(2);
    if (method === "simple") return (v / max).toFixed(2);
    return v;
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["minmax", "Min-Max"], ["simple", "Simple"]].map(([id, label]) => (
          <button key={id} onClick={() => setMethod(id)} style={{
            padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer",
            background: method === id ? t.warm : t.bg3, color: method === id ? "#000" : t.text2,
            fontWeight: 700, fontSize: 12, transition: "all 0.3s",
          }}>{label}</button>
        ))}
      </div>
      <div style={{ marginBottom: 12 }}>
        <Formula t={t}>
          {method === "minmax" ? "x' = (x - min) / (max - min)" : "x' = x / x_max"}
        </Formula>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {raw.map((v, i) => {
          const scaled = parseFloat(scale(v));
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, color: t.text3, fontFamily: "monospace", width: 80, textAlign: "right" }}>
                {(v / 1000000).toFixed(1)}M
              </span>
              <span style={{ color: t.text3, fontSize: 14 }}>→</span>
              <div style={{ flex: 1, height: 28, borderRadius: 8, background: t.bg3, position: "relative", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 8, width: `${scaled * 100}%`,
                  background: `linear-gradient(90deg, ${t.accent}, ${t.warm})`,
                  transition: "width 0.6s ease", minWidth: scaled > 0 ? 4 : 0,
                }}/>
                <span style={{
                  position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                  fontSize: 12, fontWeight: 700, fontFamily: "monospace",
                  color: scaled > 0.5 ? "#000" : t.text,
                }}>{scaled}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══ INFORMATION GAIN CALCULATOR ═══
const InfoGainDemo = ({ t }) => {
  const data = [
    { age: "<=30", buy: false }, { age: "<=30", buy: false },
    { age: "31-40", buy: true }, { age: ">40", buy: true },
    { age: ">40", buy: true }, { age: ">40", buy: false },
    { age: "31-40", buy: true }, { age: "<=30", buy: false },
    { age: "<=30", buy: true }, { age: ">40", buy: true },
    { age: "<=30", buy: true }, { age: "31-40", buy: true },
    { age: "31-40", buy: true }, { age: ">40", buy: false },
  ];
  
  const totalYes = 9, totalNo = 5, total = 14;
  const entropy = 0.94;
  
  const groups = {
    "<=30": { yes: 2, no: 3, total: 5, entropy: 0.971 },
    "31-40": { yes: 4, no: 0, total: 4, entropy: 0 },
    ">40": { yes: 3, no: 2, total: 5, entropy: 0.971 },
  };
  
  const weightedEntropy = 0.6935;
  const gain = 0.2465;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: t.text2 }}>Total Dataset:</span>
          <span style={{ fontFamily: "monospace", fontWeight: 700, color: t.accent }}>9 Yes</span>
          <span style={{ color: t.text3 }}>/</span>
          <span style={{ fontFamily: "monospace", fontWeight: 700, color: t.red }}>5 No</span>
        </div>
        <div style={{
          display: "flex", height: 20, borderRadius: 10, overflow: "hidden", gap: 2,
        }}>
          <div style={{ flex: 9, background: t.accent, borderRadius: "10px 0 0 10px" }}/>
          <div style={{ flex: 5, background: t.red, borderRadius: "0 10px 10px 0" }}/>
        </div>
        <div style={{ marginTop: 6 }}>
          <Formula t={t}>H(S) = -{"\u2211"} p·log₂(p) = 0.94</Formula>
        </div>
      </div>
      
      <div style={{ fontSize: 12, fontWeight: 700, color: t.warm, marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>
        Split by "Age" →
      </div>
      
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.entries(groups).map(([label, g]) => (
          <div key={label} style={{
            flex: "1 1 120px", padding: 14, borderRadius: 12, background: t.glow,
            border: `1px solid ${t.cardBorder}`, textAlign: "center",
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 6 }}>{label}</div>
            <div style={{
              display: "flex", height: 14, borderRadius: 7, overflow: "hidden", gap: 1, marginBottom: 6,
            }}>
              {g.yes > 0 && <div style={{ flex: g.yes, background: t.accent, borderRadius: 7 }}/>}
              {g.no > 0 && <div style={{ flex: g.no, background: t.red, borderRadius: 7 }}/>}
            </div>
            <div style={{ fontSize: 11, color: t.text2 }}>
              <span style={{ color: t.accent, fontWeight: 700 }}>{g.yes}Y</span>
              {" / "}
              <span style={{ color: t.red, fontWeight: 700 }}>{g.no}N</span>
            </div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: t.text3, marginTop: 4 }}>
              H = {g.entropy.toFixed(3)}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: 16, padding: 14, borderRadius: 12,
        background: `linear-gradient(135deg, ${t.accent}10, ${t.warm}10)`,
        border: `1px solid ${t.accent}25`,
      }}>
        <div style={{ fontSize: 12, color: t.text2, marginBottom: 4 }}>Weighted Entropy = {weightedEntropy}</div>
        <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 16, color: t.accent }}>
          Gain(age) = {entropy} − {weightedEntropy} = {gain}
        </div>
      </div>
    </div>
  );
};

// ═══ CHI-SQUARE VISUAL ═══
const ChiSquareDemo = ({ t }) => {
  const data = [
    { cat: "Female Survived", O: 307, E: 158.33, chi: 139.60 },
    { cat: "Female Not Survived", O: 156, E: 304.67, chi: 72.55 },
    { cat: "Male Survived", O: 142, E: 290.67, chi: 76.04 },
    { cat: "Male Not Survived", O: 708, E: 559.33, chi: 39.52 },
  ];
  const totalChi = 327.70;

  return (
    <div>
      <div style={{ fontSize: 12, color: t.text2, marginBottom: 12 }}>
        Menguji: apakah <strong style={{ color: t.warm }}>Sex</strong> mempengaruhi <strong style={{ color: t.accent }}>Survived</strong>?
      </div>
      <div style={{ marginBottom: 12 }}>
        <Formula t={t}>χ² = Σ (O - E)² / E</Formula>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {data.map((d, i) => {
          const pct = (d.chi / totalChi) * 100;
          const isFemale = d.cat.includes("Female");
          const isSurvived = d.cat.includes(" Survived") && !d.cat.includes("Not");
          return (
            <div key={i} style={{
              padding: 12, borderRadius: 10, background: t.glow,
              border: `1px solid ${isSurvived ? t.accent : t.red}20`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: isFemale ? t.pink : t.blue, marginBottom: 4 }}>
                {d.cat}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: t.text3, marginBottom: 4 }}>
                <span>O={d.O}</span>
                <span>E={d.E}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: t.bg3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${pct}%`, borderRadius: 3,
                  background: isSurvived ? t.accent : t.red,
                }}/>
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, fontFamily: "monospace", color: t.warm, marginTop: 4 }}>
                χ² = {d.chi}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        marginTop: 12, padding: 12, borderRadius: 10, textAlign: "center",
        background: `linear-gradient(135deg, ${t.warm}15, ${t.red}15)`,
        border: `1px solid ${t.warm}30`,
      }}>
        <div style={{ fontSize: 12, color: t.text2 }}>Total χ²</div>
        <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "monospace", color: t.warm }}>{totalChi}</div>
        <div style={{ fontSize: 11, color: t.accent, fontWeight: 600, marginTop: 4 }}>
          → Sangat tinggi → H₀ ditolak → Sex PENTING untuk Survived
        </div>
      </div>
    </div>
  );
};

// ═══ TARGET ENCODING DEMO ═══
const TargetEncodingDemo = ({ t }) => {
  const rows = [
    { color: "Blue", height: 1.77, troll: 1 },
    { color: "Red", height: 1.32, troll: 0 },
    { color: "Green", height: 1.81, troll: 1 },
    { color: "Blue", height: 1.56, troll: 0 },
    { color: "Green", height: 1.64, troll: 1 },
    { color: "Green", height: 1.61, troll: 0 },
    { color: "Blue", height: 1.73, troll: 0 },
  ];
  
  const [mode, setMode] = useState("reg");
  
  const colorMap = { Blue: t.blue, Red: t.red, Green: t.accent };
  
  const regEncode = { Blue: "1.69", Red: "1.32", Green: "1.69" };
  const clsEncode = { Blue: "0.33", Red: "0", Green: "0.67" };
  
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["reg", "Regression (Height)"], ["cls", "Classification (Troll)"]].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} style={{
            padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
            background: mode === id ? t.purple : t.bg3, color: mode === id ? "#fff" : t.text2,
            fontWeight: 700, fontSize: 11, transition: "all 0.3s",
          }}>{label}</button>
        ))}
      </div>
      
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 140px" }}>
          <div style={{ fontSize: 10, color: t.text3, fontWeight: 700, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Original</div>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 3,
              padding: "4px 8px", borderRadius: 6, background: i % 2 === 0 ? t.glow : "transparent",
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: colorMap[r.color],
              }}/>
              <span style={{ fontSize: 12, color: t.text2, flex: 1 }}>{r.color}</span>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: t.text3 }}>
                {mode === "reg" ? r.height : r.troll}
              </span>
            </div>
          ))}
        </div>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14m0 0l-4-4m4 4l-4 4" stroke={t.accent} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        
        <div style={{ flex: "1 1 140px" }}>
          <div style={{ fontSize: 10, color: t.text3, fontWeight: 700, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Encoded</div>
          {Object.entries(mode === "reg" ? regEncode : clsEncode).map(([color, val], i) => (
            <div key={color} style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
              padding: "6px 10px", borderRadius: 8, background: t.glow,
              border: `1px solid ${colorMap[color]}25`,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: colorMap[color] }}/>
              <span style={{ fontSize: 12, color: t.text2, flex: 1 }}>{color}</span>
              <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace", color: colorMap[color] }}>{val}</span>
            </div>
          ))}
          <div style={{ fontSize: 10, color: t.text3, marginTop: 6, fontStyle: "italic" }}>
            {mode === "reg" ? "= mean(height) per color" : "= P(troll=1 | color)"}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══ FEATURE SELECTION FLOW ═══
const SelectionFlowDiagram = ({ t }) => {
  const [active, setActive] = useState(null);
  
  const methods = [
    {
      id: "filter", label: "Filter", icon: "🔍", color: t.blue,
      desc: "Evaluasi fitur SEBELUM masuk model",
      items: ["Missing Value Ratio", "Variance Threshold", "Correlation", "Chi-Square", "Information Gain"],
      pros: "Cepat & murah", cons: "Tidak lihat interaksi antar fitur",
    },
    {
      id: "wrapper", label: "Wrapper", icon: "🔄", color: t.purple,
      desc: "Coba kombinasi fitur, evaluasi dengan model",
      items: ["Forward Selection", "Backward Elimination", "Exhaustive", "SFFS"],
      pros: "Akurat, lihat interaksi", cons: "Lambat, mahal komputasi",
    },
    {
      id: "embedded", label: "Embedded", icon: "🧬", color: t.accent,
      desc: "Feature selection BUILT-IN di algoritma",
      items: ["Decision Tree", "Lasso Regression", "Random Forest"],
      pros: "Balance speed & accuracy", cons: "Tergantung algoritma tertentu",
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {methods.map(m => (
          <div
            key={m.id}
            onClick={() => setActive(active === m.id ? null : m.id)}
            style={{
              flex: "1 1 160px", padding: 16, borderRadius: 14, cursor: "pointer",
              background: active === m.id ? m.color + "15" : t.bg3,
              border: `2px solid ${active === m.id ? m.color : t.cardBorder}`,
              transition: "all 0.3s",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: m.color, marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: t.text3, lineHeight: 1.4 }}>{m.desc}</div>
            
            {active === m.id && (
              <div style={{ marginTop: 12, animation: "slideUp 0.3s ease" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                  {m.items.map(item => (
                    <span key={item} style={{
                      padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                      background: m.color + "20", color: m.color,
                    }}>{item}</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5 }}>
                  <div><span style={{ color: t.accent, fontWeight: 700 }}>✓</span> <span style={{ color: t.text2 }}>{m.pros}</span></div>
                  <div><span style={{ color: t.red, fontWeight: 700 }}>✗</span> <span style={{ color: t.text2 }}>{m.cons}</span></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══ SFS / SBS VISUAL ═══
const SFSDemo = ({ t }) => {
  const [mode, setMode] = useState("sfs");
  const [step, setStep] = useState(0);
  
  const sfsSteps = [
    { selected: [], testing: ["f1", "f2", "f3", "f4"], result: "f2 menang", best: "f2" },
    { selected: ["f2"], testing: ["f2+f1", "f2+f3", "f2+f4"], result: "f2+f3 menang", best: "f3" },
    { selected: ["f2", "f3"], testing: ["f2+f3+f1", "f2+f3+f4"], result: "f2+f3+f1 menang", best: "f1" },
  ];
  
  const sbsSteps = [
    { removed: [], testing: ["-f1", "-f2", "-f3", "-f4"], result: "tanpa f1 terbaik", worst: "f1" },
    { removed: ["f1"], testing: ["-f4", "-f2", "-f3"], result: "tanpa f4 terbaik", worst: "f4" },
  ];
  
  const steps = mode === "sfs" ? sfsSteps : sbsSteps;
  const maxStep = steps.length - 1;
  
  const allFeatures = ["f1", "f2", "f3", "f4"];
  const featureColors = { f1: t.blue, f2: t.accent, f3: t.purple, f4: t.orange };
  
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["sfs", "Forward ➕"], ["sbs", "Backward ➖"]].map(([id, label]) => (
          <button key={id} onClick={() => { setMode(id); setStep(0); }} style={{
            padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
            background: mode === id ? t.accent : t.bg3, color: mode === id ? "#000" : t.text2,
            fontWeight: 700, fontSize: 12,
          }}>{label}</button>
        ))}
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {[...Array(steps.length)].map((_, i) => (
            <button key={i} onClick={() => setStep(i)} style={{
              width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer",
              background: i === step ? t.accent : t.bg3,
              color: i === step ? "#000" : t.text2, fontWeight: 800, fontSize: 13,
            }}>{i + 1}</button>
          ))}
        </div>
      </div>
      
      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
      }}>
        {allFeatures.map(f => {
          const s = steps[step];
          let status = "default";
          if (mode === "sfs") {
            if (s.selected.includes(f)) status = "selected";
            else if (f === s.best) status = "adding";
          } else {
            if (s.removed.includes(f)) status = "removed";
            else if (f === s.worst) status = "removing";
          }
          
          return (
            <div key={f} style={{
              width: 56, height: 56, borderRadius: 14, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15,
              fontFamily: "monospace", transition: "all 0.4s",
              background: status === "selected" ? featureColors[f] + "25" :
                         status === "adding" ? t.accent + "35" :
                         status === "removed" ? t.red + "10" :
                         status === "removing" ? t.red + "30" : t.bg3,
              border: `2px solid ${
                status === "selected" ? featureColors[f] :
                status === "adding" ? t.accent :
                status === "removed" ? t.red + "30" :
                status === "removing" ? t.red : t.cardBorder
              }`,
              color: status === "removed" ? t.text3 + "50" : featureColors[f],
              opacity: status === "removed" ? 0.3 : 1,
              textDecoration: status === "removed" ? "line-through" : "none",
            }}>
              {f}
              {status === "adding" && <span style={{ fontSize: 8, color: t.accent }}>+ADD</span>}
              {status === "removing" && <span style={{ fontSize: 8, color: t.red }}>-DEL</span>}
            </div>
          );
        })}
      </div>
      
      <div style={{
        marginTop: 12, padding: 10, borderRadius: 10, background: t.glow,
        fontSize: 12, color: t.text2, fontStyle: "italic",
      }}>
        Iterasi {step + 1}: {steps[step].result}
      </div>
    </div>
  );
};

// ═══ BOW DEMO ═══
const BagOfWordsDemo = ({ t }) => {
  const sentences = [
    "I love programming",
    "Programming is fun",
    "I love learning programming and new programming languages",
  ];
  const vocab = ["I", "love", "programming", "is", "fun", "learning", "and", "new", "languages"];
  const matrix = [
    [1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 2, 0, 0, 1, 1, 1, 1],
  ];

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        {sentences.map((s, i) => (
          <div key={i} style={{
            padding: "6px 12px", marginBottom: 4, borderRadius: 8,
            background: t.glow, fontSize: 12, color: t.text2,
            borderLeft: `3px solid ${[t.blue, t.purple, t.accent][i]}`,
          }}>
            <span style={{ fontWeight: 700, color: [t.blue, t.purple, t.accent][i] }}>S{i + 1}:</span>{" "}"{s}"
          </div>
        ))}
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "inline-flex", flexDirection: "column", gap: 3, minWidth: "100%" }}>
          <div style={{ display: "flex", gap: 3 }}>
            <div style={{ width: 32 }}/>
            {vocab.map((w, i) => (
              <div key={i} style={{
                width: 36, textAlign: "center", fontSize: 8, fontWeight: 700,
                color: t.text3, transform: "rotate(-45deg)", transformOrigin: "center",
                padding: "0 2px", whiteSpace: "nowrap",
              }}>{w}</div>
            ))}
          </div>
          {matrix.map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 3, alignItems: "center" }}>
              <div style={{
                width: 32, fontSize: 10, fontWeight: 800,
                color: [t.blue, t.purple, t.accent][i], textAlign: "center",
              }}>S{i + 1}</div>
              {row.map((v, j) => (
                <div key={j} style={{
                  width: 36, height: 28, borderRadius: 6, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: v === 0 ? t.bg3 : v === 1 ? t.accent + "25" : t.warm + "30",
                  border: `1px solid ${v === 0 ? t.cardBorder : v === 1 ? t.accent + "40" : t.warm + "50"}`,
                  color: v === 0 ? t.text3 + "60" : v > 1 ? t.warm : t.accent,
                  fontWeight: 800, fontSize: 13, fontFamily: "monospace",
                }}>
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══ CURSE OF DIMENSIONALITY ═══
const CurseDimDemo = ({ t }) => {
  const points = [];
  for (let i = 1; i <= 30; i++) {
    const perf = i <= 8 ? 20 + i * 9.5 : 96 - (i - 8) * 3.2;
    points.push({ x: i, y: Math.max(10, Math.min(98, perf)) });
  }
  const w = 320, h = 160, px = 40, py = 20;
  const maxY = 100;
  
  const toX = (v) => px + (v / 30) * (w - px - 10);
  const toY = (v) => h - py - (v / maxY) * (h - py - 10);
  
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.x)},${toY(p.y)}`).join(" ");
  
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: 400 }}>
      <defs>
        <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={t.accent}/>
          <stop offset="30%" stopColor={t.accent}/>
          <stop offset="100%" stopColor={t.red}/>
        </linearGradient>
        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.accent} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={t.accent} stopOpacity="0"/>
        </linearGradient>
      </defs>
      
      <line x1={px} y1={h - py} x2={w - 10} y2={h - py} stroke={t.text3 + "40"} strokeWidth="1"/>
      <line x1={px} y1={10} x2={px} y2={h - py} stroke={t.text3 + "40"} strokeWidth="1"/>
      
      <text x={w / 2} y={h - 2} textAnchor="middle" fill={t.text3} fontSize="8" fontWeight="600">
        Jumlah Fitur →
      </text>
      <text x={8} y={h / 2} textAnchor="middle" fill={t.text3} fontSize="8" fontWeight="600" transform={`rotate(-90, 8, ${h / 2})`}>
        Akurasi →
      </text>
      
      <path d={`${pathD} L${toX(30)},${toY(0)} L${toX(1)},${toY(0)} Z`} fill="url(#fillGrad)"/>
      <path d={pathD} fill="none" stroke="url(#curveGrad)" strokeWidth="2.5" strokeLinecap="round"/>
      
      <line x1={toX(8)} y1={10} x2={toX(8)} y2={h - py} stroke={t.warm} strokeWidth="1" strokeDasharray="4,4"/>
      <circle cx={toX(8)} cy={toY(points[7].y)} r="4" fill={t.warm}/>
      <text x={toX(8)} y={22} textAnchor="middle" fill={t.warm} fontSize="7" fontWeight="800">
        OPTIMAL
      </text>
      
      <text x={toX(3)} y={toY(points[2].y) - 8} fill={t.accent} fontSize="7" fontWeight="600">↑ naik</text>
      <text x={toX(20)} y={toY(points[19].y) - 8} fill={t.red} fontSize="7" fontWeight="600">↓ turun</text>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════

export default function FeatureEngineeringViz() {
  const [dark, setDark] = useState(false);
  const [section, setSection] = useState("overview");
  const t = dark ? T.dark : T.light;

  const sections = [
    { id: "overview", label: "Overview", icon: "🗺️" },
    { id: "engineering", label: "Engineering", icon: "🔧" },
    { id: "encoding", label: "Encoding", icon: "🏷️" },
    { id: "scaling", label: "Scaling", icon: "📐" },
    { id: "text", label: "Text & BoW", icon: "📝" },
    { id: "selection", label: "Selection", icon: "✂️" },
    { id: "filter", label: "Filter", icon: "🔍" },
    { id: "wrapper", label: "Wrapper", icon: "🔄" },
    { id: "embedded", label: "Embedded", icon: "🧬" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: t.bg, color: t.text,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      transition: "background 0.5s, color 0.5s",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&family=IBM+Plex+Mono:wght@400;500;600;700&family=Playfair+Display:wght@700;800;900&display=swap');
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.accent}40; border-radius: 4px; }
        button { transition: all 0.3s ease; }
        button:hover { transform: translateY(-1px); }
      `}</style>

      {/* ══ AMBIENT BG ══ */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-15%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${t.accent}06, transparent 70%)` }}/>
        <div style={{ position: "absolute", bottom: "-15%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${t.purple}05, transparent 70%)` }}/>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        
        {/* ══ HEADER ══ */}
        <header style={{ padding: "32px 0 20px", animation: "slideUp 0.6s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
                KASDD • Materi 05
              </div>
              <h1 style={{
                fontSize: 32, fontWeight: 900, lineHeight: 1.1,
                fontFamily: "'Playfair Display', serif",
                background: `linear-gradient(135deg, ${t.text}, ${t.accent})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Feature Engineering<br/>& Selection
              </h1>
            </div>
            <button
              onClick={() => setDark(!dark)}
              style={{
                width: 44, height: 44, borderRadius: 12, border: `1px solid ${t.cardBorder}`,
                background: t.card, cursor: "pointer", fontSize: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >{dark ? "☀️" : "🌙"}</button>
          </div>

          {/* ══ NAV ══ */}
          <div style={{
            display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4,
            msOverflowStyle: "none", scrollbarWidth: "none",
          }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                style={{
                  padding: "8px 14px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: section === s.id ? t.accent : t.card,
                  color: section === s.id ? "#000" : t.text2,
                  fontWeight: 700, fontSize: 12, whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 5,
                  border: `1px solid ${section === s.id ? t.accent : t.cardBorder}`,
                }}
              >
                <span style={{ fontSize: 14 }}>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>
        </header>

        {/* ══ CONTENT ══ */}
        <main style={{ paddingBottom: 60 }} key={section}>

          {/* ─── OVERVIEW ─── */}
          {section === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "slideUp 0.5s both" }}>
              <VisualCard title="Apa itu Feature?" icon="📦" t={t} color={t.blue}>
                <p style={{ fontSize: 14, color: t.text2, lineHeight: 1.7, marginBottom: 14 }}>
                  <strong style={{ color: t.text }}>Feature</strong> = sifat atau karakteristik yang bisa diukur dari setiap data point. Ini yang jadi <strong style={{ color: t.accent }}>input</strong> ke model ML.
                </p>
                <MiniTable t={t}
                  headers={["Luas (m²)", "Sumber Air", "Gaya", "Kamar", "Harga (Jt)"]}
                  rows={[
                    [100, "Sumur", "Minimalis", 3, "1.5"],
                    [120, "PDAM", "Greek", 4, "1.7"],
                    [200, "Sumur", "Farm", 5, "3.0"],
                  ]}
                  highlightCol={4}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  <Badge color={t.blue} t={t}>NUMERIK → Luas, Kamar</Badge>
                  <Badge color={t.purple} t={t}>KATEGORIKAL → Sumber Air, Gaya</Badge>
                  <Badge color={t.warm} t={t}>TARGET → Harga</Badge>
                </div>
              </VisualCard>

              <VisualCard title="Peta Materi" icon="🗺️" t={t} color={t.accent} delay={0.1}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { icon: "🔧", title: "Feature Engineering", desc: "Buat & transform fitur jadi lebih berguna", color: t.accent, items: ["Aggregation", "Encoding", "Scaling", "BoW"] },
                    { icon: "✂️", title: "Feature Selection", desc: "Pilih fitur terbaik, buang yang ga penting", color: t.warm, items: ["Filter", "Wrapper", "Embedded"] },
                  ].map(c => (
                    <div key={c.title} style={{
                      padding: 16, borderRadius: 12, background: c.color + "08",
                      border: `1px solid ${c.color}20`,
                    }}>
                      <span style={{ fontSize: 28 }}>{c.icon}</span>
                      <div style={{ fontSize: 14, fontWeight: 800, color: c.color, margin: "6px 0 4px" }}>{c.title}</div>
                      <div style={{ fontSize: 11, color: t.text3, marginBottom: 8 }}>{c.desc}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {c.items.map(i => (
                          <span key={i} style={{
                            padding: "2px 8px", borderRadius: 6, fontSize: 10,
                            background: c.color + "15", color: c.color, fontWeight: 600,
                          }}>{i}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </VisualCard>

              <VisualCard title="3 Proses Feature Engineering" icon="⚙️" t={t} color={t.purple} delay={0.2}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { title: "Creation", icon: "✨", color: t.accent, items: ["Domain knowledge", "Data-driven patterns", "Synthetic features"] },
                    { title: "Transformation", icon: "🔄", color: t.warm, items: ["Normalization", "Scaling", "Encoding", "Log / sqrt transform"] },
                    { title: "Extraction", icon: "🎯", color: t.purple, items: ["PCA / tSNE", "Feature combination", "Feature aggregation"] },
                  ].map(p => (
                    <div key={p.title} style={{
                      flex: "1 1 150px", padding: 14, borderRadius: 12,
                      background: t.bg3, border: `1px solid ${p.color}20`,
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{p.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: p.color, marginBottom: 8 }}>{p.title}</div>
                      {p.items.map(i => (
                        <div key={i} style={{ fontSize: 11, color: t.text2, padding: "2px 0", display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: p.color, flexShrink: 0 }}/>
                          {i}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </VisualCard>
            </div>
          )}

          {/* ─── ENGINEERING ─── */}
          {section === "engineering" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "slideUp 0.5s both" }}>
              <VisualCard title="Aggregation" icon="📊" t={t} color={t.blue}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Menggabungkan beberapa data point untuk bikin pandangan yang lebih menyeluruh.
                  Contoh: untuk deteksi fraud, transaction amount satu-satu ga cukup — kita perlu <strong style={{ color: t.accent }}>rolling median</strong> dari 5 transaksi terakhir.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 130px", padding: 12, borderRadius: 10, background: t.glow, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: t.text3, marginBottom: 6 }}>Individual View</div>
                    <div style={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "end", height: 50 }}>
                      {[30, 45, 5, 60, 3, 2, 1].map((v, i) => (
                        <div key={i} style={{
                          width: 14, height: v * 0.8, borderRadius: "4px 4px 0 0",
                          background: v < 10 ? t.red : t.blue,
                        }}/>
                      ))}
                    </div>
                    <div style={{ fontSize: 10, color: t.text3, marginTop: 4 }}>Low-value = bisa normal ATAU fraud</div>
                  </div>
                  <div style={{ flex: "1 1 130px", padding: 12, borderRadius: 10, background: t.glow, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: t.text3, marginBottom: 6 }}>Aggregated View (median 5)</div>
                    <div style={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "end", height: 50 }}>
                      {[40, 42, 35, 30, 5, 3, 2].map((v, i) => (
                        <div key={i} style={{
                          width: 14, height: v * 0.8, borderRadius: "4px 4px 0 0",
                          background: v < 10 ? t.red : t.accent,
                        }}/>
                      ))}
                    </div>
                    <div style={{ fontSize: 10, color: t.red, fontWeight: 700, marginTop: 4 }}>Fraud terlihat jelas! ↓↓↓</div>
                  </div>
                </div>
              </VisualCard>

              <VisualCard title="Differences & Ratios" icon="➗" t={t} color={t.warm}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Membandingkan perilaku <strong style={{ color: t.accent }}>sekarang vs historis</strong>. Transaksi banyak hari ini belum tentu anomali — tapi kalau <strong style={{ color: t.warm }}>rasio</strong> nya tinggi dibanding kebiasaan, itu mencurigakan!
                </p>
                <MiniTable t={t}
                  headers={["Customer", "Hari Ini", "Median 30hr", "Rasio"]}
                  rows={[
                    ["AQTRDAS1", 10, 9.5, "1.05"],
                    ["AQTRDAS5", 16, 2, "8.00 🚨"],
                    ["AQTRDAS7", 27, 6, "4.50 🚨"],
                    ["AQTRDAS9", 4, 6, "0.67"],
                  ]}
                  highlightCol={3}
                />
              </VisualCard>

              <VisualCard title="Age Encoding" icon="📅" t={t} color={t.cyan}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Mengubah <strong style={{ color: t.warm }}>tanggal</strong> jadi <strong style={{ color: t.accent }}>angka bermakna</strong> — berapa hari sejak suatu event.
                  Contoh: "Date first used" → "Days since device first used"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ padding: "8px 14px", borderRadius: 10, background: t.bg3, fontSize: 13, color: t.text2 }}>
                    📅 2022-08-13
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m0 0l-4-4m4 4l-4 4" stroke={t.accent} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div style={{
                    padding: "8px 14px", borderRadius: 10, background: t.accent + "15",
                    border: `1px solid ${t.accent}30`, fontSize: 14, fontWeight: 800,
                    fontFamily: "monospace", color: t.accent,
                  }}>
                    270 hari
                  </div>
                </div>
              </VisualCard>

              <VisualCard title="Indicator Encoding" icon="🚩" t={t} color={t.pink}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Membuat fitur biner (0/1) berdasarkan <strong style={{ color: t.accent }}>perubahan kondisi</strong>.
                  Contoh: "Country change from previous transaction" → berguna untuk deteksi fraud.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    { country: "US", prev: "US", change: 0 },
                    { country: "US", prev: "US", change: 0 },
                    { country: "HK", prev: "US", change: 1 },
                  ].map((r, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "6px 12px",
                      borderRadius: 8, background: r.change ? t.red + "15" : t.glow,
                      border: `1px solid ${r.change ? t.red + "30" : t.cardBorder}`,
                    }}>
                      <span style={{ fontSize: 12, color: t.text2 }}>{r.prev}</span>
                      <span style={{ color: t.text3 }}>→</span>
                      <span style={{ fontSize: 12, color: r.change ? t.red : t.text2, fontWeight: 700 }}>{r.country}</span>
                      <span style={{ marginLeft: "auto", fontFamily: "monospace", fontWeight: 800, fontSize: 16, color: r.change ? t.red : t.accent }}>
                        {r.change}
                      </span>
                    </div>
                  ))}
                </div>
              </VisualCard>

              <VisualCard title="Binarization" icon="⚡" t={t} color={t.orange}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Set <strong style={{ color: t.warm }}>threshold</strong>, di atas = 1, di bawah = 0. Contoh: suhu &gt; 38°C → demam.
                </p>
                <div style={{ display: "flex", gap: 4, alignItems: "end", justifyContent: "center" }}>
                  {[36, 36, 39, 40, 35].map((v, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{
                        width: 40, height: (v - 30) * 8, borderRadius: "8px 8px 0 0",
                        background: v > 38 ? `linear-gradient(to top, ${t.red}, ${t.warm})` : t.blue + "40",
                        display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 4,
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: v > 38 ? "#fff" : t.text3 }}>
                          {v > 38 ? "1" : "0"}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: t.text2, marginTop: 4 }}>{v}°</div>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 8, fontSize: 11, textAlign: "center", color: t.warm, fontWeight: 600,
                }}>
                  ── threshold = 38°C ──
                </div>
              </VisualCard>

              <VisualCard title="Binning" icon="📦" t={t} color={t.purple}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Mengelompokkan angka ke dalam <strong style={{ color: t.accent }}>interval/kategori</strong>. Bisa untuk angka maupun kategori.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 140px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: t.text3, marginBottom: 6, letterSpacing: 1 }}>NUMERIK</div>
                    {[
                      { range: "0-20", color: t.blue, items: ["15"] },
                      { range: "21-40", color: t.accent, items: ["22", "37"] },
                      { range: "41-60", color: t.warm, items: ["45", "52"] },
                      { range: ">60", color: t.red, items: ["70"] },
                    ].map(b => (
                      <div key={b.range} style={{
                        display: "flex", alignItems: "center", gap: 8, marginBottom: 4,
                        padding: "4px 10px", borderRadius: 8, background: b.color + "10",
                        borderLeft: `3px solid ${b.color}`,
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: b.color, width: 50 }}>{b.range}</span>
                        <div style={{ display: "flex", gap: 4 }}>
                          {b.items.map(i => (
                            <span key={i} style={{ fontSize: 11, fontFamily: "monospace", color: t.text2 }}>{i}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ flex: "1 1 140px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: t.text3, marginBottom: 6, letterSpacing: 1 }}>KATEGORIKAL</div>
                    {[
                      { cat: "Professional", color: t.blue, items: ["Engineer", "Doctor", "Lawyer"] },
                      { cat: "Creative", color: t.purple, items: ["Artist", "Youtuber"] },
                      { cat: "Education", color: t.accent, items: ["Teacher"] },
                    ].map(b => (
                      <div key={b.cat} style={{
                        display: "flex", alignItems: "center", gap: 8, marginBottom: 4,
                        padding: "4px 10px", borderRadius: 8, background: b.color + "10",
                        borderLeft: `3px solid ${b.color}`,
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: b.color, width: 80 }}>{b.cat}</span>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {b.items.map(i => (
                            <span key={i} style={{
                              padding: "1px 6px", borderRadius: 4, fontSize: 10,
                              background: b.color + "15", color: t.text2,
                            }}>{i}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </VisualCard>
            </div>
          )}

          {/* ─── ENCODING ─── */}
          {section === "encoding" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "slideUp 0.5s both" }}>
              <VisualCard title="One-Hot Encoding" icon="🔥" t={t} color={t.warm}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 4 }}>
                  Setiap kategori jadi <strong style={{ color: t.accent }}>kolom baru</strong> berisi 0 atau 1. Cocok untuk <strong style={{ color: t.warm }}>sedikit kategori</strong>.
                </p>
                <div style={{ fontSize: 11, color: t.red, marginBottom: 12, fontWeight: 600 }}>
                  ⚠️ Banyak kategori = banyak kolom baru → curse of dimensionality!
                </div>
                <OneHotDemo t={t}/>
              </VisualCard>

              <VisualCard title="Target Encoding (Mean Encoding)" icon="🎯" t={t} color={t.purple}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 4 }}>
                  Ganti kategori dengan <strong style={{ color: t.accent }}>rata-rata target</strong> untuk kategori itu.
                  Regression → mean value. Classification → probability P(y=1).
                </p>
                <div style={{ fontSize: 11, color: t.red, marginBottom: 12, fontWeight: 600 }}>
                  ⚠️ Hanya untuk supervised learning! Rawan overfitting jika data per kategori sedikit.
                </div>
                <TargetEncodingDemo t={t}/>
              </VisualCard>

              <VisualCard title="Label Encoding" icon="🔢" t={t} color={t.blue}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Ganti kategori <strong style={{ color: t.warm }}>ordinal</strong> (yang punya urutan) dengan angka berurutan.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  {["SD → 1", "SMP → 2", "SMA → 3", "S1 → 4", "S2 → 5"].map((item, i) => (
                    <div key={i} style={{
                      padding: "6px 12px", borderRadius: 8,
                      background: `${t.blue}${(10 + i * 8).toString(16)}`,
                      border: `1px solid ${t.blue}30`,
                      fontSize: 12, fontWeight: 700, color: t.blue,
                      fontFamily: "monospace",
                    }}>{item}</div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: t.red, marginTop: 8, fontWeight: 600 }}>
                  ⚠️ Jangan pakai untuk nominal (tidak ada urutan) — model bisa salah interpretasi "Bandung &gt; Jakarta"!
                </div>
              </VisualCard>

              <VisualCard title="Frequency Encoding" icon="📊" t={t} color={t.cyan}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Ganti kategori dengan <strong style={{ color: t.accent }}>jumlah kemunculan</strong>nya dalam data. Simple tapi powerful.
                </p>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  {[
                    { city: "Jakarta", freq: 2, w: 60 },
                    { city: "Surabaya", freq: 2, w: 60 },
                    { city: "Bandung", freq: 1, w: 30 },
                  ].map(c => (
                    <div key={c.city} style={{ textAlign: "center" }}>
                      <div style={{
                        width: c.w, height: c.w, borderRadius: "50%", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        background: t.cyan + "15", border: `2px solid ${t.cyan}40`,
                      }}>
                        <span style={{ fontSize: 18, fontWeight: 900, fontFamily: "monospace", color: t.cyan }}>{c.freq}</span>
                      </div>
                      <div style={{ fontSize: 11, color: t.text2, marginTop: 4, fontWeight: 600 }}>{c.city}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: t.warm, marginTop: 10, fontWeight: 600 }}>
                  ⚠️ Kelemahan: Jakarta & Surabaya sama-sama 2 → tidak bisa dibedakan!
                </div>
              </VisualCard>

              <VisualCard title="Perbandingan Encoding" icon="⚖️" t={t} color={t.accent} delay={0.1}>
                <MiniTable t={t}
                  headers={["Aspek", "One-Hot", "Target", "Label", "Frequency"]}
                  rows={[
                    ["Data Type", "Nominal", "Nominal", "Ordinal", "Nominal"],
                    ["Jumlah Kolom", "Bertambah ↑", "Tetap", "Tetap", "Tetap"],
                    ["Butuh Target?", "Tidak", "YA ⚠️", "Tidak", "Tidak"],
                    ["Overfitting?", "Rendah", "Tinggi ⚠️", "Rendah", "Sedang"],
                    ["Info Loss?", "Tidak", "Tidak", "Bisa ⚠️", "Bisa ⚠️"],
                  ]}
                />
              </VisualCard>
            </div>
          )}

          {/* ─── SCALING ─── */}
          {section === "scaling" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "slideUp 0.5s both" }}>
              <VisualCard title="Kenapa Perlu Scaling?" icon="📐" t={t} color={t.blue}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Fitur dengan <strong style={{ color: t.warm }}>range berbeda jauh</strong> bisa mendominasi model. 
                  Contoh: Credit Rating (18-21) vs Expenses (1jt-4jt) → model pikir Expenses lebih penting hanya karena angkanya besar!
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <div style={{
                    flex: "1 1 100px", padding: 12, borderRadius: 10, textAlign: "center",
                    background: t.red + "10", border: `1px solid ${t.red}20`,
                  }}>
                    <div style={{ fontSize: 11, color: t.text3 }}>Credit Rating</div>
                    <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "monospace", color: t.blue }}>18-21</div>
                  </div>
                  <div style={{
                    flex: "1 1 100px", padding: 12, borderRadius: 10, textAlign: "center",
                    background: t.red + "10", border: `1px solid ${t.red}20`,
                  }}>
                    <div style={{ fontSize: 11, color: t.text3 }}>Expenses</div>
                    <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "monospace", color: t.warm }}>1M-4M</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", fontSize: 20 }}>→</div>
                  <div style={{
                    flex: "1 1 100px", padding: 12, borderRadius: 10, textAlign: "center",
                    background: t.accent + "10", border: `1px solid ${t.accent}20`,
                  }}>
                    <div style={{ fontSize: 11, color: t.text3 }}>After Scaling</div>
                    <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "monospace", color: t.accent }}>0-1</div>
                  </div>
                </div>
              </VisualCard>

              <VisualCard title="Interactive Scaling Demo" icon="🎛️" t={t} color={t.accent}>
                <ScalingDemo t={t}/>
              </VisualCard>

              <VisualCard title="Min-Max vs Simple Feature Scaling" icon="🔬" t={t} color={t.purple} delay={0.1}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ padding: 14, borderRadius: 12, background: t.glow, border: `1px solid ${t.accent}20` }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: t.accent, marginBottom: 8 }}>Min-Max Scaling</div>
                    <Formula t={t}>x' = (x - min) / (max - min)</Formula>
                    <div style={{ fontSize: 11, color: t.text2, marginTop: 8, lineHeight: 1.5 }}>
                      Range: <strong>[0, 1]</strong><br/>
                      Min → 0, Max → 1<br/>
                      Sensitif terhadap outlier
                    </div>
                  </div>
                  <div style={{ padding: 14, borderRadius: 12, background: t.glow, border: `1px solid ${t.warm}20` }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: t.warm, marginBottom: 8 }}>Simple Feature Scaling</div>
                    <Formula t={t}>x' = x / x_max</Formula>
                    <div style={{ fontSize: 11, color: t.text2, marginTop: 8, lineHeight: 1.5 }}>
                      Range: <strong>[0, 1]</strong><br/>
                      Hanya bagi dengan max<br/>
                      Min TIDAK jadi 0
                    </div>
                  </div>
                </div>
              </VisualCard>
            </div>
          )}

          {/* ─── TEXT & BOW ─── */}
          {section === "text" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "slideUp 0.5s both" }}>
              <VisualCard title="Bag of Words (BoW)" icon="📝" t={t} color={t.warm}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 4 }}>
                  Cara mengubah <strong style={{ color: t.accent }}>teks → angka</strong>. Pecah jadi kata, hitung frekuensi setiap kata — <strong style={{ color: t.warm }}>urutan tidak penting</strong>.
                </p>
                <div style={{ fontSize: 11, color: t.text3, marginBottom: 12 }}>
                  Langkah: Tokenization → Buat vocabulary → Hitung frekuensi per dokumen
                </div>
                <BagOfWordsDemo t={t}/>
              </VisualCard>
              
              <VisualCard title="BoW: Kelebihan & Kekurangan" icon="⚖️" t={t} color={t.purple}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ padding: 12, borderRadius: 10, background: t.accent + "08", border: `1px solid ${t.accent}20` }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: t.accent, marginBottom: 6 }}>✓ Kelebihan</div>
                    {["Simple & mudah diimplementasi", "Cocok untuk klasifikasi teks dasar", "Tidak perlu deep learning"].map(p => (
                      <div key={p} style={{ fontSize: 11, color: t.text2, padding: "3px 0" }}>• {p}</div>
                    ))}
                  </div>
                  <div style={{ padding: 12, borderRadius: 10, background: t.red + "08", border: `1px solid ${t.red}20` }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: t.red, marginBottom: 6 }}>✗ Kekurangan</div>
                    {["Hilang urutan kata (semantik)", "Sparse matrix (banyak 0)", "Vocabulary besar = dimensi tinggi"].map(p => (
                      <div key={p} style={{ fontSize: 11, color: t.text2, padding: "3px 0" }}>• {p}</div>
                    ))}
                  </div>
                </div>
              </VisualCard>
            </div>
          )}

          {/* ─── SELECTION ─── */}
          {section === "selection" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "slideUp 0.5s both" }}>
              <VisualCard title="Curse of Dimensionality" icon="💀" t={t} color={t.red}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  <strong style={{ color: t.warm }}>Hughes Phenomenon</strong>: Menambah fitur TIDAK selalu meningkatkan akurasi!
                  Ada titik optimal — setelahnya, akurasi justru <strong style={{ color: t.red }}>turun</strong>.
                </p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CurseDimDemo t={t}/>
                </div>
              </VisualCard>

              <VisualCard title="Kenapa Feature Selection?" icon="✂️" t={t} color={t.accent}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
                  {[
                    { icon: "📉", text: "Kurangi dimensi", color: t.blue },
                    { icon: "⚡", text: "Percepat training", color: t.warm },
                    { icon: "🎯", text: "Akurasi lebih baik", color: t.accent },
                    { icon: "🧠", text: "Lebih interpretable", color: t.purple },
                  ].map(r => (
                    <div key={r.text} style={{
                      padding: 14, borderRadius: 12, textAlign: "center",
                      background: r.color + "08", border: `1px solid ${r.color}20`,
                    }}>
                      <span style={{ fontSize: 24 }}>{r.icon}</span>
                      <div style={{ fontSize: 12, fontWeight: 700, color: r.color, marginTop: 4 }}>{r.text}</div>
                    </div>
                  ))}
                </div>
              </VisualCard>

              <VisualCard title="3 Metode Feature Selection" icon="🔀" t={t} color={t.warm}>
                <SelectionFlowDiagram t={t}/>
              </VisualCard>
            </div>
          )}

          {/* ─── FILTER ─── */}
          {section === "filter" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "slideUp 0.5s both" }}>
              <VisualCard title="Filter Methods Overview" icon="🔍" t={t} color={t.blue}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6 }}>
                  Evaluasi fitur <strong style={{ color: t.accent }}>SEBELUM</strong> masuk model ML. Cepat, murah, bagus untuk buang fitur redundan.
                </p>
              </VisualCard>

              <VisualCard title="Missing Value Ratio" icon="❓" t={t} color={t.red}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Fitur yang terlalu banyak <strong style={{ color: t.red }}>data kosong</strong> → buang aja! Tidak informatif.
                </p>
                <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
                  {[
                    { name: "Age", missing: 5, color: t.accent },
                    { name: "Income", missing: 15, color: t.warm },
                    { name: "Phone", missing: 72, color: t.red },
                  ].map(f => (
                    <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 12, color: t.text2, width: 60 }}>{f.name}</span>
                      <div style={{ flex: 1, height: 20, borderRadius: 10, background: t.bg3, overflow: "hidden" }}>
                        <div style={{
                          width: `${f.missing}%`, height: "100%", borderRadius: 10,
                          background: f.color, display: "flex", alignItems: "center",
                          justifyContent: "center",
                        }}>
                          {f.missing > 20 && <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>{f.missing}%</span>}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: f.color, width: 40, textAlign: "right" }}>
                        {f.missing}%
                      </span>
                      {f.missing > 50 && <span style={{ fontSize: 11, color: t.red }}>🗑️</span>}
                    </div>
                  ))}
                </div>
              </VisualCard>

              <VisualCard title="Variance Threshold" icon="📊" t={t} color={t.purple}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Fitur yang hampir <strong style={{ color: t.warm }}>tidak bervariasi</strong> = tidak berguna. Hitung variance, buang yang rendah.
                </p>
                <div style={{ fontSize: 11, color: t.text3, marginBottom: 8 }}>
                  Penting: normalize dulu! Baru bandingkan variance.
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { name: "Gender", var: 0.48, keep: true },
                    { name: "Age", var: 0.35, keep: true },
                    { name: "Country", var: 0.02, keep: false },
                  ].map(f => (
                    <div key={f.name} style={{
                      flex: "1 1 80px", padding: 12, borderRadius: 10, textAlign: "center",
                      background: f.keep ? t.accent + "10" : t.red + "10",
                      border: `2px solid ${f.keep ? t.accent : t.red}25`,
                      opacity: f.keep ? 1 : 0.6,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{f.name}</div>
                      <div style={{
                        fontSize: 18, fontWeight: 900, fontFamily: "monospace",
                        color: f.keep ? t.accent : t.red,
                      }}>
                        {f.var}
                      </div>
                      <div style={{ fontSize: 10, color: f.keep ? t.accent : t.red, fontWeight: 700 }}>
                        {f.keep ? "✓ KEEP" : "✗ DROP"}
                      </div>
                    </div>
                  ))}
                </div>
              </VisualCard>

              <VisualCard title="Correlation Coefficient" icon="🔗" t={t} color={t.cyan}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Cek 2 hal: (1) Korelasi <strong style={{ color: t.accent }}>fitur↔target</strong> — yang rendah bisa dibuang.
                  (2) Korelasi <strong style={{ color: t.warm }}>fitur↔fitur</strong> — yang tinggi, ambil salah satu saja.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
                  {["", "A", "B", "C",
                    "A", "1.00", "0.92", "0.12",
                    "B", "0.92", "1.00", "0.08",
                    "C", "0.12", "0.08", "1.00"
                  ].map((cell, i) => {
                    const isHeader = i < 4 || i % 4 === 0;
                    const val = parseFloat(cell);
                    const isDiag = [4, 9, 14].includes(i);
                    const isHigh = !isNaN(val) && val > 0.8 && !isDiag;
                    const isLow = !isNaN(val) && val < 0.15 && !isDiag;
                    return (
                      <div key={i} style={{
                        padding: "8px 6px", borderRadius: 6, textAlign: "center",
                        fontSize: isHeader ? 11 : 13, fontWeight: isHeader ? 800 : 600,
                        fontFamily: isHeader ? "inherit" : "monospace",
                        color: isHeader ? t.accent : isHigh ? t.warm : isLow ? t.red : t.text2,
                        background: isHigh ? t.warm + "15" : isLow ? t.red + "10" : isDiag ? t.glow : "transparent",
                        border: isHigh ? `2px solid ${t.warm}30` : "none",
                      }}>
                        {cell}
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: 11, marginTop: 8, color: t.text3 }}>
                  <span style={{ color: t.warm, fontWeight: 700 }}>A↔B = 0.92</span> → terlalu mirip, buang salah satu!
                  {" "}<span style={{ color: t.red, fontWeight: 700 }}>C↔target rendah</span> → pertimbangkan buang.
                </div>
              </VisualCard>

              <VisualCard title="Chi-Square Test (χ²)" icon="📐" t={t} color={t.warm}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Untuk fitur <strong style={{ color: t.accent }}>kategorikal</strong>. Bandingkan nilai <strong style={{ color: t.warm }}>observed</strong> vs <strong style={{ color: t.blue }}>expected</strong>.
                  Semakin besar χ² → semakin penting fitur tersebut.
                </p>
                <ChiSquareDemo t={t}/>
              </VisualCard>

              <VisualCard title="Information Gain" icon="📈" t={t} color={t.accent}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 4 }}>
                  Seberapa banyak <strong style={{ color: t.accent }}>ketidakpastian (entropy) berkurang</strong> jika kita split data berdasarkan fitur tertentu.
                  <strong style={{ color: t.warm }}> Gain tinggi = fitur penting!</strong>
                </p>
                <div style={{ marginBottom: 12 }}>
                  <Formula t={t}>Entropy H(X) = -Σ p(xᵢ) · log₂ p(xᵢ)</Formula>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Formula t={t}>Gain(S, A) = H(S) − Σ (|Sᵥ|/|S|) · H(Sᵥ)</Formula>
                </div>
                <InfoGainDemo t={t}/>
              </VisualCard>
            </div>
          )}

          {/* ─── WRAPPER ─── */}
          {section === "wrapper" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "slideUp 0.5s both" }}>
              <VisualCard title="Wrapper Methods" icon="🔄" t={t} color={t.purple}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6 }}>
                  Perlakukan feature selection sebagai <strong style={{ color: t.accent }}>masalah pencarian</strong>.
                  Coba berbagai kombinasi fitur, latih model, evaluasi, ulangi. <strong style={{ color: t.red }}>Lebih akurat tapi MAHAL!</strong>
                </p>
              </VisualCard>

              <VisualCard title="SFS & SBS — Interactive" icon="🎮" t={t} color={t.accent}>
                <SFSDemo t={t}/>
                <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: t.glow }}>
                  <div style={{ fontSize: 11, color: t.text2, lineHeight: 1.6 }}>
                    <strong style={{ color: t.accent }}>SFS (Forward)</strong>: Mulai kosong → tambah fitur terbaik satu per satu<br/>
                    <strong style={{ color: t.warm }}>SBS (Backward)</strong>: Mulai penuh → buang fitur terburuk satu per satu<br/>
                    <span style={{ color: t.red }}>⚠️ Sequential = tidak bisa backtrack!</span>
                  </div>
                </div>
              </VisualCard>

              <VisualCard title="SFFS (Sequential Forward Floating Selection)" icon="🏊" t={t} color={t.blue}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Versi <strong style={{ color: t.accent }}>lebih pintar</strong> dari SFS — bisa <strong style={{ color: t.warm }}>backtrack!</strong> "Plus l, take away r" method.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { step: "1", label: "Inclusion", desc: "Tambah fitur paling signifikan ke set X", color: t.accent, icon: "➕" },
                    { step: "2", label: "Conditional Exclusion", desc: "Cek fitur terlemah di X — kalau bukan yang baru ditambah, buang!", color: t.warm, icon: "🔍" },
                    { step: "3", label: "Continue Exclusion", desc: "Terus cek & buang selama performa membaik", color: t.red, icon: "➖" },
                  ].map(s => (
                    <div key={s.step} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: 12,
                      borderRadius: 10, background: s.color + "08", border: `1px solid ${s.color}20`,
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        background: s.color + "20", fontSize: 16,
                      }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: s.color }}>Step {s.step}: {s.label}</div>
                        <div style={{ fontSize: 11, color: t.text2 }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </VisualCard>

              <VisualCard title="Exhaustive Feature Selection" icon="💪" t={t} color={t.red}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Coba <strong style={{ color: t.warm }}>SEMUA</strong> kombinasi fitur → brute force. Paling optimal tapi paling lambat.
                </p>
                <div style={{ textAlign: "center", padding: 16 }}>
                  <div style={{ fontSize: 11, color: t.text3, marginBottom: 8 }}>Dengan 10 fitur:</div>
                  <div style={{
                    fontSize: 28, fontWeight: 900, fontFamily: "monospace", color: t.red,
                  }}>
                    2¹⁰ = 1,024
                  </div>
                  <div style={{ fontSize: 12, color: t.text3 }}>kemungkinan kombinasi!</div>
                  <div style={{ fontSize: 11, color: t.red, marginTop: 8, fontWeight: 600 }}>
                    ⚠️ 50 fitur = 2⁵⁰ = 1 quadrillion+ kombinasi 💀
                  </div>
                </div>
              </VisualCard>
            </div>
          )}

          {/* ─── EMBEDDED ─── */}
          {section === "embedded" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "slideUp 0.5s both" }}>
              <VisualCard title="Embedded Methods" icon="🧬" t={t} color={t.accent}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6 }}>
                  Feature selection <strong style={{ color: t.accent }}>built-in</strong> di dalam algoritma ML itu sendiri.
                  Gabungan kelebihan filter (cepat) dan wrapper (akurat).
                </p>
              </VisualCard>

              <VisualCard title="Decision Tree → Feature Importance" icon="🌳" t={t} color={t.warm}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  DT secara otomatis pilih fitur terpenting untuk split. Fitur yang <strong style={{ color: t.accent }}>tidak dipakai = tidak penting</strong>.
                </p>
                <div style={{ position: "relative", padding: "10px 0" }}>
                  {/* Simple tree visualization */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{
                      padding: "8px 16px", borderRadius: 10,
                      background: t.warm + "20", border: `2px solid ${t.warm}`,
                      fontSize: 12, fontWeight: 800, color: t.warm,
                    }}>Suka Soda?</div>
                    <div style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <div style={{ fontSize: 10, color: t.accent, fontWeight: 700 }}>Ya ↙</div>
                        <div style={{
                          padding: "8px 14px", borderRadius: 10,
                          background: t.blue + "20", border: `2px solid ${t.blue}`,
                          fontSize: 12, fontWeight: 800, color: t.blue,
                        }}>Umur ≤ 12.5?</div>
                        <div style={{ display: "flex", gap: 20 }}>
                          <div style={{
                            padding: "6px 12px", borderRadius: 8,
                            background: t.red + "15", fontSize: 11, fontWeight: 700, color: t.red,
                          }}>❌ Tidak Suka</div>
                          <div style={{
                            padding: "6px 12px", borderRadius: 8,
                            background: t.accent + "15", fontSize: 11, fontWeight: 700, color: t.accent,
                          }}>✅ Suka!</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <div style={{ fontSize: 10, color: t.red, fontWeight: 700 }}>Tidak ↘</div>
                        <div style={{
                          padding: "6px 12px", borderRadius: 8,
                          background: t.red + "15", fontSize: 11, fontWeight: 700, color: t.red,
                        }}>❌ Tidak Suka</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 11, color: t.text3, textAlign: "center" }}>
                    "Suka Popcorn" <strong style={{ color: t.red }}>TIDAK DIPAKAI</strong> → berarti tidak penting menurut DT
                  </div>
                </div>
              </VisualCard>

              <VisualCard title="Lasso Regression" icon="📈" t={t} color={t.purple}>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 12 }}>
                  Linear regression yang secara otomatis <strong style={{ color: t.accent }}>set weight ke 0</strong> untuk fitur tidak penting.
                </p>
                <div style={{ marginBottom: 12 }}>
                  <Formula t={t}>y* = w₁x₁ + w₂x₂ + ... + wₙxₙ + d</Formula>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { feat: "x₁ (Luas)", w: 0.85, important: true },
                    { feat: "x₂ (Kamar)", w: 0.62, important: true },
                    { feat: "x₃ (Warna Cat)", w: 0.00, important: false },
                    { feat: "x₄ (Lokasi)", w: 0.73, important: true },
                  ].map(f => (
                    <div key={f.feat} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "6px 12px",
                      borderRadius: 8, background: f.important ? t.accent + "08" : t.red + "08",
                      opacity: f.important ? 1 : 0.5,
                    }}>
                      <span style={{ fontSize: 12, color: t.text2, flex: 1 }}>{f.feat}</span>
                      <div style={{ width: 80, height: 8, borderRadius: 4, background: t.bg3 }}>
                        <div style={{
                          width: `${f.w * 100}%`, height: "100%", borderRadius: 4,
                          background: f.important ? t.purple : t.red,
                        }}/>
                      </div>
                      <span style={{
                        fontSize: 13, fontWeight: 800, fontFamily: "monospace",
                        color: f.important ? t.purple : t.red, width: 40, textAlign: "right",
                      }}>{f.w}</span>
                      {!f.important && <span style={{ fontSize: 10, color: t.red }}>🗑️</span>}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: t.text3 }}>
                  Weight besar = fitur penting. <strong style={{ color: t.red }}>Weight 0 = fitur di-drop otomatis oleh Lasso!</strong>
                </div>
              </VisualCard>

              <VisualCard title="Perbandingan 3 Metode" icon="⚖️" t={t} color={t.cyan} delay={0.1}>
                <MiniTable t={t}
                  headers={["Aspek", "Filter", "Wrapper", "Embedded"]}
                  rows={[
                    ["Kecepatan", "⚡ Cepat", "🐢 Lambat", "⚡ Sedang"],
                    ["Akurasi", "Biasa", "🎯 Tinggi", "🎯 Tinggi"],
                    ["Komputasi", "💰 Murah", "💰💰💰 Mahal", "💰💰 Sedang"],
                    ["Interaksi Fitur", "❌ Tidak", "✅ Ya", "✅ Ya"],
                    ["Overfitting Risk", "Rendah", "⚠️ Tinggi", "Sedang"],
                    ["Contoh", "χ², Info Gain", "SFS, SBS", "DT, Lasso"],
                  ]}
                />
              </VisualCard>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
