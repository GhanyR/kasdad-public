import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');`;

const themes = {
  dark: {
    bg: "#08080a", bgCard: "#111114", bgCardHover: "#18181c",
    bgSurface: "#0c0c0f", bgAccent: "#1a1a20",
    text: "#f0f0f3", textMuted: "#8b8b9e", textDim: "#55556a",
    border: "#222230", borderLight: "#1a1a25",
    gold: "#e8b931", goldDim: "#e8b93118", goldBorder: "#e8b93130",
    red: "#ef4444", redDim: "#ef444415", redBorder: "#ef444430",
    green: "#22c55e", greenDim: "#22c55e15", greenBorder: "#22c55e30",
    blue: "#60a5fa", blueDim: "#60a5fa15", blueBorder: "#60a5fa30",
    purple: "#a78bfa", purpleDim: "#a78bfa15", purpleBorder: "#a78bfa30",
    orange: "#fb923c", orangeDim: "#fb923c15", orangeBorder: "#fb923c30",
    pink: "#f472b6", pinkDim: "#f472b615", pinkBorder: "#f472b630",
    cyan: "#22d3ee", cyanDim: "#22d3ee15", cyanBorder: "#22d3ee30",
  },
  light: {
    bg: "#f8f7f4", bgCard: "#ffffff", bgCardHover: "#fafaf8",
    bgSurface: "#f0efec", bgAccent: "#e8e7e2",
    text: "#1a1a2e", textMuted: "#5a5a70", textDim: "#9a9aaa",
    border: "#e0dfd8", borderLight: "#e8e7e2",
    gold: "#b8860b", goldDim: "#b8860b10", goldBorder: "#b8860b25",
    red: "#dc2626", redDim: "#dc262610", redBorder: "#dc262625",
    green: "#16a34a", greenDim: "#16a34a10", greenBorder: "#16a34a25",
    blue: "#2563eb", blueDim: "#2563eb10", blueBorder: "#2563eb25",
    purple: "#7c3aed", purpleDim: "#7c3aed10", purpleBorder: "#7c3aed25",
    orange: "#ea580c", orangeDim: "#ea580c10", orangeBorder: "#ea580c25",
    pink: "#db2777", pinkDim: "#db277710", pinkBorder: "#db277725",
    cyan: "#0891b2", cyanDim: "#0891b210", cyanBorder: "#0891b225",
  },
};

// ─── SECTIONS DATA ───
const SECTIONS = [
  { id: "intro", title: "Apa itu?", icon: "⚖️", accent: "gold" },
  { id: "causes", title: "Penyebab", icon: "🔍", accent: "orange" },
  { id: "challenges", title: "Tantangan", icon: "⚡", accent: "red" },
  { id: "eval", title: "Evaluasi", icon: "📊", accent: "blue" },
  { id: "cost", title: "Cost-Sensitive", icon: "💰", accent: "purple" },
  { id: "oversample", title: "Oversampling", icon: "📈", accent: "green" },
  { id: "undersample", title: "Undersampling", icon: "📉", accent: "cyan" },
  { id: "combine", title: "Kombinasi", icon: "🔗", accent: "pink" },
];

// ─── ANIMATED DOTS ───
function ImbalanceDots({ t, size = 200, ratio = 0.1 }) {
  const total = 80;
  const minority = Math.round(total * ratio);
  const dots = [];
  for (let i = 0; i < total; i++) {
    const angle = (i / total) * Math.PI * 2 + Math.sin(i * 0.3) * 0.5;
    const r = 30 + Math.random() * 55;
    const x = size / 2 + Math.cos(angle) * r + Math.sin(i + (t || 0) * 0.001) * 3;
    const y = size / 2 + Math.sin(angle) * r + Math.cos(i + (t || 0) * 0.001) * 3;
    const isMinority = i < minority;
    dots.push({ x, y, isMinority });
  }
  return dots;
}

// ─── SCALE VISUAL ───
function ScaleSVG({ t }) {
  const tilt = Math.sin((t || 0) * 0.002) * 5;
  return (
    <svg viewBox="0 0 200 160" style={{ width: "100%", maxWidth: 200 }}>
      <line x1="100" y1="20" x2="100" y2="50" stroke="#555" strokeWidth="2" />
      <g transform={`rotate(${-15 + tilt}, 100, 55)`}>
        <line x1="30" y1="55" x2="170" y2="55" stroke="#888" strokeWidth="2.5" />
        <circle cx="40" cy="55" r="25" fill="#ef444425" stroke="#ef4444" strokeWidth="1.5" />
        <text x="40" y="52" textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="700">MINORITY</text>
        <text x="40" y="62" textAnchor="middle" fill="#ef4444" fontSize="16">⬆</text>
        <circle cx="160" cy="55" r="25" fill="#60a5fa25" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="160" y="52" textAnchor="middle" fill="#60a5fa" fontSize="7" fontWeight="700">MAJORITY</text>
        <text x="160" y="62" textAnchor="middle" fill="#60a5fa" fontSize="16">⬇</text>
      </g>
      <rect x="90" y="15" width="20" height="8" rx="2" fill="#888" />
      <line x1="100" y1="23" x2="100" y2="120" stroke="#555" strokeWidth="3" />
      <rect x="85" y="115" width="30" height="8" rx="2" fill="#666" />
    </svg>
  );
}

// ─── SMOTE VISUAL ───
function SmoteSVG({ t }) {
  const points = [
    { x: 40, y: 120, label: "X1" },
    { x: 80, y: 40, label: "X11" },
    { x: 140, y: 80, label: "X12" },
    { x: 30, y: 60, label: "X13" },
    { x: 110, y: 130, label: "X14" },
  ];
  const gap = 0.3 + Math.sin((t || 0) * 0.003) * 0.15;
  const synthX = points[0].x + (points[1].x - points[0].x) * gap;
  const synthY = points[0].y + (points[1].y - points[0].y) * gap;

  return (
    <svg viewBox="0 0 180 160" style={{ width: "100%", maxWidth: 260 }}>
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="#e8b93180" />
        </marker>
      </defs>
      {/* Lines */}
      <line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y}
        stroke="#e8b93140" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arr)" />
      <line x1={points[0].x} y1={points[0].y} x2={synthX} y2={synthY}
        stroke="#22c55e60" strokeWidth="2" />
      {/* Original points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="8" fill="#60a5fa25" stroke="#60a5fa" strokeWidth="1.5" />
          <text x={p.x} y={p.y - 12} textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="600">{p.label}</text>
        </g>
      ))}
      {/* Synthetic point */}
      <circle cx={synthX} cy={synthY} r="8" fill="#22c55e35" stroke="#22c55e" strokeWidth="2">
        <animate attributeName="r" values="7;10;7" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x={synthX + 14} y={synthY + 4} fill="#22c55e" fontSize="8" fontWeight="700">BARU!</text>
      {/* Labels */}
      <text x="90" y="155" textAnchor="middle" fill="#888" fontSize="7">r1 = X1 + gap × diff</text>
    </svg>
  );
}

// ─── TOMEK LINK VISUAL ───
function TomekSVG() {
  return (
    <svg viewBox="0 0 200 140" style={{ width: "100%", maxWidth: 240 }}>
      {/* Regular pairs */}
      <circle cx="40" cy="40" r="8" fill="#60a5fa30" stroke="#60a5fa" strokeWidth="1.5" />
      <circle cx="80" cy="50" r="8" fill="#60a5fa30" stroke="#60a5fa" strokeWidth="1.5" />
      <circle cx="55" cy="90" r="8" fill="#60a5fa30" stroke="#60a5fa" strokeWidth="1.5" />
      <circle cx="140" cy="35" r="8" fill="#ef444430" stroke="#ef4444" strokeWidth="1.5" />
      <circle cx="160" cy="70" r="8" fill="#ef444430" stroke="#ef4444" strokeWidth="1.5" />
      {/* Tomek link pair */}
      <circle cx="105" cy="65" r="9" fill="#60a5fa30" stroke="#60a5fa" strokeWidth="2" />
      <circle cx="125" cy="55" r="9" fill="#ef444430" stroke="#ef4444" strokeWidth="2" />
      <line x1="105" y1="65" x2="125" y2="55" stroke="#e8b931" strokeWidth="2" strokeDasharray="3,2" />
      <text x="115" y="45" textAnchor="middle" fill="#e8b931" fontSize="7" fontWeight="700">TOMEK LINK</text>
      {/* Legend */}
      <circle cx="20" cy="125" r="5" fill="#60a5fa30" stroke="#60a5fa" strokeWidth="1" />
      <text x="30" y="128" fill="#888" fontSize="7">Majority</text>
      <circle cx="80" cy="125" r="5" fill="#ef444430" stroke="#ef4444" strokeWidth="1" />
      <text x="90" y="128" fill="#888" fontSize="7">Minority</text>
      <line x1="140" y1="125" x2="160" y2="125" stroke="#e8b931" strokeWidth="2" strokeDasharray="3,2" />
      <text x="165" y="128" fill="#888" fontSize="7">Link</text>
    </svg>
  );
}

// ─── COST MATRIX VISUAL ───
function CostMatrixVisual({ t: theme }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 0, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", maxWidth: 360 }}>
      <div style={{ padding: "8px 12px" }}></div>
      <div style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: theme.green, background: theme.greenDim, borderRadius: "8px 0 0 0" }}>Prediksi +</div>
      <div style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: theme.red, background: theme.redDim, borderRadius: "0 8px 0 0" }}>Prediksi −</div>
      <div style={{ padding: "8px 12px", fontWeight: 700, color: theme.green, background: theme.greenDim }}>Aktual +</div>
      <div style={{ padding: "12px", textAlign: "center", background: theme.bgAccent, border: `1px solid ${theme.borderLight}`, fontWeight: 700, color: theme.green, fontSize: 16 }}>0</div>
      <div style={{ padding: "12px", textAlign: "center", background: theme.redDim, border: `1px solid ${theme.redBorder}`, fontWeight: 700, color: theme.red, fontSize: 16 }}>
        100 🔥
        <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>FN — BAHAYA!</div>
      </div>
      <div style={{ padding: "8px 12px", fontWeight: 700, color: theme.red, background: theme.redDim, borderRadius: "0 0 0 8px" }}>Aktual −</div>
      <div style={{ padding: "12px", textAlign: "center", background: theme.orangeDim, border: `1px solid ${theme.orangeBorder}`, fontWeight: 700, color: theme.orange, fontSize: 16 }}>
        1
        <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>FP — toleransi</div>
      </div>
      <div style={{ padding: "12px", textAlign: "center", background: theme.bgAccent, border: `1px solid ${theme.borderLight}`, fontWeight: 700, color: theme.green, fontSize: 16, borderRadius: "0 0 8px 0" }}>0</div>
    </div>
  );
}

// ─── PIPELINE VISUAL ───
function PipelineVisual({ steps, theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", justifyContent: "center" }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            padding: "8px 14px", borderRadius: 10,
            background: step.bg || theme.bgAccent,
            border: `1px solid ${step.border || theme.border}`,
            textAlign: "center", minWidth: 80,
          }}>
            <div style={{ fontSize: 20 }}>{step.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: step.color || theme.text, marginTop: 2, fontFamily: "'Outfit', sans-serif" }}>{step.label}</div>
          </div>
          {i < steps.length - 1 && (
            <div style={{ padding: "0 6px", color: theme.textDim, fontSize: 16 }}>→</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── FORMULA BOX ───
function FormulaBox({ formula, description, theme, accent = "gold" }) {
  return (
    <div style={{
      padding: "14px 18px", borderRadius: 12,
      background: theme[accent + "Dim"],
      border: `1px solid ${theme[accent + "Border"]}`,
      marginBottom: 10,
    }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600,
        color: theme[accent], letterSpacing: 0.5, marginBottom: 4,
      }}>{formula}</div>
      {description && (
        <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.6, fontFamily: "'Crimson Pro', serif" }}>{description}</div>
      )}
    </div>
  );
}

// ─── COMPARISON TABLE ───
function CompareTable({ headers, rows, theme, accent = "blue" }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${theme.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: "10px 14px", textAlign: "left",
                background: theme[accent + "Dim"],
                color: theme[accent], fontWeight: 700, fontSize: 11,
                borderBottom: `1px solid ${theme.border}`,
                letterSpacing: 0.5,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: "10px 14px",
                  borderBottom: ri < rows.length - 1 ? `1px solid ${theme.borderLight}` : "none",
                  color: ci === 0 ? theme.text : theme.textMuted,
                  fontWeight: ci === 0 ? 600 : 400,
                  background: theme.bgCard,
                  lineHeight: 1.5,
                  fontSize: 11,
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── TAG ───
function Tag({ children, color, theme }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
      background: theme[color + "Dim"], color: theme[color],
      border: `1px solid ${theme[color + "Border"]}`,
      fontFamily: "'IBM Plex Mono', monospace",
    }}>{children}</span>
  );
}

// ─── SECTION INTRO ───
function SectionIntro({ section }) {
  const [active, setActive] = useState(section.id);
  return null;
}

// ─── MAIN SECTIONS CONTENT ───

function IntroSection({ theme, t }) {
  const dots = ImbalanceDots({ t, ratio: 0.08 });
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Left: Definition */}
        <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.gold, letterSpacing: 2, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>DEFINISI</div>
          <div style={{ fontSize: 15, color: theme.text, lineHeight: 1.8, fontFamily: "'Crimson Pro', serif" }}>
            <strong>Imbalanced Classification</strong> = masalah klasifikasi ketika <span style={{ color: theme.red, fontWeight: 600 }}>distribusi kelas TIDAK seimbang</span> dalam dataset training.
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Tag color="red" theme={theme}>Fraud Detection</Tag>
            <Tag color="orange" theme={theme}>Spam Detection</Tag>
            <Tag color="purple" theme={theme}>Disease Diagnosis</Tag>
            <Tag color="blue" theme={theme}>Churn Prediction</Tag>
          </div>
          <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: theme.goldDim, border: `1px solid ${theme.goldBorder}` }}>
            <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'Crimson Pro', serif" }}>
              Nama lain: <strong style={{ color: theme.gold }}>Rare Event Prediction</strong>, Extreme Event Prediction, Severe Class Imbalance
            </div>
          </div>
        </div>
        {/* Right: Visual */}
        <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <svg viewBox="0 0 200 200" style={{ width: 200, height: 200 }}>
            {dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.isMinority ? 5 : 3.5}
                fill={d.isMinority ? "#ef4444" : "#60a5fa"}
                opacity={d.isMinority ? 0.9 : 0.4}
              >
                {d.isMinority && <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" begin={`${i * 0.1}s`} />}
              </circle>
            ))}
          </svg>
          <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: theme.textMuted }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#60a5fa" }} /> Majority (~92%)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: theme.textMuted }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} /> Minority (~8%)
            </div>
          </div>
        </div>
      </div>

      {/* Severity Scale */}
      <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}`, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.gold, letterSpacing: 2, marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>SEBERAPA PARAH?</div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
          <div style={{ flex: 1, padding: 16, borderRadius: 12, background: theme.greenDim, border: `1px solid ${theme.greenBorder}` }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.green, fontFamily: "'Outfit', sans-serif" }}>Slight</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: theme.green, fontFamily: "'IBM Plex Mono', monospace", margin: "6px 0" }}>4:6</div>
            <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.6 }}>Sedikit tidak seimbang. Bisa ditangani seperti klasifikasi biasa — <strong style={{ color: theme.green }}>tidak perlu teknik khusus</strong>.</div>
          </div>
          <div style={{ flex: 1, padding: 16, borderRadius: 12, background: theme.orangeDim, border: `1px solid ${theme.orangeBorder}` }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.orange, fontFamily: "'Outfit', sans-serif" }}>Moderate</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: theme.orange, fontFamily: "'IBM Plex Mono', monospace", margin: "6px 0" }}>1:100</div>
            <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.6 }}>Cukup parah. Model standar mulai gagal — <strong style={{ color: theme.orange }}>perlu teknik khusus</strong>.</div>
          </div>
          <div style={{ flex: 1, padding: 16, borderRadius: 12, background: theme.redDim, border: `1px solid ${theme.redBorder}` }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.red, fontFamily: "'Outfit', sans-serif" }}>Severe</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: theme.red, fontFamily: "'IBM Plex Mono', monospace", margin: "6px 0" }}>1:5000</div>
            <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.6 }}>Sangat parah. Real-life: fraud detection, penyakit langka — <strong style={{ color: theme.red }}>wajib teknik khusus</strong>.</div>
          </div>
        </div>
      </div>

      {/* Key Problem */}
      <div style={{ padding: 20, borderRadius: 16, background: theme.redDim, border: `1px solid ${theme.redBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: theme.red, fontFamily: "'Outfit', sans-serif" }}>MASALAH UTAMA</span>
        </div>
        <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.8, fontFamily: "'Crimson Pro', serif" }}>
          Algoritma ML standar <strong>bias ke majority class</strong> karena mereka berusaha memaksimalkan akurasi secara keseluruhan. Hasilnya? Model hanya prediksi "Normal" terus dan tetap dapat akurasi 99% — tapi <strong style={{ color: theme.red }}>GAGAL TOTAL mendeteksi minority class</strong> yang justru paling penting!
        </div>
      </div>
    </div>
  );
}

function CausesSection({ theme }) {
  const causes = [
    { icon: "🎯", title: "Biased Sampling", color: "orange",
      desc: "Data dikumpulkan secara random tapi kelas langka tidak cukup muncul.",
      example: "Mengambil data buah di supermarket pagi hari → buah busuk sudah dibuang semalam" },
    { icon: "🏷️", title: "Measurement Errors", color: "red",
      desc: "Kesalahan labeling atau alat yang rusak.",
      example: "Pisang busuk dilabel 'normal' karena busuknya di dalam, tidak terlihat luar" },
    { icon: "🧹", title: "Preprocessing Bias", color: "purple",
      desc: "Saat pembersihan data, data minority dihapus.",
      example: "Data minority dianggap outlier/noise lalu diremove" },
    { icon: "🌍", title: "Sifat Domain", color: "blue",
      desc: "Kejadiannya memang jarang terjadi di dunia nyata.",
      example: "Hanya 20 dari 10.000 orang yang punya penyakit tertentu" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {causes.map((c, i) => (
        <div key={i} style={{
          padding: 18, borderRadius: 14,
          background: theme.bgCard, border: `1px solid ${theme.border}`,
          borderLeft: `4px solid ${theme[c.color]}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 24 }}>{c.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: theme[c.color], fontFamily: "'Outfit', sans-serif" }}>{c.title}</span>
          </div>
          <div style={{ fontSize: 12.5, color: theme.text, lineHeight: 1.7, marginBottom: 10, fontFamily: "'Crimson Pro', serif" }}>{c.desc}</div>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: theme[c.color + "Dim"], fontSize: 11, color: theme.textMuted, fontStyle: "italic" }}>
            💡 {c.example}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChallengesSection({ theme }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
        {[
          { title: "Dataset Size", icon: "📦", color: "orange",
            desc: "Dataset kecil + imbalanced = model tidak punya cukup contoh minority untuk belajar. Dengan n=100 dan rasio 1:100, hanya ada 1 minority sample!" },
          { title: "Label Noise", icon: "🏷️", color: "red",
            desc: "Class noise (label salah) lebih berbahaya daripada feature noise. Bayangkan label minority di-flip ke majority — minority makin sedikit!" },
          { title: "Data Overlap", icon: "🔀", color: "purple",
            desc: "Feature value antara kelas saling tumpang tindih. Model kesulitan membuat decision boundary yang jelas." },
        ].map((c, i) => (
          <div key={i} style={{
            padding: 18, borderRadius: 14,
            background: theme.bgCard, border: `1px solid ${theme.border}`,
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme[c.color], marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{c.title}</div>
            <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.7, fontFamily: "'Crimson Pro', serif" }}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Accuracy Paradox */}
      <div style={{ padding: 20, borderRadius: 14, background: theme.bgCard, border: `1px solid ${theme.redBorder}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.red, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>🎭 ACCURACY PARADOX — Mengapa Akurasi Menyesatkan</div>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ flex: 1, padding: 14, borderRadius: 10, background: theme.redDim, textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: theme.red, fontFamily: "'IBM Plex Mono', monospace" }}>99%</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Akurasi model</div>
          </div>
          <div style={{ flex: 2, padding: 14, fontSize: 12.5, color: theme.text, lineHeight: 1.8, fontFamily: "'Crimson Pro', serif" }}>
            Pada dataset 99:1, model yang <strong>selalu prediksi "Normal"</strong> tanpa belajar apapun sudah mendapat akurasi 99%! Padahal model tersebut <strong style={{ color: theme.red }}>gagal mendeteksi SEMUA kasus penting</strong> (fraud, penyakit, dll). Inilah mengapa akurasi <strong>TIDAK COCOK</strong> untuk imbalanced dataset.
            <div style={{ marginTop: 8 }}>
              <Tag color="green" theme={theme}>Gunakan: F1, ROC-AUC, Precision, Recall</Tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EvalSection({ theme }) {
  return (
    <div>
      {/* Stratified CV */}
      <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}`, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.blue, letterSpacing: 2, marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>STRATIFIED K-FOLD CROSS VALIDATION</div>
        <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.8, marginBottom: 16, fontFamily: "'Crimson Pro', serif" }}>
          Masalah: K-Fold CV biasa split data <strong>random</strong> → bisa saja satu fold <strong style={{ color: theme.red }}>tidak punya minority class sama sekali!</strong><br/>
          Solusi: <strong style={{ color: theme.blue }}>Stratified K-Fold</strong> memastikan setiap fold memiliki <strong>proporsi kelas yang sama</strong> dengan dataset asli.
        </div>

        <CompareTable
          theme={theme}
          accent="blue"
          headers={["", "K-Fold Biasa", "Stratified K-Fold"]}
          rows={[
            ["Fold 1", "Train: 0=791, 1=9 | Test: 0=199, 1=1", "Train: 0=792, 1=8 | Test: 0=198, 1=2"],
            ["Fold 2", "Train: 0=793, 1=7 | Test: 0=197, 1=3", "Train: 0=792, 1=8 | Test: 0=198, 1=2"],
            ["Fold 3", "Train: 0=794, 1=6 | Test: 0=196, 1=4", "Train: 0=792, 1=8 | Test: 0=198, 1=2"],
            ["Fold 4", "Train: 0=790, 1=10 | Test: 0=200, 1=0 ❌", "Train: 0=792, 1=8 | Test: 0=198, 1=2"],
            ["Masalah?", "⚠️ Fold 4 tidak ada minority di test!", "✅ Semua fold punya proporsi SAMA"],
          ]}
        />

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: 14, borderRadius: 10, background: theme.blueDim, border: `1px solid ${theme.blueBorder}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: theme.blue, letterSpacing: 1, marginBottom: 6 }}>PYTHON CODE</div>
            <code style={{ fontSize: 11, color: theme.text, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.8 }}>
              <span style={{ color: theme.purple }}>from</span> sklearn.model_selection <span style={{ color: theme.purple }}>import</span> StratifiedKFold<br/>
              kfold = StratifiedKFold(n_splits=5)
            </code>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: theme.greenDim, border: `1px solid ${theme.greenBorder}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: theme.green, letterSpacing: 1, marginBottom: 6 }}>STRATIFIED TRAIN/TEST SPLIT</div>
            <code style={{ fontSize: 11, color: theme.text, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.8 }}>
              train_test_split(X, y,<br/>
              &nbsp;&nbsp;<span style={{ color: theme.gold }}>stratify=y</span>)
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

function CostSection({ theme }) {
  return (
    <div>
      {/* What is Cost-Sensitive */}
      <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}`, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.purple, letterSpacing: 2, marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>KONSEP COST-SENSITIVE LEARNING</div>
        <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.8, marginBottom: 16, fontFamily: "'Crimson Pro', serif" }}>
          Biasanya ML minimize <strong>error</strong>. Dengan cost-sensitive learning, kita kasih <strong style={{ color: theme.purple }}>hukuman (penalty) berbeda</strong> untuk jenis kesalahan berbeda. False Negative (gagal deteksi penyakit) jauh lebih mahal daripada False Positive (false alarm)!
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.textDim, marginBottom: 10 }}>COST MATRIX (Rasio 1:100)</div>
            <CostMatrixVisual t={theme} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.textDim, marginBottom: 10 }}>CONTOH DUNIA NYATA</div>
            <div style={{ padding: 14, borderRadius: 10, background: theme.orangeDim, border: `1px solid ${theme.orangeBorder}`, marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.orange }}>🏥 Diagnosis Kanker</div>
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4, lineHeight: 1.6 }}>FP = tes tambahan (biaya kecil)<br/>FN = pasien sakit tidak terdeteksi (NYAWA!)</div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: theme.blueDim, border: `1px solid ${theme.blueBorder}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.blue }}>💳 Klaim Asuransi</div>
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4, lineHeight: 1.6 }}>FP = biaya investigasi lanjut<br/>FN = biaya klaim yang harus dibayar</div>
            </div>
          </div>
        </div>
      </div>

      {/* compute_class_weight */}
      <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}`, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.purple, letterSpacing: 2, marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>RUMUS: compute_class_weight</div>
        <FormulaBox
          formula="weight(class) = n_samples / (n_classes × n_samples_with_class)"
          description="n_samples = total data, n_classes = jumlah kelas, n_samples_with_class = jumlah data di kelas tersebut"
          theme={theme} accent="purple"
        />
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textDim, marginTop: 16, marginBottom: 10 }}>CONTOH HITUNG: 10.000 data, 9.900 kelas 0, 100 kelas 1</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: 14, borderRadius: 10, background: theme.blueDim, border: `1px solid ${theme.blueBorder}` }}>
            <div style={{ fontSize: 11, color: theme.blue, fontWeight: 600, marginBottom: 6 }}>Kelas 0 (majority)</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: theme.text, lineHeight: 2 }}>
              = 10000 / (2 × 9900)<br/>
              = 10000 / 19800<br/>
              <strong style={{ color: theme.blue, fontSize: 16 }}>≈ 0.505</strong>
            </div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: theme.redDim, border: `1px solid ${theme.redBorder}` }}>
            <div style={{ fontSize: 11, color: theme.red, fontWeight: 600, marginBottom: 6 }}>Kelas 1 (minority)</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: theme.text, lineHeight: 2 }}>
              = 10000 / (2 × 100)<br/>
              = 10000 / 200<br/>
              <strong style={{ color: theme.red, fontSize: 16 }}>= 50.0</strong>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: theme.goldDim, border: `1px solid ${theme.goldBorder}`, fontSize: 12, color: theme.text, lineHeight: 1.7, fontFamily: "'Crimson Pro', serif" }}>
          💡 Artinya: kesalahan pada <strong style={{ color: theme.red }}>kelas 1</strong> dihitung <strong style={{ color: theme.gold }}>~100× lebih berat</strong> daripada kesalahan pada kelas 0. Model akan "berusaha lebih keras" mengenali minority.
        </div>
      </div>

      {/* Weighted Loss */}
      <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.purple, letterSpacing: 2, marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>WEIGHTED LOGISTIC REGRESSION</div>
        <FormulaBox
          formula="Loss biasa: Σ −(log(ŷᵢ)×yᵢ + log(1−ŷᵢ)×(1−yᵢ))"
          description="Semua error dianggap sama bobotnya"
          theme={theme} accent="blue"
        />
        <FormulaBox
          formula="Loss weighted: Σ −(w₁×log(ŷᵢ)×yᵢ + w₀×log(1−ŷᵢ)×(1−yᵢ))"
          description="w₁ = bobot minority (BESAR), w₀ = bobot majority (KECIL). Error di minority class jadi lebih 'mahal' → model lebih fokus ke minority"
          theme={theme} accent="purple"
        />
        <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: theme.purpleDim, fontSize: 11, color: theme.textMuted, lineHeight: 1.7 }}>
          <strong style={{ color: theme.purple }}>Python:</strong> <code style={{ fontFamily: "'IBM Plex Mono'" }}>LogisticRegression(class_weight='balanced')</code> atau <code style={{ fontFamily: "'IBM Plex Mono'" }}>class_weight={'{'}0:0.01, 1:1.0{'}'}</code>
        </div>
      </div>
    </div>
  );
}

function OversampleSection({ theme }) {
  const [tab, setTab] = useState("random");
  const methods = [
    { id: "random", label: "Random", color: "green" },
    { id: "smote", label: "SMOTE", color: "gold" },
    { id: "borderline", label: "Borderline", color: "blue" },
    { id: "adasyn", label: "ADASYN", color: "purple" },
  ];
  return (
    <div>
      {/* Important Rule */}
      <div style={{ padding: 14, borderRadius: 12, background: theme.goldDim, border: `1px solid ${theme.goldBorder}`, marginBottom: 20, fontSize: 12, color: theme.text, lineHeight: 1.7, fontFamily: "'Crimson Pro', serif" }}>
        ⚠️ Sampling hanya dilakukan pada <strong style={{ color: theme.gold }}>TRAINING data</strong>, TIDAK pada test/validation data! Tujuannya agar model belajar tanpa bias, tapi tetap dievaluasi pada data asli yang realistis.
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {methods.map(m => (
          <button key={m.id} onClick={() => setTab(m.id)} style={{
            padding: "6px 16px", borderRadius: 20, border: `1px solid ${tab === m.id ? theme[m.color + "Border"] : theme.border}`,
            background: tab === m.id ? theme[m.color + "Dim"] : "transparent",
            color: tab === m.id ? theme[m.color] : theme.textDim,
            cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
          }}>{m.label}</button>
        ))}
      </div>

      {/* Content */}
      {tab === "random" && (
        <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.green, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Random Oversampling</div>
          <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.8, marginBottom: 16, fontFamily: "'Crimson Pro', serif" }}>
            Cara paling simpel: <strong>duplikat</strong> data minority secara random sampai seimbang. Misal: 9900 majority + 100 minority → duplikasi minority jadi 9900 juga.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ padding: 14, borderRadius: 10, background: theme.greenDim, border: `1px solid ${theme.greenBorder}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.green, marginBottom: 6 }}>✅ KELEBIHAN</div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.7 }}>Simpel, cepat, cocok untuk dataset besar, bisa membantu model iteratif (SGD, Decision Tree)</div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: theme.redDim, border: `1px solid ${theme.redBorder}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.red, marginBottom: 6 }}>❌ KEKURANGAN</div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.7 }}>Bisa menyebabkan OVERFITTING karena model hanya belajar dari data yang sama berulang-ulang. Tidak ada informasi baru!</div>
            </div>
          </div>
          <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: theme.bgAccent, fontSize: 11, color: theme.textMuted }}>
            <strong style={{ color: theme.green }}>Python:</strong> <code style={{ fontFamily: "'IBM Plex Mono'" }}>RandomOverSampler(sampling_strategy='minority')</code>
          </div>
        </div>
      )}

      {tab === "smote" && (
        <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.gold, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>SMOTE — Synthetic Minority Oversampling Technique</div>
          <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.8, marginBottom: 16, fontFamily: "'Crimson Pro', serif" }}>
            Bukan duplikasi! SMOTE <strong style={{ color: theme.gold }}>membuat data BARU (sintetis)</strong> dengan interpolasi antara data minority yang sudah ada.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: theme.bgAccent, borderRadius: 12, padding: 10 }}>
              <SmoteSVG />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.gold, marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>LANGKAH-LANGKAH:</div>
              {[
                "Pilih satu data minority (X1) secara random",
                "Cari k tetangga terdekat (KNN) dari kelas minority",
                "Pilih satu tetangga (X11) secara random",
                "Buat garis antara X1 dan X11",
                "Buat data baru di SEPANJANG garis itu",
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 11, color: theme.textMuted, lineHeight: 1.5 }}>
                  <span style={{ minWidth: 20, height: 20, borderRadius: "50%", background: theme.goldDim, border: `1px solid ${theme.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: theme.gold }}>{i + 1}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <FormulaBox
            formula="data_baru = X1 + gap × (X11 − X1)"
            description="gap = angka random antara 0 dan 1. Ini yang menentukan posisi data baru di garis antara X1 dan X11. Jika gap=0 → tepat di X1, gap=1 → tepat di X11."
            theme={theme} accent="gold"
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <div style={{ padding: 12, borderRadius: 10, background: theme.greenDim, fontSize: 11, color: theme.textMuted, lineHeight: 1.7 }}>
              <strong style={{ color: theme.green }}>✅</strong> Data baru beragam (bukan duplikat), dekat dengan existing data → lebih realistis
            </div>
            <div style={{ padding: 12, borderRadius: 10, background: theme.redDim, fontSize: 11, color: theme.textMuted, lineHeight: 1.7 }}>
              <strong style={{ color: theme.red }}>❌</strong> Tidak mempertimbangkan majority class → bisa buat data sintetis di area overlap/ambigu
            </div>
          </div>
        </div>
      )}

      {tab === "borderline" && (
        <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.blue, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Borderline-SMOTE & SVM-SMOTE</div>
          <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.8, marginBottom: 16, fontFamily: "'Crimson Pro', serif" }}>
            Perbaikan dari SMOTE: hanya buat data sintetis di <strong style={{ color: theme.blue }}>daerah perbatasan (borderline)</strong> — tempat yang paling sulit diklasifikasi model.
          </div>
          <CompareTable theme={theme} accent="blue" headers={["Kategori", "Kondisi (k tetangga)", "Aksi"]}
            rows={[
              ["🟢 Safe", "Mayoritas tetangga = minority (#maj < k/2)", "Tidak di-oversample (sudah aman)"],
              ["🟡 Borderline", "Setengah+ tetangga = majority (k/2 ≤ #maj < k)", "DI-OVERSAMPLE! ← fokus di sini"],
              ["🔴 Noise", "Semua tetangga = majority (#maj = k)", "Diabaikan (kemungkinan outlier)"],
            ]}
          />
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 10, background: theme.blueDim, border: `1px solid ${theme.blueBorder}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.blue, marginBottom: 6 }}>Borderline-SMOTE</div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.6 }}>Pakai <strong>KNN</strong> untuk identifikasi borderline instances</div>
              <div style={{ marginTop: 8, fontSize: 10, color: theme.textDim, fontFamily: "'IBM Plex Mono'" }}>BorderlineSMOTE()</div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: theme.purpleDim, border: `1px solid ${theme.purpleBorder}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.purple, marginBottom: 6 }}>SVM-SMOTE</div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.6 }}>Pakai <strong>SVM</strong> untuk cari decision boundary, oversample dekat support vectors</div>
              <div style={{ marginTop: 8, fontSize: 10, color: theme.textDim, fontFamily: "'IBM Plex Mono'" }}>SVMSMOTE()</div>
            </div>
          </div>
        </div>
      )}

      {tab === "adasyn" && (
        <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.purple, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>ADASYN — Adaptive Synthetic Sampling</div>
          <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.8, marginBottom: 16, fontFamily: "'Crimson Pro', serif" }}>
            ADASYN <strong style={{ color: theme.purple }}>adaptif</strong>: membuat LEBIH BANYAK data sintetis untuk minority yang <strong>sulit dipelajari</strong> (dekat majority) dan lebih sedikit untuk yang mudah.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ padding: 14, borderRadius: 10, background: theme.purpleDim, border: `1px solid ${theme.purpleBorder}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.purple, marginBottom: 6 }}>BEDANYA DENGAN BORDERLINE-SMOTE</div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.7 }}>
                Borderline: oversample <strong>hanya di borderline</strong><br/>
                ADASYN: oversample <strong>proporsional</strong> — makin banyak majority di sekitarnya, makin banyak data sintetis dibuat
              </div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: theme.orangeDim, border: `1px solid ${theme.orangeBorder}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.orange, marginBottom: 6 }}>⚠️ HATI-HATI</div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.7 }}>
                Jika area yang padat majority ternyata adalah <strong>outlier</strong>, ADASYN bisa terlalu fokus di situ → <strong style={{ color: theme.orange }}>performance malah turun</strong>. Tip: hapus outlier sebelum ADASYN!
              </div>
            </div>
          </div>
          <FormulaBox
            formula="weight ∝ #(majority neighbors) / #(minority neighbors)"
            description="Semakin banyak tetangga majority di sekitar satu minority point → semakin banyak data sintetis dibuat di area itu"
            theme={theme} accent="purple"
          />
        </div>
      )}
    </div>
  );
}

function UndersampleSection({ theme }) {
  const [tab, setTab] = useState("overview");
  const methods = [
    { id: "overview", label: "Overview", color: "cyan" },
    { id: "nearmiss", label: "NearMiss", color: "blue" },
    { id: "tomek", label: "Tomek Links", color: "gold" },
    { id: "enn", label: "ENN", color: "green" },
    { id: "cnn", label: "Condensed NN", color: "purple" },
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {methods.map(m => (
          <button key={m.id} onClick={() => setTab(m.id)} style={{
            padding: "6px 14px", borderRadius: 20, border: `1px solid ${tab === m.id ? theme[m.color + "Border"] : theme.border}`,
            background: tab === m.id ? theme[m.color + "Dim"] : "transparent",
            color: tab === m.id ? theme[m.color] : theme.textDim,
            cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
          }}>{m.label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.8, marginBottom: 16, fontFamily: "'Crimson Pro', serif" }}>
            Undersampling = <strong style={{ color: theme.cyan }}>menghapus data dari majority class</strong> untuk menyeimbangkan distribusi. Ada 2 pendekatan:
          </div>
          <CompareTable theme={theme} accent="cyan" headers={["Pendekatan", "Metode", "Cara Kerja"]}
            rows={[
              ["Pilih data yang DIPERTAHANKAN", "NearMiss, Condensed NN", "Pilih subset majority yang paling informatif/berguna"],
              ["Pilih data yang DIHAPUS", "Tomek Links, ENN", "Hapus data majority yang noisy/ambigu/redundan"],
              ["Kombinasi keduanya", "OSS, NCR", "Gabung metode keep + delete untuk hasil optimal"],
            ]}
          />
          <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: theme.orangeDim, fontSize: 11, color: theme.textMuted, lineHeight: 1.7 }}>
            ⚠️ <strong style={{ color: theme.orange }}>Risiko utama undersampling:</strong> menghapus data majority yang penting/berguna → decision boundary jadi kurang robust.
          </div>
        </div>
      )}

      {tab === "nearmiss" && (
        <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.blue, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>NearMiss Undersampling</div>
          <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.8, marginBottom: 16, fontFamily: "'Crimson Pro', serif" }}>
            Pilih data majority berdasarkan <strong style={{ color: theme.blue }}>jaraknya ke minority class</strong>. Ada 3 versi:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { v: "1", desc: "Majority dengan rata-rata jarak MINIMUM ke 3 minority TERDEKAT", effect: "Ambil yang dekat minority" },
              { v: "2", desc: "Majority dengan rata-rata jarak MINIMUM ke 3 minority TERJAUH", effect: "Ambil yang dekat semua minority" },
              { v: "3", desc: "Majority dengan jarak MINIMUM ke SETIAP minority", effect: "Shortlist per minority point" },
            ].map((n, i) => (
              <div key={i} style={{ padding: 14, borderRadius: 10, background: theme.blueDim, border: `1px solid ${theme.blueBorder}` }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: theme.blue, fontFamily: "'IBM Plex Mono'" }}>NearMiss-{n.v}</div>
                <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.6, marginTop: 8 }}>{n.desc}</div>
                <div style={{ fontSize: 10, color: theme.blue, marginTop: 8, fontWeight: 600 }}>→ {n.effect}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "tomek" && (
        <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.gold, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Tomek Links</div>
          <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.8, marginBottom: 16, fontFamily: "'Crimson Pro', serif" }}>
            Dua data (a, b) dari <strong>kelas berbeda</strong> disebut Tomek Link jika mereka saling menjadi <strong style={{ color: theme.gold }}>nearest neighbor satu sama lain</strong>. Tomek Links = data borderline/noisy.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: theme.bgAccent, borderRadius: 12, padding: 14 }}>
              <TomekSVG />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.gold, marginBottom: 10 }}>SYARAT TOMEK LINK (a & b):</div>
              {[
                "a dan b dari kelas BERBEDA",
                "Nearest neighbor dari a adalah b",
                "Nearest neighbor dari b adalah a",
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 12, color: theme.textMuted }}>
                  <span style={{ color: theme.gold, fontWeight: 700 }}>✓</span> {s}
                </div>
              ))}
              <div style={{ marginTop: 12, fontSize: 11, color: theme.textMuted, lineHeight: 1.7 }}>
                <strong style={{ color: theme.gold }}>Aksi:</strong> Hapus data <strong>majority</strong> yang ada di Tomek Link → membersihkan boundary antara kelas.
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "enn" && (
        <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.green, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Edited Nearest Neighbors (ENN)</div>
          <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.8, marginBottom: 16, fontFamily: "'Crimson Pro', serif" }}>
            Untuk setiap data, cek 3 nearest neighbors-nya. Jika data <strong style={{ color: theme.green }}>salah diklasifikasi</strong> oleh neighbors-nya → hapus!
          </div>
          {[
            { cond: "Data majority yang misklasifikasi oleh 3 NN-nya", act: "Hapus data majority tersebut", color: "blue" },
            { cond: "Data minority yang misklasifikasi oleh 3 NN-nya", act: "Hapus majority neighbors yang menyebabkan error", color: "red" },
          ].map((r, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 10, background: theme.bgAccent, marginBottom: 8, display: "flex", gap: 12, alignItems: "center" }}>
              <Tag color={r.color} theme={theme}>{i === 0 ? "Kasus 1" : "Kasus 2"}</Tag>
              <div style={{ fontSize: 11, color: theme.textMuted }}>{r.cond} → <strong style={{ color: theme.green }}>{r.act}</strong></div>
            </div>
          ))}
        </div>
      )}

      {tab === "cnn" && (
        <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.purple, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Condensed Nearest Neighbor (CNN)</div>
          <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.8, marginBottom: 16, fontFamily: "'Crimson Pro', serif" }}>
            Cari <strong style={{ color: theme.purple }}>subset terkecil (minimal consistent set)</strong> dari majority yang bisa menghasilkan performa KNN yang sama dengan dataset lengkap. Intinya: buang yang redundan, simpan yang esensial.
          </div>
          <div style={{ padding: 12, borderRadius: 10, background: theme.purpleDim, fontSize: 11, color: theme.textMuted, lineHeight: 1.7 }}>
            💡 Bayangkan: dari 9900 majority, mungkin hanya 500 yang benar-benar dibutuhkan untuk mempertahankan akurasi KNN.
          </div>
        </div>
      )}
    </div>
  );
}

function CombineSection({ theme }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.8, marginBottom: 20, fontFamily: "'Crimson Pro', serif" }}>
        Teknik terbaik sering menggabungkan oversampling + undersampling dalam satu <strong style={{ color: theme.pink }}>Pipeline</strong>:
      </div>

      {/* Pipeline Visual */}
      <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}`, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.pink, letterSpacing: 2, marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>PIPELINE PATTERN</div>
        <PipelineVisual theme={theme} steps={[
          { icon: "📦", label: "Data Asli", bg: theme.bgAccent },
          { icon: "📈", label: "Oversampling", bg: theme.greenDim, border: theme.greenBorder, color: theme.green },
          { icon: "📉", label: "Undersampling", bg: theme.cyanDim, border: theme.cyanBorder, color: theme.cyan },
          { icon: "🤖", label: "Model", bg: theme.purpleDim, border: theme.purpleBorder, color: theme.purple },
          { icon: "📊", label: "Evaluasi", bg: theme.goldDim, border: theme.goldBorder, color: theme.gold },
        ]} />
      </div>

      {/* Combinations */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
        {[
          { title: "SMOTE + Random Under", desc: "SMOTE oversample minority, lalu random undersample majority. Paling sederhana.", code: "SMOTE() → RandomUnderSampler()", color: "green", result: "ROC AUC baseline" },
          { title: "SMOTE + Tomek Links", desc: "SMOTE buat data sintetis, Tomek Links bersihkan noise di boundary setelahnya.", code: "SMOTETomek()", color: "gold", result: "AUC: 0.815" },
          { title: "SMOTE + ENN", desc: "SMOTE buat data sintetis, ENN hapus data ambigu yang misklasifikasi. Paling bersih!", code: "SMOTEENN()", color: "blue", result: "AUC: 0.856" },
        ].map((c, i) => (
          <div key={i} style={{ padding: 16, borderRadius: 14, background: theme.bgCard, border: `1px solid ${theme[c.color + "Border"]}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme[c.color], marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{c.title}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.7, marginBottom: 10, fontFamily: "'Crimson Pro', serif" }}>{c.desc}</div>
            <div style={{ padding: 8, borderRadius: 8, background: theme.bgAccent, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: theme.textDim, marginBottom: 8 }}>{c.code}</div>
            <Tag color={c.color} theme={theme}>{c.result}</Tag>
          </div>
        ))}
      </div>

      {/* Summary Table */}
      <div style={{ padding: 20, borderRadius: 16, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.pink, letterSpacing: 2, marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>RINGKASAN SEMUA METODE</div>
        <CompareTable theme={theme} accent="pink"
          headers={["Level", "Metode", "Ide Utama", "Kapan Pakai"]}
          rows={[
            ["Evaluasi", "Stratified CV", "Pertahankan proporsi kelas di setiap fold", "Selalu gunakan untuk imbalanced data!"],
            ["Algoritma", "Cost-Sensitive", "Beri penalty berbeda per kelas", "Saat cost FN ≠ cost FP jelas"],
            ["Data ↑", "Random Oversample", "Duplikasi minority", "Baseline, dataset besar"],
            ["Data ↑", "SMOTE", "Buat data sintetis (interpolasi)", "Default oversampling"],
            ["Data ↑", "Borderline-SMOTE", "SMOTE hanya di borderline", "Overlap tinggi"],
            ["Data ↑", "ADASYN", "SMOTE adaptif (proporsional)", "Distribusi tidak merata"],
            ["Data ↓", "Random Undersample", "Hapus majority random", "Minority cukup banyak"],
            ["Data ↓", "Tomek Links", "Hapus boundary/noisy majority", "Pembersihan data"],
            ["Data ↓", "ENN", "Hapus misklasifikasi majority", "Pembersihan data"],
            ["Data ↓", "NearMiss", "Pilih majority dekat minority", "Eksperimen"],
            ["Data ↕", "SMOTE + Tomek/ENN", "Oversample lalu bersihkan", "Best practice"],
          ]}
        />
      </div>
    </div>
  );
}

// ─── MAIN APP ───
export default function ImbalancedClassificationViz() {
  const [mode, setMode] = useState("light");
  const [activeSection, setActiveSection] = useState("intro");
  const [time, setTime] = useState(0);
  const t = themes[mode];

  useEffect(() => {
    const interval = setInterval(() => setTime(prev => prev + 16), 16);
    return () => clearInterval(interval);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "intro": return <IntroSection theme={t} t={time} />;
      case "causes": return <CausesSection theme={t} />;
      case "challenges": return <ChallengesSection theme={t} />;
      case "eval": return <EvalSection theme={t} />;
      case "cost": return <CostSection theme={t} />;
      case "oversample": return <OversampleSection theme={t} />;
      case "undersample": return <UndersampleSection theme={t} />;
      case "combine": return <CombineSection theme={t} />;
      default: return null;
    }
  };

  const currentSection = SECTIONS.find(s => s.id === activeSection);

  return (
    <div style={{
      minHeight: "100vh", background: t.bg, color: t.text,
      fontFamily: "'Outfit', sans-serif", transition: "all 0.3s ease",
    }}>
      <style>{FONTS}{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 3px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        button { transition: all 0.2s; }
        button:hover { filter: brightness(1.1); }
      `}</style>

      {/* ─── HEADER ─── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `${t.bg}ee`, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${t.border}`,
        padding: "12px 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${t.gold}30, ${t.red}30)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>⚖️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text, fontFamily: "'Outfit', sans-serif" }}>Imbalanced Classification</div>
              <div style={{ fontSize: 10, color: t.textDim, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1 }}>MATERI 12 · KASDAD</div>
            </div>
          </div>
          <button onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{
            padding: "6px 14px", borderRadius: 20, border: `1px solid ${t.border}`,
            background: t.bgCard, color: t.textMuted, cursor: "pointer",
            fontSize: 12, fontWeight: 600,
          }}>{mode === "dark" ? "☀️ Light" : "🌙 Dark"}</button>
        </div>
      </div>

      {/* ─── NAVIGATION ─── */}
      <div style={{
        position: "sticky", top: 62, zIndex: 99,
        background: `${t.bg}dd`, backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${t.borderLight}`,
        padding: "8px 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4, overflowX: "auto" }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              padding: "6px 14px", borderRadius: 20, border: "none",
              background: activeSection === s.id ? t[s.accent + "Dim"] : "transparent",
              color: activeSection === s.id ? t[s.accent] : t.textDim,
              cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
              outline: activeSection === s.id ? `1px solid ${t[s.accent + "Border"]}` : "none",
            }}>
              {s.icon} {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 60px" }}>
        {/* Section Title */}
        <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: t[currentSection.accent], letterSpacing: 3, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>
            SECTION {SECTIONS.findIndex(s => s.id === activeSection) + 1} / {SECTIONS.length}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: t.text, fontFamily: "'Outfit', sans-serif" }}>
            {currentSection.icon} {currentSection.title}
          </div>
        </div>

        {/* Section Content */}
        <div key={activeSection} style={{ animation: "fadeUp 0.5s ease" }}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
